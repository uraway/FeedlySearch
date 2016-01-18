var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

/*
var routes = require('./routes/index');
var users = require('./routes/users');
*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use('/', routes);
app.use('/users', users);
*/

app.get('/', function(req, res) {
  res.render('index')
});

app.get('/searching', function(req, res) {
  var val = req.query.search;
  console.log(val);

  var url = "http://cloud.feedly.com/v3/search/feeds?query=" + val;

  console.log(url);

  request(url, function(err, response, body) {
    body = JSON.parse(body);
    var msg = [];

    if (!body) {
      msg.push('No results found. Try again.');
      console.log(body.results == []);
    } else {
      for (i in body.results) {
        var velocity = body.results[i].velocity;
        var website = body.results[i].website;
        var curated = body.results[i].curated;
        var subscribers = body.results[i].subscribers;
        var feedId = body.results[i].feedId;
        var featured = body.results[i].featured;
        var title = body.results[i].title;
        console.log(title);
        msg.push( "<table><tbody>" +
                  "<tr><td class='tag'> results:</td><td class='res'> No."  + i +           "<td></tr>" +
                  "<tr><td class='tag'> velocity:</td><td class='res'> " + velocity +       "</td></tr>" +
                  "<tr><td class='tag'> website:</td><td class='res'>" + website +         "</td></tr>" +
                  "<tr><td class='tag'> curated:</td><td class='res'> " + curated +         "</td></tr>" +
                  "<tr><td class='tag'> subscribers:</td><td class='res'> " + subscribers + "</td></tr>" +
                  "<tr><td class='tag'> feed id:</td><td class='res'> " + feedId +          "</td></tr>" +
                  "<tr><td class='tag'> featured:</td><td class='res'> " + featured +       "</td></tr>" +
                  "<tr><td class='tag'> title:</td><td class='res'> " + title +             "</td></tr>" +
                  "</tbody></table>"
                );
      }
    }
    res.send(msg);
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
