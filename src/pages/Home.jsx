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
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);


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
        setInputRegion("");     // show selected city in the input
        setSuggestions([]);            // hide the dropdown
    };

    // Optional: Press Enter → take first suggestion
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && suggestions.length > 0) {
            handleSelectCity(suggestions[0]);
        }
    };

    return (
        <div className="home-container" onKeyDown={handleKeyDown}>
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
                            >
                                {city.display}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="home__inner">
                <div className="home__left">
                    <CityComponent selectedCity={selectedCity} />
                    <DailyForecast selectedCity={selectedCity} />
                </div>
                <HourlyForecast selectedCity={selectedCity} />
            </div>
        </div>
    );
}