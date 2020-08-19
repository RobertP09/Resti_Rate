-- Create main restaurant table
CREATE TABLE restaurants (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    price_range int NOT NULL check(price_range >= 1 and price_range <= 5)
);

-- Create reviews table
CREATE TABLE reviews(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL check(rating >= 1 and rating <= 5)
);

-- Get average rating 
SELECT trunc(AVG(rating), 2) as avg_rating FROM reviews WHERE restaurant_id = 2;

-- Count ratings per restaurant
SELECT count(rating) WHERE restaurant_id = 2;

-- Group ratings for each restaurant
SELECT restaurant_id, count(restaurant_id) FROM reviews GROUP BY restaurant_id;

SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;
