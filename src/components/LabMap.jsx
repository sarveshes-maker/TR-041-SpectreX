import React, { useEffect, useRef } from 'react';

const LabMap = ({ userCoords, labCoords, labName, isInteractive, onLocationChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.L || !userCoords || !labCoords) return;

    // Initialize map if not already done
    if (!mapInstance.current) {
      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false
      });

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapInstance.current);
    }

    const { current: map } = mapInstance;
    const { L } = window;

    // Clear existing layers and events
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
    map.off('click');

    const isSamePoint = userCoords.lat === labCoords.lat && userCoords.lng === labCoords.lng;

    const userMarker = L.marker([userCoords.lat, userCoords.lng], {
      draggable: isInteractive,
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div style="background: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); cursor: grab;"></div>',
        iconSize: [14, 14]
      })
    }).addTo(map).bindPopup('Your Farm Location');

    if (isInteractive && onLocationChange) {
      userMarker.on('dragend', function (e) {
        const marker = e.target;
        const pos = marker.getLatLng();
        onLocationChange(pos.lat, pos.lng);
      });

      map.on('click', function (e) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });
    }

    if (!isSamePoint) {
      const labMarker = L.marker([labCoords.lat, labCoords.lng], {
        icon: L.divIcon({
          className: 'lab-marker',
          html: '<div style="background: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);"></div>',
          iconSize: [14, 14]
        })
      }).addTo(map).bindPopup(labName);

      const line = L.polyline([
        [userCoords.lat, userCoords.lng],
        [labCoords.lat, labCoords.lng]
      ], {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.6,
        dashArray: '5, 10'
      }).addTo(map);

      const bounds = L.latLngBounds([
        [userCoords.lat, userCoords.lng],
        [labCoords.lat, labCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [30, 30] });
    } else {
      map.setView([userCoords.lat, userCoords.lng], 15);
    }

    // Force Leaflet to recalculate size after render
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      // Cleanup on unmount
      if (mapInstance.current) {
//        mapInstance.current.remove();
//        mapInstance.current = null;
      }
    };
  }, [userCoords, labCoords, labName]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '200px', 
        borderRadius: '16px', 
        marginTop: '20px',
        border: '1px solid var(--glass-border)',
        overflow: 'hidden',
        zIndex: 1
      }} 
    />
  );
};

export default LabMap;
