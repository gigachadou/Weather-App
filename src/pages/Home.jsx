import { useEffect, useState } from "react";
import "../styles/Home.css";
import CityComponent from "../components/CityComponent";
import getCurrentAPI, { getDailyAPI } from "../../utils/getAPI";
import DailyForecast from "../components/DailyForecast";

export default function Home() {
    const [inputRegion, setInputRegion] = useState("");
    const [region, setRegion] = useState("Berlin");
    const [Data, setData] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const result1 = await getCurrentAPI("home");
            const result2 = await getDailyAPI();
            if (isMounted) setData([result1, result2]);
        }
        load();

        return () => {
            isMounted = false;
        };
    }, []);


    return (
        <div className="home-container">
            <div className="home__h1">
                <h1>How's the sky looking today?</h1>
            </div>
            <div className="home__search">
                <input type="text" value={inputRegion} onChange={(event) => setInputRegion(event.target.value)} />
            </div>
            <div className="home__inner">
                <div className="home__left">
                    {Data && <CityComponent data={Data[0]} />}
                    {Data && <DailyForecast data={Data[1]} />}
                </div>
                <div className="hourlyForecast-container">

                </div>
            </div>
        </div>
    )
};
