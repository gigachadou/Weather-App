import { useEffect, useState } from "react";
import "../styles/Home.css";
import CityComponent from "../components/CityComponent";
import getCurrentAPI from "../../utils/getCurrentAPI";
import DailyForecast from "../components/DailyForecast";
import getDailyAPI from "../../utils/getDailyAPI";
import getCitySuggestions from "../../utils/getCitySuggestion";
import getParamsForAPI from "../../utils/getParamsForAPI";

export default function Home() {
    const [inputRegion, setInputRegion] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState({
        name: "Berlin",
        lat: 52.52,
        lon: 13.41
    });
    const [currentDataState, setCurrentDataState] = useState(null);
    const [dailyDataState, setDailyDataState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch weather whenever selected city changes
    useEffect(() => {
        let isMounted = true;

        async function loadWeather() {
            if (!selectedCity.lat || !selectedCity.lon) {
                setError("No location selected");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const [currentData, dailyData] = await Promise.all([
                    getCurrentAPI({
                        latitude: selectedCity.lat,
                        longitude: selectedCity.lon,
                        cityName: selectedCity.name
                    }),
                    getDailyAPI({
                        latitude: selectedCity.lat,
                        longitude: selectedCity.lon
                    })
                ]);
                console.log(currentData, dailyData)
                if (isMounted) {
                    setCurrentDataState({ data: currentData, cityName: selectedCity.name });
                    setDailyDataState(dailyData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadWeather();

        return () => {
            isMounted = false;
        };
    }, [selectedCity]);

    // Show suggestions when user types
    useEffect(() => {
        let timer;

        if (inputRegion.trim().length >= 2) {
            timer = setTimeout(async () => {
                // Use the imported suggestions function
                const results = await getCitySuggestions(inputRegion, 6);
                setSuggestions(results);
            }, 350); // small delay so it doesn't search on every keystroke
        } else {
            setSuggestions([]);
        }

        return () => clearTimeout(timer);
    }, [inputRegion]);

    // When user clicks a suggestion
    const handleSelectCity = (city) => {
        setSelectedCity({
            name: city.name,
            lat: city.lat,
            lon: city.lon
        });
        setInputRegion(city.name);     // show selected city in the input
        setSuggestions([]);            // hide the dropdown
    };

    // Optional: Press Enter → take first suggestion
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && suggestions.length > 0) {
            handleSelectCity(suggestions[0]);
        }
    };

    console.log(dailyDataState);

    return (
        <div className="home-container">
            <div className="home__h1">
                <h1>How's the sky looking today?</h1>
            </div>

            <div className="home__search">
                <div className="search-wrapper">
                    <input
                        type="text"
                        value={inputRegion}
                        onChange={(e) => setInputRegion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search city (e.g. Tashkent, Berlin...)"
                    />

                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((city, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectCity(city)}
                                    className="suggestion-item"
                                >
                                    {city.display}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (suggestions.length > 0) handleSelectCity(suggestions[0]);
                    }}
                >
                    Search
                </button>
            </div>

            <div className="home__inner">
                <div className="home__left">
                    {loading && <div className="loading">Loading weather for {selectedCity.name}...</div>}
                    {error && <div className="error">Error: {error}</div>}

                    {currentDataState && dailyDataState && !loading && !error && (
                        <>
                            <CityComponent
                                data={currentDataState.data}
                                cityName={currentDataState.cityName}
                            />
                            <DailyForecast data={dailyDataState} />
                        </>
                    )}
                </div>

                <div className="hourlyForecast-container">
                </div>
            </div>
        </div>
    );
}