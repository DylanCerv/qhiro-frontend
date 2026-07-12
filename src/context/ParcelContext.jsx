import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const ParcelContext = createContext(null);

export function ParcelProvider({ children }) {
  const [parcels, setParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshParcels = useCallback(async () => {
    const response = await api.getParcels();
    const nextParcels = response.parcels ?? [];
    setParcels(nextParcels);
    setSelectedParcelId((currentId) => {
      if (!currentId) return nextParcels[0]?.parcelId ?? null;
      return nextParcels.some((p) => p.parcelId === currentId)
        ? currentId
        : nextParcels[0]?.parcelId ?? null;
    });
    return nextParcels;
  }, []);

  useEffect(() => {
    refreshParcels()
      .catch(() => setParcels([]))
      .finally(() => setLoading(false));
  }, [refreshParcels]);

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
    [parcels, selectedParcel, selectedParcelId, refreshParcels, loading],
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
