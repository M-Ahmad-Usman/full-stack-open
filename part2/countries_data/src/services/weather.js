import axios from 'axios'

const baseURL = 'https://api.openweathermap.org/data/2.5'
const baseIconURL = 'https://openweathermap.org/img/wn'

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API

const getCityWeather = (countryName) => {
    
    countryName = countryName.toLowerCase();

    return axios
        .get(`${baseURL}/weather?q=${countryName}&units=metric&appid=${apiKey}`)
        .then(res => res.data)
}

const getIconURL = (iconCode) => {
    return `${baseIconURL}/${iconCode}@2x.png`
}

export default { getCityWeather, getIconURL }