require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const db = require('./db')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM restaurants")

        res.status(200).json({
            status: "Success",
            results: results.rows.length,
            data: {
                restaurants: results.rows
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM restaurants WHERE id = $1", [req.params.id])

        res.status(201).json({
            status: "Success",
            data: {
                restaurant: results.rows[0]
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/api/v1/restaurants", async (req, res) => {
    try {
        const { name, location, price_range } = req.body;

        const results = await db.query("INSERT INTO restaurants(name, location, price_range) values($1, $2, $3) RETURNING * ", [name, location, price_range])

        res.status(201).json({
            status: "Success",
            data: {
                restaurant: results.rows[0]
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.put("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const { name, location, price_range } = req.body;

        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING * ",
            [name, location, price_range, req.params.id])

        res.status(201).json({
            status: "Success",
            data: {
                restaurant: results.rows[0]
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const results = await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id])

        res.status(201).json({
            status: "Success",
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(PORT, () => {
    console.log(`Live @ http://localhost:${PORT}`);
})