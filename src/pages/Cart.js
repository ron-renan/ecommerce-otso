import { useEffect, useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import PlaceOrder from '../pages/PlaceOrder';

export default function Cart() {
    const { user, cartCount } = useContext(UserContext);
    const [cartData, setCartData] = useState([]);
    const [products, setProducts] = useState([]);
    const [mappedCartItems, setMappedCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderProducts, setOrderProducts] = useState([]);
    const [stillCart, setStillCart] = useState([]);
    const navigate = useNavigate();
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
            if (cartCount === 0) {
                Swal.fire({
                    title: "Empty Cart",
                    icon: 'error',
                    text: "Cart is empty."
                });
                return navigate("/products");
            }
        }, [cartCount, navigate]);

    useEffect(() => {
        if (user && user.id !== null) {
            if (!user.isAdmin) {
                fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/active`)
                    .then(res => res.json())
                    .then(results => {
                        setProducts(results.products);
                    })
                    .catch(err => {
                        Swal.fire({
                            title: "Product is unavailable",
                            icon: 'error',
                        });
                    });
            }

            fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.message === "Cart not found for this user") {
                        Swal.fire({
                            title: "Cart not Found",
                            icon: 'error',
                            text: "No available cart for this user."
                        });

                    } else if (data.message === "Your cart is empty.") {
                        // Swal.fire({
                        //     title: "Empty Cart",
                        //     icon: 'error',
                        //     text: "Cart is empty."
                        // });
                    } else {
                        setCartData(data.items);
                    }
                });
        } else {
            Swal.fire({
                title: "User is not yet logged in",
                icon: 'error',
            });
        }
    }, [user]);

    useEffect(() => {
        if (products.length && cartData.length) {
            const mappedItems = cartData.map(cartItem => {
                const product = products.find(product => product._id === cartItem.productId);
                return {
                    ...cartItem,
                    productName: product ? product.name : 'Unknown',
                    price: product ? product.price : '0',
                    productDescription: product ? product.description : 'No description available',
                    subTotal: (cartItem.quantity * (product ? product.price : 0)).toFixed(2)
                };
            });
            setMappedCartItems(mappedItems);
        }
    }, [products, cartData]);

    useEffect(() => {
        const newTotalPrice = mappedCartItems.reduce((total, item) => {
            if (selectedItems[item.productId]) {
                return total + parseFloat(item.subTotal);
            }
            return total;
        }, 0);
        setTotalPrice(newTotalPrice.toFixed(2));
    }, [selectedItems, mappedCartItems]);

    const handleCheckboxChange = (productId) => {
        setSelectedItems(prevState => ({
            ...prevState,
            [productId]: !prevState[productId]
        }));
    };

    useEffect(() => {
        setStillCart(mappedCartItems.filter(item => !selectedItems[item.productId]));
        setOrderProducts(mappedCartItems.filter(item => selectedItems[item.productId]));
    }, [mappedCartItems, selectedItems]);

    const handleQuantityChange = (productId, initialQty, increment) => {
        if (initialQty + increment > 0) {
            setMappedCartItems(prevState =>
                prevState.map(item =>
                    item.productId === productId
                        ? {
                              ...item,
                              quantity: Math.max(1, item.quantity + increment), // Ensure quantity doesn't go below 1
                              subTotal: (item.price * (item.quantity + increment)).toFixed(2) // Calculate subtotal
                          }
                        : item
                )
            );

            // Update the selected items state based on the quantity
            setSelectedItems(prevState => ({
                ...prevState,
                [productId]: parseInt(initialQty + increment) > 0 // Check the checkbox if quantity is greater than zero
            }));

            fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart/updateQuantity', {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: parseInt(initialQty + increment)
                })
            });
        }
    };

    if (!user || user.id === null) {
        return <Navigate to="/login" />;
    }

    const placeOrder = () => {
        console.log("Placing order");
        navigate('/order', { state: { unselected: stillCart, orders: orderProducts } });
    };

    const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelectedItems = {};
    if (newSelectAll) {
        mappedCartItems.forEach(item => {
            newSelectedItems[item.productId] = true;
        });
    }
    setSelectedItems(newSelectedItems);
};


    return (
        <Container>
            <Row className="mt-5 mb-8">
                <Col md={2}></Col>
                <Col md={8}>
                    <h5 className="text-center my-3 text-success">Customer Cart</h5>
                    {mappedCartItems.length > 0 ? (
                        mappedCartItems.map(item => (
                            <Row key={item.productId} className="align-items-center my-2 border-bottom">
                                <Col md={2} className="text-center">
                                    <Form.Check
                                        type="checkbox"
                                        checked={!!selectedItems[item.productId]}
                                        onChange={() => handleCheckboxChange(item.productId)}
                                        style={{ transform: "scale(1.5)" }}
                                    />
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-success">{item.productName}</h6>
                                    <p className="text-success">{item.productDescription}</p>
                                    <p className="text-success">Subtotal: {parseFloat(item.subTotal).toLocaleString()} Php</p>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="d-flex align-items-center mb-3">
                                        <Form.Label className="me-2 text-success">Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            style={{ width: "4rem", height: "1.8rem", fontSize: "1rem" }}
                                            value={item.quantity}
                                            readOnly
                                            className="me-2 text-left"
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            className="me-2 text-success"
                                            onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="fa-xs" />
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                                        >
                                            <FontAwesomeIcon icon={faMinus} className="fa-xs" />
                                        </Button>
                                    </Form.Group>
                                </Col>
                            </Row>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </Col>
                <Col md={2}></Col>
            </Row>
            <Row className="fixed-bottom bg-light py-3">
                <Col md={2}></Col>
                <Col md={8}>
                    <Row>
                        <Col className="text-center">
                            <Row className=" border-secondary pt-2">
                                <Col md={2} className="text-end pe-4">
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllChange}
                                            style={{ transform: "scale(1.5)" }}
                                        />
                                    </Col>
                                <Col md={6} className="text-center">
                                    <h6 className="text-success">Total: {parseFloat(totalPrice).toLocaleString()} Php</h6>
                                </Col>
                                <Col md={4} className="text-start ps-5">
                                    <Button
                                        className="accent"
                                        variant="success"
                                        onClick={placeOrder}
                                    >
                                        Checkout
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
