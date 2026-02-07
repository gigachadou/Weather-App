/**
 * Creates parameters for fetching weather data from Open-Meteo
 * Returns ready-to-use URL or object with all needed fields
 *
 * @param {number} latitude - city's latitude
 * @param {number} longitude - city's longitude
 * @param {string} [timezone="auto"] - timezone to align daily data
 * @returns {Object} - object with url, params description, and direct fetch-ready URL
 */
export default function getParamsForAPI(latitude, longitude, timezone = "auto") {
    // Core fields we want
    const current = [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "wind_speed_10m",
        "weather_code",
        "is_day"
    ].join(",");

    const daily = [
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "precipitation_sum",
        "weather_code",
        "precipitation_probability_max"
    ].join(",");

    const params = {
        latitude,
        longitude,
        current,
        daily,
        timezone,
        // You can add more if needed: hourly, winddirection_10m, etc.
    };

    // Build full URL
    const searchParams = new URLSearchParams(params);
    const url = `https://api.open-meteo.com/v1/forecast?${searchParams.toString()}`;

    return {
        url,                        // ready to use with fetch(url)
        latitude,
        longitude,
        timezone,
        currentFields: current.split(","),
        dailyFields: daily.split(","),
        description: "Current + daily 7-day forecast with feels-like, rain, weather codes"
    };
}
