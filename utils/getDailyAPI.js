export default async function getDailyAPI({ latitude, longitude }) {
    // Safety check
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        console.warn("getDailyAPI: Invalid latitude/longitude", { latitude, longitude });
        return [];
    }

    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `daily=temperature_2m_max,temperature_2m_min,weather_code&` +
            `timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Daily forecast fetch failed:", response.status, errorText);
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.daily?.time) {
            console.warn("No daily forecast data received");
            return [];
        }

        const result = [];

        for (let i = 0; i < data.daily.time.length; i++) {
            const dateStr = data.daily.time[i];
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            result.push({
                day: dayName,
                maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                minTemp: Math.round(data.daily.temperature_2m_min[i]),
                weatherCode: data.daily.weather_code[i]
            });
        }

        return result;
    } catch (error) {
        console.error("Error in getDailyAPI:", error);
        return [];
    }
}