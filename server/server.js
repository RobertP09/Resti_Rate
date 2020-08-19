require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/restaurants', require('./routes/restaurants'))

app.listen(PORT, () => {
    console.log(`Live @ http://localhost:${PORT}`);
})