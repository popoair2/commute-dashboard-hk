import type { ActionLabel, NormalizedSignals, VerdictLabel, VerdictResult } from './types';

function hasUnclearData(signals: NormalizedSignals): boolean {
  return (
    signals.preferredEtaBucket === 'UNKNOWN' ||
    signals.backupEtaBucket === 'UNKNOWN' ||
    signals.traffic === 'UNKNOWN' ||
    signals.accident === 'UNKNOWN' ||
    signals.weather === 'UNKNOWN'
  );
}

function buildResult(
  verdict: VerdictLabel,
  action: ActionLabel,
  reason: string,
): VerdictResult {
  return { verdict, action, reason };
}

export function evaluateCommute(signals: NormalizedSignals): VerdictResult {
  // Rule 1: hard train recommendation only for severe disruption.
  if (signals.accident === 'MAJOR' || signals.weather === 'SEVERE') {
    return buildResult(
      'Consider train today',
      'Train fallback recommended',
      'Severe disruption detected (major accident or severe weather).',
    );
  }

  // Rule 2: strong preferred-bus case (clearly strong only).
  if (
    signals.preferredEtaBucket === 'GOOD' &&
    signals.backupEtaBucket !== 'UNKNOWN' &&
    signals.traffic === 'LIGHT' &&
    signals.accident === 'NONE' &&
    signals.weather === 'NORMAL'
  ) {
    return buildResult(
      'Bus looks good',
      'Preferred bus looks fine',
      'Signals are clearly favorable across ETA, traffic, incidents, and weather.',
    );
  }

  // Rule 3: both buses weak or traffic clearly too heavy.
  if (
    (signals.preferredEtaBucket === 'BAD' && signals.backupEtaBucket === 'BAD') ||
    (signals.traffic === 'HEAVY' &&
      signals.preferredEtaBucket !== 'GOOD' &&
      signals.backupEtaBucket !== 'GOOD')
  ) {
    return buildResult(
      'Consider train today',
      'Train fallback recommended',
      'Bus ETAs are weak under current disruption conditions.',
    );
  }

  // Rule 4: preferred weak but backup still workable.
  if (
    signals.preferredEtaBucket === 'BAD' &&
    (signals.backupEtaBucket === 'GOOD' || signals.backupEtaBucket === 'OK')
  ) {
    return buildResult(
      'Bus is risky today',
      'Backup bus is safer',
      'Preferred route is delayed; backup route appears safer.',
    );
  }

  // Rule 5: mixed/unclear signal handling, avoid overconfidence.
  if (hasUnclearData(signals)) {
    if (signals.backupEtaBucket === 'GOOD' || signals.backupEtaBucket === 'OK') {
      return buildResult(
        'Bus still possible',
        'Backup bus is safer',
        'Some signals are unclear; backup ETA still looks workable.',
      );
    }

    return buildResult(
      'Bus still possible',
      'Train fallback recommended',
      'Some signals are unclear and backup confidence is limited.',
    );
  }

  // Rule 6: cautious default when conditions are mixed but not severe.
  return buildResult(
    'Bus still possible',
    'Backup bus is safer',
    'Conditions are mixed, so a cautious bus choice is recommended.',
  );
}
