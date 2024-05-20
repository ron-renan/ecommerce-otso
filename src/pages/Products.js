import { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import UserView from '../components/UserView';


export default function Products() {

		const { user } = useContext(UserContext);

		const [products, setProducts] = useState([]);

		useEffect(() => {
			fetch(`${ process.env.REACT_APP_API_URL}/products/active`)
			.then(res => res.json())
			.then(data => {
				console.log(data);

				setProducts(data.products)

			})
		}, []);



	return(
		<>

                <UserView productsData={products} />
           
		</>
		)
}
