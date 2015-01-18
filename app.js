var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var client = require('twilio')('', '');
var http = require("http");

var routes = require('./routes/index');
//var addfile = require('./routes/addfile');

var app = express();
var the_port = process.env.PORT || 4000;
app.listen(the_port);

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/mobiledata';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mongoose.connect('mongodb://127.0.0.1/mobiledata');

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var connection = mongoose.connection;
mongoose.model('list', {phone: String, pkey: String}, 'pkeys');

app.get('/register', function (req, res) {

    doc = {phone: req.query.phone, pkey: req.query.pkey};
    connection.collection('pkeys').remove({phone: req.query.phone}, function (err) {

    });
    connection.collection('pkeys').insert(doc, function (err){

    });
    res.send({0: "Success"});
});

app.get("/getkey", function (req, res) {
    mongoose.model('list').find({phone: req.query.phone}, function(err, results){
        res.send(results[0].pkey);
    });
});

app.use('/', routes);

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

//TWILIO

// Create a function to handle our incoming SMS requests (POST request)
app.post('/incoming', function(req, res) {
  // Extract the From and Body values from the POST data
  var from = req.body.From;
  
  // Return sender a very nice message
  // twiML to be executed when SMS is received
  var twiml = '<Response><Sms>5555</Sms></Response>';
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


