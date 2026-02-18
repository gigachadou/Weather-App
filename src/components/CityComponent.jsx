import { useContext, useEffect, useState } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { WiNightClear } from "react-icons/wi";
import getCurrentAPI from "../../API_modules/getCurrentAPI";
import { UnitsContext } from "../../context";

export default function CityComponent({ selectedCity }) {
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
                const res = await getCurrentAPI({
                    latitude: selectedCity.lat,
                    longitude: selectedCity.lon,
                    cityName: selectedCity.name,
                    temp_unit: units.temp,
                    wind_speed_unit: units.windSpeed,
                    precipitation_unit: units.precipitation
                })

                setData({ ...res, cityName: selectedCity.name });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadWeather();
    }, [selectedCity, units]);

    const isDay = !error && !loading ? data.is_day === 1 : null;

    return (
        (
            <div className="cityComponent">
                <div className="mainInfo">
                    {!error && !loading && data && (
                        <>
                            <div className="mainInfo__text">
                                <h3>{selectedCity.name}, {selectedCity.country}</h3>
                                <h3>{data.time?.split("T")[1]?.slice(0, 5) || "—"}</h3>
                            </div>

                            <div className="mainInfo__div">
                                {isDay ? (
                                    <IoSunnyOutline color="orange" size={48} />
                                ) : (
                                    <WiNightClear color="#a0d2ff" size={48} />
                                )}
                                <h2>{Math.round(data.temperature)}{data.units.temperature}</h2>
                            </div>
                        </>
                    )}
                </div>

                {!loading && !error && data && (<div className="smallInfo-container">
                    <div className="smallInfo__div morph">
                        <div className="smallInfo__label">Feels Like</div>
                        <div className="smallInfo__info">
                            {Math.round(data.feelsLike) + " " + data.units.feelsLike}
                        </div>
                    </div>

                    <div className="smallInfo__div morph">
                        <div className="smallInfo__label">Humidity</div>
                        <div className="smallInfo__info">{data.humidity + " " + data.units.humidity}</div>
                    </div>

                    <div className="smallInfo__div morph">
                        <div className="smallInfo__label">Wind</div>
                        <div className="smallInfo__info">{Math.round(data.windSpeed) + " " + data.units.windSpeed}</div>
                    </div>

                    <div className="smallInfo__div morph">
                        <div className="smallInfo__label">Precipitation</div>
                        <div className="smallInfo__info">{(data.precipitation || 0) + " " + data.units.precipitation}</div>
                    </div>
                </div>)}
            </div>)
    );
}