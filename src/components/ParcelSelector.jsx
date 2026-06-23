import { useParcels } from '../context/ParcelContext';
import { ui } from '../i18n/es';

export default function ParcelSelector() {
  const { parcels, selectedParcelId, setSelectedParcelId } = useParcels();

  if (parcels.length === 0) {
    return null;
  }

  return (
    <label className="parcel-selector">
      {ui.parcels.selectParcel}
      <select value={selectedParcelId ?? ''} onChange={(e) => setSelectedParcelId(e.target.value)}>
        {parcels.map((parcel) => (
          <option key={parcel.parcelId} value={parcel.parcelId}>
            {parcel.name}
          </option>
        ))}
      </select>
    </label>
  );
}
