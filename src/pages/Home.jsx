import { useEffect, useState } from "react";
import "../styles/Home.css";
import CityComponent from "../components/CityComponent";
import getAPI from "../../utils/getAPI";

export default function Home() {
    const [inputRegion, setInputRegion] = useState("");
    const [region, setRegion] = useState("Berlin");
    const [Data, setData] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const result = await getAPI("home");
            if (isMounted) setData(result);
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
                {Data && <CityComponent data={Data} />}
                <div className="hourlyForecast-container">

                </div>
            </div>
        </div>
    )
};
