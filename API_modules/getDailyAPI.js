export default async function getDailyAPI({ latitude, longitude, timezone = "auto", temp_unit = "celsius", wind_speed_unit = "kmh", precipitation_unit = "mm" }) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${latitude}&` +
            `longitude=${longitude}&` +
            `temperature_unit=${temp_unit}&wind_speed_unit=${wind_speed_unit}&precipitation_unit=${precipitation_unit}&` +
            `daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum&` +
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
                date: date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                minTemp: Math.round(data.daily.temperature_2m_min[i]),
                weatherCode: data.daily.weather_code[i],
                maxApparent: Math.round(data.daily.apparent_temperature_max[i]),
                minApparent: Math.round(data.daily.apparent_temperature_min[i]),
                sunrise: (data.daily.sunrise[i]).split("T")[1],
                sunset: (data.daily.sunset[i]).split("T")[1],
                maxUV: data.daily.uv_index_max[i],
                windSpeed: data.daily.wind_speed_10m_max[i],
                windDirection: data.daily.wind_direction_10m_dominant[i],
                precipitationSum: data.daily.precipitation_sum[i],
                units: {
                    temp: data.daily_units.temperature_2m_max,
                    windSpeed: data.daily_units.wind_speed_10m_max,
                    precipitation: data.daily_units.precipitation_sum,
                }
            };
        });
    } catch (error) {
        console.error("Error at getting daily API:", error.message);
        return null;
    };
};

//daily_units
/*
apparent_temperature_max
: 
"°C"
apparent_temperature_min
: 
"°C"
sunrise
: 
"iso8601"
sunset
: 
"iso8601"
temperature_2m_max
: 
"°C"
temperature_2m_min
: 
"°C"
time
: 
"iso8601"
uv_index_max
: 
""
weather_code
: 
"wmo code"
wind_direction_10m_dominant
: 
"°"
wind_speed_10m_max
: 
"km/h" */