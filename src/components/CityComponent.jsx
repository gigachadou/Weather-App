import { IoSunnyOutline } from "react-icons/io5";

export default function CityComponent({ data }) {
    return (
        <div className="cityComponent">
            <div className="mainInfo">
                <div className="mainInfo__text">
                    <h3>{data.region}, {data.country}</h3>
                    <h3>{data.time}</h3>
                </div>
                <div className="mainInfo__div">
                    <IoSunnyOutline color="orange"/>
                    <h2>{data.temperature}</h2>
                </div>
            </div>
            <div className="smallInfo-container">
                <div className="smallInfo__div">
                    <div className="smallInfo__label">Feels Like</div>
                    <div className="smallInfo__info">{data.feelsLike}</div>
                </div>
                <div className="smallInfo__div">
                    <div className="smallInfo__label">Humidity</div>
                    <div className="smallInfo__info">{data.humidity}</div>
                </div>
                <div className="smallInfo__div">
                    <div className="smallInfo__label">Wind</div>
                    <div className="smallInfo__info">{data.windSpeed}</div>
                </div>
                <div className="smallInfo__div">
                    <div className="smallInfo__label">Precipitation</div>
                    <div className="smallInfo__info">{data.precipitation}</div>
                </div>
            </div>
        </div>
    )
};
