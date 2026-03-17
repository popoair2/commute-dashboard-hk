import type { EtaBucket, NormalizedSignals, RawSignals } from './types';

function etaToBucket(etaMin: number | null): EtaBucket {
  if (etaMin === null || Number.isNaN(etaMin)) {
    return 'UNKNOWN';
  }

  if (etaMin <= 8) {
    return 'GOOD';
  }

  if (etaMin <= 12) {
    return 'OK';
  }

  return 'BAD';
}

export function normalizeSignals(raw: RawSignals): NormalizedSignals {
  return {
    preferredEtaBucket: etaToBucket(raw.preferredEtaMin),
    backupEtaBucket: etaToBucket(raw.backupEtaMin),
    traffic: raw.traffic,
    accident: raw.accident,
    weather: raw.weather,
  };
}
