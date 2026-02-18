import getDailyAPI from "../../API_modules/getDailyAPI";
import getWeatherIcon from "../../API_modules/getWeatherIcon";
import { useContext, useEffect, useState } from "react";
import { UnitsContext } from "../../context";


export default function DailyForecast({ selectedCity }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const units = useContext(UnitsContext);

    useEffect(() => {
        async function loadWeather() {
            if (!selectedCity.lat || !selectedCity.lon) {
                setError("No location selected");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const dailyData = await getDailyAPI({
                    latitude: selectedCity.lat,
                    longitude: selectedCity.lon,
                    temp_unit: units.temp,
                    wind_speed_unit: units.windSpeed,
                    precipitation_unit: units.precipitation
                })
                setData(dailyData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadWeather();
    }, [selectedCity, units]);
    console.log(data);
    return (
        <div className="daily-container">
            <div className="daily__label">
                <h4>Daily forecast</h4>
            </div>
            {loading && <div className="loading">Loading hourly weather for {selectedCity.name}...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!loading && !error && data && (<div className="daily__inner">
                {data.map(day => {
                    return (
                        <div className="daily__div" key={day.day}>
                            <h5>{day.day}</h5>
                            {getWeatherIcon(day.weatherCode)}
                            <div className="daily__div-inner">
                                <h5 className="max-temp">{day.maxTemp}°</h5>
                                <h5 className="min-temp">{day.minTemp}°</h5>
                            </div>
                        </div>
                    );
                })}
            </div>)}
        </div>
    );
}

