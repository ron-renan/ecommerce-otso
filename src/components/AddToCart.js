import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useContext } from 'react';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

export default function AddToCart({ addToCartProduct, handleClose, qtyOnHand }) {
    const [quantity, setQuantity] = useState(qtyOnHand);
    const { user, setUser, refreshCartCount } = useContext(UserContext);

    function confirmAddToCart() {
        if (quantity > 0) {

            fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart/addToCart', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ localStorage.getItem('token') }`
              },
              body: JSON.stringify({
                productId: addToCartProduct._id,
                quantity: quantity
              })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message === "Product not found"){
                    Swal.fire({
                        title: "Product not found",
                        icon: 'error',
                        text: "Product not found."
                    })
                }else if ( data.message === "Internal server error"){
                    Swal.fire({
                        title: "Error in adding",
                        icon: 'error',
                        text: "Error adding product to cart."
                    })
                } else if ( data.message === "Item added to cart successfully" ) {
                    Swal.fire({
                        title: "Item successfully added to cart",
                        icon: 'success'
                    })
                    refreshCartCount();
                    console.log('Added to cart:', addToCartProduct);
                    console.log('Quantity left:', quantity - 1);
                    setQuantity(quantity - 1); // Update quantity after adding to cart
                    handleClose(); // Close the modal after adding to cart
                }
            })
            
        } else {
            alert("Product is out of stock");
            Swal.fire({
                        title: "Out of Stock",
                        icon: 'error',
                        text: "Product out of stock."
                    })
        }
    }

    const handleQtyChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <= qtyOnHand) {
            setQuantity(Number(value));
        }
    }

    return (
        <>
            <Modal.Header closeButton className="bg-success">
                <Modal.Title className="text-light">Add to Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => { e.preventDefault(); confirmAddToCart(); }}>
                    <h4 className="mb-4 text-success">{addToCartProduct.name}</h4>
                    <Form.Group className="mb-3 text-success">
                        <Form.Label className="fs-6 fw-bolder text-success">Description :</Form.Label>
                        <Form.Text className="d-block fs-7 text-success">{addToCartProduct.description}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3 text-success">
                        <Form.Label><span className="fw-bolder text-success">Price</span> : {addToCartProduct.price}</Form.Label>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bolder text-success">Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={quantity}
                            className="w-25"
                            onChange={handleQtyChange}
                            min="0"
                            max={qtyOnHand}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="accent" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button className="accent" variant="success" onClick={confirmAddToCart}>Confirm</Button>
            </Modal.Footer>
        </>
    );
}
