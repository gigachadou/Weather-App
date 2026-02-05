import { TiWeatherCloudy } from "react-icons/ti";
import "../styles/Header.css";

export default function Header() {
    return (
        <div className="header-container">
            <TiWeatherCloudy color="orange" size={50} />
            <h2>Weather App</h2>
        </div>
    );
};