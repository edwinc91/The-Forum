var express = require('express'),
    PORT    = process.env.PORT || 3001,
    server  = express();

server.get('/secret-test', function (req, res) {
  res.write("Welcome to this app");
  res.end();
});

server.listen(PORT, function () {
  console.log("Server is running on PORT: ", PORT);
});
