import { Modal } from 'react-bootstrap';
import { useState, useContext } from 'react';
import UserContext from '../UserContext';
import { Link } from 'react-router-dom';

export default function ProductView({ productview, handleClose, qtyOnHand}) {
    const { user} = useContext(UserContext);
    const [ quantity] = useState(qtyOnHand);

    return (
        <>
            <Modal.Header closeButton className="bg-success">
                <Modal.Title className="text-light">{productview.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-success">
                <h6>Description</h6>
                <p>{productview.description}</p>
                <h6>Price</h6>
                <p>{productview.price}</p>
                <h6>Quantity</h6>
                <p>{quantity}</p>          
            </Modal.Body>
            <Modal.Footer>
                <>
                { user.id === null || !user.isAdmin ? 
                    <Link className="btn btn-success accent btn-block" to="/login">Log in to Shop</Link>
               :
                    <Link className="btn btn-success accent btn-block" to="/products">Admin is not allowed</Link>
               }
               </>
            </Modal.Footer>
        </>
    );
}