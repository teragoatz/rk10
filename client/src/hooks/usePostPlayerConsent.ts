import { useMutation } from '@tanstack/react-query';
import axios from '../api';

export interface PlayerConsentPayload {
  playerId: number;
  consent: boolean;
}

async function postPlayerConsent(payload: PlayerConsentPayload): Promise<string> {
  const { playerId, consent } = payload;
  const response = await axios.post(`/api/player/${playerId}/consent`, { consent });
  // const response = await axios.post(`http://localhost:5000/api/player/${playerId}/consent`, { consent });
  return response.data;
}

export function usePostPlayerConsent() {
  return useMutation<string, Error, PlayerConsentPayload>({
    mutationKey: ['playerConsent'],
    mutationFn: (payload: PlayerConsentPayload) => {
      return postPlayerConsent(payload);
    },
  });
}
