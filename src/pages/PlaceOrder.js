import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function PlaceOrder() {
    const location = useLocation();
    const { unselected, orders } = location.state || { unselected: [], orders: [] };
    const { user, setCartCount, cartCount } = useContext(UserContext);
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
            await fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart/${productId}/removeFromCart`, {
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
            const response = await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/order/checkout', {
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
            await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart/addToCart', {
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

        navigate('/products'); // Navigate to a thank you page or order summary
    } catch (error) {
        console.error('Error placing order:', error);
    }
};


    return (
        <Container>
            <Row className="mt-5 mb-5">
                <Col md={4}></Col>
                <Col md={4} className="mt-5 text-success">
                    <h4 className="text-center mt-2 mb-5">Customer's Order</h4>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <div key={index} className="mt-2">
                                <h6>{order.productName}</h6>
                                <p>Quantity: {order.quantity}</p>
                                <p><span className="fw-bolder text-success">Subtotal :</span> {order.subTotal} Php</p>
                            </div>
                        ))
                    ) : (
                        <p>No items selected.</p>
                    )}
                </Col>
                <Col md={4}></Col>
            </Row>
            <Row className="fixed-bottom bg-light py-3">
                <Col className="col-md-8 offset-md-2">
                    <Row className="border-secondary pt-3">
                        <Col md={3}></Col>
                        <Col md={4} className="text-start pe-5">
                            <h5 className="text-success">Total : {parseFloat(totalPrice).toLocaleString()} Php</h5>
                        </Col>
                        <Col md={5} className="text-start">
                            <Button
                                variant="success"
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
