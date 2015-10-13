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
  title: { type: String, //required: true
  },
  author: { type: String, //required: true
  },
  date: Date,
  body: { type: String, //required: true
  },
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

server.use(session({
  secret: "thisismysecretysecret",
  resave: true,
  saveUninitialized: true
}));

server.use(express.static('./public'));
server.use(expressLayouts);
server.use(methodOverride('_method'));

server.use(bodyParser.urlencoded({ extended: true }));

server.use(function (req, res, next) {
  console.log("REQ DOT BODY", req.body);
  console.log("REQ DOT SESSION", req.session);

  next();
});

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

server.patch('/threads/:id', function (req, res) {
  var threadOptions = req.body.thread;
  console.log(threadOptions)

  threadOptions.comments = threadOptions.comments.toString();

  Thread.findByIdAndUpdate(req.params.id, threadOptions, function (err, threadWithComment) {
    if (err) {
      console.log(err)
    } else {
      res.redirect(302, "/threads/" + threadWithComment._id);
    }
  });
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

server.post('/', function (req, res) {
  console.log(req.body.thread)
  var threadOptions = req.body.thread;
  var newThread = new Thread(threadOptions);
  newThread.save(function (err, threadInputtedIn) {
    if (err) {
      console.log(err)
    } else {
      res.redirect(302, "/");
    }
  });
});
