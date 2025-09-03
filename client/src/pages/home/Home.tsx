import React, { useState } from 'react';
import { useGetTournamentList } from '../../hooks';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

export default function Home() {
  const [status, setStatus] = useState('incomplete');
  const { data: tournament } = useGetTournamentList(status);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant={status === 'incomplete' ? 'contained' : 'outlined'} onClick={() => setStatus('incomplete')}>
          Incomplete
        </Button>
        <Button variant={status === 'finished' ? 'contained' : 'outlined'} onClick={() => setStatus('finished')}>
          Finished
        </Button>
      </Box>

      <Box>
        {tournament?.map((tournament) => (
          <Paper
            key={tournament.id}
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              '&:hover': {
                elevation: 2,
              },
            }}
          >
            <Typography variant="h6">{tournament.name}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
