import React, { useEffect, useRef, useState } from 'react';
import './WeatherApp.css';
import logo from '../images/logo2.png'
import dummy from '../images/dummy.png'
import axios from 'axios';

const WeatherApp = () => {
    const refInput = useRef();
    const [location, setLocation] = useState();
    const [city, setCity] = useState();
    const [weatherData, setWeatherData] = useState({});

    //For Rendering Initial Data depending upon user location
    useEffect(() => {
        const getInitialData = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            else {
                console.log("Geolocation not supported");
            }
            function success(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation({ latitude, longitude });
                const cityurl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location?.latitude}&longitude=${location?.longitude}&localityLanguage=en`;

                axios.get(cityurl).then((response) => {
                    setCity(response?.data?.city);
                })

                const apiKey = '4f6dd4f854c1453d626a1e2aa58739d3';
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&units=Metric&appid=${apiKey}`;
                axios.get(apiUrl).then((response) => {
                    setWeatherData({
                        name: city,
                        temp: Math.round(response?.data?.main?.temp),
                        icon: dummy,
                        htemp: Math.round(response?.data?.main?.temp_max),
                        ltemp: Math.round(response?.data?.main?.temp_min),
                        desc: ((response?.data?.weather?.[0]?.description)),
                        feels: Math.round(response?.data?.main?.feels_like),
                        humidity: response?.data?.main?.humidity,
                        windspeed: response?.data?.wind?.speed,
                        winddegree: response?.data?.wind?.deg});
                })
            }
            function error() {
                console.log("Unable to retrieve your location");
            }
        }
        getInitialData();
    }, [city])

    //Changes rendering based on user inputting a city name
    const handleSearchWeather = (e) => {
        const location = refInput.current.value;
        const apiKey = '4f6dd4f854c1453d626a1e2aa58739d3';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?&q=${location}&units=Metric&appid=${apiKey}`;
        axios.get(apiUrl).then((response) => {
            const values = response?.data;
            setWeatherData({
                name: location,
                temp: Math.round(values?.main?.temp),
                icon: `https://openweathermap.org/img/wn/${values?.weather?.[0]?.icon}@2x.png`,
                htemp: Math.round(values?.main?.temp_max),
                ltemp: Math.round(values?.main?.temp_min),
                desc: ((values?.weather?.[0]?.description).charAt(0).toUpperCase() + (values?.weather?.[0]?.description).slice(1)),
                feels: Math.round(values?.main?.feels_like),
                humidity: values?.main?.humidity,
                windspeed: values?.wind?.speed,
                winddegree: values?.wind?.deg
            });
        })
            .catch((error) => {
                console.error("Error fetching weather data", error);
            });
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className='col-12 d-flex justify-content-center'>
                        <img className="logoimage" src={logo} alt="twclogo" />
                    </div>
                </div>

                <div className="row d-flex justify-content-center">
                    <div className='col-6 d-flex justify-content-center'>
                        <input ref={refInput} className="form-control" type="search" placeholder="Search City" aria-label="Search" 
                        onKeyDown={(e) => (!!(e.target.value) && (e.key === 'Enter'))? handleSearchWeather(e): null} />
                        <button className="btn btn-light" onClick={handleSearchWeather}>Search</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p className='cityname'>{weatherData?.name}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <img src={weatherData?.icon} className="icon" alt="icons" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p className='temp'>{weatherData?.temp}&deg;</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p className='desc'>{weatherData?.desc}</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center d-flex justify-content-center">
                        <p className='htemp'>Highest: {weatherData?.htemp}&deg;</p>
                        <p className='ltemp'>Lowest: {weatherData?.ltemp}&deg;</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p className='feels'>Feels like: {weatherData?.feels}&deg;</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p className='feels'>Humidity: {weatherData?.humidity}%</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p className='wind'>Wind: {weatherData?.windspeed} km/hr and {weatherData?.winddegree}&deg;</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default WeatherApp;