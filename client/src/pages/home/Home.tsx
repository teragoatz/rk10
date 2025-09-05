import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTournamentList } from '../../hooks';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import TournamentListItem from '../../components/TournamentListItem';
import Typography from '@mui/material/Typography';

export default function Home() {
  const [status, setStatus] = useState('incomplete');
  const { data: tournamentList, isLoading, isError } = useGetTournamentList(status);
  const navigate = useNavigate();

  function handleTournamentClick(tournamentId: string) {
    navigate(`/tournament/${tournamentId}`);
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant={status === 'incomplete' ? 'contained' : 'outlined'} onClick={() => setStatus('incomplete')}>
          Active
        </Button>
        <Button variant={status === 'finished' ? 'contained' : 'outlined'} onClick={() => setStatus('finished')}>
          Finished
        </Button>
      </Box>

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <CircularProgress size={50} />
        </Box>
      )}
      {isError && <Alert severity="error">Error loading tournaments, please refresh this page and try again.</Alert>}
      {tournamentList && (
        <Box>
          {tournamentList.length === 0 ? (
            <Typography variant="body1">
              No {status === 'incomplete' ? 'active' : 'finished'} tournaments found
            </Typography>
          ) : (
            <List>
              {tournamentList.map((tournament) => (
                <TournamentListItem
                  key={tournament.id}
                  tournament={tournament}
                  handleTournamentClick={handleTournamentClick}
                />
              ))}
            </List>
          )}
        </Box>
      )}
    </Container>
  );
}
