import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTournamentList } from '../../hooks';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TournamentListItem from '../../components/TournamentListItem';

export default function Home() {
  const [status, setStatus] = useState('incomplete');
  const { data: tournament } = useGetTournamentList(status);
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

      <List>
        {tournament?.map((tournament) => (
          <TournamentListItem
            key={tournament.id}
            tournament={tournament}
            handleTournamentClick={handleTournamentClick}
          />
        ))}
      </List>
    </Container>
  );
}
