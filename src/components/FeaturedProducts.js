import { useState, useEffect } from 'react';
import { CardGroup, Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
            .then(res => res.json())
            .then(data => {
                const products = data.products;
                if (products.length === 0) return;

                const numbers = new Set();
                const featured = [];

                // Generate a unique set of random indices
                while (numbers.size < Math.min(5, products.length)) {
                    const randomNum = Math.floor(Math.random() * products.length);
                    numbers.add(randomNum);
                }

                // Create featured product cards using the random indices
                numbers.forEach(num => {
                    featured.push(
                        <ProductCard productProp={products[num]} key={products[num]._id} breakPoint={2} />
                    );
                });

                setPreviews(featured);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <>
            <h3 className="text-center mb-5 second">Featured Products</h3>
            <CardGroup className="justify-content-center">
                {previews}
            </CardGroup>
        </>
    );
}
