import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface LoginWithPlayerIdDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginWithPlayerIdDialog({ open, onClose }: LoginWithPlayerIdDialogProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePlayerIdClick = () => {
    if (inputText.length >= 7) {
      localStorage.setItem('playerId', inputText);
      onClose();
    } else {
      setError('Invalid player ID, must be at least 7 characters long');
    }
  };

  useEffect(() => {
    setError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      <DialogContent>
        <Container maxWidth="sm" sx={{ height: '80%' }}>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 4 }}>
              Login with Player ID
            </Typography>
            <TextField
              placeholder="Enter your player ID..."
              variant="outlined"
              size="medium"
              autoFocus
              fullWidth
              inputRef={inputRef}
              onChange={(e) => setInputText(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant="contained" onClick={handlePlayerIdClick} fullWidth sx={{ mt: 4 }}>
              Login
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
