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



// Setup
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

// Declaring all the routers
const loginRouter = require('./routes/login');
const eportfolioRouter = require('./routes/eportfolio');
const profileRouter = require('./routes/profile');
const templatesRouter = require('./routes/templates');
const registerRouter = require('./routes/register');

// Middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// Initialize routes
app.use('/eportfolio', eportfolioRouter);
app.use('/profile', profileRouter);
app.use('/templates', templatesRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);




// Error Handling
app.use(function(err,req,res,next){
  console.log(err);
  res.status(422).send({
    error: err.message})
});

// Default request, page not found
app.use((req, res) => {
  console.log(req.headers);
  res.statuseCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>Page not found :(</h1></body></html>');
});



const test_server = http.createServer(app);

test_server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
