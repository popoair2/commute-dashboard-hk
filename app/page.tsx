import { commuteConfig } from '../config/commute';
import { formatAccident, formatEta, formatTimeLabel, formatTraffic, formatWeather } from '../lib/format';
import { defaultScenarioId, mockScenarios } from '../lib/mockData';
import { normalizeSignals } from '../lib/normalize';
import { evaluateCommute } from '../lib/verdictRules';

type PageProps = {
  searchParams?: {
    scenario?: string;
  };
};

function getScenario(selectedScenarioId?: string) {
  if (selectedScenarioId) {
    const selected = mockScenarios.find((scenario) => scenario.id === selectedScenarioId);

    if (selected) {
      return selected;
    }
  }

  return (
    mockScenarios.find((scenario) => scenario.id === defaultScenarioId) ?? mockScenarios[0]
  );
}

export default function HomePage({ searchParams }: PageProps) {
  const scenario = getScenario(searchParams?.scenario);
  const normalized = normalizeSignals(scenario.signals);
  const outcome = evaluateCommute(normalized);
  const isDev = process.env.NODE_ENV !== 'production';
  const trainRecommended = outcome.action === 'Train fallback recommended';

  return (
    <main className="page">
      <div className="container">
        <section className="card header-card">
          <h1>Commute Dashboard HK</h1>
          <p>Updated: {formatTimeLabel(scenario.updatedAt)}</p>
          <p className="subtle">Mock scenario: {scenario.name}</p>
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
            <span>Preferred ({commuteConfig.preferredBus.route})</span>
            <strong>{formatEta(scenario.signals.preferredEtaMin)}</strong>
          </div>
          <div className="row">
            <span>Backup ({commuteConfig.backupBus.route})</span>
            <strong>{formatEta(scenario.signals.backupEtaMin)}</strong>
          </div>
        </section>

        <section className="card">
          <h3>Disruption signals</h3>
          <div className="row">
            <span>Traffic</span>
            <strong>{formatTraffic(scenario.signals.traffic)}</strong>
          </div>
          <div className="row">
            <span>Road accident alert</span>
            <strong>{formatAccident(scenario.signals.accident)}</strong>
          </div>
          <div className="row">
            <span>Weather severity</span>
            <strong>{formatWeather(scenario.signals.weather)}</strong>
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
          </section>
        )}
      </div>
    </main>
  );
}
