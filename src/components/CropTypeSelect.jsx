import { getCropTypeLabel, ui } from '../i18n/es';
import { CROP_OPTIONS } from '../utils/crops';

export default function CropTypeSelect({ value, onChange, disabled = false, id }) {
  return (
    <label className="crop-select-label" htmlFor={id}>
      <span>{ui.parcels.cropType}</span>
      <select id={id} value={value || ''} onChange={onChange} disabled={disabled}>
        <option value="">{ui.parcels.addCrop}</option>
        {CROP_OPTIONS.map((crop) => (
          <option key={crop} value={crop}>
            {getCropTypeLabel(crop)}
          </option>
        ))}
      </select>
    </label>
  );
}
