import axios from "axios";

export async function weatherTool(city: string) {
	try {
		const response = await axios.get(
			"https://api.openweathermap.org/data/2.5/weather",
			{
				params: {
					q: city,
					appid: process.env.OPENWEATHER_API_KEY,
					units: "metric"
				}
			}
		);

		const data = response.data;

		return `
Weather in ${city}

Temperature: ${data.main.temp}°C
Feels Like: ${data.main.feels_like}°C
Condition: ${data.weather[0].description}
Humidity: ${data.main.humidity}%
`;
	}
	catch (err) {
		console.error(err);
		return null;
	}
}