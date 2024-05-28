import AdminView from '../components/AdminView';
import ProductList from '../components/ProductsList';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `${process.env.REACT_APP_API_URL}/products/active` ;
                if (user.isAdmin) {
                    url = `${process.env.REACT_APP_API_URL}/products/all`;
                }
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchData();
    }, [user.isAdmin]);

    return (
        <>
            {user.isAdmin ? <AdminView ProductsData={products} /> : <ProductList ProductsData={products} />}
        </>
    );
}
