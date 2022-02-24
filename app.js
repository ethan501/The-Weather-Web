require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let initialMessage = "Welcome to The Weather Web";

app.get("/", function (req, res) {
    initialMessage = "Welcome to The Weather Web";
  res.render("home", { initialMessage: initialMessage });
});

app.post("/", function (req, res) {
  //console.log(req.body.cityName);

  const city = req.body.cityName;
  const apiKey = process.env.APIKEY;
  const units = "metric";
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=" +
    units +
    "&appid=" +
    apiKey;

  https.get(weatherUrl, function (response) {
   /*  console.log(response.statusCode); */

    if (response.statusCode === 200 || response.statusCode === 304) {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.render("weatherPage", {
          imageURL: imageURL,
          city: city,
          temp: temp,
          weatherDescription: weatherDescription,
        });
      });
    } else {
      initialMessage =
        "Sorry, no city with recorded weather has that name in our database. Try Again";
      res.render("home", { initialMessage: initialMessage });
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
