import "../styles/Modals.css";
import getWeatherIcon from "../../API_modules/getWeatherIcon";

export default function DailyModal({ info, title, ref }) {
    if(!info) return null;
    return (
        <dialog className="infoDialog__container" ref={ref}>
            <div className="infoDialog__header">
                <h3 className="infoDialog__title">{title || ""}</h3>
                <div className="infoDialog__weatherIcon">
                    {getWeatherIcon(info.weatherCode, "#fef08a", 42)}
                </div>
            </div>

            <div className="infoDialog__inner">
                <table className="infoDialog__table">
                    <tbody>
                        <tr>
                            <th scope="row">Date</th>
                            <td>{info.date}</td>
                        </tr>
                        <tr>
                            <th scope="row">Temperature</th>
                            <td>
                                <div className="infoDialog__pair">
                                    <span className="infoDialog__pill">Max {info.maxTemp} {info.units.temp}</span>
                                    <span className="infoDialog__pill infoDialog__pill--muted">Min {info.minTemp} {info.units.temp}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Feels Like</th>
                            <td>
                                <div className="infoDialog__pair">
                                    <span className="infoDialog__pill">Max {info?.maxApparent} {info.units.temp}</span>
                                    <span className="infoDialog__pill infoDialog__pill--muted">Min {info.minApparent} {info.units.temp}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Sun</th>
                            <td>
                                <div className="infoDialog__pair">
                                    <span>Sunrise {info.sunrise}</span>
                                    <span>Sunset {info.sunset}</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Wind</th>
                            <td>{info?.windSpeed} {info.units.windSpeed}, {info.windDirection} deg</td>
                        </tr>
                        <tr>
                            <th scope="row">Precipitation</th>
                            <td>{info.precipitationSum} {info.units.precipitation}</td>
                        </tr>
                        <tr>
                            <th scope="row">UV Index</th>
                            <td>{info.maxUV}</td>
                        </tr>
                        <tr>
                            <th scope="row">Weather Code</th>
                            <td>{info.weatherCode}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button className="infoDialog__closeBtn" onClick={() => ref.current.close()}>
                Close
            </button>
        </dialog>
    );
}

/**
 * return {
 *   day: dayName,
 *   date: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
 *   maxTemp: Math.round(data.daily.temperature_2m_max[i]),
 *   minTemp: Math.round(data.daily.temperature_2m_min[i]),
 *   weatherCode: data.daily.weather_code[i],
 *   maxApparent: Math.round(data.daily.apparent_temperature_max[i]),
 *   minApparent: Math.round(data.daily.apparent_temperature_min[i]),
 *   sunrise: (data.daily.sunrise[i]).split("T")[1],
 *   sunset: (data.daily.sunset[i]).split("T")[1],
 *   maxUV: data.daily.uv_index_max[i],
 *   windSpeed: data.daily.wind_speed_10m_max[i],
 *   windDirection: data.daily.wind_direction_10m_dominant[i],
 *   precipitationSum: data.daily.precipitation_sum,
 *   units: {
 *     temp: data.daily_units.temperature_2m_max,
 *     windSpeed: data.daily_units.wind_speed_10m_max,
 *     precipitation: data.daily_units.precipitation_sum,
 *   }
 * };
 */
