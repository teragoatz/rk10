import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { TournamentPairings } from '../../hooks';
import Match from './Match';

interface PairingsProps {
  pairings: TournamentPairings[];
  playerId: string | null;
  isLoading: boolean;
  isError: boolean;
}

export default function Pairings({ pairings, playerId, isLoading, isError }: PairingsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const pairingsSortedByPlayerId = playerId
    ? pairings.map((pairing) => ({
        ...pairing,
        matches: pairing.matches.sort((a, b) => {
          const aContainsPlayer = a.player1_id === playerId || a.player2_id === playerId;
          const bContainsPlayer = b.player1_id === playerId || b.player2_id === playerId;

          // If a contains player and b doesn't, a comes first
          if (aContainsPlayer && !bContainsPlayer) return -1;
          // If b contains player and a doesn't, b comes first
          if (bContainsPlayer && !aContainsPlayer) return 1;
          // If both or neither contain player, maintain original order
          return 0;
        }),
      }))
    : pairings;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" m={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box height="100%" mt={4} mb={4}>
        <Alert severity="error">Error loading pairings</Alert>
      </Box>
    );
  }

  if (!pairingsSortedByPlayerId || pairingsSortedByPlayerId.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No pairings available yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {pairingsSortedByPlayerId.map((pairing) => (
          <Tab key={`tab-${pairing.number}`} label={`Round ${pairing.number}`} sx={{ minWidth: 120 }} />
        ))}
      </Tabs>

      {pairingsSortedByPlayerId.map((pairing, index) => (
        <Box
          key={`panel-${pairing.number}`}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`pairing-tabpanel-${index}`}
          aria-labelledby={`pairing-tab-${index}`}
        >
          {activeTab === index && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Matches
              </Typography>

              {pairing.matches.map((match) => (
                <Match key={`match-${match.id}`} match={match} playerId={playerId} />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
