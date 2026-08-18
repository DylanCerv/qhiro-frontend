export const countryDefaults = {
  EC: { lat: -0.1807, lng: -78.4678, label: 'Ecuador' },
  AR: { lat: -34.6037, lng: -58.3816, label: 'Argentina' },
  MX: { lat: 19.4326, lng: -99.1332, label: 'México' },
  CO: { lat: 4.711, lng: -74.0721, label: 'Colombia' },
  PE: { lat: -12.0464, lng: -77.0428, label: 'Perú' },
  CL: { lat: -33.4489, lng: -70.6693, label: 'Chile' },
  ES: { lat: 40.4168, lng: -3.7038, label: 'España' },
  US: { lat: 38.9072, lng: -77.0369, label: 'Estados Unidos' },
};

export const mapTiles = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
  },
};

export function getCountryCenter(countryCode) {
  return countryDefaults[countryCode] ?? countryDefaults.EC;
}

export function detectCountryCode() {
  if (typeof navigator === 'undefined') return 'EC';

  const supportedCountries = new Set(Object.keys(countryDefaults));
  const timezoneCountries = {
    'America/Argentina/Buenos_Aires': 'AR',
    'America/Bogota': 'CO',
    'America/Guayaquil': 'EC',
    'America/Lima': 'PE',
    'America/Mexico_City': 'MX',
    'America/Santiago': 'CL',
    'Europe/Madrid': 'ES',
  };
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezoneCountries[timezone]) return timezoneCountries[timezone];

  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of locales) {
    try {
      const countryCode = new Intl.Locale(locale).region;
      if (supportedCountries.has(countryCode)) return countryCode;
    } catch {
      // Ignore malformed browser locales and continue with the default country.
    }
  }

  return 'EC';
}

export async function resolveUserLocation(countryCode) {
  const fallback = getCountryCenter(countryCode);

  if (!navigator.geolocation) {
    return { lat: fallback.lat, lng: fallback.lng };
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
      });
    });
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch {
    return { lat: fallback.lat, lng: fallback.lng };
  }
}

export function isPointInPolygon(point, polygon = []) {
  if (!point || polygon.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;
    const intersects = yi > point.lat !== yj > point.lat
      && point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function findParcelAtPoint(point, parcels = []) {
  return parcels.find((parcel) => isPointInPolygon(point, parcel.coordinates ?? [])) ?? null;
}

export function formatCoordinates(point, digits = 5) {
  if (!point) return '—';
  return `${point.lat.toFixed(digits)}, ${point.lng.toFixed(digits)}`;
}

