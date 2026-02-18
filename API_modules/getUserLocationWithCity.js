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

    const data = await res.json();

    return {
        name: data.results[0].name,
        lat: data.results[0].lat,
        lon: data.results[0].lon,
        country: data.results[0].country
    };
};

/**
 * name
 * lat
 * lon
 * country
 */
