import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useGetTournamentList } from '../hooks';
import TournamentListItem from '../components/TournamentListItem';

interface SearchTournamentsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchTournamentsDialog({ open, onClose }: SearchTournamentsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeFinished, setIncludeFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleTournamentClick = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
    onClose();
  };

  useEffect(() => {
    if (open) {
      // Use requestAnimationFrame to ensure DOM is ready
      const focusInput = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      };

      requestAnimationFrame(focusInput);
    }
  }, [open]);

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
          inputRef={inputRef}
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
                <TournamentListItem
                  key={tournament.id}
                  tournament={tournament}
                  handleTournamentClick={handleTournamentClick}
                />
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
          <CloseIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>{renderDialogContent()}</DialogContent>
    </Dialog>
  );
}
