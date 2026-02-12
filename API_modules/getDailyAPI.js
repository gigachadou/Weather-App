export default async function getDailyAPI({ latitude, longitude, timezone = "auto" }) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `daily=temperature_2m_max,temperature_2m_min,weather_code&` +
            `timezone=${timezone}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        console.log(data);

        return data.daily.time.map((time, i) => {
            const date = new Date(time);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            return {
                day: dayName,
                maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                minTemp: Math.round(data.daily.temperature_2m_min[i]),
                weatherCode: data.daily.weather_code[i]
            };
        });
    } catch (error) {
        console.error("Error at getting daily API:", error.message);
        return null;
    };
};