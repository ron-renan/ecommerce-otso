import { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Error from './Error';

export default function ProductView() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setProduct(data);
        } else if (response.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to fetch product');
        }
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div><Error message={error} /></div>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>{product.name}</Card.Title>
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{product.description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>PhP {product.price}</Card.Text>
              <Card.Subtitle>Active:</Card.Subtitle>
              <Card.Text>{product.isActive ? 'Yes' : 'No'}</Card.Text>
              <Link className="btn btn-danger btn-block" to="/login">
                Login to Buy
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}