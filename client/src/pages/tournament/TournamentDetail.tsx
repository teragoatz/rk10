import React from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useGetTournament, useGetTournamentPairings } from '../../hooks';
import Banner from './Banner';

export default function TournamentDetail() {
  const { id } = useParams();
  const { data: tournament, isLoading: isLoadingTournament, isError: isErrorTournament } = useGetTournament(id);
  const { data: pairings, isLoading: isLoadingPairings, isError: isErrorPairings } = useGetTournamentPairings(id);

  if (isLoadingTournament || isLoadingPairings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={100} />
      </Box>
    );
  }

  if (isErrorTournament || isErrorPairings || !tournament || !pairings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">Error loading tournament with id {id}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Banner tournament={tournament} />

      <Box mb={2}>
        <Stack direction="column" spacing={2}>
          <Typography variant="body1">
            Location: {tournament?.city}, {tournament?.state}, {tournament?.country}
          </Typography>
          <Typography variant="body1">Start date: {tournament?.startdate}</Typography>
        </Stack>
      </Box>
      <Box mb={2}>
        <Typography variant="h3">Pairings</Typography>
        {pairings?.map((pairing) => (
          <Box key={`pairing-${pairing.number}`} mb={2}>
            <Typography variant="h5">
              Round #{pairing.number}
            </Typography>
            <Typography variant="body1">
              Stage {pairing.stage}
            </Typography>
            <Typography variant="body1">
              Time left {pairing.timeleft}
            </Typography>
            <Typography variant="body1">
              Type {pairing.type}
            </Typography>
            <Typography variant="h6">
              Matches
            </Typography>
            {pairing.matches.map((match) => (
              <Box key={`match-${match.id}`} mb={2}>
                <Typography variant="body1">
                  {match.player1_id ?? 'tbd'} vs {match.player2_id ?? 'tbd'}
                </Typography>
                <Typography variant="body1">
                  Table #{match.tablenumber}
                </Typography>
                {!!match.outcome && (
                  <Typography variant="body1">
                    Outcome: {match.outcome}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
