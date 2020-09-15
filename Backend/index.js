const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
var http = require('http');

require('./models/db.js');

const hostname = 'localhost';
const port = 8000;
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Declaring all the routers
const loginRouter = require('./routes/login');
const landingRouter = require('./routes/landing');
const profileRouter = require('./routes/profile');
const templatesRouter = require('./routes/templates');
const registerRouter = require('./routes/register');

app.use('/', landingRouter);
app.use('/profile', profileRouter);
app.use('/templates', templatesRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

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
