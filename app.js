var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
const db = require('./models/base_models/index')

var app = express()

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    console.log('err: ', err)
    // render the error page
    res.status(err.status || 500).send({error: '404'})
})

module.exports = app
