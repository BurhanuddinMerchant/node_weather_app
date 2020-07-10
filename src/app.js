const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000; //if the value is not provided by heroku ,we will use port 30000

//Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "MYAPPS",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "MYAPPS",
  });
});
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "MYAPPS",
    helpText: "Help Meeeeeeee!!!",
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(req.query.address, (error, { latitude, longitude, address } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(
      latitude,
      longitude,
      (error, { temperature, precipProb, summary, ozone, CloudCover } = {}) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          summary,
          temperature,
          precipProb,
          address,
          ozone,
          CloudCover,
        });
      }
    );
  });
});
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Error 404",
    name: "MYAPPS",
    error: "Help Article Not Found",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "Error 404",
    name: "MYAPPS",
    error: "404 Page Not Found Error",
  });
});
app.listen(port, () => {
  console.log("Server Is Up at port " + port);
});
