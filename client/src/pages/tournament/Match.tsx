import React, { useState, useMemo, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import CheckCircle from '@mui/icons-material/CheckCircle';
import DoDisturbOn from '@mui/icons-material/DoDisturbOn';
import { TournamentPairing, usePostSelectOutcome } from '../../hooks';
import { MatchOutcome, MatchOutcomeColor } from '../../util/constants';

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

function getMatchOutcomeIcon(player: Player, outcome: MatchOutcome) {
  switch (outcome) {
    case MatchOutcome.Player1Wins:
      return player === Player.Player1 ? (
        <CheckCircle
          sx={{
            ml: 1,
            fontSize: '1.2em',
            color: 'green',
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <></>
      );
    case MatchOutcome.Player2Wins:
      return player === Player.Player2 ? (
        <CheckCircle
          sx={{
            ml: 1,
            fontSize: '1.2em',
            color: 'green',
            verticalAlign: 'middle',
          }}
        />
      ) : (
        <></>
      );
    case MatchOutcome.Tie:
      return (
        <DoDisturbOn
          sx={{
            ml: 1,
            fontSize: '1.2em',
            color: 'yellow',
            verticalAlign: 'middle',
          }}
        />
      );
  }
  return <></>;
}

interface MatchProps {
  playerId: string | null;
  match: TournamentPairing;
}

export default function Match({ match, playerId }: MatchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showTableNumber = useMemo(() => match.tablenumber !== 0, [match.tablenumber]);
  const showResolveButton = useMemo(() => {
    if (!playerId) {
      return false;
    }

    const playerIdMatches = match.player1_id === playerId || match.player2_id === playerId;
    return !match.outcome && showTableNumber && playerIdMatches;
  }, [match.outcome, showTableNumber, playerId]);

  const handleResolveClick = () => {
    setIsExpanded(!isExpanded);
  };
  const { mutate: selectOutcome, isError, isPending, isSuccess, reset } = usePostSelectOutcome();

  function handleSelectOutcome(outcome: MatchOutcome, playerId: string) {
    selectOutcome({ match_id: match.id, player_id: playerId, outcome });
  }

  useEffect(() => {
    reset();
  }, []);

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
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          component="span"
          sx={{
            color: getMatchOutcomeColor(Player.Player1, match.outcome),
            fontWeight: 'bold',
            display: 'inline-block',
            mr: 2,
            width: '40%',
          }}
        >
          {getPlayerDisplayName(Player.Player1, match)}
          {getMatchOutcomeIcon(Player.Player1, match.outcome)}
        </Typography>
        {match.outcome !== MatchOutcome.Bye && (
          <>
            <Typography
              component="span"
              sx={{
                display: 'inline-block',
                width: '20%',
                textAlign: 'center',
              }}
            >
              vs
            </Typography>
            <Typography
              component="span"
              sx={{
                color: getMatchOutcomeColor(Player.Player2, match.outcome),
                fontWeight: 'bold',
                display: 'inline-block',
                ml: 2,
                width: '40%',
                textAlign: 'right',
              }}
            >
              {getMatchOutcomeIcon(Player.Player2, match.outcome)}{' '}
              {getPlayerDisplayName(Player.Player2, match)}
            </Typography>
          </>
        )}
        {match.outcome === MatchOutcome.Bye && (
          <>
            <Typography
              component="span"
              sx={{
                color: MatchOutcomeColor.Bye,
                fontWeight: 'bold',
                display: 'inline-block',
                width: '20%',
                textAlign: 'center',
              }}
            >
              BYE
            </Typography>
            <Box sx={{ ml: 2, width: '40%' }} />
          </>
        )}
      </Box>

      {showTableNumber && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Table #{match.tablenumber}
          </Typography>

          {showResolveButton && (
            <Button
              onClick={handleResolveClick}
              endIcon={isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              sx={{
                textTransform: 'none',
                fontSize: '0.875rem',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              Resolve Match
            </Button>
          )}
        </Box>
      )}

      {showResolveButton && !!playerId && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              color="success"
              disabled={isPending || isSuccess}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                width: '120px',
              }}
              onClick={() => handleSelectOutcome(MatchOutcome.Player1Wins, playerId)}
            >
              {isPending ? <CircularProgress size={20} /> : 'WINNER'}
            </Button>
            <Button
              variant="contained"
              color="warning"
              disabled={isPending || isSuccess}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                width: '120px',
              }}
              onClick={() => handleSelectOutcome(MatchOutcome.Tie, playerId)}
            >
              {isPending ? <CircularProgress size={20} /> : 'TIE'}
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={isPending || isSuccess}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                width: '120px',
              }}
              onClick={() => handleSelectOutcome(MatchOutcome.Player2Wins, playerId)}
            >
              {isPending ? <CircularProgress size={20} /> : 'WINNER'}
            </Button>
          </Box>
          {isSuccess && <Alert sx={{ mt: 2 }} severity="success">Outcome selected successfully.</Alert>}
          {isError && <Alert sx={{ mt: 2 }} severity="error">Error selecting outcome, please refresh the page and try again.</Alert>}
        </Collapse>
      )}
    </Box>
  );
}
