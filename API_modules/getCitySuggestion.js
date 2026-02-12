export default async function getCitySuggestions(query, maxResults = 6, language = "en") {
   const url = `https://geocoding-api.open-meteo.com/v1/search?` +
        `name=${encodeURIComponent(query)}` +
        `&count=${maxResults}` +
        `&language=${language}` +
        `&format=json`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Geocoding failed: ${res.status}`);
        }

        const data = await res.json();

        if (data.results.length === 0) {
            return [];
        }

        return data.results.map(city => ({
            name: city.name,
            country: city.country || city.country_code || "—",
            lat: city.latitude,
            lon: city.longitude,
            display: `${city.name}${city.admin1 ? `, ${city.admin1}` : ""}, ${city.country || city.country_code || "?"}`
        }));

    } catch (error) {
        console.error("City suggestions error:", error);
        return [];
    }
}

