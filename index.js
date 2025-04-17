import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;
const baseURL = "http://api.openweathermap.org/geo/1.0/";
const ApiKey = process.env.WEATHER_API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    content: "Weather will be updated here.",
    icon: "",
  });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
  });
  

  app.post("/submit", async (req, res) => {
    const city = req.body.cityname;
  
    try {
      // Fetching geocoding data
      const geoResponse = await axios.get(`${baseURL}direct?q=${city}&appid=${ApiKey}`);
  
      // Checking if any cities were returned
      if (geoResponse.data.length === 0) {
        throw new Error("No matching city found.");
      }
  
      // Getting the first suggestion from OpenWeatherMap's response
      const { lat, lon, name, state, country } = geoResponse.data[0];
  
      // Fetching weather data for the first city match
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`
      );
  
      const weather = weatherResponse.data;
      console.log(weather);
      
      const weatherData = {
        city: name,
        state: state || "N/A",
        country: country,
        temp: weather.main.temp,
        description: weather.weather[0].description,
        humidity: weather.main.humidity,
        wind: weather.wind.speed,
        rain: weather.rain ? "Yes" : "No"
      };
  
      res.render("index.ejs", {
        content: "",
        icon: weather.weather[0].icon,
        weatherData: weatherData
      });
  
    } catch (error) {
      res.render("index.ejs", {
        content: `No data found or invalid city name. Please check your input. Error: ${error.message}`,
        icon: "",
      });
    }
  });
  
  
  

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
