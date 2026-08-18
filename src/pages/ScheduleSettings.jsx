import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useParcels } from '../context/ParcelContext';
import {
  formatDateTime,
  formatDaysUntil,
  formatRepeat,
  getScheduleTypeLabel,
  toDateInput,
  toTimeInput,
  ui,
} from '../i18n/es';
import { findOverlappingSchedule, getNextOccurrence } from '../utils/schedule';

const emptyForm = {
  parcelIds: [],
  startDate: '',
  startClock: '',
  repeatPreset: 'week',
  repeatEvery: 1,
  repeatUnit: 'day',
  enabled: true,
  scheduleType: '',
};

function getScheduleParcelIds(schedule) {
  if (schedule?.parcelIds?.length) return schedule.parcelIds;
  return schedule?.parcelId ? [schedule.parcelId] : [];
}

function getRepeatPreset(schedule) {
  if (schedule?.repeatUnit === 'week' && Number(schedule.repeatEvery || 1) === 1) return 'week';
  if (schedule?.repeatUnit === 'month' && Number(schedule.repeatEvery || 1) === 1) return 'month';
  if (schedule?.repeatUnit) return 'custom';
  if (Number(schedule?.frequencyDays) === 7) return 'week';
  if (Number(schedule?.frequencyDays) === 30) return 'month';
  return 'custom';
}

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
  const [dragIndex, setDragIndex] = useState(null);
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
    setCurrentPage(1);
  }, [statusFilter]);

  const resetForm = () => {
    setEditingScheduleId(null);
    setForm(emptyForm);
  };

  const startEdit = (schedule) => {
    setEditingScheduleId(schedule.scheduleId);
    setForm({
      parcelIds: getScheduleParcelIds(schedule),
      startDate: toDateInput(schedule.startTime),
      startClock: toTimeInput(schedule.startTime),
      repeatPreset: getRepeatPreset(schedule),
      repeatEvery: Number(schedule.repeatEvery || schedule.frequencyDays || 1),
      repeatUnit: schedule.repeatUnit || 'day',
      enabled: schedule.enabled,
      scheduleType: getScheduleTypeLabel(schedule.scheduleType ?? ''),
    });
    setMessage('');
    setError('');
  };

  const addParcelToRoute = (parcelId) => {
    if (!parcelId || form.parcelIds.includes(parcelId)) return;
    setForm({ ...form, parcelIds: [...form.parcelIds, parcelId] });
  };

  const removeParcelFromRoute = (parcelId) => {
    setForm({
      ...form,
      parcelIds: form.parcelIds.filter((id) => id !== parcelId),
    });
  };

  const reorderParcel = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= form.parcelIds.length) return;
    const nextIds = [...form.parcelIds];
    const [moved] = nextIds.splice(fromIndex, 1);
    nextIds.splice(toIndex, 0, moved);
    setForm({ ...form, parcelIds: nextIds });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (form.parcelIds.length === 0) {
      setError('Añade al menos una parcela a la ruta del dron.');
      return;
    }
    const repeatUnit = form.repeatPreset === 'custom' ? form.repeatUnit : form.repeatPreset;
    const repeatEvery = form.repeatPreset === 'custom' ? Number(form.repeatEvery) : 1;
    if (!Number.isInteger(repeatEvery) || repeatEvery < 1) {
      setError('Indica cada cuánto debe salir el dron.');
      return;
    }
    if (!form.startDate) {
      setError('Elige la fecha de la primera salida.');
      return;
    }
    if (!form.startClock) {
      setError('Elige la hora de salida.');
      return;
    }
    const startTime = new Date(`${form.startDate}T${form.startClock}`).toISOString();
    const overlap = findOverlappingSchedule(
      {
        scheduleId: editingScheduleId ?? undefined,
        startTime,
        repeatUnit,
        repeatEvery,
      },
      schedules,
    );
    if (overlap) {
      setError('El dron ya tiene una misión ese día a esa hora. Elige otra fecha u otra hora.');
      return;
    }
    try {
      const payload = {
        parcelIds: form.parcelIds,
        parcelId: form.parcelIds[0],
        startTime,
        repeatUnit,
        repeatEvery,
        enabled: form.enabled,
        scheduleType: form.scheduleType.trim() || undefined,
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

  const getRouteLabel = (schedule) => {
    const ids = getScheduleParcelIds(schedule);
    if (!ids.length) return 'Sin ruta';
    if (ids.length === 1) return getParcelName(ids[0]);
    return `${ids.length} parcelas`;
  };

  const getRouteDetail = (schedule) =>
    getScheduleParcelIds(schedule).map(getParcelName).join(' → ');

  const availableParcels = parcels.filter((parcel) => !form.parcelIds.includes(parcel.parcelId));

  const previewNextFlight = useMemo(() => {
    if (!form.startDate || !form.startClock) return null;
    const startTime = new Date(`${form.startDate}T${form.startClock}`);
    if (Number.isNaN(startTime.getTime())) return null;
    const repeatUnit = form.repeatPreset === 'custom' ? form.repeatUnit : form.repeatPreset;
    const repeatEvery = form.repeatPreset === 'custom' ? Number(form.repeatEvery) : 1;
    return getNextOccurrence({
      startTime: startTime.toISOString(),
      repeatUnit,
      repeatEvery,
    });
  }, [form.startClock, form.startDate, form.repeatEvery, form.repeatPreset, form.repeatUnit]);

  const categorySuggestions = useMemo(() => {
    const used = schedules
      .map((schedule) => getScheduleTypeLabel(schedule.scheduleType ?? ''))
      .filter(Boolean);
    return [...new Set(['Rutina', 'Inspección', 'Emergencia', ...used])];
  }, [schedules]);

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
  const nextOverall = useMemo(() => {
    const upcoming = schedules
      .filter((schedule) => schedule.enabled)
      .map((schedule) => ({
        schedule,
        at: getNextOccurrence(schedule),
      }))
      .sort((a, b) => a.at.getTime() - b.at.getTime());
    return upcoming[0] ?? null;
  }, [schedules]);

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
              <span className="schedule-label">Ruta del dron</span>
              <select
                value=""
                onChange={(e) => addParcelToRoute(e.target.value)}
                disabled={!availableParcels.length}
              >
                <option value="">
                  {availableParcels.length ? 'Añadir parcela a la ruta' : 'Todas las parcelas ya están en la ruta'}
                </option>
                {availableParcels.map((p) => (
                  <option key={p.parcelId} value={p.parcelId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            {form.parcelIds.length > 0 ? (
              <ol className="schedule-route-list">
                {form.parcelIds.map((parcelId, index) => (
                  <li
                    key={parcelId}
                    className={`schedule-route-item${dragIndex === index ? ' is-dragging' : ''}`}
                    draggable
                    onDragStart={(event) => {
                      if (event.target.closest('button')) {
                        event.preventDefault();
                        return;
                      }
                      setDragIndex(index);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(index));
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const fromIndex = Number(event.dataTransfer.getData('text/plain'));
                      reorderParcel(Number.isNaN(fromIndex) ? dragIndex : fromIndex, index);
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                  >
                    <span className="schedule-route-handle" aria-hidden="true">
                      <span className="material-symbols-outlined">drag_indicator</span>
                    </span>
                    <span className="schedule-route-order">{index + 1}</span>
                    <div className="schedule-route-copy">
                      <strong>{getParcelName(parcelId)}</strong>
                      <small>
                        {index === 0 ? 'Despega y va primero aquí' : 'Siguiente parada'}
                        {index === form.parcelIds.length - 1 ? ' · luego regresa' : ''}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="schedule-route-btn"
                      onClick={() => removeParcelFromRoute(parcelId)}
                      aria-label="Quitar parcela"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="map-meta">Elige el orden de parcelas. El dron sale, recorre esa ruta y regresa.</p>
            )}

            <div className="schedule-field">
              <span className="schedule-label">Frecuencia</span>
              <div className="schedule-repeat-presets">
                {[
                  { id: 'week', label: 'Cada semana' },
                  { id: 'month', label: 'Cada mes' },
                  { id: 'custom', label: 'Personalizado' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={form.repeatPreset === option.id ? 'schedule-repeat-btn active' : 'schedule-repeat-btn'}
                    onClick={() => setForm({ ...form, repeatPreset: option.id })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {form.repeatPreset === 'custom' && (
                <div className="schedule-frequency-input">
                  <span>Cada</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    step="1"
                    value={form.repeatEvery}
                    onChange={(e) => setForm({ ...form, repeatEvery: e.target.value })}
                  />
                  <select
                    value={form.repeatUnit}
                    onChange={(e) => setForm({ ...form, repeatUnit: e.target.value })}
                  >
                    <option value="day">días</option>
                    <option value="week">semanas</option>
                    <option value="month">meses</option>
                  </select>
                </div>
              )}
            </div>

            <div className="schedule-form-row">
              <label className="schedule-field">
                <span className="schedule-label">Primera salida</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </label>

              <label className="schedule-field">
                <span className="schedule-label">Hora</span>
                <input
                  type="time"
                  value={form.startClock}
                  onChange={(e) => setForm({ ...form, startClock: e.target.value })}
                  required
                />
              </label>
            </div>
            {previewNextFlight && (
              <p className="schedule-next-hint">
                Siguiente vuelo de esta programación:{' '}
                <strong>{formatDaysUntil(previewNextFlight)}</strong>
                {' · '}
                {formatDateTime(previewNextFlight)}
              </p>
            )}

            <label className="schedule-field">
              <span className="schedule-label">Categoría (opcional)</span>
              <input
                list="schedule-category-options"
                value={form.scheduleType}
                onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
                placeholder="Escribe una o elige una existente"
                maxLength={48}
              />
              <datalist id="schedule-category-options">
                {categorySuggestions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>

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
            <div className="schedule-list-title">
              <h2>Próximas misiones</h2>
              {nextOverall ? (
                <p className="schedule-next-overall">
                  Próximo vuelo: {formatDaysUntil(nextOverall.at)} · {formatDateTime(nextOverall.at)}
                </p>
              ) : (
                <p className="schedule-next-overall">No hay vuelos activos programados</p>
              )}
            </div>
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
                  <span>Ruta / misión</span>
                  <span>Cronograma</span>
                  <span aria-hidden="true" />
                </div>
                <ul className="schedule-table-body">
                  {pagedSchedules.map((s) => {
                    const nextAt = getNextOccurrence(s);
                    return (
                    <li key={s.scheduleId} className="schedule-row">
                      <div className="schedule-state-cell">
                        <span className={s.enabled ? 'schedule-dot active' : 'schedule-dot paused'} />
                        <strong>{s.enabled ? 'Listo' : 'Pausado'}</strong>
                      </div>
                      <div className="schedule-mission-cell">
                        <strong>{getRouteLabel(s)}</strong>
                        <span>
                          {s.scheduleType
                            ? `${getScheduleTypeLabel(s.scheduleType)} · ${getRouteDetail(s)}`
                            : getRouteDetail(s)}
                        </span>
                      </div>
                      <div className="schedule-time-cell">
                        <strong>{formatDateTime(nextAt)}</strong>
                        <span>{formatDaysUntil(nextAt)} · {formatRepeat(s)}</span>
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
                    );
                  })}
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
    </div>
  );
}
