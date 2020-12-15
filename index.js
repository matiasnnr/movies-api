const express = require('express')

const app = express()

const {config} = require('./config/index')
const moviesApi = require('./routes/movies')

const { logErrors, errorHandler, wrapError } = require('./utils/middleware/errorHandlers')
const notFoundHandler = require('./utils/middleware/notFoundHandler');

// middlware body parser
app.use(express.json()); // permite a nuestra ruta interpretar datos de formato json

// routes
moviesApi(app)

// Catch error 404
app.use(notFoundHandler)

// Errors middlewares
app.use(logErrors)
app.use(wrapError)
app.use(errorHandler)

app.listen(config.port, function() {
    console.log(`Listening http://localhost:${config.port}`);
})