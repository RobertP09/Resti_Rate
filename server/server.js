require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 4000


app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {

    const results = await db.query("SELECT * FROM restaurants")
    console.log(results);
    res.status(200).json({
        status: "Success",
        data: {
            restaurant: ["mcdonalds", "Wendys"]
        }
    })
})

app.get("/api/v1/restaurants/:id", (req, res) => {
    console.log("Single");
})

app.post("/api/v1/restaurants/", (req, res) => {
    console.log("Added");
})

app.put("/api/v1/restaurants/:id", (req, res) => {
    console.log("Updated");
})

app.delete("/api/v1/restaurants/:id", (req, res) => {
    console.log("Deleted");
})

app.listen(PORT, () => {
    console.log(`Live @ http://localhost:${PORT}`);
})