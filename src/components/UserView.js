import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';

export default function UserView({ productsData }) {
    const [products, setProducts] = useState([]);
    const [searchActive, setSearchActive] = useState(false);  // State to manage visibility based on search

    useEffect(() => {
        if (productsData && productsData.length > 0) {
            const productsArr = productsData.map(product => {
                return product.isActive ? <ProductCard productProp={product} key={product._id} /> : null;
            });
            setProducts(productsArr);
        }
    }, [productsData]);

    return (
        <>
            <ProductSearch onSearch={setSearchActive} />
            {searchActive && <div>{products}</div>}
        </>
    );
}