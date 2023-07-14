const dotEnv = require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
const AffiliateLoginRoute = require('./routers/affiliatelogin')



mongoose.connect(process.env.MONGO_DB_URI, {useNewUrlParser: true},{useUnifiedTopology: true})

mongoose.connection.on('connected', () => {
    console.log("MongoDB has been connected")
})

function logger(req, res, next) {
    console.log(`[${Date.now()}] ${req.method} ${req.url} `)
    next()
}

app.use(logger)
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/affiliate/login', AffiliateLoginRoute)

app.listen(process.env.SERVER_PORT, () => console.log(`App is now running at ${process.env.SERVER_PORT}!`))