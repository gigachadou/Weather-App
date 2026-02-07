import { IoSunnyOutline } from "react-icons/io5";
import { WiDaySunny, WiNightClear } from "react-icons/wi";

export default function CityComponent({ data, cityName }) {
    // data = current weather object from Open-Meteo
    // cityName = passed from parent (selected city name)
    console.log(data);
    const isDay = data.is_day === 1;

    return (
        <div className="cityComponent">
            <div className="mainInfo">
                <div className="mainInfo__text">
                    <h3>{cityName}</h3>
                    <h3>{data.time?.split("T")[1]?.slice(0, 5) || "—"}</h3>
                    {/* Shows time like "14:00" */}
                </div>

                <div className="mainInfo__div">
                    {isDay ? (
                        <IoSunnyOutline color="orange" size={48} />
                    ) : (
                        <WiNightClear color="#a0d2ff" size={48} />
                    )}
                    <h2>{Math.round(data.temperature)}°</h2>
                </div>
            </div>

            <div className="smallInfo-container">
                <div className="smallInfo__div">
                    <div className="smallInfo__label">Feels Like</div>
                    <div className="smallInfo__info">
                        {Math.round(data.feelsLike) + " " + data.units.feelsLike}
                    </div>
                </div>

                <div className="smallInfo__div">
                    <div className="smallInfo__label">Humidity</div>
                    <div className="smallInfo__info">{data.humidity + " " + data.units.humidity}</div>
                </div>

                <div className="smallInfo__div">
                    <div className="smallInfo__label">Wind</div>
                    <div className="smallInfo__info">{Math.round(data.windSpeed) + " " + data.units.windSpeed}</div>
                </div>

                <div className="smallInfo__div">
                    <div className="smallInfo__label">Precipitation</div>
                    <div className="smallInfo__info">{(data.precipitation || 0) + " " + data.units.precipitation}</div>
                </div>
            </div>
        </div>
    );
}