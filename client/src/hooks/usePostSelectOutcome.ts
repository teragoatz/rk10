import { useMutation } from '@tanstack/react-query';
import axios from '../api';
import { MatchOutcome } from '../util/constants';
import { SERVER_URI } from '../util';

export interface SelectOutcomePayload {
  match_id: number;
  player_id: string;
  outcome: MatchOutcome;
}

async function postSelectOutcome(payload: SelectOutcomePayload): Promise<string> {
  const { match_id, player_id, outcome } = payload;
  const response = await axios.post(`${SERVER_URI}/api/match/${match_id}/select-outcome`, { player_id, outcome });
  return response.data;
}

export function usePostSelectOutcome() {
  return useMutation<string, Error, SelectOutcomePayload>({
    mutationKey: ['selectOutcome'],
    mutationFn: (payload: SelectOutcomePayload) => {
      return postSelectOutcome(payload);
    },
  });
}
