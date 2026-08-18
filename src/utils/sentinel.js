import { distanceMeters } from './geo';

export const MAX_SENTINEL_SNAP_METERS = 250;

export function getNextSentinelLabel(sentinels = []) {
  const used = new Set(
    sentinels
      .map((sentinel) => sentinel.sentinelLabel?.toLowerCase())
      .filter(Boolean),
  );

  for (let index = 1; index <= 99; index += 1) {
    const label = `c${index}`;
    if (!used.has(label)) return label;
  }

  return `c${sentinels.length + 1}`;
}

export function getAccountSentinels(devices = [], excludeDeviceId) {
  return devices.filter(
    (device) =>
      device.type === 'sentinel' &&
      device.coordinates?.lat != null &&
      device.coordinates?.lng != null &&
      device.deviceId !== excludeDeviceId,
  );
}

export function filterSentinels(devices = [], parcelId) {
  return devices.filter(
    (device) =>
      device.type === 'sentinel' &&
      device.coordinates?.lat != null &&
      device.coordinates?.lng != null &&
      (!parcelId || device.parcelId === parcelId),
  );
}

export function getSentinelDisplayLabel(sentinel) {
  return sentinel.sentinelLabel ?? sentinel.name ?? 'c?';
}

export function findNearestSentinel(point, sentinels = []) {
  if (!point || !sentinels.length) return null;

  return sentinels.reduce((nearest, sentinel) => {
    if (!sentinel.coordinates) return nearest;
    const distance = distanceMeters(point, sentinel.coordinates);
    if (!nearest || distance < nearest.distance) {
      return { sentinel, distance };
    }
    return nearest;
  }, null);
}
