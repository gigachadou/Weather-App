/**
 * Fetches city name suggestions from Open-Meteo Geocoding API
 * Useful for autocomplete / search dropdown
 *
 * @param {string} query - partial city name typed by user (e.g. "Ber", "Tash", "Lon")
 * @param {number} [maxResults=6] - how many suggestions to return
 * @param {string} [language="en"] - response language
 * @returns {Promise<Array<{name: string, country: string, lat: number, lon: number, display: string}>>}
 */
export default async function getCitySuggestions(query, maxResults = 6, language = "en") {
    if (!query || query.trim().length < 1) {
        return [];
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?` +
        `name=${encodeURIComponent(query.trim())}` +
        `&count=${maxResults}` +
        `&language=${language}` +
        `&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return [];
        }

        // Format results nicely for display
        return data.results.map(city => ({
            name: city.name,
            country: city.country || city.country_code || "—",
            lat: city.latitude,
            lon: city.longitude,
            // Nice display string for dropdown
            display: `${city.name}${city.admin1 ? `, ${city.admin1}` : ""}, ${city.country || city.country_code || "?"}`
        }));

    } catch (error) {
        console.error("City suggestions error:", error);
        return [];
    }
}

