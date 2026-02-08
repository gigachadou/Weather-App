/**
 * 
 * @returns {{name: String, lat: number, lon: number, country: string}}
 */

export default async function getUserLocationWithCity() {
    try {
        // Get coordinates first
        const pos = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => resolve({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                }),
                err => reject(err),
                { enableHighAccuracy: true }
            );
        });

        // Get city & country from coordinates
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?` +
            `latitude=${pos.lat}&longitude=${pos.lon}&count=1`;

        const res = await fetch(url);
        const geo = await res.json();

        let cityName = "Current location";
        let countryName = "";

        if (geo.results?.[0]) {
            cityName = geo.results[0].name;
            countryName = geo.results[0].country || geo.results[0].country_code || "";
        }

        return {
            name: cityName,
            lat: pos.lat,
            lon: pos.lon,
            country: countryName
        };
    } catch (err) {
        console.error("Location error:", err);
        return {
            name: "Unknown",
            lat: null,
            lon: null,
            country: ""
        };
    }
}