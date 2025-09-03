import React, { useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useGetTournamentList } from './hooks';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { formatDate } from './util';

interface SearchTournamentsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchTournamentsDialog({ open, onClose }: SearchTournamentsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeFinished, setIncludeFinished] = useState(false);

  const { data: tournamentList, isLoading, isError } = useGetTournamentList(includeFinished ? 'all' : 'incomplete');

  const filteredTournamentList = useMemo(() => {
    if (searchQuery.trim().length < 3) {
      return;
    }

    return (
      tournamentList?.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.country.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ?? []
    );
  }, [tournamentList, searchQuery]);

  function renderDialogContent() {
    if (isLoading) {
      return <CircularProgress size={100} />;
    }

    if (isError) {
      return <Alert severity="error">Error loading tournaments, please refresh this page and try again.</Alert>;
    }

    return (
      <Box>
        <TextField
          placeholder="Search by tournament name or location..."
          variant="outlined"
          size="medium"
          fullWidth
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControlLabel
          control={<Checkbox checked={includeFinished} onChange={(e) => setIncludeFinished(e.target.checked)} />}
          label="Include past tournaments"
        />
        {filteredTournamentList && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6">Tournaments</Typography>
            {filteredTournamentList.length === 0 && (
              <Typography variant="body1">No tournaments found that match your search criteria</Typography>
            )}
            <List>
              {filteredTournamentList.map((tournament) => (
                <ListItem
                  key={tournament.id}
                  sx={{
                    pb: 4,
                    borderBottom: '1px solid #e0e0e0',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    mb: 4,
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
              ))}
            </List>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Search Tournaments
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{renderDialogContent()}</DialogContent>
    </Dialog>
  );
}
