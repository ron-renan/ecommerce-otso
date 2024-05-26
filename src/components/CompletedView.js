import React from 'react';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';

function CompletedView({ completedData }) {
    return (
        <Container>
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <Row className="mt-1 mb-8">
                        <Col md={2}></Col>
                        <Col md={8} className="border border-2 bg-light text-success rounded-3 mb-5">
                            <h4 className="text-center mt-4 mb-5">History Order</h4>
                            {completedData.length > 0 ? (
                                completedData.map(item => (
                                    <Row key={item.orderedOn} className="align-items-center my-2 border-bottom ms-3">
                                        <Col md={1} className="text-center"></Col>
                                        <Col md={10} className="mb-3">
                                            {item.productsOrdered.map((orderProduct, index) => (
                                                <div key={`${orderProduct._id}-${index}`} className="mb-3">
                                                    <h6>{orderProduct.productId.name}</h6>
                                                    <p className="d-inline">Quantity: {orderProduct.quantity}</p>
                                                    <p className="d-inline ms-5">Price: {orderProduct.subTotal}</p>
                                                </div>
                                            ))}
                                            <p className="fw-bolder">Total: {parseFloat(item.totalPrice).toLocaleString()} Php</p>
                                            <p className="fw-normal">Order date: {new Date(item.orderedOn).toLocaleString()}</p>
                                            <Button 
                                                variant={item.status.toLowerCase() === "cancelled" ? "danger" : "secondary"}
                                                disabled
                                            >
                                                {item.status}
                                            </Button>
                                        </Col>
                                        <Col md={1}></Col>
                                    </Row>
                                ))
                            ) : (
                            <h4 className="text-center text-danger">Pending order is empty.</h4>
                            )}
         
                        </Col>
                        <Col md={2}></Col>
                    </Row>
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    );
}

export default CompletedView;
