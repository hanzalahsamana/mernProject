const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const app = express();

dotenv.config({ path: './config.env' })
require('./db/conn')
// const User = require('./model/userSchema');
app.use(express.json());
app.use(require('./router/auth'))

const PORT = process.env.PORT;

// Middleware
const middleware = (req, res, next) => {
    next();
}

app.get('/', (req, res) => {
    res.send('Hello world from the server')
})

app.get('/about', middleware, (req, res) => {
    res.send('Hello about world from the server')
})

app.get('/contact', (req, res) => {
    res.send('Hello contact world from the server')
})

app.get('/signin', (req, res) => {
    res.send('Hello signin world from the server')
})

app.get('/signup', (req, res) => {
    res.send('Hello signup world from the server')
})

app.listen(PORT, () => {
    console.log(`Server is running at port no ${PORT}`)
})