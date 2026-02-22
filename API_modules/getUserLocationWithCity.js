export default async function getUserLocationWithCity() {
    if (!navigator.geolocation) {
        throw new Error("Geolocation not supported");
    }

    const { lat, lon } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            err => reject(new Error("Location access denied or failed")),
            { enableHighAccuracy: true }
        )
    );

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "https://weather-app-98f.pages.dev (axmedovaasira@gmail.com)"
        }
    });

    if (!res.ok) {
        throw new Error("Geocoding service error");
    }

    const data = await res.json();

    if (!data?.address) {
        throw new Error("No location info found");
    }

    const address = data.address;

    const name =
        address.city ||
        address.town ||
        address.village ||
        address.state ||
        "Unknown";

    return {
        name,
        lat: Number(data.lat),
        lon: Number(data.lon),
        country: address.country || "Unknown"
    };
}