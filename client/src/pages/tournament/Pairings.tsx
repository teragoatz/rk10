import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { TournamentPairings } from '../../hooks';

interface PairingsProps {
  pairings: TournamentPairings[];
  playerId: string | null;
}

export default function Pairings({ pairings, playerId }: PairingsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const pairingsWithPlayerId = playerId ? pairings.map((pairing) => ({
    ...pairing,
    matches: pairing.matches.filter((match) => match.player1_id === playerId || match.player2_id === playerId),
  })) : pairings;

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {pairingsWithPlayerId.map((pairing) => (
          <Tab key={`tab-${pairing.number}`} label={`Round ${pairing.number}`} sx={{ minWidth: 120 }} />
        ))}
      </Tabs>

      {pairingsWithPlayerId.map((pairing, index) => (
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
                <Box
                  key={`match-${match.id}`}
                  mb={2}
                  p={2}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    <strong
                      style={
                        match.outcome === 1
                          ? { color: 'green' }
                          : match.outcome === 3
                          ? { color: 'yellow' }
                          : {}
                      }
                    >
                      {match.player1_name && match.player1_name.first && match.player1_name.last
                        ? `${match.player1_name.first} ${match.player1_name.last}`
                        : match.player1_id ?? 'TBD'}
                    </strong>
                    {match.outcome !== 5 && (
                      <>
                        {' vs '}
                        <strong
                          style={
                            match.outcome === 2
                              ? { color: 'green' }
                              : match.outcome === 3
                              ? { color: 'yellow' }
                              : {}
                          }
                        >
                          {match.player2_name && match.player2_name.first && match.player2_name.last
                            ? `${match.player2_name.first} ${match.player2_name.last}`
                            : match.player2_id ?? ''}
                        </strong>
                      </>
                    )}
                    {match.outcome === 5 && (
                      <span style={{ color: 'orange', marginLeft: 8 }}><strong>BYE</strong></span>
                    )}
                    {match.outcome === 3 && (
                      <span style={{ color: 'yellow', marginLeft: 8 }}><strong>TIE</strong></span>
                    )}
                  </Typography>
                  {match.tablenumber !== 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Table #{match.tablenumber}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
