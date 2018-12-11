var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var tennisStyle = require("./model/tennisStyle");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/tennisRacquetdb"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/scrape", function (req, res) {

	axios.get("http://www.racquetfinder.com/?name=&manufacturer=&hsMin=&hsMax=&lMin=&lMax=&wMin=&wMax=&swMin=&swMax=&fMin=&fMax=&bpMin=&bpMax=&bwMin=&bwMax=&mains=&crosses=&max_price=&currentcheckbox=ASICS&current=Y").then(function (response) {

		// Load the body of the HTML into cheerio
		var $ = cheerio.load(response.data);

		// Empty array to save our scraped data
		var results = {};

		// With cheerio, find each h4-tag with the class "headline-link" and loop through the results
		$(".product").each(function (i, element) {

			var racInfo = $(element).children(".rac_info")

			var imageInfo = $(element).children(".image_wrap").children()


			// racket title
			results.title = racInfo.children(".rac_name").text()

			// image link
			results.image = imageInfo.children(".rac_img").attr("src");

			// Link
			results.link = imageInfo.attr("href")

			results.headSize = parseInt(racInfo.children(".rac_specs").find('tr.odd').first().find("td").text().slice(0, 3))

			results.racLength = parseFloat(racInfo.children(".rac_specs").find('tr.odd').first().siblings('tr').first().find("td").text().slice(0, 5))

			results.racBalance = racInfo.children(".rac_specs").find('tr.odd').first().siblings('tr').first().next().next().find("td").text()

			results.swingWeight = parseInt(racInfo.children(".rac_specs").find('tr.odd').first().siblings('tr').first().next().next().next().find("td").text())




			// Make an object with data we scraped for this h4 and push it to the results array
			console.log(results)

			tennisStyle.create(results).then(function (dbRacket) {
				console.log(dbRacket)
			})
				.catch(function (err) {
					console.log(err)
				})

		});


	})

	res.send('Scrap Complete')
})


// requesting all racquets

app.get("/racquets", function (req, res) {
	tennisStyle.find({})
		.then(function (dbTennis) {

			res.json(dbTennis)
		})
		.catch(function (err) {
			res.json(err)
		})
})

app.get('/racquets/:search', function (req, res) {
	tennisStyle.find({
		"$text": {
			"$search": req.params.search
		}
	})
		.then(function (tennisResults) {

			res.json(tennisResults)
			console.log(tennisResults)
		})
		.catch(function (err) {
			res.json(err)
			console.log(tennisResults)
		})
})

app.get('/sortracquets/:categories', function (req, res) {

	tennisStyle.find().sort({
		[req.params.categories]: 1
	})
		.then(function (tennisResults) {
			res.json(tennisResults)
		})
		.catch(function (err) {
			res.json(err)
		})

})



app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});