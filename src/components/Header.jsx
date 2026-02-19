import { TiWeatherCloudy } from "react-icons/ti";
import "../styles/Header.css";
import { useState } from "react";

export default function Header({ units, setUnits }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    function handleChange(e) {
        const { name, value } = e;

        setUnits(prev => ({
            ...prev,
            [name]: value
        }));

        setIsOpen(false);
    };

    return (
        <div className="header-container">
            <div className="header-logo">
                <TiWeatherCloudy color="orange" size={50} />
                <h2>Weather App</h2>
            </div>
            <div className="units-dropdown-container">
                <button
                    className={`units-trigger ${isOpen ? 'active' : ''}`}
                    onClick={toggleDropdown}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    Units {isOpen ? '▲' : '▼'}
                </button>

                {isOpen && (
                    <div className="units-dropdown-menu">
                        <div className="unit-group">
                            <span className="unit-label">Temperature</span>
                            <div className="segmented-control">
                                <button
                                    type="button"
                                    className={`segment-btn ${units.temp === 'celsius' ? 'active' : ''}`}
                                    onClick={() => handleChange({ name: 'temp', value: 'celsius' })}
                                >
                                    °C
                                </button>
                                <button
                                    type="button"
                                    className={`segment-btn ${units.temp === 'fahrenheit' ? 'active' : ''}`}
                                    onClick={() => handleChange({ name: 'temp', value: 'fahrenheit' })}
                                >
                                    °F
                                </button>
                            </div>
                        </div>
                        <div className="unit-group">
                            <span className="unit-label">Wind Speed</span>
                            <div className="segmented-control">
                                <button
                                    type="button"
                                    className={`segment-btn ${units.windSpeed === 'kmh' ? 'active' : ''}`}
                                    onClick={() => handleChange({ name: 'windSpeed', value: 'kmh' })}
                                >
                                    km/h
                                </button>
                                <button
                                    type="button"
                                    className={`segment-btn ${units.windSpeed === 'mph' ? 'active' : ''}`}
                                    onClick={() => handleChange({ name: 'windSpeed', value: 'mph' })}
                                >
                                    mph
                                </button>
                            </div>
                        </div>
                        <div className="unit-group">
                            <span className="unit-label">Precipitation</span>
                            <div className="segmented-control">
                                <button
                                    type="button"
                                    className={`segment-btn ${units.precipitation === 'mm' ? 'active' : ''}`}
                                    onClick={() => handleChange({ name: 'precipitation', value: 'mm' })}
                                >
                                    mm
                                </button>
                                <button
                                    type="button"
                                    className={`segment-btn ${units.precipitation === 'inch' ? 'active' : ''}`}
                                    onClick={() => handleChange({ name: 'precipitation', value: 'inch' })}
                                >
                                    in
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};