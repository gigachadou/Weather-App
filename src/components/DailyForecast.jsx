import {
    WiDaySunny,
    WiDayCloudy,
    WiCloudy,
    WiNightClear,
    WiFog,
    WiRain,
    WiShowers,
    WiThunderstorm,
    WiSnow,
    WiStrongWind,
} from "react-icons/wi";

export default function DailyForecast({ data }) {
    return (
        <div className="daily-container">
            <div className="daily__label">
                <h4>Daily forecast</h4>
            </div>
            <div className="daily__inner">
                {data.map(e => {
                    return (
                        <div className="daily__div" key={e.day}>
                            <h5>{e.day}</h5>
                            {getWeatherIcon(e.weatherCode, 32, "orange")}
                            <div className="daily__div-inner">
                                <h5>{e.maxTemp}</h5>
                                <h5>{e.minTemp}</h5>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

function getWeatherIcon(code, size = 32, color = "currentColor") {
    // Main weather codes (WMO codes used by Open-Meteo)
    if (code === 0) return <WiDaySunny size={size} color={color} />;           // Clear sky

    if (code === 1 || code === 2) return <WiDayCloudy size={size} color={color} />;   // Mainly clear / partly cloudy

    if (code === 3) return <WiCloudy size={size} color={color} />;            // Overcast

    // Fog & haze
    if (code >= 45 && code <= 48) return <WiFog size={size} color={color} />;

    // Drizzle
    if (code >= 51 && code <= 57) return <WiShowers size={size} color={color} />;

    // Rain
    if (code >= 61 && code <= 67) return <WiRain size={size} color={color} />;

    // Snow
    if (code >= 71 && code <= 77) return <WiSnow size={size} color={color} />;

    // Showers
    if (code >= 80 && code <= 86) return <WiShowers size={size} color={color} />;

    // Thunderstorm
    if (code >= 95 && code <= 99) return <WiThunderstorm size={size} color={color} />;

    // Default / fallback
    return <WiDaySunny size={size} color={color} />;
}