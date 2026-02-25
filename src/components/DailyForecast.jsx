import getDailyAPI from "../../API_modules/getDailyAPI";
import getWeatherIcon from "../../API_modules/getWeatherIcon";
import { useContext, useEffect, useRef, useState } from "react";
import { UnitsContext } from "../../context";
import DailyModal from "./DailyModal";


export default function DailyForecast({ selectedCity }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const modalRef = useRef(null);
    const units = useContext(UnitsContext);
    const [modalArgs, setModalArgs] = useState({ info: null, title: null });

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
        <>
            <DailyModal ref={modalRef} info={modalArgs.info} title={modalArgs.title} />
            <div className="daily-container">
                <div className="daily__label">
                    <h4>Daily forecast</h4>
                </div>
                {loading && (
                    <div className="daily__inner">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div className="daily__div daily-loading-card" key={index}>
                                <div className="loading-line loading-line--daily-day" />
                                <div className="daily-loading-icon" />
                                <div className="daily__div-inner">
                                    <div className="loading-line loading-line--daily-temp" />
                                    <div className="loading-line loading-line--daily-temp" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {error && !loading && (
                    <div className="daily__inner">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div className="daily__div daily-error-card" key={index}>
                                <div className="daily-error-title">Forecast unavailable</div>
                                <div className="daily-error-text">{index === 0 ? error : "No data"}</div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && !error && data && (<div className="daily__inner">
                    {data.map(day => {
                        return (
                            <div className="daily__div" key={day.day} onClick={() => { setModalArgs({ info: day, title: "Weather info for " + day.date }); modalRef.current.showModal(); }}>
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
        </>
    );
}
