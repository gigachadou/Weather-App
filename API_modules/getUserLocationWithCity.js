export default async function getUserLocationWithCity() {
    if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser.");
    }

    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }),
            error => reject(error),
            { enableHighAccuracy: true }
        );
    });

    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${pos.lat}&longitude=${pos.lon}&count=1`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch location data.");
    }

    const geo = await res.json();

    const result = geo.results[0];

    return {
        name: result.name,
        lat: pos.lat,
        lon: pos.lon,
        country: result.country
    };
};

/**
 * name
 * lat
 * lon
 * country
 */
