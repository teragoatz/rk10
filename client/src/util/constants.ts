export enum MatchOutcome {
  Player1Wins = 1,
  Player2Wins = 2,
  Tie = 3,
  Bye = 5,
}

export enum MatchOutcomeColor {
  Win = 'green',
  Loss = 'white',
  Tie = 'yellow',
  Bye = 'orange',
  White = 'white',
}

export const SERVER_URI = process.env.REACT_APP_SERVER_URI ?? '';
