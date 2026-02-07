export default async function getHourlyAPI({ latitude, longitude, timezone = "auto", hoursToReturn = 24 } = {}) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
        console.warn("latitude yoki longitude kiritilmagan");
        return { data: [], units: {} };
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&` +
            `timezone=${encodeURIComponent(timezone)}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`API xatosi: ${res.status}`);
        }

        const json = await res.json();

        if (!json.hourly?.time) {
            return { data: [], units: {} };
        }

        const data = json.hourly.time.map((time, i) => ({
            time,
            temp: Math.round(json.hourly.temperature_2m?.[i] ?? 0),
            feelsLike: Math.round(json.hourly.apparent_temperature?.[i] ?? 0),
            humidity: json.hourly.relative_humidity_2m?.[i] ?? 0,
            precipitation: json.hourly.precipitation?.[i] ?? 0,
            weatherCode: json.hourly.weather_code?.[i] ?? 0,
            windSpeed: Math.round(json.hourly.wind_speed_10m?.[i] ?? 0)
        })).slice(0, hoursToReturn);

        const units = {
            temperature: json.hourly_units?.temperature_2m || "°C",
            feelsLike: json.hourly_units?.apparent_temperature || "°C",
            humidity: json.hourly_units?.relative_humidity_2m || "%",
            precipitation: json.hourly_units?.precipitation || "mm",
            weatherCode: json.hourly_units?.weather_code || "",
            windSpeed: json.hourly_units?.wind_speed_10m || "km/h"
        };

        return { data, units };
    } catch (error) {
        console.error("Hourly ma'lumot olishda xato:", error);
        return { data: [], units: {} };
    }
}