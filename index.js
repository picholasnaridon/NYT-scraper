var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('morgan');
var request = require('request'); 
var cheerio = require('cheerio'); 



// scraping tools
var cheerio = require("cheerio");
var request = require("request");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

// Show any Mongoose error

var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(express.static(process.cwd() + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

require("./routes/api-routes")(app);

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});


var PORT = process.env.PORT || 8080;

app.listen(PORT, function() {
     console.log("Mongoose news scraper alive and listening on Port "+ PORT);
});

