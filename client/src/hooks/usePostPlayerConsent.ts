import { useMutation } from '@tanstack/react-query';
import axios from '../api';
import { SERVER_URI } from '../util';

export interface PlayerConsentPayload {
  playerId: number;
  consent: boolean;
}

async function postPlayerConsent(payload: PlayerConsentPayload): Promise<string> {
  const { playerId, consent } = payload;
  const response = await axios.post(`${SERVER_URI}/api/player/${playerId}/consent`, { consent });
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
