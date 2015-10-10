var express         = require('express'),
    PORT            = process.env.PORT || 3001,
    server          = express(),
    MONGOURI        = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    dbname          = "some_useful_name",
    mongoose        = require('mongoose'),
    ejs             = require('ejs'),
    layouts         = require('express-ejs-layouts'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    session         = require('express-session');

server.get('/secret-test', function (req, res) {
  res.write("Welcome to this app");
  res.end();
});

mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
  console.log("Server is running on PORT: ", PORT);
});
