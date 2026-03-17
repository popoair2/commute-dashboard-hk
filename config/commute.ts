import type { CommuteConfig } from '../lib/types';

export const commuteConfig: CommuteConfig = {
  profileName: 'Morning Home → Work',
  originLabel: 'Home',
  destinationLabel: 'Work',
  preferredBus: {
    operator: 'KMB',
    route: '970X',
    stopId: 'KMB_STOP_1234',
    bound: 'To Work',
  },
  backupBus: {
    operator: 'Citybus',
    route: '970',
    stopId: 'CTB_STOP_5678',
    bound: 'To Work',
  },
  trainFallbackLabel: 'MTR fallback',
};
