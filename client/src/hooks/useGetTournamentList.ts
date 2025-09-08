import { useQuery } from '@tanstack/react-query';
import axios from '../api';
import { Tournament } from './useGetTournament';

async function getTournamentList(status: string): Promise<Tournament[]> {
  const response = await axios.get(`/api/tournaments?status=${status}`);
  // const response = await axios.get(`http://localhost:5000/api/tournaments?status=${status}`);
  return response.data;
}

export function useGetTournamentList(status = 'incomplete') {
  return useQuery<Tournament[], Error>({
    queryKey: ['tournamentList', status],
    queryFn: () => getTournamentList(status),
  });
}
