'use strict'
global.__base = __dirname + '/'
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const LOG_PATH = path.join(__dirname, '..', 'logs')
const {config}=require(`${__base}/utils/config`)
const appRouter=require(`${__base}/router`)
const app = express()
const PORT = process.env.port || config.port

app.enable('strict routing')
app.enable('case sensitive routing')
app.enable('trust proxy')
app.set('etag', 'strong')
app.use(morgan('dev'))


app.use(bodyParser())

app.use('/',appRouter)

app.use('/',function(req,res){
   res.send("Route doesn't exist")
})

app.listen(PORT, () => {
    console.log(`App started listening on port number ${PORT}`)
})