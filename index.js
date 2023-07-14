const dotEnv = require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()


mongoose.connect(process.env.MONGO_DB_URI, {useNewUrlParser: true},{useUnifiedTopology: true})

mongoose.connection.on('connected', () => {
    console.log("MongoDB has been connected")
})

function logger(req, res, next) {
    console.log(`[${Date.now()}] ${req.method} ${req.url} `)
    next()
}

app.use(logger)
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(process.env.PORT, () => console.log("App is now running!"))