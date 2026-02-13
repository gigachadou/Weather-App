export default async function getHourlyAPI({ latitude, longitude, timezone = "auto", hoursToReturn = 24 } = {}) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&` +
            `timezone=${encodeURIComponent(timezone)}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`${res.status}`);
        };

        const json = await res.json();

        const data = json.hourly.time.map((time, i) => ({
            time: time,
            temp: Math.round(json.hourly.temperature_2m[i]),
            feelsLike: Math.round(json.hourly.apparent_temperature[i]),
            humidity: json.hourly.relative_humidity_2m[i],
            precipitation: json.hourly.precipitation[i],
            weatherCode: json.hourly.weather_code[i],
            windSpeed: Math.round(json.hourly.wind_speed_10m[i])
        })).slice(0, hoursToReturn);

        const units = {
            temperature: json.hourly_units.temperature_2m,
            feelsLike: json.hourly_units.apparent_temperature,
            humidity: json.hourly_units.relative_humidity_2m,
            precipitation: json.hourly_units.precipitation,
            weatherCode: json.hourly_units.weather_code,
            windSpeed: json.hourly_units.wind_speed_10m
        };

        return { data, units };
    } catch (error) {
        console.error("Error at getting hourly forecast:", error.message);
        return null;
    };
};

/**
 * data:
    * time
    * temp
    * feelsLike
    * humidity
    * precipitation
    * weatherCode
    * windSpeed
 * units:
    * temperature
    * feelsLike
    * humidity
    * precipitation
    * weatherCode
    * windSpeed   
 */