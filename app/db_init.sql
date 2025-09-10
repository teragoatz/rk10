CREATE TABLE IF NOT EXISTS hello_hits (
    id SERIAL PRIMARY KEY,
    hit_time TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tournaments (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(100),
    roundtime INTEGER,
    finalsroundtime INTEGER,
    organizer_popid VARCHAR(20),
    organizer_name VARCHAR(100),
    startdate DATE,
    lessswiss BOOLEAN,
    autotablenumber BOOLEAN,
    overflowtablestart INTEGER,
    is_finished BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS players (
    userid VARCHAR(20) PRIMARY KEY,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    birthdate DATE,
    starter BOOLEAN,
    tc_consent BOOLEAN NOT NULL DEFAULT FALSE,
    tc_consent_timestamp TIMESTAMP,
    creationdate TIMESTAMP,
    lastmodifieddate TIMESTAMP
);

-- Table for rounds, each round belongs to a tournament
CREATE TABLE IF NOT EXISTS rounds (
    id SERIAL PRIMARY KEY,
    tournament_id VARCHAR(20) REFERENCES tournaments(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    type INTEGER,
    stage INTEGER,
    timeleft INTEGER
);

-- Table for matches, each match belongs to a round and has two players
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    round_id INTEGER REFERENCES rounds(id) ON DELETE CASCADE,
    player1_id VARCHAR(20) REFERENCES players(userid) ON DELETE CASCADE,
    player2_id VARCHAR(20) REFERENCES players(userid) ON DELETE CASCADE,
    outcome INTEGER,
    tablenumber INTEGER,
    timestamp TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_outcome_selections (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    player_id VARCHAR(20) REFERENCES players(userid) ON DELETE CASCADE,
    outcome INTEGER,
    timestamp TIMESTAMP DEFAULT NOW(),
    UNIQUE(match_id, player_id)
);