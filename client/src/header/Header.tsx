import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper';
import SearchTournamentsDialog from './SearchTournamentsDialog';
import LoginWithPlayerIdDialog from './LoginWithPlayerIdDialog';
import LogoutDialog from './LogoutDialog';

export default function Header() {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [loginWithPlayerIdDialogOpen, setLoginWithPlayerIdDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const playerId = localStorage.getItem('playerId');

  const handleSearchClick = () => {
    setSearchDialogOpen(true);
  };

  const handleSearchDialogClose = () => {
    setSearchDialogOpen(false);
  };

  const handleLoginWithPlayerIdClick = () => {
    if (playerId) {
      setLogoutDialogOpen(true);
    } else {
      setLoginWithPlayerIdDialogOpen(true);
    }
  };

  const handleLoginWithPlayerIdDialogClose = () => {
    setLoginWithPlayerIdDialogOpen(false);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          textAlign: 'center',
          py: 1,
          borderRadius: 0,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          The world's most trusted TCG tournament platform.
        </Typography>
      </Paper>

      <AppBar position="static" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: '#1976d2',
                  letterSpacing: '-0.5px',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#1565c0',
                  },
                }}
              >
                RK10
              </Typography>
            </Link>

            {/* Search Button */}
            <Button
              variant="outlined"
              onClick={handleSearchClick}
              startIcon={<SearchIcon />}
              sx={{
                width: '400px',
                height: '40px',
                justifyContent: 'flex-start',
                textAlign: 'left',
                color: '#666',
                borderColor: '#e0e0e0',
                backgroundColor: '#f5f5f5',
                borderRadius: '25px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: '#f0f7ff',
                },
                '& .MuiButton-startIcon': {
                  marginRight: '12px',
                },
              }}
            >
              Search by tournament name or location...
            </Button>

            {/* Profile Icon */}
            <IconButton
              sx={{
                p: 0,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
              onClick={handleLoginWithPlayerIdClick}
            >
              <Avatar
                sx={{
                  bgcolor: '#1976d2',
                  width: 40,
                  height: 40,
                }}
              >
                <PersonIcon />
              </Avatar>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <SearchTournamentsDialog open={searchDialogOpen} onClose={handleSearchDialogClose} />
      <LoginWithPlayerIdDialog open={loginWithPlayerIdDialogOpen} onClose={handleLoginWithPlayerIdDialogClose} />
      {playerId && <LogoutDialog open={logoutDialogOpen} onClose={handleLogoutDialogClose} playerId={playerId} />}
    </Box>
  );
}
