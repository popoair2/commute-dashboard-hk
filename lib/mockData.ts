import type { MockScenario } from './types';

export const mockScenarios: MockScenario[] = [
  {
    id: 'bus-looks-good',
    name: 'Bus looks good',
    updatedAt: '2026-03-17T07:42:00+08:00',
    signals: {
      preferredEtaMin: 4,
      backupEtaMin: 8,
      traffic: 'LIGHT',
      accident: 'NONE',
      weather: 'ADVISORY',
    },
  },
  {
    id: 'bus-still-possible',
    name: 'Bus still possible',
    updatedAt: '2026-03-17T07:44:00+08:00',
    signals: {
      preferredEtaMin: 10,
      backupEtaMin: 7,
      traffic: 'MODERATE',
      accident: 'MINOR',
      weather: 'ADVISORY',
    },
  },
  {
    id: 'bus-risky-today',
    name: 'Bus is risky today',
    updatedAt: '2026-03-17T07:46:00+08:00',
    signals: {
      preferredEtaMin: 15,
      backupEtaMin: 9,
      traffic: 'HEAVY',
      accident: 'MINOR',
      weather: 'NORMAL',
    },
  },
  {
    id: 'consider-train',
    name: 'Consider train today',
    updatedAt: '2026-03-17T07:48:00+08:00',
    signals: {
      preferredEtaMin: 17,
      backupEtaMin: 18,
      traffic: 'HEAVY',
      accident: 'MAJOR',
      weather: 'SEVERE',
    },
  },
  {
    id: 'partial-unclear',
    name: 'Partial / unclear data',
    updatedAt: '2026-03-17T07:49:00+08:00',
    signals: {
      preferredEtaMin: null,
      backupEtaMin: 11,
      traffic: 'UNKNOWN',
      accident: 'NONE',
      weather: 'ADVISORY',
    },
  },
];

export const defaultScenarioId = 'bus-still-possible';
