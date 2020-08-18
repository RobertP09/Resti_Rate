import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RestaurantsContext } from '../context/RestaurantsContext'
import RestaurantFinder from '../apis/RestaurantFinder'

function RestaurantDetailPage() {
	const { id } = useParams()
	const { selectedRestaurant, setSelectedRestaurant } = useContext(
		RestaurantsContext
	)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await RestaurantFinder.get(`/${id}`)
				//console.log(response.data.data.restaurant)
				setSelectedRestaurant(response.data.data.restaurant)
			} catch (err) {
				console.log(err)
			}
		}

		fetchData()
	}, [])

	return <div>{selectedRestaurant && selectedRestaurant.name}</div>
}

export default RestaurantDetailPage
