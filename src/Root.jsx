import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { UnitsContext } from "../context";

export default function Root() {
    const [units, setUnits] = useState({ absolute: "metric", temp: "celsius", windSpeed: "kmh", precipitation: "mm" });
    const [selectedCity, setSelectedCity] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const tryConnection = async () => {
            try {
                const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m");
                if (!res.ok) {
                    setError("Server is not responding, check your connection and try refreshing the page.");
                    return;
                };
                setError(null);
            } catch (err) {
                setError("Server is not responding, check your connection and try refreshing the page. " + err.message);
            };
        };

        tryConnection();
    }, []);

    return (
        <div className="root-inner">
            <Header units={units} setUnits={setUnits} />
            {!error ? (
                <UnitsContext value={units}>
                    <Outlet context={{ selectedCity, setSelectedCity }} />
                </UnitsContext>
            ) : (
                <div className="root-error-wrap">
                    <div className="root-error-card">
                        <h2>Service temporarily unavailable</h2>
                        <p>{error}</p>
                        <button
                            className="root-error-button"
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
