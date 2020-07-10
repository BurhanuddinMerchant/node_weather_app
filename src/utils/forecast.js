const request = require("request");

const forecast = (lon, lat, callback) => {
  const url =
    "https://api.darksky.net/forecast/4bd6f6f76cd13d53c85e0d7a84af8f3d/" +
    encodeURIComponent(lon) +
    "," +
    encodeURIComponent(lat) +
    "?units=si";
  request({ url: url, json: true }, (error, { body }) => {
    if (error) {
      callback(" Weather service unavailable!! ", undefined);
    } else if (body.error) {
      callback(" Unable to find location!! ", undefined);
    } else {
      console.log(body.daily.data[0]);
      callback(undefined, {
        temperature: body.currently.temperature,
        precipProb: body.currently.precipProbability,
        summary: body.currently.summary,
        ozone: body.daily.data[0].ozone,
        CloudCover: body.daily.data[0].cloudCover,
      });
    }
  });
};

module.exports = forecast;
