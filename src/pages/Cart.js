    import { useEffect, useState, useContext } from 'react';
    import { useNavigate, Navigate } from 'react-router-dom';
    import { Container, Row, Col, Button, Form } from 'react-bootstrap';
    import Swal from 'sweetalert2';
    import UserContext from '../UserContext';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
    import PlaceOrder from '../pages/PlaceOrder';

    export default function Cart() {
        const { user, cartCount, setCartCount } = useContext(UserContext);
        const [cartData, setCartData] = useState([]);
        const [products, setProducts] = useState([]);
        const [mappedCartItems, setMappedCartItems] = useState([]);
        const [selectedItems, setSelectedItems] = useState({});
        const [totalPrice, setTotalPrice] = useState(0);
        const [orderProducts, setOrderProducts] = useState([]);
        const [stillCart, setStillCart] = useState([]);
        const navigate = useNavigate();
        const [selectAll, setSelectAll] = useState(false);
        const [isActive, setIsActive] = useState(false);

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
                setIsActive(selectAll || Object.values(selectedItems).some(selected => selected));
            }, [selectAll, selectedItems]);

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

        // useEffect(() => {
        //     setCartCount(mappedCartItems.length);
        // }, [mappedCartItems]);

        useEffect(() => {
            setStillCart(mappedCartItems.filter(item => !selectedItems[item.productId]));
            setOrderProducts(mappedCartItems.filter(item => selectedItems[item.productId]));
        }, [mappedCartItems, selectedItems]);

        const handleQuantityChange = (e,productId, initialQty, increment) => {
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
                e.preventDefault();

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

        const removeFromCart = async(cartId) => {
            try {
                const response = await fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart/${cartId}/removeFromCart`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('token')}`    
                    }
                });

                const data = await response.json();
                console.log(data);

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to remove Item from cart');
                }

                Swal.fire({
                    title: "Item successfully removed!",
                    icon: 'success'
                });

               setMappedCartItems(prevItems => prevItems.filter(item => item.productId !== cartId));
               setCartCount(mappedCartItems.filter(items => items.productId !== cartId).length);

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: "Error on removing Item",
                    icon: 'error',
                    text: error.message || "Something went wrong."
                });
            }
        }


        const placeOrder = () => {
            console.log("Placing order");
            navigate('/myorder', { state: { unselected: stillCart, orders: orderProducts } });
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
            <Container className="mt-5">
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                    <Row className="mt-5 mb-8">
                        <Col md={2}></Col>
                        <Col md={8} className="border border-2 bg-light text-success rounded-3">
                            <h5 className="text-center my-3">Customer Cart</h5>
                            {mappedCartItems.length > 0 ? (
                                mappedCartItems.map(item => (
                                    <Row key={item.productId} className="align-items-center my-2 border-bottom ms-3">
                                        <Col md={2} className="text-center">
                                            <Form.Check
                                                type="checkbox"
                                                checked={!!selectedItems[item.productId]}
                                                onChange={() => handleCheckboxChange(item.productId)}
                                                style={{ transform: "scale(1.5)" }}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <h6>{item.productName}</h6>
                                            <p>{item.productDescription}</p>
                                            <p>Subtotal: {parseFloat(item.subTotal).toLocaleString()} Php</p>
                                            <Form.Group className="d-flex align-items-center mb-3">
                                                <Form.Label className="me-2">Quantity</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    style={{ width: "4rem", height: "1.8rem", fontSize: "1rem" }}
                                                    value={item.quantity}
                                                    readOnly
                                                    className="me-2 text-left"
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    className="me-2"
                                                    onClick={(e) => handleQuantityChange(e,item.productId, item.quantity, 1)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="fa-xs" />
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={(e) => handleQuantityChange(e,item.productId, item.quantity, -1)}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="fa-xs" />
                                                </Button>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="text-center">
                                            <Button 
                                            variant="warning"
                                            onClick={() => removeFromCart(item.productId)}
                                            >
                                                Remove                                                
                                            </Button>    
                                        </Col>
                                    </Row>
                                ))
                            ) : (
                                <p>Your cart is empty.</p>
                            )}
                        </Col>
                        <Col md={2}></Col>
                    </Row>        

                    </Col>
                    <Col md={2}></Col>
                </Row>
                
                <Row className="fixed-bottom bg-success py-1 text-light">
                    <Col md={2}></Col>
                    <Col md={8}>
                        <Row>
                            <Col className="text-center">
                                <Row className=" border-secondary pt-1">
                                    <Col md={3} className="text-end pe-4 pt-2">
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAllChange}
                                                style={{ transform: "scale(1.5)" }}
                                            />
                                        </Col>
                                    <Col md={4} className="text-center pt-2">
                                        <h5 className="accent">Total: {parseFloat(totalPrice).toLocaleString()} Php</h5>
                                    </Col>
                                    <Col md={5} className="text-start ps-5">
                                        <Button
                                            variant="warning"
                                            onClick={placeOrder}
                                            disabled={!isActive}
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
