import React, {useEffect, useState} from 'react';
import ProductCard from './ProductCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default function ProductsList({ProductsData}){

	const [filteredProducts, setFilteredProducts] = useState([]);
	const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]);

 	useEffect(() => {
			setFilteredProducts(ProductsData.products);
			setAllProducts(ProductsData.products);
	}, [ProductsData]);

	 useEffect(() => {

	 const handleSearchChange = () => {
        const filtered = allProducts.filter(product => {
            return product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                   (!minPrice || product.price >= parseFloat(minPrice)) &&
                   (!maxPrice || product.price <= parseFloat(maxPrice));
        });
        setFilteredProducts(filtered);
        //onSearch(filtered.length > 0); // Call the onSearch prop to manage visibility
    };
        handleSearchChange();
    },[searchTerm, minPrice, maxPrice]);

return (
	<Container >	 
		 <Row className="border border-bordered">
		 	<Col md={2} className="mt-3">
		 		<Row>
            	<h5 className="mt-5 text-success">Product Search</h5>
                <Col md={12}>
                    <Form.Group className="mt-5 text-success">
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
                        <Form.Label className="fw-bolder text-success">Min Price:</Form.Label>
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
                        <Form.Label className="fw-bolder text-success">Max Price:</Form.Label>
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
		 	<Col md={10} className="mt-3">
            <Row className="mt-5">
                {filteredProducts.map(product => (
                    <Col className="wrapper" key={product._id} >
                        <ProductCard productProp={product} />
                    </Col>
                ))}
            </Row>
  		    </Col>    
		</Row>   
    </Container>   
    );
}
