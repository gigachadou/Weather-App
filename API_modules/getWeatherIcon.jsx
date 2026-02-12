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
    WiNightFog,
    WiNightShowers,
    WiNightRain,
    WiNightSnow,
    WiNightAltShowers,
    WiNightThunderstorm,
    WiNightAltCloudy,
} from "react-icons/wi";

export default function getWeatherIcon(code, size = 36, color = "currentColor", isNight = false) {
    if (code === 0) return isNight ? <WiNightClear size={size} color={color} /> : <WiDaySunny size={size} color={color} />; // Clear sky

    if (code === 1 || code === 2) return isNight ? <WiNightAltCloudy size={size} color={color} /> : <WiDayCloudy size={size} color={color} />; // Mainly clear / partly cloudy

    if (code === 3) return <WiCloudy size={size} color={color} />; // Overcast

    if (code >= 45 && code <= 48) return isNight ? <WiNightFog size={size} color={color} /> : <WiFog size={size} color={color} />;

    if (code >= 51 && code <= 57) return isNight ? <WiNightShowers size={size} color={color} /> : <WiShowers size={size} color={color} />; // Drizzle

    if (code >= 61 && code <= 67) return isNight ? <WiNightRain size={size} color={color} /> : <WiRain size={size} color={color} />;

    if (code >= 71 && code <= 77) return isNight ? <WiNightSnow size={size} color={color} /> : <WiSnow size={size} color={color} />;

    if (code >= 80 && code <= 86) return isNight ? <WiNightAltShowers size={size} color={color} /> : <WiShowers size={size} color={color} />; // Showers

    if (code >= 95 && code <= 99) return isNight ? <WiNightThunderstorm size={size} color={color} /> : <WiThunderstorm size={size} color={color} />;
    // fallback
    return isNight ? <WiNightClear size={size} color={color} /> : <WiDaySunny size={size} color={color} />;
};