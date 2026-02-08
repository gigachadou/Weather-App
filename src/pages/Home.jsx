import { useEffect, useState } from "react";
import "../styles/Home.css";
import CityComponent from "../components/CityComponent";
import DailyForecast from "../components/DailyForecast";
import HourlyForecast from "../components/HourlyForecast";
import getCitySuggestions from "../../utils/getCitySuggestion";
import { IoSearchOutline, IoLocationOutline } from "react-icons/io5";
import getUserLocationWithCity from "../../utils/getUserLocationWithCity";

export default function Home() {
    const [inputRegion, setInputRegion] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Try to load location automatically on first mount (optional)
    useEffect(() => {
        // You can comment this out if you only want manual trigger
        const tryAutoLocation = async () => {
            try {
                setLoading(true);
                const location = await getUserLocationWithCity();
                if (location?.lat && location?.lon) {
                    setSelectedCity(location);
                }
            } catch (err) {
                // silently fail on mount – don't show error on first load
            } finally {
                setLoading(false);
            }
        };

        tryAutoLocation();
    }, []);

    // Show suggestions when typing
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputRegion.trim().length >= 2) {
                try {
                    const results = await getCitySuggestions(inputRegion, 8);
                    setSuggestions(results || []);
                } catch (err) {
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [inputRegion]);

    // Handle selecting a city from suggestions
    const handleSelectCity = (city) => {
        if (!city?.lat || !city?.lon) return;

        setSelectedCity({
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            country: city.country || ""
        });
        setInputRegion(city.name);
        setSuggestions([]);
        setError(null);
    };

    // Button handler – ask for location again
    const handleUseMyLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const location = await getUserLocationWithCity();

            if (location?.lat && location?.lon) {
                setSelectedCity(location);
                setInputRegion(location.name || "Your location");
                setError(null);
            } else {
                setError("Could not get location data");
            }
        } catch (err) {
            // Most common: user denied permission
            if (err.code === 1) {
                setError("Location permission was denied. Please allow it in your browser settings.");
            } else {
                setError(err.message || "Could not access your location");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <div className="home__h1">
                <h1>How's the sky looking today?</h1>
            </div>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <span className="search-icon">
                        <IoSearchOutline />
                    </span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for a place..."
                        value={inputRegion}
                        onChange={(e) => setInputRegion(e.target.value)}
                    />
                </div>

                <button className="search-button" onClick={() => {
                    if (suggestions.length > 0) handleSelectCity(suggestions[0]);
                }}>
                    Search
                </button>

                {/* New button – ask location again */}
                <button
                    className="location-button"
                    onClick={handleUseMyLocation}
                    disabled={loading}
                >
                    {loading ? "Detecting..." : <><IoLocationOutline /> Use my location</>}
                </button>

                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((city, i) => (
                            <li
                                key={i}
                                className="suggestion-item"
                                onClick={() => handleSelectCity(city)}
                            >
                                {city.display || city.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Messages */}
            {loading && <div className="status-message loading">Detecting your location...</div>}
            {error && <div className="status-message error">{error}</div>}

            {/* Weather content */}
            {selectedCity && selectedCity.lat && selectedCity.lon ? (
                <div className="home__inner">
                    <div className="home__left">
                        <CityComponent selectedCity={selectedCity} />
                        <DailyForecast selectedCity={selectedCity} />
                    </div>
                    <HourlyForecast selectedCity={selectedCity} />
                </div>
            ) : (
                !loading && (
                    <div className="status-message info">
                        {error
                            ? "Try again or search manually"
                            : "Search a city or click 'Use my location'"}
                    </div>
                )
            )}
        </div>
    );
}