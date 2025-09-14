import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
      sx={{
        p: 0,
        mb: 2,
        '&:last-child': {
          mb: 0,
        },
      }}
    >
      <Card
        onClick={() => handleTournamentClick(tournament.id)}
        sx={{
          width: '100%',
          cursor: 'pointer',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderColor: '#1976d2',
            transform: 'translateY(-2px)',
          },
          '&:focus': {
            outline: '2px solid #1976d2',
            outlineOffset: '2px',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTournamentClick(tournament.id);
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mb: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                flex: 1,
                mr: 2,
              }}
            >
              {tournament.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {formatDate(tournament.startdate)}
              </Typography>
              <ChevronRightIcon
                sx={{
                  color: 'text.secondary',
                  fontSize: '1.2rem',
                }}
              />
            </Box>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.95rem',
            }}
          >
            {tournament.city}, {tournament.state}, {tournament.country}
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  );
}
