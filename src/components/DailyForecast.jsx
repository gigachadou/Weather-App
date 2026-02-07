import getWeatherIcon from "../../utils/getWeatherIcon";

export default function DailyForecast({ data }) {
    return (
        <div className="daily-container">
            <div className="daily__label">
                <h4>Daily forecast</h4>
            </div>

            <div className="daily__inner">
                {data.map(day => {
                    return (
                        <div className="daily__div" key={day.day}>
                            <h5>{day.day}</h5>
                            {getWeatherIcon(day.weatherCode, 36, "orange")}
                            <div className="daily__div-inner">
                                <h5 className="max-temp">{day.maxTemp}°</h5>
                                <h5 className="min-temp">{day.minTemp}°</h5>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

