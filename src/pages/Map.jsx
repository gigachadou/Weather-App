import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import MapPicker from '../components/MapPicker';
import { getCityName } from '../../API_modules/getUserLocationWithCity';

export default function Map() {
    const navigate = useNavigate();
    const { selectedCity, setSelectedCity } = useOutletContext();

    const [selected, setSelected] = useState(selectedCity);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleLocationSelect = async (lat, lon) => {
        if (isProcessing) return;

        setIsProcessing(true);

        let result;

        try {
            result = await getCityName(lat, lon);
        } catch (err) {
            console.error('Reverse geocoding failed:', err);

            result = {
                name: 'Selected point',
                lat: Number(lat),
                lon: Number(lon),
                country: '—'
            };
        }

        const confirmed = window.confirm(
            `Do you want to set this location?\n\n${result.name}, ${result.country}\n${result.lat.toFixed(5)}, ${result.lon.toFixed(5)}`
        );

        if (confirmed) {
            setSelected(result);

            setSelectedCity(result);

            navigate('/');
        } else {
            setSelected(result);
        }

        setIsProcessing(false);
    };

    return (
        <div className="map-fullscreen">
            <MapPicker
                initialLat={selected?.lat ?? 41.3111}
                initialLon={selected?.lon ?? 69.2797}
                initialName={selected?.name}
                onLocationSelect={handleLocationSelect}
                isLoading={isProcessing}
            />

            {selected && (
                <div className="location-info-panel">
                    <h2>{selected.name}</h2>
                    <p>
                        {selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}
                    </p>
                    <p>{selected.country}</p>

                    {isProcessing && (
                        <p className="processing-text">Processing...</p>
                    )}

                    {!isProcessing && (
                        <small className="hint-text">
                            Click anywhere on the map to choose another location
                        </small>
                    )}
                </div>
            )}

            <style jsx>{`
        .map-fullscreen {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 10;
          background: #000;
        }

        .location-info-panel {
          position: absolute;
          bottom: 24px;
          left: 16px;
          right: 16px;
          max-width: 380px;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(10px);
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.28);
          z-index: 100;
        }

        .location-info-panel h2 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          line-height: 1.2;
        }

        .location-info-panel p {
          margin: 4px 0;
          color: #333;
        }

        .processing-text {
          margin-top: 12px;
          color: #e67e22;
          font-weight: 500;
        }

        .hint-text {
          display: block;
          margin-top: 12px;
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
}