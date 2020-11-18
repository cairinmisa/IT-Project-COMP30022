const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
var http = require('http');
require('./models/db.js');
const passport = require("passport");

// Setup express app
const hostname = 'localhost';
const port = 8000;
const app = express();



// Setup Middleware
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());
app.use(express.static('public'))

// Declaring all the routers
const eportfolioRouter = require('./routes/eportfolio');
const profileRouter = require('./routes/profile');
const templateRouter = require('./routes/template');
const uploadRouter = require('./routes/upload');

// Use Passport Middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// Initialize routes
app.use('/eportfolio', eportfolioRouter);
app.use('/profile', profileRouter);
app.use('/template', templateRouter);
app.use('/uploader', uploadRouter);




// Error Handling
app.use(function(err,req,res,next){
  console.log(err);
  res.status(422).send({
    error: err.message})
});

// Default request, page not found
app.use((req, res) => {
  console.log(req.headers);
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>Page not found :(</h1></body></html>');
});



const test_server = http.createServer(app);

test_server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
