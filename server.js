require('dotenv').config()

//aws
const config = require('./config.json');

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const itemsRouter = require('./routes/item')
app.use('/items', itemsRouter)

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log("Server listening on port " + port))
