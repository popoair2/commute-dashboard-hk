import { commuteConfig } from '../config/commute';
import { fetchCitybusFirstEta } from '../lib/citybus';
import { formatAccident, formatEta, formatTimeLabel, formatTraffic, formatWeather } from '../lib/format';
import { defaultScenarioId, mockScenarios } from '../lib/mockData';
import { normalizeSignals } from '../lib/normalize';
import { fetchTrafficLevel } from '../lib/traffic';
import { evaluateCommute } from '../lib/verdictRules';

type PageProps = {
  searchParams?: {
    scenario?: string;
    source?: string;
  };
};

function getScenario(selectedScenarioId?: string) {
  if (selectedScenarioId) {
    const selected = mockScenarios.find((scenario) => scenario.id === selectedScenarioId);

    if (selected) {
      return selected;
    }
  }

  return mockScenarios.find((scenario) => scenario.id === defaultScenarioId) ?? mockScenarios[0];
}

export default async function HomePage({ searchParams }: PageProps) {
  const scenario = getScenario(searchParams?.scenario);
  const useMockOnly = searchParams?.source === 'mock';

  let preferredEtaMin = useMockOnly ? scenario.signals.preferredEtaMin : null;
  let preferredEtaSource: 'live' | 'mock' | 'none' = useMockOnly ? 'mock' : 'none';
  let traffic = scenario.signals.traffic;
  let trafficSource: 'live' | 'mock' = 'mock';
  let updatedAt = scenario.updatedAt;
  let dataSourceLabel = useMockOnly
    ? `Mock scenario: ${scenario.name}`
    : 'No live Citybus ETA available right now';

  if (!useMockOnly) {
    try {
      const liveEta = await fetchCitybusFirstEta({
        operator: commuteConfig.preferredBus.operator,
        stopId: commuteConfig.preferredBus.stopId,
        route: commuteConfig.preferredBus.route,
        direction: commuteConfig.preferredBus.direction,
      });

      if (liveEta.etaMin !== null) {
        preferredEtaMin = liveEta.etaMin;
        preferredEtaSource = 'live';
        dataSourceLabel = 'Live preferred ETA: Citybus';
      } else {
        dataSourceLabel = 'No live Citybus ETA available right now';
      }

      if (liveEta.updatedAt) {
        updatedAt = liveEta.updatedAt;
      }
    } catch {
      dataSourceLabel = 'Citybus API unavailable. No live ETA right now';
    }

    try {
      const liveTraffic = await fetchTrafficLevel();

      traffic = liveTraffic.traffic;
      trafficSource = 'live';
    } catch {
      trafficSource = 'mock';
    }
  }

  const signals = {
    ...scenario.signals,
    preferredEtaMin,
    traffic,
  };

  const normalized = normalizeSignals(signals);
  const outcome = evaluateCommute(normalized);
  const isDev = process.env.NODE_ENV !== 'production';
  const trainRecommended = outcome.action === 'Train fallback recommended';

  return (
    <main className="page">
      <div className="container">
        <section className="card header-card">
          <h1>Commute Dashboard HK</h1>
          <p>Updated: {formatTimeLabel(updatedAt)}</p>
          <p className="subtle">{dataSourceLabel}</p>
        </section>

        <section className="card verdict-card">
          <p className="verdict-label">Current commute verdict</p>
          <h2>{outcome.verdict}</h2>
          <p className="action">{outcome.action}</p>
          <p className="reason">{outcome.reason}</p>
        </section>

        <section className="card">
          <h3>Bus options</h3>
          <div className="row">
            <span>
              Preferred ({commuteConfig.preferredBus.route}) {commuteConfig.preferredBus.stopLabel}
            </span>
            <strong>
              {formatEta(signals.preferredEtaMin)} ·{' '}
              {preferredEtaSource === 'live'
                ? 'Live'
                : preferredEtaSource === 'mock'
                  ? 'Mock fallback'
                  : 'No live ETA'}
            </strong>
          </div>
          <div className="row">
            <span>Backup ({commuteConfig.backupBus.route})</span>
            <strong>{formatEta(signals.backupEtaMin)}</strong>
          </div>
        </section>

        <section className="card">
          <h3>Disruption signals</h3>
          <div className="row">
            <span>Traffic</span>
            <strong>
              {formatTraffic(signals.traffic)} · {trafficSource === 'live' ? 'Live' : 'Mock fallback'}
            </strong>
          </div>
          <div className="row">
            <span>Road accident alert</span>
            <strong>{formatAccident(signals.accident)}</strong>
          </div>
          <div className="row">
            <span>Weather severity</span>
            <strong>{formatWeather(signals.weather)}</strong>
          </div>
        </section>

        <section className="card">
          <h3>Fallback guidance</h3>
          {trainRecommended ? (
            <p className="fallback-primary">
              Recommended now: switch to {commuteConfig.trainFallbackLabel}.
            </p>
          ) : (
            <p>
              Keep {commuteConfig.trainFallbackLabel} as your backup if bus conditions worsen.
            </p>
          )}
          <p className="subtle">Profile: {commuteConfig.profileName}</p>
        </section>

        {isDev && (
          <section className="card dev-card">
            <h3>Dev-only: switch mock scenario</h3>
            <ul>
              {mockScenarios.map((item) => (
                <li key={item.id}>
                  <a href={`/?scenario=${item.id}`}>{item.name}</a>
                </li>
              ))}
            </ul>
            <p>
              For safe local testing, force mock mode: <a href="/?source=mock">/?source=mock</a>
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
