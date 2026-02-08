import getDailyAPI from "../../utils/getDailyAPI";
import getWeatherIcon from "../../utils/getWeatherIcon";
import { useEffect, useState } from "react";


export default function DailyForecast({ selectedCity }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

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
                const dailyData = await getDailyAPI({
                    latitude: selectedCity.lat,
                    longitude: selectedCity.lon
                })
                if (isMounted) {
                    setData(dailyData);
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
                            {getWeatherIcon(day.weatherCode, 36, "orange")}
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

