import { useContext, useEffect, useState } from "react";
import getHourlyAPI from "../../API_modules/getHourlyAPI";
import getWeatherIcon from "../../API_modules/getWeatherIcon";
import { UnitsContext } from "../../context";

export default function HourlyForecast({ selectedCity }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const units = useContext(UnitsContext);

    useEffect(() => {
        async function loadWeather() {
            if (!selectedCity?.lat || !selectedCity?.lon) {
                setError("No location selected");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setForecastData(null);
            setSelectedDay(null);

            try {
                const result = await getHourlyAPI({
                    latitude: selectedCity.lat,
                    longitude: selectedCity.lon,
                    temp_unit: units.temp,
                    wind_speed_unit: units.windSpeed,
                    precipitation_unit: units.precipitation,
                });

                if (!result || !result.data) {
                    throw new Error("No data received from API");
                }

                const grouped = result.data.reduce((acc, item) => {
                    const date = new Date(item.time);
                    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

                    if (!acc.days.has(dayName)) {
                        acc.days.add(dayName);
                        acc.data[dayName] = [];
                    }
                    acc.data[dayName].push(item);
                    return acc;
                }, { days: new Set(), data: {} });

                const daysArray = Array.from(grouped.days);

                setForecastData({
                    days: daysArray,
                    data: grouped.data,
                    units: result.units,
                });

                if (daysArray.length > 0) {
                    setSelectedDay(daysArray[0]);
                }
            } catch (err) {
                setError(err.message || "Failed to load hourly forecast");
            } finally {
                setLoading(false);
            }
        }

        loadWeather();
    }, [selectedCity, units]);

    const selectedDayData = forecastData && selectedDay ? forecastData.data[selectedDay] : [];

    return (
        <div className="hourly__container">
            <div className="hourly__header">
                <h5>Hourly forecast</h5>

                {!error && !loading && forecastData?.days?.length > 0 && (
                    <select
                        value={selectedDay || ""}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        {forecastData.days.map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {loading && (
                <div className="loading">
                    Loading hourly weather for {selectedCity.name || "…"}...
                </div>
            )}

            {error && <div className="error">Error: {error}</div>}

            {!loading && !error && selectedDayData.length > 0 && (
                <div className="hourly-items">
                    {selectedDayData.map((hour, index) => {
                        const time = hour.time?.split("T")?.[1]?.slice(0, 5) || "—";

                        return (
                            <div className="hourly__div" key={index}>
                                {getWeatherIcon(hour.weatherCode)}
                                <h5>{time}</h5>
                                <h5>
                                    {hour.temp} {forecastData.units.temperature}
                                </h5>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}