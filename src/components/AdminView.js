import { Table, Button, Form, Modal, Container } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import EditProduct from './EditProduct';

export default function AdminView({ ProductsData }) {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState({});

    useEffect(() => {
        if (ProductsData) {
            setProducts(ProductsData);
        }
    }, [ProductsData]);

    const handleProductActivation = (e, productId, isActive) => {
        e.preventDefault();
        const action = isActive ? 'archive' : 'activate';
        fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/products/${productId}/${action}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    title: "Product not found",
                    icon: 'error',
                    text: "Product not found in database."
                });
            } else {
                Swal.fire({
                    title: `Product ${action} success`,
                    icon: 'success',
                    text: `Product is now ${action}d.`
                });
                setProducts(prevProducts => prevProducts.map(product => {
                    if (product._id === productId) {
                        return {
                            ...product,
                            isActive: !isActive // Toggle isActive status
                        };
                    }
                    return product;
                }));
            }
        });
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <>
        <Container className="pt-5">
            <h2 className="text-center my-5 text-success">Admin Dashboard</h2>
            <Table striped borderless hover response="sm">
                <thead className="text-center py-5 fs-7 admin-header">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan={2}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td className={`fw-bold ${product.isActive ? 'text-success' : 'text-danger'}`}>
                                {product.isActive ? "Available" : "Unavailable"}
                            </td>
                            <td>
                                <Button onClick={() => handleEditClick(product)} className="bg-primary text-light mx-3">Edit</Button>
                            </td>
                            <td>
                                {user.id ? (
                                    <Form onSubmit={(e) => handleProductActivation(e, product._id, product.isActive)}>
                                        <Button variant={product.isActive ? "secondary" : "success"} type="submit">
                                            {product.isActive ? "Archive" : "Activate"}
                                        </Button>
                                    </Form>
                                ) : null}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </Container>
            <Modal show={showModal} onHide={handleClose}>
                <EditProduct
                    editingProduct={editingProduct}
                    handleClose={handleClose}
                    setProducts={setProducts}
                    showModal={showModal}
                />
            </Modal>
        </>
    );
}
