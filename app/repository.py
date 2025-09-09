from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from models import Base, MatchOutcomeSelection, Tournament, Player, Round, Match
import os

class PostgresRepository:
    def __init__(self):
        user = os.getenv("POSTGRES_USER")
        password = os.getenv("POSTGRES_PASSWORD")
        host = os.getenv("POSTGRES_HOST")
        db = os.getenv("POSTGRES_DB")
        self.engine = create_engine(
            f"postgresql+psycopg2://{user}:{password}@{host}/{db}"
        )
        Base.metadata.create_all(self.engine)
        self.Session = scoped_session(sessionmaker(bind=self.engine))

    def add(self, obj):
        session = self.Session()
        try:
            session.add(obj)
            session.commit()
            return obj
        except SQLAlchemyError as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def get(self, model, pk):
        session = self.Session()
        try:
            return session.get(model, pk)
        finally:
            session.close()

    def list(self, model, **filters):
        session = self.Session()
        try:
            query = session.query(model)
            if filters:
                query = query.filter_by(**filters)
            return query.all()
        finally:
            session.close()

    def update(self, model, pk, **kwargs):
        session = self.Session()
        try:
            obj = session.get(model, pk)
            if not obj:
                return None
            for key, value in kwargs.items():
                setattr(obj, key, value)
            session.commit()
            return obj
        except SQLAlchemyError as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def set_player_consent(self, player_id, consent=True):
        session = self.Session()
        try:
            player = session.get(Player, player_id)
            if not player:
                player = Player(userid=player_id,
                                creationdate=datetime.now(),
                                lastmodifieddate=datetime.now())
                session.add(player)
            player.tc_consent = consent
            player.tc_consent_timestamp = datetime.now()
            session.commit()
            return player
        except SQLAlchemyError as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def delete(self, model, pk):
        session = self.Session()
        try:
            obj = session.get(model, pk)
            if not obj:
                return False
            session.delete(obj)
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def select_match_outcome(self, match_id, player_id, outcome):
        session = self.Session()
        try:
            # Verify player is part of the match
            match = session.query(Match).get(match_id)
            if not match or (player_id != match.player1_id and player_id != match.player2_id):
                raise ValueError("Player is not associated with this match.")
        
            # Upsert selection
            selection = session.query(MatchOutcomeSelection).filter_by(
                match_id=match_id, player_id=player_id
            ).first()
            if selection:
                selection.outcome = outcome
                selection.timestamp = datetime.utcnow()
            else:
                selection = MatchOutcomeSelection(
                    match_id=match_id,
                    player_id=player_id,
                    outcome=outcome,
                    timestamp=datetime.utcnow()
                )
                session.add(selection)
            session.commit()

            # Check if both players have selected the same outcome
            selections = session.query(MatchOutcomeSelection).filter_by(match_id=match_id).all()
            if len(selections) == 2 and selections[0].outcome == selections[1].outcome:
                # Both players agree, update match outcome
                match = session.query(Match).get(match_id)
                match.outcome = selections[0].outcome
                session.commit()
                return True, selections[0].outcome
            return False, None
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()

    def sync_match_outcome(self, match_id):
        session = self.Session()
        try:
            # Get agreed outcome from selections
            selections = session.query(MatchOutcomeSelection).filter_by(match_id=match_id).all()
            if len(selections) == 2 and selections[0].outcome == selections[1].outcome:
                agreed_outcome = selections[0].outcome
                match = session.query(Match).get(match_id)
                if match and match.outcome != agreed_outcome:
                    match.outcome = agreed_outcome
                    session.commit()
                    return True
            return False
        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()