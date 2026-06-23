import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useParcels } from '../context/ParcelContext';
import CropTypeSelect from '../components/CropTypeSelect';
import ParcelMapEditor from '../components/ParcelMapEditor';
import ParcelMap from '../components/ParcelMap';
import { ui } from '../i18n/es';

const emptyForm = { name: '', cropType: '', zoneId: 'zone_a' };

export default function Parcels() {
  const { profile } = useAuth();
  const { parcels, refreshParcels } = useParcels();
  const [form, setForm] = useState(emptyForm);
  const [points, setPoints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editPoints, setEditPoints] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cropSavingId, setCropSavingId] = useState(null);

  const mapCenter = profile?.location ?? { lat: -0.1807, lng: -78.4678 };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (points.length < 3) {
      setError(ui.parcels.minPoints);
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await api.createParcel({ ...form, coordinates: points });
      setForm(emptyForm);
      setPoints([]);
      setMessage(ui.parcels.saved);
      await refreshParcels();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (parcel) => {
    setEditingId(parcel.parcelId);
    setEditForm({
      name: parcel.name,
      cropType: parcel.cropType ?? '',
      zoneId: parcel.zoneId,
    });
    setEditPoints(parcel.coordinates ?? []);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
    setEditPoints([]);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (editPoints.length < 3) {
      setError(ui.parcels.minPoints);
      return;
    }
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await api.updateParcel(editingId, { ...editForm, coordinates: editPoints });
      setMessage(ui.parcels.updated);
      cancelEdit();
      await refreshParcels();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCropChange = async (parcelId, cropType) => {
    setCropSavingId(parcelId);
    setError('');
    try {
      await api.updateParcel(parcelId, { cropType: cropType || '' });
      setMessage(ui.parcels.cropUpdated);
      await refreshParcels();
    } catch (err) {
      setError(err.message);
    } finally {
      setCropSavingId(null);
    }
  };

  const handleDelete = async (parcelId) => {
    setError('');
    try {
      await api.deleteParcel(parcelId);
      if (editingId === parcelId) cancelEdit();
      setMessage(ui.parcels.deleted);
      await refreshParcels();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>{ui.parcels.title}</h1>
        <p>{ui.parcels.subtitle}</p>
      </div>

      {message && <p className="form-success page-message">{message}</p>}
      {error && <p className="form-error page-message">{error}</p>}

      {editingId && (
        <section className="card parcel-edit-card">
          <h2>{ui.parcels.editTitle}</h2>
          <form className="form" onSubmit={handleUpdate}>
            <div className="grid-2">
              <label>
                {ui.parcels.name}
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </label>
              <CropTypeSelect
                id="edit-crop-type"
                value={editForm.cropType}
                onChange={(e) => setEditForm({ ...editForm, cropType: e.target.value })}
              />
              <label>
                {ui.parcels.zoneId}
                <input
                  value={editForm.zoneId}
                  onChange={(e) => setEditForm({ ...editForm, zoneId: e.target.value })}
                  required
                />
              </label>
            </div>

            <ParcelMapEditor center={mapCenter} points={editPoints} setPoints={setEditPoints} />

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {ui.parcels.saveChanges}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                {ui.common.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="card">
        <h2>{ui.parcels.listTitle}</h2>
        {parcels.length === 0 ? (
          <p className="empty-state">{ui.parcels.noParcels}</p>
        ) : (
          <>
            <ParcelMap parcels={parcels} center={mapCenter} interactive tileStyle="satellite" />
            <ul className="simple-list parcel-list">
              {parcels.map((parcel) => (
                <li key={parcel.parcelId} className="parcel-list-item">
                  <div className="parcel-list-main">
                    <strong>{parcel.name}</strong>
                    <span className="parcel-zone">{parcel.zoneId}</span>
                  </div>
                  <CropTypeSelect
                    id={`crop-${parcel.parcelId}`}
                    value={parcel.cropType ?? ''}
                    disabled={cropSavingId === parcel.parcelId}
                    onChange={(e) => handleCropChange(parcel.parcelId, e.target.value)}
                  />
                  <div className="list-actions">
                    <button type="button" className="btn-secondary" onClick={() => startEdit(parcel)}>
                      {ui.common.edit}
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(parcel.parcelId)}
                    >
                      {ui.common.delete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="card">
        <h2>{ui.parcels.createTitle}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <label>
              {ui.parcels.name}
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <CropTypeSelect
              id="create-crop-type"
              value={form.cropType}
              onChange={(e) => setForm({ ...form, cropType: e.target.value })}
            />
            <label>
              {ui.parcels.zoneId}
              <input
                value={form.zoneId}
                onChange={(e) => setForm({ ...form, zoneId: e.target.value })}
                required
              />
            </label>
          </div>

          <ParcelMapEditor center={mapCenter} points={points} setPoints={setPoints} />

          <button type="submit" className="btn-primary" disabled={submitting}>
            {ui.parcels.saveParcel}
          </button>
        </form>
      </section>
    </div>
  );
}
