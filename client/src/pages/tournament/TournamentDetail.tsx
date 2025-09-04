import React from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useGetTournament, useGetTournamentPairings } from '../../hooks';
import Banner from './Banner';
import Pairings from './Pairings';
import { Paper } from '@mui/material';

export default function TournamentDetail() {
  const { id } = useParams();
  const { data: tournament, isLoading: isLoadingTournament, isError: isErrorTournament } = useGetTournament(id);
  const { data: pairings, isLoading: isLoadingPairings, isError: isErrorPairings } = useGetTournamentPairings(id);
  const playerId = localStorage.getItem('playerId');

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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box mb={4}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1">
              Location: {tournament?.city}, {tournament?.state}, {tournament?.country}
            </Typography>
            <Typography variant="body1">Organized by: {tournament?.organizer_name}</Typography>
          </Stack>
        </Box>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Pairings</Typography>
          {pairings && pairings.length > 0 && (
            <Pairings pairings={pairings} playerId={playerId} />
          )}
        </Paper>
      </Container>
    </Box>
  );
}
