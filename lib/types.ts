export type EtaBucket = 'GOOD' | 'OK' | 'BAD' | 'UNKNOWN';
export type TrafficLevel = 'LIGHT' | 'MODERATE' | 'HEAVY' | 'UNKNOWN';
export type AccidentLevel = 'NONE' | 'MINOR' | 'MAJOR' | 'UNKNOWN';
export type WeatherLevel = 'NORMAL' | 'ADVISORY' | 'SEVERE' | 'UNKNOWN';

export type VerdictLabel =
  | 'Bus looks good'
  | 'Bus still possible'
  | 'Bus is risky today'
  | 'Consider train today';

export type ActionLabel =
  | 'Preferred bus looks fine'
  | 'Backup bus is safer'
  | 'Train fallback recommended';

export type RawSignals = {
  preferredEtaMin: number | null;
  backupEtaMin: number | null;
  traffic: TrafficLevel;
  accident: AccidentLevel;
  weather: WeatherLevel;
};

export type NormalizedSignals = {
  preferredEtaBucket: EtaBucket;
  backupEtaBucket: EtaBucket;
  traffic: TrafficLevel;
  accident: AccidentLevel;
  weather: WeatherLevel;
};

export type VerdictResult = {
  verdict: VerdictLabel;
  action: ActionLabel;
  reason: string;
};

export type MockScenario = {
  id: string;
  name: string;
  updatedAt: string;
  signals: RawSignals;
};

export type CommuteConfig = {
  profileName: string;
  originLabel: string;
  destinationLabel: string;
  preferredBus: {
    operator: string;
    route: string;
    stopId: string;
    bound: string;
  };
  backupBus: {
    operator: string;
    route: string;
    stopId: string;
    bound: string;
  };
  trainFallbackLabel: string;
};
