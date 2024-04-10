const express = require("express");
const bodyParser = require("body-parser");
const { getImdbScrape } = require("./controller/imdbScrape");

// Create an instance of the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define the port number
const port = 3000;

// Define a route for the '/imdbscrape' endpoint that calls the 'getImdbScrape' function
app.get("/imdbscrape", getImdbScrape);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
