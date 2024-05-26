import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function EditProduct({ editingProduct, handleClose, setProducts }) {
    const [editedProduct, setEditedProduct] = useState({ ...editingProduct });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProduct = (e) => {
        e.preventDefault();
        fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/${editedProduct._id}/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(editedProduct)
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    title: "Update Failed",
                    icon: 'error',
                    text: data.message
                });
            } else {
                console.log(data);
                Swal.fire({
                    title: "Update Successful",
                    icon: 'success',
                    text: `${data.updatedProduct.name} details have been updated.`
                });
                setProducts(prevProducts => prevProducts.map(product => 
                    product._id === editedProduct._id ? { ...editedProduct } : product
                ));
                handleClose();
            }
        });
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleUpdateProduct}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={editedProduct.name || ''} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="description" value={editedProduct.description || ''} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={editedProduct.price || ''} onChange={handleInputChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" type="submit" onClick={handleUpdateProduct}>Submit</Button>
            </Modal.Footer>
        </>
    );
}