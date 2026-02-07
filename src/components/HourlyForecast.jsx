import getWeatherIcon from "../../utils/getWeatherIcon"

export default function HourlyForecast({ data }) {
    function detectNight(time) {
        if (time == "-") return false;
        const hour = Number(time.slice(0, 2))
        return (hour > 20 || hour < 7)
    };
    return (
        <div className="hourly__container">
            <h5>Hourly forecast</h5>
            {data.data.map((e, i) => {
                const time = e.time?.split("T")[1]?.slice(0, 5) || "—"
                return (
                    <div className="hourly__div" key={i}>
                        {getWeatherIcon(e.weatherCode, 36, "orange", detectNight(time))}
                        <h5>{time}</h5>
                        <h5>{e.temp + " " + data.units.temperature}</h5>
                    </div>
                )
            })}
        </div>
    )
};