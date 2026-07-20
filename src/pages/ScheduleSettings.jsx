import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useParcels } from '../context/ParcelContext';
import {
  formatDate,
  formatFrequency,
  getScheduleTypeLabel,
  toDatetimeLocal,
  ui,
} from '../i18n/es';

const scheduleTypeOptions = ['routine', 'inspection', 'emergency'];
const scheduleTypeMeta = {
  routine: { label: 'Rutina', subtitle: 'Mapeo NDVI y humedad', icon: 'check_circle' },
  inspection: { label: 'Inspección', subtitle: 'Anomalía térmica detectada', icon: 'search' },
  emergency: { label: 'Emergencia', subtitle: 'Riesgo biológico / plaga', icon: 'warning' },
};

const emptyForm = {
  parcelId: '',
  startTime: '',
  frequencyDays: 7,
  enabled: true,
  scheduleType: 'routine',
};

export default function ScheduleSettings() {
  const { parcels } = useParcels();
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuScheduleId, setOpenMenuScheduleId] = useState(null);
  const pageSize = 4;

  useEffect(() => {
    api
      .getSchedules()
      .then((scheduleRes) => {
        setSchedules(scheduleRes.schedules ?? []);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (parcels[0] && !form.parcelId) {
      setForm((prev) => ({ ...prev, parcelId: parcels[0].parcelId }));
    }
  }, [parcels, form.parcelId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const resetForm = () => {
    setEditingScheduleId(null);
    setForm({
      ...emptyForm,
      parcelId: parcels[0]?.parcelId ?? '',
    });
  };

  const startEdit = (schedule) => {
    setEditingScheduleId(schedule.scheduleId);
    setForm({
      parcelId: schedule.parcelId,
      startTime: toDatetimeLocal(schedule.startTime),
      frequencyDays: schedule.frequencyDays,
      enabled: schedule.enabled,
      scheduleType: schedule.scheduleType ?? 'routine',
    });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const startTime = form.startTime
        ? new Date(form.startTime).toISOString()
        : new Date().toISOString();
      const payload = {
        ...form,
        startTime,
        scheduleId: editingScheduleId ?? undefined,
      };
      const result = await api.saveSchedule(payload);
      setSchedules((prev) => {
        const filtered = prev.filter((s) => s.scheduleId !== result.schedule.scheduleId);
        return [...filtered, result.schedule];
      });
      setMessage(editingScheduleId ? ui.schedule.updated : ui.schedule.saved);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (scheduleId) => {
    setError('');
    try {
      await api.deleteSchedule(scheduleId);
      setSchedules((prev) => prev.filter((s) => s.scheduleId !== scheduleId));
      if (editingScheduleId === scheduleId) resetForm();
      setMessage(ui.schedule.deleted);
    } catch (err) {
      setError(err.message);
    }
  };

  const getParcelName = (parcelId) =>
    parcels.find((p) => p.parcelId === parcelId)?.name ?? parcelId;

  const filteredSchedules = useMemo(() => {
    if (statusFilter === 'all') return schedules;
    if (statusFilter === 'active') return schedules.filter((schedule) => schedule.enabled);
    return schedules.filter((schedule) => !schedule.enabled);
  }, [schedules, statusFilter]);

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(filteredSchedules.length / pageSize));
    setCurrentPage((page) => Math.min(page, nextTotalPages));
  }, [filteredSchedules.length]);

  const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / pageSize));

  const pagedSchedules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSchedules.slice(start, start + pageSize);
  }, [currentPage, filteredSchedules]);

  const activeSchedules = schedules.filter((schedule) => schedule.enabled).length;
  const pausedSchedules = schedules.filter((schedule) => !schedule.enabled).length;
  const averageFrequency = schedules.length
    ? schedules.reduce((sum, schedule) => sum + Number(schedule.frequencyDays || 0), 0) / schedules.length
    : 0;
  const monthlyRuns = schedules.reduce((sum, schedule) => {
    const frequency = Math.max(1, Number(schedule.frequencyDays || 1));
    return sum + Math.max(1, Math.round(30 / frequency));
  }, 0);

  const kpiCards = [
    {
      icon: 'flight',
      label: 'Tiempo de vuelo (mes)',
      value: `${(monthlyRuns * 8.5).toFixed(1)} h`,
    },
    {
      icon: 'eco',
      label: 'CO2 compensado',
      value: `${(monthlyRuns * 0.12).toFixed(1)} Tons`,
    },
  ];

  return (
    <div className="page schedule-page">
      <div className="page-head schedule-head">
        <div className="schedule-head-copy">
          <p className="page-eyebrow">Panel de Control</p>
          <h1>Programación de Vuelos</h1>
          <p>Gestión de misiones autónomas y telemetría de flota.</p>
        </div>
      </div>

      <div className="grid-2 schedule-grid">
        <section className="card schedule-form-card">
          <h2>{editingScheduleId ? 'Editar programación' : 'Programar misión'}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="schedule-field">
              <span className="schedule-label">Seleccionar parcela</span>
              <select
                value={form.parcelId}
                onChange={(e) => setForm({ ...form, parcelId: e.target.value })}
              >
                {parcels.map((p) => (
                  <option key={p.parcelId} value={p.parcelId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="schedule-type-group">
              <legend className="schedule-label">Tipo de misión</legend>
              <div className="schedule-type-list">
                {scheduleTypeOptions.map((type) => {
                  const meta = scheduleTypeMeta[type];
                  return (
                    <label key={type} className={form.scheduleType === type ? 'schedule-type-option active' : 'schedule-type-option'}>
                      <input
                        type="radio"
                        name="scheduleType"
                        value={type}
                        checked={form.scheduleType === type}
                        onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
                      />
                      <span className="schedule-type-dot" aria-hidden="true" />
                      <span className="schedule-type-icon">
                        <span className="material-symbols-outlined" aria-hidden="true">{meta.icon}</span>
                      </span>
                      <span className="schedule-type-copy">
                        <strong>{meta.label}</strong>
                        <small>{meta.subtitle}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="schedule-form-row">
              <label className="schedule-field">
                <span className="schedule-label">Frecuencia</span>
                <select
                  value={form.frequencyDays}
                  onChange={(e) =>
                    setForm({ ...form, frequencyDays: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 5, 7, 14, 30].map((value) => (
                    <option key={value} value={value}>
                      {formatFrequency(value)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="schedule-field">
                <span className="schedule-label">Hora inicio</span>
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary schedule-submit">
                <span className="material-symbols-outlined" aria-hidden="true">flight_takeoff</span>
                <span>Confirmar programación</span>
              </button>
            </div>
          </form>
          {message && <p className="form-success">{message}</p>}
          {error && <p className="form-error">{error}</p>}
        </section>

        <section className="card schedule-list-card">
          <div className="schedule-list-head">
            <h2>Próximas misiones</h2>
            <div className="schedule-list-tabs" role="tablist" aria-label="Filtrar misiones">
              <button
                type="button"
                className={statusFilter === 'active' ? 'schedule-pill active' : 'schedule-pill'}
                onClick={() => setStatusFilter('active')}
              >
                <span>{activeSchedules}</span>
                <span>Activas</span>
              </button>
              <button
                type="button"
                className={statusFilter === 'paused' ? 'schedule-pill active' : 'schedule-pill'}
                onClick={() => setStatusFilter('paused')}
              >
                <span>{pausedSchedules}</span>
                <span>Pausadas</span>
              </button>
            </div>
          </div>
          {schedules.length === 0 ? (
            <p className="empty-state">Aún no hay programaciones.</p>
          ) : (
            <>
              <div className="schedule-table">
                <div className="schedule-table-head">
                  <span>Estado</span>
                  <span>Parcela / misión</span>
                  <span>Cronograma</span>
                  <span aria-hidden="true" />
                </div>
                <ul className="schedule-table-body">
                  {pagedSchedules.map((s) => (
                    <li key={s.scheduleId} className="schedule-row">
                      <div className="schedule-state-cell">
                        <span className={s.enabled ? 'schedule-dot active' : 'schedule-dot paused'} />
                        <strong>{s.enabled ? 'Listo' : 'Pausado'}</strong>
                      </div>
                      <div className="schedule-mission-cell">
                        <strong>{getParcelName(s.parcelId)}</strong>
                        <span>{getScheduleTypeLabel(s.scheduleType ?? 'routine')}</span>
                      </div>
                      <div className="schedule-time-cell">
                        <strong>{formatDate(s.nextRunAt)}</strong>
                        <span>{formatFrequency(s.frequencyDays)}</span>
                      </div>
                      <div className="schedule-actions-cell">
                        <button
                          type="button"
                          className="schedule-menu-btn"
                          aria-label="Abrir acciones"
                          onClick={() =>
                            setOpenMenuScheduleId((current) =>
                              current === s.scheduleId ? null : s.scheduleId,
                            )
                          }
                        >
                          <span className="material-symbols-outlined" aria-hidden="true">more_vert</span>
                        </button>
                        {openMenuScheduleId === s.scheduleId && (
                          <div className="schedule-menu">
                            <button type="button" onClick={() => startEdit(s)}>
                              Editar
                            </button>
                            <button type="button" onClick={() => handleDelete(s.scheduleId)}>
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="schedule-list-footer">
                <p>
                  Mostrando {Math.min(filteredSchedules.length, currentPage * pageSize)}
                  {' '}de {filteredSchedules.length} misiones programadas
                </p>
                <div className="schedule-pagination">
                  <button
                    type="button"
                    className="btn-secondary schedule-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    className="btn-primary schedule-page-btn schedule-page-btn--solid"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <div className="schedule-kpi-grid">
        {kpiCards.map((card) => (
          <section key={card.label} className="card schedule-kpi-card">
            <span className="schedule-kpi-icon">
              <span className="material-symbols-outlined" aria-hidden="true">{card.icon}</span>
            </span>
            <div>
              <p>{card.label}</p>
              <strong>{card.value}</strong>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
