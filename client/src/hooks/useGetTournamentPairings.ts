import { useQuery } from '@tanstack/react-query';
import axios from '../api';

export interface PlayerName {
  first: string;
  last: string;
}

export interface IMatch {
  id: number;
  outcome: number;
  tablenumber: number;
  timestamp: string;
  player1_id: string;
  player1_name?: PlayerName;
  player2_name?: PlayerName;
  player2_id: string;
  round_id: number;
}

export interface TournamentPairings {
  id: number;
  matches: IMatch[];
  number: number;
  stage: number;
  timeleft: number;
  tournament_id: string;
  type: number;
}

async function getTournamentPairings(tournamentId: string): Promise<TournamentPairings[]> {
  const response = await axios.get(`/api/tournament/${tournamentId}/pairings`);
  // const response = await axios.get(`http://localhost:5000/api/tournament/${tournamentId}/pairings`);
  return response.data;
}

export function useGetTournamentPairings(tournamentId?: string) {
  return useQuery<TournamentPairings[] | undefined, Error>({
    queryKey: ['tournamentPairings', tournamentId],
    queryFn: () => {
      if (!tournamentId) {
        return;
      }

      return getTournamentPairings(tournamentId);
    },
    enabled: !!tournamentId,
  });
}
