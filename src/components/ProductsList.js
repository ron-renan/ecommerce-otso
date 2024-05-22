import React, {useEffect, useState} from 'react';
import ProductCard from './ProductCard';
import {Container, Form, Row, Col} from 'react-bootstrap'

export default  function ProductsList({ProductsData}){

	const [filteredProducts, setFilteredProducts] = useState([]);
	const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts] = useState([]);

 	useEffect(() => {
			setFilteredProducts(ProductsData.products);
			// setAllProducts(ProductsData.products);
	}, [ProductsData]);

	 useEffect(() => {

	 const handleSearchChange = () => {
        const filtered = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                   (!minPrice || product.price >= parseFloat(minPrice)) &&
                   (!maxPrice || product.price <= parseFloat(maxPrice));
        });
        setFilteredProducts(filtered);
        // onSearch(filtered.length > 0); // Call the onSearch prop to manage visibility
    };
        handleSearchChange();
    },[searchTerm, minPrice, maxPrice]);

	return (
		 <Container>
		 <Row className="border border-bordered">
		 	<Col md={2}>
		 		<Row>
            	<h3 className="mt-5">Product Search</h3>
                <Col md={12}>
                    <Form.Group className="mt-5">
                        <Form.Label className="fw-bolder" >Product Name:</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group className="mt-5">
                        <Form.Label className="fw-bolder">Min Price:</Form.Label>
                        <Form.Control
                            type="number"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                            placeholder="Minimum price"
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group className="mt-5">
                        <Form.Label className="fw-bolder">Max Price:</Form.Label>
                        <Form.Control
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            placeholder="Maximum price"
                        />
                    </Form.Group>
                </Col>
            </Row>
		 	</Col>
		 	<Col md={10}>
            <h3 className="mt-5">Search Results:</h3>
            <Row>
                {filteredProducts.map(product => (
                    <Col md={4} key={product._id} className="mt-2">
                        <ProductCard productProp={product} />
                    </Col>
                ))}
            </Row>
  		</Col>
		</Row>   
        </Container>
    );
}
