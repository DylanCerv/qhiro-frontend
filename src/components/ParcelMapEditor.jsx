import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mapTiles } from '../utils/geo';
import { ui } from '../i18n/es';

function createPointIcon(index, selected, moving) {
  const classes = ['parcel-point-marker'];
  if (selected) classes.push('selected');
  if (moving) classes.push('moving');

  return L.divIcon({
    className: classes.join(' '),
    html: `<span>${index + 1}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function DrawHandler({ setPoints, isMoving, onDeselect }) {
  useMapEvents({
    click(event) {
      if (isMoving) return;
      onDeselect();
      setPoints((prev) => [...prev, { lat: event.latlng.lat, lng: event.latlng.lng }]);
    },
  });
  return null;
}

function MapCenter({ center, points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 3) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
      return;
    }
    if (center) {
      map.setView([center.lat, center.lng], 15);
    }
  }, [center, map, points]);
  return null;
}

export default function ParcelMapEditor({ center, points, setPoints }) {
  const [tileStyle, setTileStyle] = useState('satellite');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const tiles = mapTiles[tileStyle] ?? mapTiles.satellite;
  const mapCenter = center ?? { lat: -0.1807, lng: -78.4678 };

  const selectedPoint = selectedIndex !== null ? points[selectedIndex] : null;

  const pointIcons = useMemo(
    () =>
      points.map((_, index) =>
        createPointIcon(index, selectedIndex === index, isMoving && selectedIndex === index),
      ),
    [points, selectedIndex, isMoving],
  );

  const selectPoint = (index) => {
    setSelectedIndex(index);
    setIsMoving(false);
  };

  const deselectPoint = () => {
    setSelectedIndex(null);
    setIsMoving(false);
  };

  const startMove = () => {
    if (selectedIndex === null) return;
    setIsMoving(true);
  };

  const deleteSelected = () => {
    if (selectedIndex === null) return;
    if (points.length <= 3) return;
    setPoints((prev) => prev.filter((_, i) => i !== selectedIndex));
    deselectPoint();
  };

  const updatePoint = (index, lat, lng) => {
    setPoints((prev) => prev.map((point, i) => (i === index ? { lat, lng } : point)));
  };

  const removeLastPoint = () => {
    setPoints((prev) => prev.slice(0, -1));
    if (selectedIndex !== null && selectedIndex >= points.length - 1) {
      deselectPoint();
    }
  };

  return (
    <div className="map-editor">
      <div className="map-toolbar">
        <p>{ui.parcels.drawHint}</p>
        <div className="map-toolbar-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={removeLastPoint}
            disabled={points.length === 0}
          >
            {ui.parcels.removeLastPoint}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setPoints([]);
              deselectPoint();
            }}
          >
            {ui.parcels.clearPoints}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setTileStyle(tileStyle === 'satellite' ? 'street' : 'satellite')}
          >
            {tileStyle === 'satellite' ? ui.parcels.streetView : ui.parcels.satelliteView}
          </button>
        </div>
      </div>

      {points.length > 0 && (
        <div className="point-selector">
          <span className="point-selector-label">{ui.parcels.selectPoint}:</span>
          {points.map((_, index) => (
            <button
              key={`chip-${index}`}
              type="button"
              className={`point-chip${selectedIndex === index ? ' selected' : ''}`}
              onClick={() => selectPoint(index)}
            >
              {ui.parcels.pointLabel} {index + 1}
            </button>
          ))}
        </div>
      )}

      {selectedPoint && (
        <div className="point-editor-panel">
          <p>
            <strong>
              {ui.parcels.pointLabel} {selectedIndex + 1}
            </strong>{' '}
            · {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
          </p>
          <div className="form-actions">
            <button
              type="button"
              className={`btn-secondary${isMoving ? ' active-mode' : ''}`}
              onClick={startMove}
            >
              {isMoving ? ui.parcels.movingPoint : ui.parcels.movePoint}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={deleteSelected}
              disabled={points.length <= 3}
            >
              {ui.parcels.deletePoint}
            </button>
            <button type="button" className="btn-secondary" onClick={deselectPoint}>
              {ui.parcels.deselectPoint}
            </button>
          </div>
          {isMoving && <p className="map-meta">{ui.parcels.movePointHint}</p>}
          {points.length <= 3 && selectedIndex !== null && (
            <p className="map-meta">{ui.parcels.minPointsDelete}</p>
          )}
        </div>
      )}

      <div className="map-wrap map-wrap-tall">
        <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={15} scrollWheelZoom>
          <TileLayer attribution={tiles.attribution} url={tiles.url} />
          <MapCenter center={center} points={points} />
          <DrawHandler setPoints={setPoints} isMoving={isMoving} onDeselect={deselectPoint} />
          {points.map((point, index) => (
            <Marker
              key={`point-${index}-${point.lat}-${point.lng}`}
              position={[point.lat, point.lng]}
              icon={pointIcons[index]}
              draggable={isMoving && selectedIndex === index}
              eventHandlers={{
                click: (event) => {
                  event.originalEvent.stopPropagation();
                  selectPoint(index);
                },
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng();
                  updatePoint(index, lat, lng);
                  setIsMoving(false);
                },
              }}
            />
          ))}
          {points.length >= 3 && (
            <Polygon
              positions={points.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: '#54e98a', fillColor: '#54e98a', fillOpacity: 0.25 }}
            />
          )}
        </MapContainer>
      </div>

      <p className="map-meta">
        {ui.parcels.pointsCount}: {points.length} · {ui.parcels.selectPointHint}
      </p>
    </div>
  );
}
