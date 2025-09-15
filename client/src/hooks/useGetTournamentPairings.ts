import { useQuery } from '@tanstack/react-query';
import axios from '../api';
import { useEffect } from 'react';
import { socket, SERVER_URI } from '../util';

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
  const response = await axios.get(`${SERVER_URI}/api/tournament/${tournamentId}/pairings`);
  return response.data;
}

export function useGetTournamentPairings(tournamentId?: string) {
  const getTournamentPairingsQuery = useQuery<TournamentPairings[] | undefined, Error>({
    queryKey: ['tournamentPairings', tournamentId],
    queryFn: () => {
      if (!tournamentId) {
        return;
      }

      return getTournamentPairings(tournamentId);
    },
    enabled: !!tournamentId,
  });

  useEffect(() => {
    if (tournamentId) {
      socket.on('data_updated', () => getTournamentPairingsQuery.refetch());
    }

    return () => {
      if (tournamentId) {
        socket.off('data_updated');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  return getTournamentPairingsQuery;
}
