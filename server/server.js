require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const db = require('./db')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
    try {
        const restaurantRatingsData = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP by restaurant_id) reviews on restaurants.id = reviews.restaurant_id")

        res.status(200).json({
            status: "Success",
            results: restaurantRatingsData.rows.length,
            data: {
                restaurants: restaurantRatingsData.rows
            }
        })
    } catch (err) {
        console.error(err.message);
    }
})

// Get a single restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
    try {
        const restaurant = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP by restaurant_id) reviews on restaurants.id = reviews.restaurant_id WHERE id = $1", [req.params.id])

        const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [req.params.id])

        res.status(201).json({
            status: "Success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            },
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

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    const { name, review, rating } = req.body;

    try {
        const reviewQuery = await db.query("INSERT INTO reviews (restaurant_id, name, review, rating) values ($1,$2,$3,$4) RETURNING *",
            [req.params.id, name, review, rating])

        //console.log(reviewQuery);
        res.status(201).json({
            status: "Success",
            data: {
                review: reviewQuery.rows[0]
            }
        })
    } catch (err) {
        console.error(err);
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

        res.status(204).json({
            status: "Success",
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(PORT, () => {
    console.log(`Live @ http://localhost:${PORT}`);
})