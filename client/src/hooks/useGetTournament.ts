import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../constants';

interface Tournament {
  id: string;
  name: string;
  organizer_name: string;
  organizer_popid: string;
  startdate: string;
  lessswiss: boolean;
  autotablenumber: boolean;
  overflowtablestart: number;
  roundtime: number;
  finalsroundtime: number;
  city: string;
  state: string;
  country: string;
}

async function getTournament(tournamentId: string): Promise<Tournament> {
  const response = await axios.get(`${API_URL}/tournament/${tournamentId}`);
  return response.data;
}

export function useGetTournament(tournamentId?: string) {
  return useQuery<Tournament | undefined, Error>({
    queryKey: ['tournaments'],
    queryFn: () => {
      if (!tournamentId) {
        return;
      }

      return getTournament(tournamentId);
    },
    enabled: !!tournamentId,
  });
}
