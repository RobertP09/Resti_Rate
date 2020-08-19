const db = require('../db/index')
const express = require('express')
const router = express.Router()

// Get all restaurants
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.post("/:id/addReview", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
    try {
        const results = await db.query("DELETE FROM restaurants WHERE id = $1", [req.params.id])

        res.status(204).json({
            status: "Success",
        })
    } catch (err) {
        console.error(err.message);
    }
})

module.exports = router