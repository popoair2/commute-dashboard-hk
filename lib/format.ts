import type { AccidentLevel, TrafficLevel, WeatherLevel } from './types';

export function formatEta(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return 'Unavailable';
  }

  return `${value} min`;
}

export function formatTraffic(level: TrafficLevel): string {
  const labels: Record<TrafficLevel, string> = {
    LIGHT: 'Light',
    MODERATE: 'Moderate',
    HEAVY: 'Heavy',
    UNKNOWN: 'Unknown',
  };

  return labels[level];
}

export function formatAccident(level: AccidentLevel): string {
  const labels: Record<AccidentLevel, string> = {
    NONE: 'None',
    MINOR: 'Minor nearby alert',
    MAJOR: 'Major route-impacting alert',
    UNKNOWN: 'Unknown',
  };

  return labels[level];
}

export function formatWeather(level: WeatherLevel): string {
  const labels: Record<WeatherLevel, string> = {
    NORMAL: 'Normal',
    ADVISORY: 'Advisory',
    SEVERE: 'Severe',
    UNKNOWN: 'Unknown',
  };

  return labels[level];
}

export function formatTimeLabel(isoTime: string): string {
  const date = new Date(isoTime);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleTimeString('en-HK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
