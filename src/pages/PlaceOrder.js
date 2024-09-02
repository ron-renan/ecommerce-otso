import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function PlaceOrder() {
    const location = useLocation();
    const { unselected, orders } = location.state || { unselected: [], orders: [] };
    const { user, setCartCount } = useContext(UserContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    // Calculate the total price based on the orders array
    useEffect(() => {
        const newTotalPrice = orders.reduce((total, item) => 
            total + parseFloat(item.subTotal), 0
        );
        setTotalPrice(newTotalPrice.toFixed(2));
    }, [orders]);

    const deleteProduct = async (productId) => {
        try {
            console.log(`Deleting product with ID: ${productId}`);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/removeFromCart`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.log("Unable to delete items from cart.");
        }
    };

    const processOrder = async () => {
        try {
            console.log('Processing order');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/order/checkout`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Order Placed!',
                    text: 'Your order has been successfully placed.',
                    icon: 'success',
                })
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'There was an error placing your order. Please try again.',
                    icon: 'error',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error processing your request. Please try again.',
                icon: 'error',
            });
        }
    };

    const insertProduct = async (productId, quantity) => {
        try {
            console.log(`Inserting product with ID: ${productId}, Quantity: ${quantity}`);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/addToCart`, {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ localStorage.getItem('token') }`
              },
              body: JSON.stringify({
                productId: productId,
                quantity: quantity
              })
            });

        } catch (error) {
            console.log("Unable to re-insert items to cart.");
        }
    };

  const placeOrder = async () => {
    console.log('Starting placeOrder function');

    try {
        // Delete unselected Products from cart
        if (unselected.length > 0) {
            console.log('Deleting unselected products');
            for (let item of unselected) {
                await deleteProduct(item.productId);
            }
        }

        // Process Orders
        await processOrder();

        // Delete Order products from cart
        if (orders.length > 0) {
            console.log('Deleting order products');
            for (let item of orders) {
                await deleteProduct(item.productId);
            }
        }
        // Re-insert unselected products to cart
        if (unselected.length > 0) {
            console.log('Re-inserting unselected products');
            for (let item of unselected) {
                await insertProduct(item.productId, item.quantity);
            }
        }

        // Refresh cart count after placing order
        //refreshCartCount();
        setCartCount(unselected.length);

        navigate('/'); // Navigate to a thank you page or order summary
    } catch (error) {
        console.error('Error placing order:', error);
    }
};

// Redirect if user is not logged in or is an admin
    if (!user.id || user.isAdmin) {
        return <Navigate to="/" />;
    }


    return (
       <Container className="mt-5">
                    <Row >
                        <Col md={1} x={12}></Col>
                        <Col md={10} x={12}>
                            <Row className="mt-5 mb-8">
                                <Col md={1} x={12}></Col>
                                <Col md={10} x={12} className="border border-2 bg-success text-light rounded-3">
                                    <>
                                    <h5 className="text-center my-4">Customer Order</h5>
                                    {orders.length > 0 ? (
                                        orders.map((order, index) => (
                                            <div key={index} className="mt-2 border rounded-2 ps-5 py-3 bg-light text-success">
                                                <h6>{order.productName}</h6>
                                                <p>{order.productDescription}</p>
                                                <p>Quantity: {order.quantity}</p>
                                                <p><span className="fw-bolder text-success">Subtotal :</span> {order.subTotal} Php</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No items selected.</p>
                                    )}
                                    <p className="py-2"></p>
                                    </>
                                </Col>
                                <Col md={1} x={12}></Col>
                            </Row>
                        </Col>
                        <Col md={1} x={12}></Col>
                    </Row>
                    
                    <Row className="fixed-bottom bg-success text-light py-1 pb-3">
                        <Col className="col-md-8 offset-md-2">
                            <Row className="border-secondary pt-3">
                                <Col md={2} xs={12}></Col>
                                <Col md={7} xs={6} className="text-end pe-5">
                                    <h6 className="pt-2">Total : {parseFloat(totalPrice).toLocaleString()} Php</h6>
                                </Col>
                                <Col md={3} xs={6} className="text-start">
                                    <Button
                                        variant="warning"
                                        size="md"
                                        onClick={placeOrder}
                                    >
                                        Place Order
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
    );
}
