import "../styles/Modals.css";
import getWeatherIcon from "../../API_modules/getWeatherIcon";

export default function HourlyModal({ ref, info, title }) {
    if (!info) return null;

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
                            <th scope="row">Time</th>
                            <td>{info.time}</td>
                        </tr>
                        <tr>
                            <th scope="row">Temperature</th>
                            <td>{info.temp} {info.units.temperature}</td>
                        </tr>
                        <tr>
                            <th scope="row">Feels Like</th>
                            <td>{info.feelsLike} {info.units.temperature}</td>
                        </tr>
                        <tr>
                            <th scope="row">Humidity</th>
                            <td>{info.humidity} {info.units.humidity}</td>
                        </tr>
                        <tr>
                            <th scope="row">Precipitation</th>
                            <td>{info.precipitation} {info.units.precipitation}</td>
                        </tr>
                        <tr>
                            <th scope="row">Precipitation Prob</th>
                            <td>{info.precipitationProb} %</td>
                        </tr>
                        <tr>
                            <th scope="row">Wind</th>
                            <td>{info.windSpeed} {info.units.windSpeed}</td>
                        </tr>
                        <tr>
                            <th scope="row">Dew Point</th>
                            <td>{info.dewPoint} {info.units.temperature}</td>
                        </tr>
                        <tr>
                            <th scope="row">Visibility</th>
                            <td>{info.visibility} km</td>
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
 * info
 : 
 dewPoint
 : 
 4
 feelsLike
 : 
 4
 humidity
 : 
 85
 precipitation
 : 
 0
 precipitationProb
 : 
 0
 temp
 : 
 6
 time
 : 
 "2026-02-25T00:00"
 units
 : 
 {temperature: 'Â°C', humidity: '%', precipitation: 'mm', windSpeed: 'km/h'}
 visibility
 : 
 24.46
 weatherCode
 : 
 3
 windSpeed
 : 
 4
 */
