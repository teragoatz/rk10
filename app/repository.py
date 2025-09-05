from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import SQLAlchemyError
from models import Base, Tournament, Player, Round, Match
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