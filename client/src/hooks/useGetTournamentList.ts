import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

async function getTournamentList(status: string): Promise<Tournament[]> {
  const response = await axios.get(`http://localhost:5000/api/tournaments?status=${status}`);
  return response.data;
}

export function useGetTournamentList(status = 'incomplete') {
  return useQuery<Tournament[], Error>({
    queryKey: ['tournaments'],
    queryFn: () => getTournamentList(status),
  });
}
