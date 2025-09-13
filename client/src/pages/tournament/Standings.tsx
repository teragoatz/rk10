import React from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TournamentStanding } from '../../hooks/useGetTournamentStandings';

interface StandingsProps {
  standings: TournamentStanding[];
  isLoading: boolean;
  isError: boolean;
}

export default function Standings({ standings, isLoading, isError }: StandingsProps) {
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
        <Alert severity="error">Error loading standings</Alert>
      </Box>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No standings available yet.
      </Typography>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '65px' }}>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="right">Record</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings.map((standing, index) => (
              <TableRow key={standing.player_id}>
                <TableCell component="th" scope="row" align="center">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {!!standing.firstname && !!standing.lastname
                    ? `${standing.firstname} ${standing.lastname}`
                    : standing.player_id}
                </TableCell>
                <TableCell align="right">{standing.record}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
