import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import ProductList from '../components/ProductsList';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';

export default function Products() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = 'http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/active' ;
                if (user.isAdmin) {
                    url = 'http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/all';
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
