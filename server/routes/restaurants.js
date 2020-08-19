const express = require('express')
const router = express.Router()
const {
    getAllRestaurants,
    getSingleRestaurant,
    addReview,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant } = require('../controllers/restaurants')

// Get all restaurants
router.get("/", getAllRestaurants)

// Get a single restaurant
router.get("/:id", getSingleRestaurant)

// Add restaurant
router.post("/", addRestaurant)

// Add a review to single restaurant
router.post("/:id/addReview", addReview)

// Update restaurant
router.put("/:id", updateRestaurant)

// Delete restaurant
router.delete("/:id", deleteRestaurant)

module.exports = router