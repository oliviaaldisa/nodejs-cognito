const express = require('express');
const logger = require('morgan'); // HTTP request logger middleware
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers
const pe = require('parse-error'); // Parse error object in Node
const cors = require('cors'); // So other websites can make requests to this server

const v1 = require('./routes/v1');
const authUser = require('./routes/v1-auth');
const app = express();

const CONFIG = require('./config/config');
const port = CONFIG.port;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//Log Env
console.log("Environment:", CONFIG.app)
console.log("Port:", port)

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});

// CORS
app.use(cors());

app.use('/v1', v1);
app.use('/v1/auth', authUser);

app.use('/', function (req, res) {
    res.status(200).json({
        "status": 200,
        "message": "NodeJS API"
    })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});