import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants';

interface TournamentPairing {
  id: number;
  outcome: number;
  tablenumber: number;
  timestamp: string;
  player1_id: string;
  player2_id: string;
  round_id: number;
}

interface TournamentPairings {
  id: number;
  matches: TournamentPairing[];
  number: number;
  stage: number;
  timeleft: number;
  tournament_id: string;
  type: number;
}

async function getTournamentPairings(tournamentId: string): Promise<TournamentPairings[]> {
  const response = await axios.get(`${API_URL}/tournament/${tournamentId}/pairings`);
  return response.data;
}

export function useGetTournamentPairings(tournamentId?: string) {
  return useQuery<TournamentPairings[] | undefined, Error>({
    queryKey: ['tournamentPairings'],
    queryFn: () => {
      if (!tournamentId) {
        return;
      }

      return getTournamentPairings(tournamentId);
    },
    enabled: !!tournamentId,
  });
}
