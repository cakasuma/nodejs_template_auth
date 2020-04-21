// import
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const userRouter = require('./src/routes/user.route')
const port = process.env.PORT || 3000

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
// use db
require('./src/db/db')

app.use((req, res, next) => {
    console.log(`${new Date()} => ${req.originalUrl}`, req.body)
    next()
})
app.use(userRouter)

app.get('/', (req, res) => {
    res.json({"message": "Welcome to NODEJS REST API, TODO: make anything here"});
});

app.use((req, res, next) => {
    res.status(404).send('We think you are lost')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
