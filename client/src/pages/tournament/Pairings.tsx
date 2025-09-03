import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { TournamentPairings } from '../../hooks';

interface PairingsProps {
  pairings: TournamentPairings[];
}

export default function Pairings({ pairings }: PairingsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {pairings.map((pairing) => (
          <Tab key={`tab-${pairing.number}`} label={`Round ${pairing.number}`} sx={{ minWidth: 120 }} />
        ))}
      </Tabs>

      {pairings.map((pairing, index) => (
        <Box
          key={`panel-${pairing.number}`}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`pairing-tabpanel-${index}`}
          aria-labelledby={`pairing-tab-${index}`}
        >
          {activeTab === index && (
            <Box>
              <Stack direction="row" spacing={4} mb={2}>
                <Typography variant="body1">
                  <strong>Stage:</strong> {pairing.stage}
                </Typography>
                <Typography variant="body1">
                  <strong>Time left:</strong> {pairing.timeleft}
                </Typography>
                <Typography variant="body1">
                  <strong>Type:</strong> {pairing.type}
                </Typography>
              </Stack>

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
                    <strong>{match.player1_id ?? 'TBD'}</strong> vs <strong>{match.player2_id ?? 'TBD'}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Table #{match.tablenumber}
                  </Typography>
                  {!!match.outcome && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      <strong>Outcome:</strong> {match.outcome}
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
