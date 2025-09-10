import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TournamentPairing } from '../../hooks';
import { MatchOutcome, MatchOutcomeColor } from '../../util/constants';

interface MatchProps {
  match: TournamentPairing;
}

enum Player {
  Player1 = 1,
  Player2 = 2,
}

function getMatchOutcomeColor(player: Player, outcome: MatchOutcome): MatchOutcomeColor {
  switch (outcome) {
    case MatchOutcome.Player1Wins:
      return player === Player.Player1 ? MatchOutcomeColor.Win : MatchOutcomeColor.Loss;
    case MatchOutcome.Player2Wins:
      return player === Player.Player1 ? MatchOutcomeColor.Loss : MatchOutcomeColor.Win;
    case MatchOutcome.Tie:
      return MatchOutcomeColor.Tie;
    case MatchOutcome.Bye:
      return MatchOutcomeColor.Bye;
    default:
      return MatchOutcomeColor.White;
  }
}

function getPlayerDisplayName(player: Player, match: TournamentPairing) {
  if (player === Player.Player1) {
    if (match.player1_name && match.player1_name.first && match.player1_name.last) {
      return match.player1_name?.first + ' ' + match.player1_name?.last;
    }
    return match.player1_id ?? 'TBD';
  }
  if (match.player2_name && match.player2_name.first && match.player2_name.last) {
    return match.player2_name?.first + ' ' + match.player2_name?.last;
  }
  return match.player2_id ?? 'TBD';
}

export default function Match({ match }: MatchProps) {
  return (
    <Box
      key={`match-${match.id}`}
      mb={2}
      p={2}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="body1" gutterBottom>
        <Typography
          component="span"
          sx={{
            color: getMatchOutcomeColor(Player.Player1, match.outcome),
            fontWeight: 'bold',
            display: 'inline-block',
            mr: 2,
          }}
        >
          {getPlayerDisplayName(Player.Player1, match)}
        </Typography>
        {match.outcome !== 5 && (
          <>
            {' vs '}
            <Typography
              component="span"
              sx={{
                color: getMatchOutcomeColor(Player.Player2, match.outcome),
                fontWeight: 'bold',
                display: 'inline-block',
                ml: 2,
              }}
            >
              {getPlayerDisplayName(Player.Player2, match)}
            </Typography>
          </>
        )}
        {match.outcome === 5 && (
          <Typography
            component="span"
            sx={{ color: MatchOutcomeColor.Bye, ml: 2, fontWeight: 'bold', display: 'inline-block' }}
          >
            BYE
          </Typography>
        )}
        {match.outcome === 3 && (
          <Typography
            component="span"
            sx={{ color: MatchOutcomeColor.Tie, ml: 2, fontWeight: 'bold', display: 'inline-block' }}
          >
            TIE
          </Typography>
        )}
      </Typography>
      {match.tablenumber !== 0 && (
        <Typography variant="body2" color="text.secondary">
          Table #{match.tablenumber}
        </Typography>
      )}
    </Box>
  );
}
