import { useEffect, useState } from "react";
import "../styles/Home.css";
import CityComponent from "../components/CityComponent";
import getCurrentAPI from "../../utils/getCurrentAPI";
import DailyForecast from "../components/DailyForecast";
import getDailyAPI from "../../utils/getDailyAPI";
import getCitySuggestions from "../../utils/getCitySuggestion";
import getParamsForAPI from "../../utils/getParamsForAPI";
import { IoSearchOutline } from "react-icons/io5";
import getHourlyAPI from "../../utils/getHourlyAPI";
import HourlyForecast from "../components/HourlyForecast";

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
    const [hourlyDataState, setHourlyDataState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [onFocusSuggestion, setOnFocusSuggestion] = useState(0);

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
                const [currentData, dailyData, hourlyData] = await Promise.all([
                    getCurrentAPI({
                        latitude: selectedCity.lat,
                        longitude: selectedCity.lon,
                        cityName: selectedCity.name
                    }),
                    getDailyAPI({
                        latitude: selectedCity.lat,
                        longitude: selectedCity.lon
                    }),
                    getHourlyAPI({
                        latitude: selectedCity.lat,
                        longitude: selectedCity.lon
                    })
                ]);
                console.log(hourlyData);
                if (isMounted) {
                    setCurrentDataState({ data: currentData, cityName: selectedCity.name });
                    setDailyDataState(dailyData);
                    setHourlyDataState(hourlyData);
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
                const results = await getCitySuggestions(inputRegion, 100);
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
            handleSelectCity(suggestions[onFocusSuggestion]);
        }

    };

    return (
        <div className="home-container">
            <div className="home__h1">
                <h1>How's the sky looking today?</h1>
            </div>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <span className="search-icon"><IoSearchOutline /></span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for a place..."
                        value={inputRegion}
                        onChange={(e) => setInputRegion(e.target.value)}
                    />
                </div>

                <button className="search-button">Search</button>

                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((city, i) => (
                            <li
                                key={i}
                                className="suggestion-item"
                                onClick={() => handleSelectCity(city)}
                                onFocus={i === onFocusSuggestion}
                            >
                                {city.display + " :" + i}
                            </li>
                        ))}
                    </ul>
                )}
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
                {loading && <div className="loading">Loading hourly weather for {selectedCity.name}...</div>}
                {error && <div className="error">Error: {error}</div>}
                {hourlyDataState && !loading && !error && (
                    <>
                        <HourlyForecast data={hourlyDataState} />
                    </>
                )}
            </div>
        </div>
    );
}