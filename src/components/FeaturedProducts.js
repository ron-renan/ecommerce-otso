import { useState, useEffect } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import PreviewProducts from './PreviewProducts';

export default function FeaturedProducts(){

	const [previews, setPreviews] = useState([])

	useEffect(() => {
		fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/active')
		.then(res => res.json())
		.then(data => {
			console.log(data)

			const numbers = []
			const featured = []

			// This function generates a random number between 0 and the length of the data array (the fetched course data). It checks if the random number has already been added to the numbers array. If not, it adds the random number to the numbers array. If the random number already exists in the numbers array, it recursively calls itself to generate a new random number.

			const generateRandomNums = () => {
				let randomNum = Math.floor(Math.random() * data.products.length)

				if(numbers.indexOf(randomNum) === -1){
					numbers.push(randomNum)
				}else{
					generateRandomNums()
				}
			}

			for(let i = 0; i < 5; i++){
				generateRandomNums()

				featured.push(
					<PreviewProducts data={data.products[numbers[i]]} key={data.products[numbers[i]]._id} breakPoint={2} />
					)
			}

			setPreviews(featured)

		})
	}, [])

	return(
		<>
			<h2 className="text-center">Featured Products</h2>
			<div className="wrapper mt-3">
			<CardGroup className="justify-content-center "  >
			{previews}
			</CardGroup>
			</div>
		</>

	)
}