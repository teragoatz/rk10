import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box textAlign="center">
        <h1>Page doesn&apos;t exist.</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </Box>
    </Container>
  );
}
