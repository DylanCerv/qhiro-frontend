import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';
import DeviceCard from '../components/DeviceCard';
import DeviceDetailsPanel from '../components/DeviceDetailsPanel';
import DeviceFormPanel from '../components/DeviceFormPanel';
import { useParcels } from '../context/ParcelContext';
import { findParcelAtPoint } from '../utils/geo';
import { ui } from '../i18n/es';
import { filterSentinels, getAccountSentinels, getNextSentinelLabel } from '../utils/sentinel';

const deviceTypeOptions = ['drone', 'nest', 'sentinel'];

const deviceFilters = [
  { id: 'all', label: 'Todos', icon: 'apps' },
  { id: 'drone', label: 'Dron', icon: 'flight_takeoff' },
  { id: 'nest', label: 'Nido', icon: 'hub' },
  { id: 'sentinel', label: 'Centinelas', icon: 'cell_tower' },
];

const emptyDeviceForm = {
  name: '',
  type: 'sentinel',
  status: 'online',
  parcelId: '',
  zoneId: '',
  coordinates: null,
  sentinelLabel: '',
};

export default function Devices() {
  const { parcels } = useParcels();
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState(emptyDeviceForm);
  const [panelMode, setPanelMode] = useState('create');
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [editForm, setEditForm] = useState(emptyDeviceForm);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState('');
  const [togglingDeviceId, setTogglingDeviceId] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pendingSentinels, setPendingSentinels] = useState([]);
  const editorRef = useRef(null);
  const pendingIdRef = useRef(0);

  const getParcelName = (parcelId) => parcels.find((parcel) => parcel.parcelId === parcelId)?.name ?? 'Parcela';

  const loadDevices = () =>
    api
      .getDevices()
      .then((res) => setDevices(res.devices ?? []))
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadDevices().finally(() => setLoading(false));
  }, []);

  const activeForm = editingDeviceId ? editForm : form;
  const isSentinelForm = activeForm.type === 'sentinel';
  const detectedParcel = parcels.find((parcel) => parcel.parcelId === activeForm.parcelId) ?? null;
  const hasDrone = devices.some(
    (device) => device.type === 'drone' && device.deviceId !== editingDeviceId,
  );
  const hasNest = devices.some(
    (device) => device.type === 'nest' && device.deviceId !== editingDeviceId,
  );

  const availableDeviceTypes = useMemo(
    () => deviceTypeOptions.filter((type) => {
      if (type === 'drone') return !hasDrone || activeForm.type === 'drone';
      if (type === 'nest') return !hasNest || activeForm.type === 'nest';
      return true;
    }),
    [hasDrone, hasNest, activeForm.type],
  );

  const sentinelsOnParcel = useMemo(
    () => filterSentinels(
      devices.filter((device) => device.deviceId !== editingDeviceId),
      editingDeviceId ? activeForm.parcelId : undefined,
    ),
    [devices, editingDeviceId, activeForm.parcelId],
  );

  const deviceCounts = useMemo(() => ({
    all: devices.length,
    drone: devices.filter((device) => device.type === 'drone').length,
    nest: devices.filter((device) => device.type === 'nest').length,
    sentinel: devices.filter((device) => device.type === 'sentinel').length,
  }), [devices]);

  const filteredDevices = useMemo(() => {
    if (typeFilter === 'all') return devices;
    return devices.filter((device) => device.type === typeFilter);
  }, [devices, typeFilter]);

  const scrollToEditor = () => {
    window.requestAnimationFrame(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const buildDevicePayload = (source, sentinelPlacement = null) => {
    const payload = {
      type: source.type,
      status: source.status ?? 'online',
    };

    if (source.name?.trim()) {
      payload.name = source.name.trim();
    }

    if (source.type !== 'sentinel') return payload;

    const placement = sentinelPlacement ?? source;

    return {
      ...payload,
      parcelId: placement.parcelId || undefined,
      zoneId: placement.zoneId || undefined,
      coordinates: placement.coordinates,
    };
  };

  const sameCoordinates = (left, right) =>
    Math.abs(left.lat - right.lat) < 0.00001 && Math.abs(left.lng - right.lng) < 0.00001;

  const setActiveForm = (nextForm) => {
    if (editingDeviceId) setEditForm(nextForm);
    else setForm(nextForm);
  };

  const closeEditor = () => {
    setPanelMode('create');
    setActiveDeviceId(null);
    setEditingDeviceId(null);
    setEditForm(emptyDeviceForm);
    setForm(emptyDeviceForm);
    setPendingSentinels([]);
    setFormError('');
  };

  const handleTypeChange = (nextType) => {
    setPendingSentinels([]);

    if (nextType === 'sentinel') {
      setActiveForm({
        ...activeForm,
        type: nextType,
        parcelId: '',
        zoneId: '',
        coordinates: null,
        sentinelLabel: '',
      });
      return;
    }

    setActiveForm({
      name: activeForm.name,
      type: nextType,
      status: activeForm.status,
      parcelId: '',
      zoneId: '',
      coordinates: null,
      sentinelLabel: '',
    });
  };

  const handleSentinelPlacement = (point, parcel) => {
    setFormError('');
    const resolvedParcel = parcel ?? findParcelAtPoint(point, parcels);
    if (!resolvedParcel) {
      setFormError('El punto debe estar dentro de una parcela.');
      return;
    }

    if (editingDeviceId) {
      const accountSentinels = getAccountSentinels(devices, editingDeviceId);
      const currentLabel = activeForm.sentinelLabel?.toLowerCase();
      const labelTaken = currentLabel && accountSentinels.some(
        (sentinel) => sentinel.sentinelLabel?.toLowerCase() === currentLabel,
      );
      setActiveForm({
        ...activeForm,
        coordinates: point,
        parcelId: resolvedParcel.parcelId,
        zoneId: resolvedParcel.zoneId ?? '',
        sentinelLabel: !labelTaken && currentLabel
          ? currentLabel
          : getNextSentinelLabel(accountSentinels),
      });
      return;
    }

    setPendingSentinels((prev) => {
      if (prev.some((item) => sameCoordinates(item.coordinates, point))) {
        setFormError('Ya marcaste un centinela en ese punto.');
        return prev;
      }

      const accountSentinels = getAccountSentinels(devices);

      return [
        ...prev,
        {
          id: `pending-${pendingIdRef.current += 1}`,
          coordinates: point,
          parcelId: resolvedParcel.parcelId,
          zoneId: resolvedParcel.zoneId ?? '',
          sentinelLabel: getNextSentinelLabel([...accountSentinels, ...prev]),
        },
      ];
    });
  };

  const handleRemovePending = (pendingId) => {
    setPendingSentinels((prev) => prev.filter((item) => item.id !== pendingId));
    setFormError('');
  };

  const startViewDetails = (device) => {
    setPanelMode('view');
    setActiveDeviceId(device.deviceId);
    setEditingDeviceId(null);
    setFormError('');
    setMessage('');
    scrollToEditor();
  };

  const startCreate = (preferredType) => {
    const nextType = preferredType ?? (typeFilter !== 'all' ? typeFilter : 'sentinel');
    setPanelMode('create');
    setActiveDeviceId(null);
    setEditingDeviceId(null);
    setEditForm(emptyDeviceForm);
    setForm({
      ...emptyDeviceForm,
      type: nextType,
    });
    setPendingSentinels([]);
    setFormError('');
    setMessage('');
    scrollToEditor();
  };

  const startEdit = (device) => {
    setPanelMode('edit');
    setActiveDeviceId(device.deviceId);
    setEditingDeviceId(device.deviceId);
    setEditForm({
      name: device.name,
      type: device.type,
      status: device.status,
      parcelId: device.parcelId ?? '',
      zoneId: device.zoneId ?? '',
      coordinates: device.coordinates ?? null,
      sentinelLabel: device.sentinelLabel ?? '',
    });
    setFormError('');
    setMessage('');
    scrollToEditor();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.type === 'sentinel') {
      if (pendingSentinels.length === 0) {
        setFormError('Marca al menos un centinela en el mapa antes de guardar.');
        return;
      }

      setSubmitting(true);
      setFormError('');
      setMessage('');
      try {
        const createdDevices = [];
        for (const pending of pendingSentinels) {
          const result = await api.createDevice(buildDevicePayload(form, pending));
          createdDevices.push(result.device);
        }
        setDevices((prev) => [...prev, ...createdDevices]);
        closeEditor();
        setForm(emptyDeviceForm);
        setMessage(
          createdDevices.length > 1
            ? `${createdDevices.length} centinelas registradas correctamente.`
            : ui.devices.added,
        );
      } catch (err) {
        setFormError(err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    setFormError('');
    setMessage('');
    try {
      const result = await api.createDevice(buildDevicePayload(form));
      setDevices((prev) => [...prev, result.device]);
      closeEditor();
      setForm(emptyDeviceForm);
      setMessage(ui.devices.added);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (editForm.type === 'sentinel' && !editForm.coordinates) {
      setFormError('Marca la ubicación del centinela en el mapa antes de guardar.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setMessage('');
    try {
      const result = await api.updateDevice(editingDeviceId, buildDevicePayload(editForm));
      setDevices((prev) =>
        prev.map((device) => (device.deviceId === editingDeviceId ? result.device : device)),
      );
      closeEditor();
      setMessage(ui.devices.updated);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (device) => {
    setTogglingDeviceId(device.deviceId);
    setMessage('');
    try {
      const nextStatus = device.status === 'online' ? 'offline' : 'online';
      const result = await api.toggleDeviceStatus(device.deviceId, nextStatus);
      setDevices((prev) =>
        prev.map((item) => (item.deviceId === device.deviceId ? result.device : item)),
      );
      setMessage(nextStatus === 'online' ? 'Dispositivo conectado.' : 'Dispositivo desconectado.');
    } catch (err) {
      setMessage('');
    } finally {
      setTogglingDeviceId('');
    }
  };

  const handleDeleteDevice = async (device) => {
    const confirmed = window.confirm(`${ui.devices.deleteConfirm}\n\n${device.name}`);
    if (!confirmed) return;

    setDeletingDeviceId(device.deviceId);
    setMessage('');
    try {
      await api.deleteDevice(device.deviceId);
      setDevices((prev) => prev.filter((item) => item.deviceId !== device.deviceId));
      if (activeDeviceId === device.deviceId) closeEditor();
      setMessage(ui.devices.deleted);
    } catch (err) {
      setMessage('');
    } finally {
      setDeletingDeviceId('');
    }
  };

  const formProps = {
    activeForm,
    isSentinelForm,
    availableDeviceTypes,
    detectedParcel,
    sentinelsOnParcel,
    pendingSentinels,
    parcels,
    hasDrone,
    hasNest,
    submitting,
    getParcelName,
    onNameChange: (name) => setActiveForm({ ...activeForm, name }),
    onTypeChange: handleTypeChange,
    onSelectPoint: handleSentinelPlacement,
    onRemovePending: handleRemovePending,
  };

  const activeDevice = devices.find((device) => device.deviceId === activeDeviceId) ?? null;
  const isEditing = panelMode === 'edit';
  const isViewing = panelMode === 'view';

  if (loading) return <p className="page-state">{ui.common.loadingDevices}</p>;

  return (
    <div className="page devices-page">
      <div className="page-head devices-head">
        <div>
          <p className="page-eyebrow">Hardware-Ops Dashboard</p>
          <h1>Flota de Hardware</h1>
        </div>
        <p>{ui.devices.subtitle}</p>
      </div>

      {message && <p className="form-success devices-banner">{message}</p>}
      {error && <p className="form-error devices-banner">{error}</p>}

      <div className="devices-workspace">
        <div className="devices-fleet-column">
          <div className="devices-toolbar">
            <h2>Flota registrada</h2>
            <div className="device-filter-tabs" role="tablist" aria-label="Filtrar dispositivos">
              {deviceFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={typeFilter === filter.id}
                  className={typeFilter === filter.id ? 'device-filter-tab active' : 'device-filter-tab'}
                  onClick={() => setTypeFilter(filter.id)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">{filter.icon}</span>
                  {filter.label}
                  <span className="device-filter-count">{deviceCounts[filter.id] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="device-list">
            {filteredDevices.map((device) => (
              <DeviceCard
                key={device.deviceId}
                device={device}
                parcelName={getParcelName(device.parcelId)}
                selected={activeDeviceId === device.deviceId}
                onViewDetails={() => startViewDetails(device)}
                onEdit={() => startEdit(device)}
                onToggleStatus={() => handleToggleStatus(device)}
                onDelete={() => handleDeleteDevice(device)}
                deleting={deletingDeviceId === device.deviceId}
                toggling={togglingDeviceId === device.deviceId}
              />
            ))}

            {filteredDevices.length === 0 && devices.length > 0 && (
              <p className="devices-empty-filter">No hay dispositivos en este filtro.</p>
            )}
          </div>

          {devices.length === 0 && (
            <div className="devices-empty-state">
              <p>{ui.devices.noDevices}</p>
            </div>
          )}
        </div>

        <aside className="card devices-editor-panel" ref={editorRef}>
          <div className="devices-editor-head">
            <h2>
              {isViewing && `Detalles · ${activeDevice?.name ?? ''}`}
              {isEditing && `Editar · ${activeDevice?.name ?? ''}`}
              {!isViewing && !isEditing && ui.devices.addTitle}
            </h2>
            {(isEditing || isViewing) ? (
              <button type="button" className="btn-ghost" onClick={startCreate}>
                Nuevo
              </button>
            ) : (
              <button type="button" className="btn-ghost" onClick={() => startCreate()}>
                Limpiar
              </button>
            )}
          </div>

          {isViewing && activeDevice && (
            <DeviceDetailsPanel
              device={activeDevice}
              parcelName={getParcelName(activeDevice.parcelId)}
              parcels={parcels}
              onEdit={() => startEdit(activeDevice)}
              onClose={closeEditor}
            />
          )}

          {!isViewing && (
            <DeviceFormPanel
              {...formProps}
              title={isEditing ? 'Configuración' : 'Nuevo dispositivo'}
              editing={isEditing}
              error={formError}
              onSubmit={isEditing ? handleUpdate : handleSubmit}
              onCancel={isEditing ? closeEditor : startCreate}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
