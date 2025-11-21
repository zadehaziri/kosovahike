import { useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useUrlPosition } from '../../hooks/useUrlPosition';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Map.scss';
import LeafletControlGeocoder from './LeafletControlGeocoder';

const Map = () => {
  const [mapPosition, setMapPosition] = useState([42.6026, 20.9030]);
  const trails = useSelector((state) => state.trailsTracking.pastTrails);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  useEffect(() => {
    navigate('/user-stats/past-trails');
  }, [navigate]);

  const customMarker = new Icon({
    iconUrl: require('../../assets/images/marker-icon.png'),
    iconSize: [42, 42],
  });

  return (
    <div className='mapContainer'>
      {!geolocationPosition && (
        <button className='position-btn' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Your current position'}
        </button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={8.5}
        scrollWheelZoom={true}
        className='map'
      >
        <TileLayer
          attribution='Google Maps'
          url='https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'
        />

        <LeafletControlGeocoder />
        {trails?.map((trail) => {
          const { position } = trail;
          if (!trail.position || !trail.position.lat || !trail.position.lng) {
            return null;
          }

          const lat = parseFloat(position.lat);
          const lng = parseFloat(position.lng);
          if (isNaN(lat) || isNaN(lng)) {
            return null;
          }
          return (
            <Marker position={[lat, lng]} key={trail._id} icon={customMarker}>
              <Popup>
                <span>{trail.emoji}</span> <span>{trail?.name}</span>
              </Popup>
            </Marker>
          );
        })}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      console.log('Latitude:', e.latlng.lat);
      console.log('Longitude:', e.latlng.lng);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;