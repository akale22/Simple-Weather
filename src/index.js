// Requiring application dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

// Configuring dotenv package
require("dotenv").config();

// Retrieving my Open Weather Map API key
const key = process.env.API_KEY;

// Setting up express and body-parser configurations
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Setting the view engine to ejs
app.set("view engine", "ejs");

// Setting up the default display when the app is launched
app.get("/", (req, res) => {
  res.render("welcome", { message: "Welcome to Simple Weather" });
});

// Displaying the data from the Open Weather Map API for the specified city
app.post("/", (req, res) => {
  // Obtaining the specified city from the request
  let city = req.body.city;

  // Creating the url with the specified city and the API key
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`;

  // Requesting the data and dealing with what has been returned
  request(url, (err, response, body) => {
    if (err) {
      res.render("error", { error: "Something went wrong. Please try again." });
    } else {
      let data = JSON.parse(body);

      if (data.main == null) {
        res.render("error", { error: "City not found. Please try again." });
      } else {
        let { temp } = data.main;
        let { description } = data.weather[0];
        let { feels_like } = data.main;
        let { humidity } = data.main;
        let { speed } = data.wind;
        let { name } = data;
        let { country } = data.sys;

        res.render("weather", {
          temp,
          description,
          feels_like,
          humidity,
          wind: speed,
          country,
          city: name,
        });
      }
    }
  });
});

// Specifying the port we want to listen on
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}!`);
});
