import { Card, Button, Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import AddToCart from './AddToCart';
import ProductView from './ProductView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import UserContext from '../UserContext';

export default function ProductCard({ productProp }) {
    
    const { user } = useContext(UserContext);
    const { _id, name, description, price } = productProp;

    const [quantity, setQuantity] = useState(10);
    const [addToCart, setAddToCart] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = (product) => {
        setAddToCart(product);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <>
            <Card id="productComponent">
                <Card.Body className="second">
                    <Card.Title>{name}</Card.Title>
                    <Card.Subtitle>Description:</Card.Subtitle>
                    <Card.Text>{description}</Card.Text>
                    <Card.Subtitle>Price:</Card.Subtitle>
                    <Card.Text>PhP {price}</Card.Text>
                    <Card.Text>Quantity: {quantity}</Card.Text>
                    <Button onClick={() => handleAddToCart(productProp)} className="bg-success accent ms-2">
                        Add To Cart <FontAwesomeIcon icon={faShoppingCart} className="yellow-icon" />
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleClose}>
                {user.id !== null && !user.isAdmin ? (
                    <AddToCart
                        addToCartProduct={addToCart}
                        handleClose={handleClose}
                        qtyOnHand={quantity}
                        showModal={showModal}
                    />
                ) : (
                    <ProductView
                        productview={addToCart}
                        handleClose={handleClose}
                        qtyOnHand={quantity}
                    />
                )}
            </Modal>
        </>
    );
}
