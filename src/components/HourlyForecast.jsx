import { useContext, useEffect, useState } from "react";
import getHourlyAPI from "../../API_modules/getHourlyAPI";
import getWeatherIcon from "../../API_modules/getWeatherIcon"
import { UnitsContext } from "../../context";

export default function HourlyForecast({ selectedCity }) {
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
                const dailyData = await getHourlyAPI({
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

    return (
        <div className="hourly__container">
            <h5>Hourly forecast</h5>
            {loading && <div className="loading">Loading hourly weather for {selectedCity.name}...</div>}
            {error && <div className="error">Error: {error}</div>}
            {!error && !loading && data && data.data.map((e, i) => {
                const time = e.time?.split("T")[1]?.slice(0, 5) || "—"
                return (
                    <div className="hourly__div" key={i}>
                        {getWeatherIcon(e.weatherCode)}
                        <h5>{time}</h5>
                        <h5>{e.temp + " " + data.units.temperature}</h5>
                    </div>
                )
            })}
        </div>
    )
};