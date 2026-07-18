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
  const formatZoneLabel = (zoneId) => {
    if (!zoneId) return 'Sin zona';
    return zoneId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  };

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
    <div className="page parcels-page">
      <div className="page-head">
        <h1>{ui.parcels.title}</h1>
        <p>{ui.parcels.subtitle}</p>
      </div>

      {message && <p className="form-success page-message">{message}</p>}
      {error && <p className="form-error page-message">{error}</p>}

      <div className="parcels-workspace">
        <aside className="card parcels-list-panel">
          <div className="parcels-panel-head">
            <h2>{ui.parcels.listTitle}</h2>
            <span>{parcels.length} total</span>
          </div>
          <a href="#parcel-form" className="btn-primary parcels-new-button">
            <span className="material-symbols-outlined">add_location</span>
            Nueva parcela
          </a>
        {parcels.length === 0 ? (
          <p className="empty-state">{ui.parcels.noParcels}</p>
        ) : (
            <ul className="parcel-rail-list">
              {parcels.map((parcel) => (
                <li
                  key={parcel.parcelId}
                  className={editingId === parcel.parcelId ? 'active' : ''}
                >
                  <div className="parcel-list-main">
                    <strong>{parcel.name}</strong>
                    <span className="parcel-zone">{formatZoneLabel(parcel.zoneId)}</span>
                  </div>
                  <span className="parcel-rail-health">
                    {parcel.healthStatus ?? 'sin estado'}
                  </span>
                  <div className="parcel-rail-crop">
                    <CropTypeSelect
                      id={`crop-${parcel.parcelId}`}
                      value={parcel.cropType ?? ''}
                      disabled={cropSavingId === parcel.parcelId}
                      onChange={(e) => handleCropChange(parcel.parcelId, e.target.value)}
                    />
                  </div>
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
        )}
        </aside>

        <section className="parcels-map-panel">
          {editingId ? (
            <ParcelMapEditor center={mapCenter} points={editPoints} setPoints={setEditPoints} />
          ) : (
            <ParcelMap parcels={parcels} center={mapCenter} interactive tileStyle="satellite" />
          )}
        </section>

        <aside className={`card parcels-form-panel${editingId ? ' parcel-edit-card' : ''}`} id="parcel-form">
          <h2>{editingId ? 'Detalles de Parcela' : ui.parcels.createTitle}</h2>
          <p className="parcels-form-intro">
            {editingId
              ? 'Ajusta los parámetros técnicos del lote seleccionado.'
              : 'Define la identificación y ubicación del nuevo lote.'}
          </p>
          <form className="form" onSubmit={editingId ? handleUpdate : handleSubmit}>
            <label>
              {ui.parcels.name}
              <input
                value={editingId ? editForm.name : form.name}
                onChange={(e) =>
                  editingId
                    ? setEditForm({ ...editForm, name: e.target.value })
                    : setForm({ ...form, name: e.target.value })
                }
                required
              />
            </label>
            <CropTypeSelect
              id={editingId ? 'edit-crop-type' : 'create-crop-type'}
              value={editingId ? editForm.cropType : form.cropType}
              onChange={(e) =>
                editingId
                  ? setEditForm({ ...editForm, cropType: e.target.value })
                  : setForm({ ...form, cropType: e.target.value })
              }
            />
            <label>
              {ui.parcels.zoneId}
              <input
                value={editingId ? editForm.zoneId : form.zoneId}
                onChange={(e) =>
                  editingId
                    ? setEditForm({ ...editForm, zoneId: e.target.value })
                    : setForm({ ...form, zoneId: e.target.value })
                }
                required
              />
            </label>
            {!editingId && (
              <p className="map-meta">
                Marca al menos tres puntos en el mapa para delimitar la parcela.
              </p>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {editingId ? ui.parcels.saveChanges : ui.parcels.saveParcel}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  {ui.common.cancel}
                </button>
              )}
            </div>
        </form>
        </aside>
      </div>

      {!editingId && (
        <section className="card parcel-create-map">
          <h2>Delimitar nueva parcela</h2>
          <ParcelMapEditor center={mapCenter} points={points} setPoints={setPoints} />
        </section>
      )}
    </div>
  );
}
