import getWeatherIcon from "../../utils/getWeatherIcon"

export default function HourlyForecast({ data }) {
    return (
        <div className="hourly__container">
            <h5>Hourly forecast</h5>
            {data.data.map((e, i) => {
                return (
                    <div className="hourly__div" key={i}>
                        {getWeatherIcon(e.weatherCode, 36, "orange")}
                        <h5>{e.time?.split("T")[1]?.slice(0, 5) || "—"}</h5>
                        <h5>{e.temp + " " + data.units.temperature}</h5>
                    </div>
                )
            })}
        </div>
    )
};