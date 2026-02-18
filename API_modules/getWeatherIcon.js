export default function getWeatherIcon(code) {
    if (code === 0) return "Clear";

    if (code === 1 || code === 2) return "Cloudy" ;

    if (code === 3) return "Cloudy";

    if (code >= 45 && code <= 48) return "Fog";

    if (code >= 51 && code <= 57) return "Showers";

    if (code >= 61 && code <= 67) return "Rain";

    if (code >= 71 && code <= 77) return "Snow";

    if (code >= 80 && code <= 86) return "Showers";

    if (code >= 95 && code <= 99) return "Thunderstorm";

    return "Sunny";
};