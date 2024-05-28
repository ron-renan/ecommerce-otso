import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';


export default function PendingOrder({pendingData}){
	const { user, cartCount } = useContext(UserContext);
	const [orderData, setOrderData] = useState([]);
	
	const cancelOrder = async (orderId, status) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/order/updateOrderStatus`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    orderId: orderId,
                    status: status
                })
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire({
                    title: "Unable to Cancel Order",
                    icon: 'error'
                });
                throw new Error('Failed to update status');
            } else {
                Swal.fire({
                    title: "Order Cancelled",
                    icon: 'success',
                    text: "Your order has been cancelled"
                });

                // Refresh order data after cancelling
                setOrderData((prevData) =>
                    prevData.map((order) =>
                        order._id === orderId ? { ...order, status: status } : order
                    )
                );
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            Swal.fire({
                title: "Something went wrong",
                icon: 'error',
            });
        }
    };
	return (
		<Container className="mt-4">
		    <Row>
		        <Col md={1} x={12} ></Col>
		        <Col md={10} x={12}>
		            <Row className="mt-5 mb-8">
		                <Col md={1} x={12}></Col>
		                <Col md={10} x={12} className="border border-2 bg-light text-success rounded-3">
		                    <h4 className="text-center mt-4 mb-5">Order Status</h4>
		                    {pendingData.length > 0 ? (
		                        pendingData.map(item => (
		                            <Row key={item.orderedOn} className="align-items-center my-2 border-bottom ms-3">
		                                <Col md={1} x={12} className="text-center"></Col>
		                                <Col md={10} x={12}>
		                                    {item.productsOrdered.map((orderProduct, index) => (
		                                        <div key={`${orderProduct._id}-${index}`} className="mb-3">
		                                        	<p className="fw-normal"><span className="fw-bolder pe-2">Order ID:</span> {item._id}</p>
		                                            <h6>{orderProduct.productId.name}</h6>
		                                            <p className="d-inline">Quantity: {orderProduct.quantity}</p>
		                                            <p className="d-inline ms-5">Price: {orderProduct.subTotal}</p>
		                                        </div>
		                                    ))}
		                                    <p className="fw-bolder">Total: {parseFloat(item.totalPrice).toLocaleString()} Php</p>
		                                    <p className="fw-normal">Order date: {new Date(item.orderedOn).toLocaleString()}</p>

		                                    <Form.Group className="d-flex align-items-end mb-3">
		                                        <Button
		                                            variant="danger"
		                                            className="me-2"
		                                            disabled={item.status === 'Cancelled'}
		                                        >
		                                            {item.status}
		                                        </Button>
		                                        {item.status !== 'Cancelled' && (
		                                            <Button
		                                                variant="success"
		                                                className="me-2 accent"
		                                                onClick={() => cancelOrder(item._id, "Cancelled")}
		                                            >
		                                                Cancel Order
		                                            </Button>
		                                        )}
		                                    </Form.Group>
		                                </Col>
		                                <Col md={1}></Col>
		                            </Row>
		                        ))
		                    ) : (
		                    <h4 className="text-center text-danger">Pending order is empty.</h4>
		                    )}
		 
		                </Col>
		                <Col md={1} x={12}></Col>
		            </Row>
		        </Col>
		        <Col md={1} x={12}></Col>
		    </Row>
		</Container>
	)
}