
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config').config;

var app = module.exports = express.createServer();

// socket io
var io = require('socket.io');

// socket io setup
io = io.listen(app);

io.set('transports', [
  'websocket'
, 'flashsocket'
, 'htmlfile'
, 'xhr-polling'
, 'jsonp-polling'
]);


// configure express
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// remote control the presentation server code
routes.setupRemotePresenter(app, io, config);

app.listen(3050);
console.log("Express server listening on port %d in %s mode", 3050, app.settings.env);
