import React, {useState, useEffect} from "react";
import axios from 'axios';
import '../App.css'
import MapImg from '../images/Paris-Map-France.jpg'

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=f32367c7f3bb429d281943428e294e9e`
                );
                setWeatherData(response.data)
            } catch (error) {
                console.error('Error fetching weather data:', error)
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://api.openweathermap.org/data/2.5/forecast?q=Paris&appid=f32367c7f3bb429d281943428e294e9e'
                );
                setForecastData(response.data);
            } catch (error) {
                console.error('Error fetching weather forecast', error);
            }
        };
        fetchData()
    }, []);

    if (!weatherData || !forecastData) {
        return <div>Loading...</div>
    }

    const renderForecast = () => {
        const uniqueDays = new Set();

        return forecastData.list.map((item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!uniqueDays.has(date)) {
                uniqueDays.add(date);
                return (
                    <div key={item.dt}>
                        <p>Date: {date}</p>
                        <p>Temperature: {(item.main.temp - 273.15).toFixed(2)} °C</p>
                        <p>Description: {item.weather[0].description}</p>
                        <hr/>
                    </div>
                );
            }
            return null;
        });
    };


    const {name, main, weather} = weatherData;
    const temperatureCelsius = (main.temp - 273.15).toFixed(2);

    return (
        <div>
            <div className="container title-edit">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box-style">
                            <h2 className="title-edit">Map</h2>
                            <img src={MapImg} alt="Paris, France Map" className="map-edges" style={{width: '100%', height: 'auto'}}/>
                        </div>
                    </div>
                    <div className="col-md-6">


                        <div className="box-style">
                            <h2 className="title-edit">{name}</h2>
                            <p>Temperature: {temperatureCelsius} °C</p>
                            <p>Description: {weather[0].description}</p>
                            <p>Humidity: {main.humidity}%</p>
                            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                        </div>
                    </div>


                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="box-style">
                            <h2 className="title-edit">Weather Forecast</h2>
                            {renderForecast()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
export default Weather;