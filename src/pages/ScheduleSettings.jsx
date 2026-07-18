import { useEffect, useState } from 'react';
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

  return (
    <div className="page schedule-page">
      <div className="page-head schedule-head">
        <h1>{ui.schedule.title}</h1>
        <p>{ui.schedule.subtitle}</p>
      </div>

      <div className="grid-2 schedule-grid">
        <section className="card schedule-form-card">
          <h2>{editingScheduleId ? ui.schedule.editSchedule : ui.schedule.newSchedule}</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              {ui.schedule.parcel}
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

            <label>
              {ui.schedule.scheduleType}
              <select
                value={form.scheduleType}
                onChange={(e) => setForm({ ...form, scheduleType: e.target.value })}
              >
                {scheduleTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {getScheduleTypeLabel(type)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {ui.schedule.startTime}
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </label>

            <label>
              {ui.schedule.frequencyDays}
              <input
                type="number"
                min="1"
                value={form.frequencyDays}
                onChange={(e) =>
                  setForm({ ...form, frequencyDays: Number(e.target.value) })
                }
              />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              />
              {ui.schedule.enableAutomation}
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingScheduleId ? ui.schedule.saveChanges : ui.schedule.save}
              </button>
              {editingScheduleId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  {ui.common.cancel}
                </button>
              )}
            </div>
          </form>
          {message && <p className="form-success">{message}</p>}
          {error && <p className="form-error">{error}</p>}
        </section>

        <section className="card schedule-list-card">
          <h2>{ui.schedule.activeSchedules}</h2>
          {schedules.length === 0 ? (
            <p className="empty-state">{ui.schedule.noSchedules}</p>
          ) : (
            <ul className="simple-list">
              {schedules.map((s) => (
                <li key={s.scheduleId}>
                  <strong>{getParcelName(s.parcelId)}</strong>
                  <span>{getScheduleTypeLabel(s.scheduleType ?? 'routine')}</span>
                  <span>{s.enabled ? ui.schedule.enabled : ui.schedule.disabled}</span>
                  <span>
                    {ui.schedule.next}: {formatDate(s.nextRunAt)}
                  </span>
                  <span>{formatFrequency(s.frequencyDays)}</span>
                  <div className="list-actions">
                    <button type="button" className="btn-secondary" onClick={() => startEdit(s)}>
                      {ui.common.edit}
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(s.scheduleId)}
                    >
                      {ui.common.delete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
