import { useEffect, useState } from "react";
import "../styles/Home.css";
import CityComponent from "../components/CityComponent";
import DailyForecast from "../components/DailyForecast";
import HourlyForecast from "../components/HourlyForecast";
import getCitySuggestions from "../../API_modules/getCitySuggestion";
import { IoSearchOutline, IoLocationOutline, IoClose } from "react-icons/io5";
import getUserLocationWithCity from "../../API_modules/getUserLocationWithCity";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Home() {
    const [inputRegion, setInputRegion] = useState("");
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestionMsg, setSuggestionsMsg] = useState(null);
    const { selectedCity, setSelectedCity } = useOutletContext();
    const navigate = useNavigate();
    useEffect(() => {
        const tryAutoLocation = async () => {
            try {
                setLoading(true);
                const location = await getUserLocationWithCity();
                if (location?.lat && location?.lon) {
                    setSelectedCity(location);
                }
            } catch (err) {
                console.log(err?.message);
            } finally {
                setLoading(false);
            };
        };

        tryAutoLocation();
    }, []);

    useEffect(() => {
        if (inputRegion.trim().length < 2) {
            setSuggestions(null);
            setSuggestionsMsg(null);
            return;
        };

        setSuggestionsMsg("Loading...");

        const timer = setTimeout(async () => {
            try {
                const results = await getCitySuggestions(inputRegion.trim(), 6);
                if (results?.length > 0) {
                    setSuggestions(results);
                    setSuggestionsMsg(null);
                } else {
                    setSuggestions([]);
                    setSuggestionsMsg("No matching places found");
                }
            } catch (err) {
                setSuggestions([]);
                setSuggestionsMsg("Couldn't load suggestions" + err?.message);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [inputRegion]);

    const handleSelectCity = (city) => {
        if (!city?.lat || !city?.lon) return;

        setSelectedCity({
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            country: city.country || ""
        });
        setInputRegion("");
        setSuggestions([]);
        setError(null);
    };

    const handleUseMyLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const location = await getUserLocationWithCity();

            setSelectedCity(location);
            setError(null);
        } catch (err) {
            if (err.code === 1) {
                setError("Location permission was denied. Please allow it in browser settings.");
            } else if (err.code === 2) {
                setError("Location unavailable.");
            } else if (err.code === 3) {
                setError("Location request timed out.");
            } else {
                setError(err.message || "Could not access your location.");
            }
        } finally {
            setLoading(false);
        };
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

                <button className="search-button" onClick={() => { navigate("/map") }}>
                    Open Map
                </button>

                <button
                    className="location-button"
                    onClick={handleUseMyLocation}
                    disabled={loading}
                >
                    {loading ? "Detecting..." : <><IoLocationOutline /> Use my location</>}
                </button>

                {suggestions && (
                    <ul className="suggestions-list">
                        {suggestionMsg && <li className="suggestion-item">{suggestionMsg}</li>}
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

            {loading && <div className="status-message loading">Detecting your location...</div>}
            {error && <div className="status-message error">
                <IoClose size={22} onClick={() => setError(null)} className="status-message iconX" />
                <span>{error}</span>
            </div>}

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