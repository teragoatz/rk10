from sqlalchemy import (
    Column, Integer, String, Boolean, Date, DateTime, ForeignKey
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Tournament(Base):
    __tablename__ = 'tournaments'
    id = Column(String(20), primary_key=True)
    name = Column(String(255), nullable=False)
    city = Column(String(100))
    state = Column(String(50))
    country = Column(String(100))
    roundtime = Column(Integer)
    finalsroundtime = Column(Integer)
    organizer_popid = Column(String(20))
    organizer_name = Column(String(100))
    startdate = Column(Date)
    lessswiss = Column(Boolean)
    autotablenumber = Column(Boolean)
    overflowtablestart = Column(Integer)
    rounds = relationship("Round", back_populates="tournament", cascade="all, delete-orphan")
    is_finished = Column(Boolean, nullable=False, default=False)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Player(Base):
    __tablename__ = 'players'
    userid = Column(String(20), primary_key=True)
    firstname = Column(String(100))
    lastname = Column(String(100))
    birthdate = Column(Date)
    starter = Column(Boolean)
    tc_consent = Column(Boolean, nullable=False, default=False)
    tc_consent_timestamp = Column(DateTime)
    creationdate = Column(DateTime)
    lastmodifieddate = Column(DateTime)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Round(Base):
    __tablename__ = 'rounds'
    id = Column(Integer, primary_key=True)
    tournament_id = Column(String(20), ForeignKey('tournaments.id', ondelete="CASCADE"))
    number = Column(Integer, nullable=False)
    type = Column(Integer)
    stage = Column(Integer)
    timeleft = Column(Integer)
    tournament = relationship("Tournament", back_populates="rounds")
    matches = relationship("Match", back_populates="round", cascade="all, delete-orphan")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True)
    round_id = Column(Integer, ForeignKey('rounds.id', ondelete="CASCADE"))
    player1_id = Column(String(20), ForeignKey('players.userid', ondelete="CASCADE"))
    player2_id = Column(String(20), ForeignKey('players.userid', ondelete="CASCADE"))
    outcome = Column(Integer)
    tablenumber = Column(Integer)
    timestamp = Column(DateTime)
    round = relationship("Round", back_populates="matches")
    player1 = relationship("Player", foreign_keys=[player1_id])
    player2 = relationship("Player", foreign_keys=[player2_id])

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class MatchOutcomeSelection(Base):
    __tablename__ = 'match_outcome_selections'
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey('matches.id', ondelete="CASCADE"), nullable=False)
    player_id = Column(String(20), ForeignKey('players.userid', ondelete="CASCADE"), nullable=False)
    outcome = Column(Integer, nullable=False)
    timestamp = Column(DateTime)

    __table_args__ = (
        # Ensure one selection per player per match
        {'sqlite_autoincrement': True},
    )