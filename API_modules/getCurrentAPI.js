export default async function getCurrentAPI({ latitude, longitude, cityName = "Unknown", temp_unit = "celsius", wind_speed_unit = "kmh", precipitation_unit = "mm" }) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `temperature_unit=${temp_unit}&wind_speed_unit=${wind_speed_unit}&precipitation_unit=${precipitation_unit}&` +
            `current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,is_day&` +
            `timezone=auto`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`${res.status}`);
        };

        const data = await res.json();
        console.log(data);
        return {
            region: cityName,
            time: data.current.time,
            temperature: Math.round(data.current.temperature_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            feelsLike: Math.round(data.current.apparent_temperature),
            precipitation: data.current.precipitation,
            humidity: data.current.relative_humidity_2m,
            isDay: data.current.is_day === 1,
            units: {
                temperature: data.current_units.temperature_2m,
                windSpeed: data.current_units.wind_speed_10m,
                feelsLike: data.current_units.apparent_temperature,
                precipitation: data.current_units.precipitation,
                humidity: data.current_units.relative_humidity_2m
            }
        };
    } catch (error) {
        console.error("Error at getting current API:", error.message);
        return null;
    };
};