import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tournament } from '../../hooks';

interface BannerProps {
  tournament: Tournament;
}

export default function Banner({ tournament }: BannerProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '400px',
        backgroundImage: 'url(https://placehold.co/1200x400)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          color: 'white',
          pl: 4,
          maxWidth: '60%',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 'bold',
            mb: 1,
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          }}
        >
          {tournament.name}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
          }}
        >
          Organized by: {tournament.organizer_name}
        </Typography>
      </Box>
    </Box>
  );
}
