import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const ParcelContext = createContext(null);

export function ParcelProvider({ children }) {
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshParcels = async () => {
    const response = await api.getParcels();
    const nextParcels = response.parcels ?? [];
    setParcels(nextParcels);
    if (!selectedParcelId && nextParcels.length > 0) {
      setSelectedParcelId(nextParcels[0].parcelId);
    }
    if (selectedParcelId && !nextParcels.some((p) => p.parcelId === selectedParcelId)) {
      setSelectedParcelId(nextParcels[0]?.parcelId ?? null);
    }
    return nextParcels;
  };

  useEffect(() => {
    refreshParcels()
      .catch(() => setParcels([]))
      .finally(() => setLoading(false));
  }, []);

  const selectedParcel = parcels.find((p) => p.parcelId === selectedParcelId) ?? null;

  const value = useMemo(
    () => ({
      parcels,
      selectedParcel,
      selectedParcelId,
      setSelectedParcelId,
      refreshParcels,
      loading,
    }),
    [parcels, selectedParcel, selectedParcelId, loading],
  );

  return <ParcelContext.Provider value={value}>{children}</ParcelContext.Provider>;
}

export function useParcels() {
  const context = useContext(ParcelContext);
  if (!context) {
    throw new Error('useParcels must be used within ParcelProvider');
  }
  return context;
}
