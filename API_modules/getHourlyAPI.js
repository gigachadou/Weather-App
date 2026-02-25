export default async function getHourlyAPI({ latitude, longitude, timezone = "auto", temp_unit = "celsius", wind_speed_unit = "kmh", precipitation_unit = "mm" }) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `temperature_unit=${temp_unit}&wind_speed_unit=${wind_speed_unit}&precipitation_unit=${precipitation_unit}&` +
            `hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m&` +
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
            windSpeed: Math.round(json.hourly.wind_speed_10m[i]),
            precipitationProb: json.hourly.precipitation_probability[i],
            dewPoint: json.hourly.dew_point_2m[i],
            visibility: (json.hourly.visibility[i] / 1000),
        }));

        const units = {
            temperature: json.hourly_units.temperature_2m,
            humidity: json.hourly_units.relative_humidity_2m,
            precipitation: json.hourly_units.precipitation,
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