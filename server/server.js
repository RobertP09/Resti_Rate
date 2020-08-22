require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan("common", { stream: accessLogStream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("../", "client", "build", "index.html"))
    })
}

app.use('/v1/restaurants', require('./routes/restaurants'))

app.listen(PORT, () => {
    console.log(`Live @ http://localhost:${PORT}`);
})