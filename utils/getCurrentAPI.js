export default async function getCurrentAPI({ latitude, longitude, cityName = "Unknown" }) {
    // Safety check - prevent invalid requests
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        console.warn("getCurrentAPI: Invalid latitude/longitude", { latitude, longitude });
        return null;
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,is_day&` +
            `timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Current weather fetch failed:", response.status, errorText);
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        return {
            region: cityName,
            country: "", // can be filled later from geocoding if needed
            time: data.current.time,
            temperature: Math.round(data.current.temperature_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            feelsLike: Math.round(data.current.apparent_temperature),
            precipitation: data.current.precipitation || 0,
            humidity: data.current.relative_humidity_2m,
            isDay: data.current.is_day === 1,
            // Optional: keep units if you want to show them
            units: {
                temperature: data.current_units?.temperature_2m || "°C",
                windSpeed: data.current_units?.wind_speed_10m || "km/h",
                feelsLike: data.current_units?.apparent_temperature || "°C",
                precipitation: data.current_units?.precipitation || "mm",
                humidity: data.current_units?.relative_humidity_2m || "%"
            }
        };
    } catch (error) {
        console.error("Error in getCurrentAPI:", error);
        return null;
    }
}