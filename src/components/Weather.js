import React, {useState, useEffect} from "react";
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css'

const Weather = () => {
    const[city, setCity] = useState("Paris")
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]); // Default center for Cairo


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f32367c7f3bb429d281943428e294e9e`
                );
                setWeatherData(response.data)
            } catch (error) {
                console.error('Error fetching weather data:', error)
            }
        };
        fetchData();
    }, [city]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f32367c7f3bb429d281943428e294e9e`
                );
                setForecastData(response.data);
            } catch (error) {
                console.error('Error fetching weather forecast', error);
            }
        };
        fetchData()
    }, [city]);

    useEffect(() => {
        if (weatherData && weatherData.coord) {
            const { lat, lon } = weatherData.coord;
            setMapCenter([lat, lon]);
        }
    }, [weatherData]);


    if (!weatherData || !forecastData) {
        return <div>Loading...</div>
    }

    const handleCityChange = (e) => {
        setCity(e.target.value)
    };

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
                    <input className="search-edit" type="text" placeholder="Enter city name" value={city} onChange={handleCityChange}/>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="box-style">
                            <h2 className="title-edit">{name}</h2>
                            <p>Temperature: {temperatureCelsius} °C</p>
                            <p>Description: {weather[0].description}</p>
                            <p>Humidity: {main.humidity}%</p>
                            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <MapContainer center={mapCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={mapCenter}>
                                <Popup>{city}</Popup>
                            </Marker>
                        </MapContainer>
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