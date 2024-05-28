import React from 'react';
import {Link} from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import bgImg from '../images/bg-img.jpg'; // Assuming bg-img.png is in the same directory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function LandingPage() {
  return (
    <Container fluid style={{height: "100vh"}} >
      <Row style={{ height: "80vh" }} className="align-items-center mb-5">
        <Col md={6} className="mb-5 order-1">
          <div className="text-success ms-md-5 mb-5">
            <h1 className="fs-12 heavy-shadow mb-2">Go</h1>
            <h1 className="fs-9 fs-12 heavy-shadow mb-2">Online</h1>
            <h4 className="mb-5">"Where quality meets convenience."</h4>
            <Link to="/products" className="btn btn-warning btn-lg px-5 mb-5 fw-bolder">Shop Us<FontAwesomeIcon icon={faShoppingCart} className="ps-2" /></Link>
          </div>
        </Col>
        <Col md={6} order--2>
          <Image src={bgImg} fluid style={{ objectFit: 'cover', width: '100%', height: '100%' }} className="mt-5" />			
        </Col>
      </Row>	
    </Container>
  );
}
