import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function ProductView() {
  const { user } = useContext(UserContext);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const addToCart = (productId) => {
    fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart/addToCart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        addedToCartProducts: [{ productId }],
        totalPrice: price
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 'Admin is forbidden') {
          Swal.fire({
            title: 'Admin add to cart error',
            icon: 'error',
            text: 'You are an administrator you may not add to cart.'
          });
        } else if (data.message === 'Successfully Added to Cart') {
          Swal.fire({
            title: 'Successfully added to cart',
            icon: 'success',
            text: 'You have successfully added this product to cart.'
          });
          navigate('/products');
        } else {
          Swal.fire({
            title: 'Something went wrong',
            icon: 'error',
            text: 'Please try again.'
          });
        }
      });
  };

  useEffect(() => {
    fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.product) {
          setName(data.product.name);
          setDescription(data.product.description);
          setPrice(data.product.price);
        } else {
          navigate('/404');
        }
      })
      .catch((err) => {
        console.error(err);
        navigate('/404');
      });
  }, [productId, navigate]);

  return (
    <Container className="mt-5">
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>{name}</Card.Title>
              <Card.Subtitle>Description:</Card.Subtitle>
              <Card.Text>{description}</Card.Text>
              <Card.Subtitle>Price:</Card.Subtitle>
              <Card.Text>PhP {price}</Card.Text>
              {user.id !== null ? (
                <Button variant="primary" block="true" onClick={() => addToCart(productId)}>
                  Add To Cart
                </Button>
              ) : (
                <Link className="btn btn-danger btn-block" to="/login">
                  Log in to Buy
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}