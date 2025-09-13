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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { usePostPlayerConsent } from '../hooks';

interface LoginWithPlayerIdDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginWithPlayerIdDialog({ open, onClose }: LoginWithPlayerIdDialogProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: postPlayerConsent, isError, reset } = usePostPlayerConsent();

  const handlePlayerIdClick = async () => {
    if (inputText.length >= 7) {
      try {
        await postPlayerConsent({ playerId: parseInt(inputText), consent: consentChecked });
        localStorage.setItem('playerId', inputText);
        window.location.reload();
        onClose();
      } catch (error) {
        setError(
          'There was an unexpected error logging in with your player ID. Please refresh this page and try again.',
        );
      }
    } else if (inputText.length < 7) {
      setError('Invalid player ID, must be at least 7 characters long');
    }
  };

  useEffect(() => {
    setError('');
    reset();

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

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
            <Box sx={{ mt: 3, width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    color="primary"
                    sx={{
                      mr: 2,
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    I consent to my first name and last name being displayed publicly on this website in connection with
                    tournament pairings and results. You may withdraw consent at any time by contacting us.
                    <br />
                    <strong>
                      I have read and agree to the terms above and consent to my name being displayed publicly.
                    </strong>
                  </Typography>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={handlePlayerIdClick}
              fullWidth
              sx={{ mt: 3 }}
              // disabled={!consentChecked}
            >
              Login
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                There was an unexpected error logging in with your player ID. Please refresh this page and try again.
              </Alert>
            )}
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
