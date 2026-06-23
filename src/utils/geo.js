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
