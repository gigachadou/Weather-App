import { useEffect, useRef, useState } from "react";

const LEAFLET_CSS_ID = "leaflet-css-cdn";
const LEAFLET_SCRIPT_ID = "leaflet-js-cdn";

async function loadLeaflet() {
    if (window.L) return window.L;

    if (!document.getElementById(LEAFLET_CSS_ID)) {
        const link = document.createElement("link");
        link.id = LEAFLET_CSS_ID;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = LEAFLET_SCRIPT_ID;
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = () => resolve(window.L);
        script.onerror = () => reject(new Error("Failed to load Leaflet"));
        document.body.appendChild(script);
    });
}

export default function MapPicker({
    onLocationSelect,
    initialLat = 41.3111,
    initialLon = 69.2797,
    initialName = null,
    isLoading = false
}) {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function init() {
            try {
                const L = await loadLeaflet();
                if (!mounted || !mapContainerRef.current) return;

                const map = L.map(mapContainerRef.current, {
                    zoomControl: true
                }).setView([initialLat, initialLon], 11);

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 19
                }).addTo(map);

                if (initialLat && initialLon) {
                    markerRef.current = L.marker([initialLat, initialLon], {
                        draggable: false
                    }).addTo(map);

                    if (initialName) {
                        markerRef.current.bindPopup(initialName).openPopup();
                    }
                }

                map.on("click", async (e) => {
                    const { lat, lng } = e.latlng;

                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        markerRef.current = L.marker([lat, lng]).addTo(map);
                    }

                    onLocationSelect?.(lat, lng);
                });

                mapRef.current = map;

                setTimeout(() => map.invalidateSize(), 100);
            } catch (err) {
                setError("Xarita yuklanmadi. Internet aloqasini tekshiring.");
                console.error(err);
            }
        }

        init();

        return () => {
            mounted = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [initialLat, initialLon, initialName, onLocationSelect]);

    return (
        <div className="map-wrapper">
            <div ref={mapContainerRef} className="map-canvas" />
            {error && <div className="map-error">{error}</div>}
            {isLoading && <div className="map-loading">Loading...</div>}

            <style jsx>{`
                .map-wrapper {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .map-canvas {
                    width: 100%;
                    height: 100%;
                }
                .map-error, .map-loading {
                    position: absolute;
                    top: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    z-index: 1000;
                }
            `}</style>
        </div>
    );
};