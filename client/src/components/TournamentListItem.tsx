import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { formatDate } from '../util';
import { Tournament } from '../hooks';

interface TournamentListItemProps {
  tournament: Tournament;
  handleTournamentClick: (tournamentId: string) => void;
}

export default function TournamentListItem({ tournament, handleTournamentClick }: TournamentListItemProps) {
  return (
    <ListItem
      key={tournament.id}
      onClick={() => handleTournamentClick(tournament.id)}
      sx={{
        pt: 4,
        pb: 4,
        borderBottom: '1px solid #e0e0e0',
        alignItems: 'flex-start',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 1,
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h3">{tournament.name}</Typography>
        <Typography variant="h4">{formatDate(tournament.startdate)}</Typography>
      </Box>
      <Typography variant="body1">
        {tournament.city}, {tournament.state}, {tournament.country}
      </Typography>
    </ListItem>
  );
}
