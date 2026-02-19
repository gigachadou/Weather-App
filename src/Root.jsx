import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useState } from "react";
import { UnitsContext } from "../context";

export default function Root() {
    const [units, setUnits] = useState({ temp: "celsius", windSpeed: "kmh", precipitation: "mm" });

    return (
        <div className="root-inner">
            <Header units={units} setUnits={setUnits} />
            <UnitsContext value={units}>
                <Outlet />
            </UnitsContext>
        </div>
    );
};