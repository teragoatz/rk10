import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";
// import "@fontsource/ubuntu-mono";
// import "@fontsource/ubuntu-mono/400.css";
// import "@fontsource/ubuntu-mono/400-italic.css";
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './header/Header';

const Home = lazy(() => import('./pages/home/Home'));
const TournamentDetail = lazy(() => import('./pages/tournament/TournamentDetail'));
const PageNotFound = lazy(() => import('./pages/404/PageNotFound'));

function Loading() {
  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={100} />
      </Box>
    </Container>
  );
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    h2: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '3.75rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournament/:id" element={<TournamentDetail />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        {/* <Footer /> */}
      </Suspense>
    </ThemeProvider>
  );
}
