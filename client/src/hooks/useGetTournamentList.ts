import { useQuery } from '@tanstack/react-query';
import axios from '../api';
import { Tournament } from './useGetTournament';
import { SERVER_URI } from '../util';

async function getTournamentList(status: string): Promise<Tournament[]> {
  const response = await axios.get(`${SERVER_URI}/api/tournaments?status=${status}`);
  return response.data;
}

export function useGetTournamentList(status = 'incomplete') {
  return useQuery<Tournament[], Error>({
    queryKey: ['tournamentList', status],
    queryFn: () => getTournamentList(status),
  });
}
