import { useQuery } from '@tanstack/react-query';
import axios from '../api';

export interface TournamentStanding {
  player_id: string;
  firstname: string | null;
  lastname: string | null;
  wins: number;
  losses: number;
  ties: number;
  byes: number;
  record: string;
}

async function getTournamentStandings(tournamentId: string): Promise<TournamentStanding[]> {
  const response = await axios.get(`/api/tournament/${tournamentId}/standings`);
  // const response = await axios.get(`http://localhost:5000/api/tournament/${tournamentId}/standings`);
  return response.data;
}

export function useGetTournamentStandings(tournamentId?: string) {
  return useQuery<TournamentStanding[] | undefined, Error>({
    queryKey: ['tournamentStandings', tournamentId],
    queryFn: () => {
      if (!tournamentId) {
        return;
      }

      return getTournamentStandings(tournamentId);
    },
    enabled: !!tournamentId,
  });
}
