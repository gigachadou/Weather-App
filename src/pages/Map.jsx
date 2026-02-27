import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import MapPicker from '../components/MapPicker';
import { getCityName } from '../../API_modules/getUserLocationWithCity';
import "../styles/Map.css";

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
            <div style={{ flex: 1, width: '100%' }}>
                <MapPicker
                    initialLat={selected?.lat ?? 41.3111}
                    initialLon={selected?.lon ?? 69.2797}
                    initialName={selected?.name}
                    onLocationSelect={handleLocationSelect}
                    isLoading={isProcessing}
                />  
            </div>

            {selected && (
                <div className="location-info-panel">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2>{selected.name}</h2>
                        <button onClick={() => { setSelectedCity(selected); navigate("/"); }}>Select</button>
                    </div>
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
        </div>
    );
}