import {
    WiDaySunny,
    WiCloudy,
    WiFog,
    WiRain,
    WiSnow,
    WiShowers,
    WiThunderstorm
} from 'react-icons/wi';

export default function getWeatherIcon(code, color = "orange", size = 32) {
    if (code === 0) {
        return <WiDaySunny color={color} size={size} />;
    }

    if (code === 1 || code === 2 || code === 3) {
        return <WiCloudy color={color} size={size} />;
    }

    if (code >= 45 && code <= 48) {
        return <WiFog color={color} size={size} />;
    }

    if (code >= 51 && code <= 57) {
        return <WiShowers color={color} size={size} />;
    }

    if (code >= 61 && code <= 67) {
        return <WiRain color={color} size={size} />;
    }

    if (code >= 71 && code <= 77) {
        return <WiSnow color={color} size={size} />;
    }

    if (code >= 80 && code <= 86) {
        return <WiShowers color={color} size={size} />;
    }

    if (code >= 95 && code <= 99) {
        return <WiThunderstorm color={color} size={size} />;
    }
    return <WiDaySunny color={color} size={size} />;
}