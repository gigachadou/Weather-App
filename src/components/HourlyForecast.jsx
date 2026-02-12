import { useEffect, useState } from "react";
import getHourlyAPI from "../../API_modules/getHourlyAPI";
import getWeatherIcon from "../../API_modules/getWeatherIcon"

export default function HourlyForecast({ selectedCity }) {
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
                const dailyData = await getHourlyAPI({
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

    function detectNight(time) {
        if (time == "-") return false;
        const hour = Number(time.slice(0, 2))
        return (hour > 20 || hour < 7)
    };
    return (
        <div className="hourly__container">
            <h5>Hourly forecast</h5>
            {loading && <div className="loading">Loading hourly weather for {selectedCity.name}...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!error && !loading && data && data.data.map((e, i) => {
                const time = e.time?.split("T")[1]?.slice(0, 5) || "—"
                return (
                    <div className="hourly__div" key={i}>
                        {getWeatherIcon(e.weatherCode, 36, "orange", detectNight(time))}
                        <h5>{time}</h5>
                        <h5>{e.temp + " " + data.units.temperature}</h5>
                    </div>
                )
            })}
        </div>
    )
};