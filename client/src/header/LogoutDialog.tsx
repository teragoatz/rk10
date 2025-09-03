import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  playerId: string;
}

export default function LogoutDialog({ open, onClose, playerId }: LogoutDialogProps) {
  const handleLogoutClick = () => {
    localStorage.removeItem('playerId');
    window.location.reload();
    onClose();
  };

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
        <Box
          sx={{
            display: 'flex',
            height: '80%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
            You are logged in with Player ID:{' '}
            <span style={{ fontWeight: 700, color: 'green', fontSize: '1.75rem' }}>{playerId}</span>
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLogoutClick}
            fullWidth
            sx={{ mt: 2, maxWidth: '400px' }}
          >
            Logout
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
