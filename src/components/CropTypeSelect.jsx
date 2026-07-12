import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getCropTypeLabel, ui } from '../i18n/es';
import { FALLBACK_CROP_OPTIONS } from '../utils/crops';

export default function CropTypeSelect({ value, onChange, disabled = false, id }) {
  const [crops, setCrops] = useState(FALLBACK_CROP_OPTIONS);

  useEffect(() => {
    api
      .getCrops()
      .then((response) => {
        if (response.crops?.length) setCrops(response.crops);
      })
      .catch(() => {});
  }, []);

  return (
    <label className="crop-select-label" htmlFor={id}>
      <span>{ui.parcels.cropType}</span>
      <select id={id} value={value || ''} onChange={onChange} disabled={disabled}>
        <option value="">{ui.parcels.addCrop}</option>
        {crops.map((crop) => (
          <option key={crop.value} value={crop.value}>
            {crop.label ?? getCropTypeLabel(crop.value)}
          </option>
        ))}
      </select>
    </label>
  );
}
