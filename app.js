// dotenv to hide my connection string
require('dotenv').config();
// this along with const app = express creates the app
// with the export at the bottom this is the bare bones:
// const express = require("express");
// const app = express();
// // …
// module.exports = app;
const express = require('express');

// import some useful node libraries
const createError = require('http-errors'); // Need to be top?
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// we require modiles from our routes directly
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//Import routes for "catalog" area of site
const catalogRouter = require("./routes/catalog");

const compression = require("compression");
const helmet = require("helmet");

// Create the Express application object
const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// .env connection string
const mongoDB = process.env.DB_CONN
// connection error handling report to console
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Set up rate limiter: maximum of twenty requests per minute
var RateLimit = require("express-rate-limit");
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add the middleware libraries we imported above
app.use(limiter);
app.use(helmet());
app.use(compression()); // Compress all routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// add previously imported route-handling code to request handling chain
app.use('/', indexRouter);
app.use('/users', usersRouter);
// Add catalog routes to middleware chain.
app.use("/catalog", catalogRouter);
// the last middleware adds handler methods for errors and HTTP 404 responses
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// everything is fully configured so we add it to module exports
// so it can be imported by /bin/www
module.exports = app;
