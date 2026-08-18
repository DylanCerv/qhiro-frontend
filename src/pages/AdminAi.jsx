import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import { ui } from '../i18n/es';

function formatUsd(value) {
  if (value == null || Number.isNaN(Number(value))) return ui.common.notAvailable;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatPrice(model) {
  if (isPendingModel(model) || model.inputUsdPer1M == null) {
    return ui.aiSettings.trainingCost;
  }
  return ui.aiSettings.gptCredits;
}

function isPendingModel(model) {
  return model.status === 'pending' || model.selectable === false;
}

export default function AdminAi() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchingId, setSwitchingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadStatus = useCallback(async () => {
    const response = await api.getAiStatus();
    setStatus(response);
  }, []);

  useEffect(() => {
    loadStatus()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadStatus]);

  const handleRefresh = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await loadStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (modelId) => {
    setError('');
    setSuccess('');
    setSwitchingId(modelId);
    try {
      const response = await api.setAiModel(modelId);
      setStatus(response);
      setSuccess(ui.aiSettings.switched);
    } catch (err) {
      setError(err.message);
    } finally {
      setSwitchingId('');
    }
  };

  if (loading && !status) return <p className="page-state">{ui.common.loadingSession}</p>;

  const credits = status?.credits ?? {};
  const usage = status?.usage ?? {};
  const models = status?.models ?? [];
  const creditValue = credits.available ? credits.totalAvailableUsd : null;

  return (
    <div className="page admin-ai-page">
      <div className="page-head admin-clients-head">
        <div>
          <h1>{ui.aiSettings.title}</h1>
          <p>{ui.aiSettings.subtitle}</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-grant-btn" onClick={handleRefresh} disabled={loading}>
            {ui.aiSettings.refresh}
          </button>
        </div>
      </div>

      <div className="admin-kpis">
        <section className="card">
          <p className="admin-kpi-label">{ui.aiSettings.available}</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--green" aria-hidden="true">
            account_balance_wallet
          </span>
          <strong>{formatUsd(creditValue)}</strong>
        </section>
        <section className="card">
          <p className="admin-kpi-label">
            {credits.available ? ui.aiSettings.used : ui.aiSettings.estimated}
          </p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--red" aria-hidden="true">
            payments
          </span>
          <strong>{formatUsd(credits.available ? credits.totalUsedUsd : usage.estimatedUsd)}</strong>
        </section>
        <section className="card">
          <p className="admin-kpi-label">{ui.aiSettings.analyses}</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--blue" aria-hidden="true">
            analytics
          </span>
          <strong>{usage.analysesCount ?? 0}</strong>
        </section>
        <section className="card">
          <p className="admin-kpi-label">{ui.aiSettings.activeModel}</p>
          <span className="material-symbols-outlined admin-kpi-icon admin-kpi-icon--green" aria-hidden="true">
            psychology
          </span>
          <strong className="admin-ai-model-value">
            {models.find((model) => model.active)?.label ?? status?.activeModel ?? ui.common.notAvailable}
          </strong>
        </section>
      </div>

      <section className="card admin-ai-status-card">
        <div className="admin-ai-status-row">
          <StatusBadge
            status={
              !status?.apiKeyConfigured || usage.quotaExceeded
                ? 'yellow'
                : 'green'
            }
            label={
              !status?.apiKeyConfigured
                ? ui.aiSettings.keyMissing
                : usage.quotaExceeded
                  ? ui.aiSettings.noQuota
                  : ui.aiSettings.ready
            }
          />
          {credits.billingUrl && (
            <a href={credits.billingUrl} target="_blank" rel="noreferrer">
              {ui.aiSettings.billing}
            </a>
          )}
        </div>
        {!credits.available && (
          <p className="admin-ai-note">
            {credits.message ?? ui.aiSettings.creditsUnavailable} {ui.aiSettings.estimated}: {formatUsd(usage.estimatedUsd)}.
          </p>
        )}
        {credits.available && credits.message && (
          <p className="admin-ai-note">{credits.message}</p>
        )}
        {usage.lastError && !usage.quotaExceeded && <p className="form-error">{usage.lastError}</p>}
      </section>

      <section className="card">
        <h2>{ui.aiSettings.modelsTitle}</h2>
        <p className="admin-ai-lead">{ui.aiSettings.modelsLead}</p>
        <div className="admin-ai-models">
          {models.map((model) => {
            const busy = switchingId === model.id;
            const pending = isPendingModel(model);
            return (
              <article
                key={model.id}
                className={`admin-ai-model${model.active ? ' is-active' : ''}${pending ? ' is-pending' : ''}${model.available ? '' : ' is-unavailable'}`}
              >
                <div className="admin-ai-model-head">
                  <div>
                    <h3>{model.label}</h3>
                    <p>{model.provider}</p>
                  </div>
                  {model.active && <StatusBadge status="green" label={ui.aiSettings.inUse} />}
                  {pending && !model.active && (
                    <StatusBadge status="pending" label={ui.aiSettings.pending} />
                  )}
                </div>
                <p>{model.description}</p>
                <div className="admin-ai-model-meta">
                  <span>{formatPrice(model)}</span>
                  {model.supportsVision && <span>{ui.aiSettings.vision}</span>}
                  {pending && <span>{ui.aiSettings.training}</span>}
                </div>
                <button
                  type="button"
                  className={model.active ? 'admin-grant-btn' : 'admin-ai-switch'}
                  disabled={model.active || pending || !model.available || Boolean(switchingId)}
                  onClick={() => handleSwitch(model.id)}
                >
                  {model.active
                    ? ui.aiSettings.inUse
                    : pending
                      ? ui.aiSettings.training
                      : !model.available
                        ? ui.aiSettings.unavailable
                        : busy
                          ? 'Cambiando…'
                          : ui.aiSettings.useModel}
                </button>
              </article>
            );
          })}
        </div>
        {success && <p className="form-success">{success}</p>}
        {error && <p className="form-error">{error}</p>}
      </section>
    </div>
  );
}
