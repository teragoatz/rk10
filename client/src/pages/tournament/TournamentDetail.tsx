import React, { useState } from 'react';
import { useWebSocketUpdates } from '../../hooks/useWebSocketUpdates';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useGetTournament, useGetTournamentPairings, useGetTournamentStandings } from '../../hooks';
import { formatDate } from '../../util/dateUtil';
// import Banner from './Banner';
import Pairings from './Pairings';
import Standings from './Standings';

export default function TournamentDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const { data: tournament, isLoading: isLoadingTournament, isError: isErrorTournament } = useGetTournament(id);
  const { data: pairings, isLoading: isLoadingPairings, isError: isErrorPairings, refetch: refetchPairings } = useGetTournamentPairings(id);
  // Auto-refresh pairings on backend data update
  useWebSocketUpdates(() => {
    refetchPairings();
  });
  const { data: standings, isLoading: isLoadingStandings, isError: isErrorStandings } = useGetTournamentStandings(id);
  const playerId = localStorage.getItem('playerId');

  if (isLoadingTournament) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={100} />
      </Box>
    );
  }

  if (isErrorTournament || !tournament) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">Error loading tournament with id {id}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* <Banner tournament={tournament} /> */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>{tournament.name}</Typography>
        <Typography variant="h5">{formatDate(tournament.startdate)}</Typography>
        <Box mb={4}>
          <Stack direction="column" spacing={2}>
            <Typography variant="body1">
              Location: {tournament?.city}, {tournament?.state}, {tournament?.country}
            </Typography>
            <Typography variant="body1">Organized by: {tournament?.organizer_name}</Typography>
          </Stack>
        </Box>
        <Paper elevation={1} sx={{ p: 3, maxWidth: 'md' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Pairings" />
            <Tab label="Standings" />
          </Tabs>

          <Box role="tabpanel" hidden={activeTab !== 0}>
            {activeTab === 0 && (
              <Box>
                <Pairings pairings={pairings ?? []} playerId={playerId} isLoading={isLoadingPairings} isError={isErrorPairings} />
              </Box>
            )}
          </Box>

          <Box role="tabpanel" hidden={activeTab !== 1}>
            {activeTab === 1 && (
              <Box>
                <Standings standings={standings ?? []} isLoading={isLoadingStandings} isError={isErrorStandings} />
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
