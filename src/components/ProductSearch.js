import ProductCard from './ProductCard';
import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';

export default function ProductSearch({ onSearch }){
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Store all courses after fetching

    useEffect(() => {
        fetchAllProducts();
    }, []);

    useEffect(() => {
        handleSearchChange();
    }, [searchTerm, minPrice, maxPrice]);

    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products`);
            const data = await response.json();
            setAllProducts(data.products);
            setFilteredProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    
    const handleSearchChange = () => {
        const filtered = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                   (!minPrice || product.price >= parseFloat(minPrice)) &&
                   (!maxPrice || product.price <= parseFloat(maxPrice));
        });
        setFilteredProducts(filtered);
        onSearch(filtered.length > 0); // Call the onSearch prop to manage visibility
    };

    
    return (
        <Container>
            <h2>Product Search</h2>
            <Row>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Min Price:</Form.Label>
                        <Form.Control
                            type="number"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                            placeholder="Minimum price"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Max Price:</Form.Label>
                        <Form.Control
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            placeholder="Maximum price"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <h3>Search Results:</h3>
            <Row>
                {filteredProducts.map(product => (
                    <Col md={4} key={product._id}>
                        <ProductCard productProp={product} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

