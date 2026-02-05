import { TiWeatherSunny } from "react-icons/ti";

export default function CityInfo() {
    return (
        <div className="cityInfo-container">
            <h1>Berlin</h1>
            <h2><TiWeatherSunny color="orange" size={35}/> Sunny, mild temperature</h2>
        </div>
    );
};