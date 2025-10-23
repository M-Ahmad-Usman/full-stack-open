
// React
import { useState, useEffect } from 'react'
// Services
import weatherService from "../services/weather"

const Country = props => {

	const { country } = props
	
	const [ weatherData, setWeatherData ] = useState({})

	useEffect(() => {

		weatherService
			.getCityWeather(country.capital[0])
			.then(data => {
				
				const newWeatherData = {
					temperature: data.main.temp,
					iconURL: weatherService.getIconURL(data.weather[0].icon),
					wind: data.wind.speed
				}
				setWeatherData(newWeatherData)
				
			}).catch(error => console.log(error))
	}, [])

	return (
		<>
			<h1>{country.name.common}</h1>

			<p>Capital: {country.capital}</p>
			<p>Area: {country.area}</p>

			<h2>Languages</h2>
			<ul>
				{Object.entries(country.languages)
					.map(([key, value]) => <li key={key}>{value}</li>)}
			</ul>

			<img src={country.flags.png} alt={country.flags.alt} />

			<h2>Weather in {country.capital}</h2>
			<p>Temperature: {weatherData.temperature} Celcius</p>
			<img src={weatherData.iconURL} alt="" />
			<p>Wind: {weatherData.wind} m/s</p>
		</>
	)
}

export default Country
