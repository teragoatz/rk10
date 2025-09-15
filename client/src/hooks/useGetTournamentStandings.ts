import { useQuery } from '@tanstack/react-query';
import axios from '../api';
import { useEffect } from 'react';
import { socket } from '../util';

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
  const getTournamentStandingsQuery = useQuery<TournamentStanding[] | undefined, Error>({
    queryKey: ['tournamentStandings', tournamentId],
    queryFn: () => {
      if (!tournamentId) {
        return;
      }

      return getTournamentStandings(tournamentId);
    },
    enabled: !!tournamentId,
  });

  useEffect(() => {
    if (tournamentId) {
      socket.on('data_updated', () => getTournamentStandingsQuery.refetch());
    }

    return () => {
      if (tournamentId) {
        socket.off('data_updated');
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  return getTournamentStandingsQuery;
}
