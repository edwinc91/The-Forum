var express         = require('express'),
    PORT            = process.env.PORT || 3001,
    server          = express(),
    MONGOURI        = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    dbname          = "some_useful_name",
    mongoose        = require('mongoose'),
    Schema          = mongoose.Schema,
    ejs             = require('ejs'),
    expressLayouts  = require('express-ejs-layouts'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    session         = require('express-session');

var threadSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: Date,
  body: { type: String, required: true },
  comments: [{ author: String, body: String, date: Date }]
}, {collection: 'forum_thread_list', strict: true});

var Thread = mongoose.model(null, threadSchema);

server.get('/secret-test', function (req, res) {
  res.write("Welcome to this app");
  res.end();
});

mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
  console.log("Server is running on PORT: ", PORT);
});

server.set('views', './views');
server.set('view engine', 'ejs');

server.use(express.static('./public'));
server.use(expressLayouts);
server.use(methodOverride('_method'));

server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', function (req, res) {
  Thread.find({}, function (err, allThreads) {
    if (err) {
      console.log(err)
    } else {
      res.render('homepage', {
      threads: allThreads
      });
    }
  });
});

server.get('/threads/new', function (req, res) {
  res.render('newthread');
});

server.get('/threads/:id', function (req, res) {
  Thread.findById(req.params.id, function (err, aSpecificThread) {
    if (err) {
      console.log(err)
    } else {
      res.render('showthread', {
        thread: aSpecificThread
      });
    }
  });
});
