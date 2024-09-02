import { Row, Col, Table, Button, Form, Modal, Container } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import EditProduct from './EditProduct';

export default function AdminView({ ProductsData }) {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (ProductsData) {
            setProducts(ProductsData);
        }
    }, [ProductsData]);

    const handleProductActivation = (e, productId, isActive) => {
        e.preventDefault();
        const action = isActive ? 'archive' : 'activate';
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/${action}`, {
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

    const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    `${product._id}`.includes(searchTerm) || `${product.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
        <>
<Container fluid className="pt-3 ">
<h2 className="text-center mt-5 text-success">Admin Dashboard</h2>
    <Row>
    <Col md={{ span: 6, offset: 3 }}>
      <Form.Control
        type="text"
        placeholder="Search product"
        value={searchTerm}
        onChange={handleSearchChange}
      />
        </Col>
    </Row> 
        
            <Table striped bordered hover responsive="md" size="sm" className="table-fluid mt-2">
            <thead className="text-center py-5 fs-7 admin-header">
                <tr>
                    <th className="py-3 text-light d-none d-md-table-cell">ID</th>
                    <th className="py-3 text-light">Name</th>
                    <th className="py-3 text-light">Description</th>
                    <th className="py-3 text-light d-none d-md-table-cell">Price</th>
                    <th className="py-3 text-light d-none d-md-table-cell">Availability</th>
                    <th colSpan={2} className="py-3 text-light">Action</th>
                </tr>
            </thead>
            <tbody className="text-center">
                {filteredProducts.map(product => (
                    <tr key={product._id}>
                        <td className="d-none d-md-table-cell">{product._id}</td>
                        <td>{product.name}</td>
                        <td className="d-none d-md-table-cell">{product.description}</td>
                        <td className="d-none d-md-table-cell">{product.price}</td>
                        <td className={`fw-bold ${product.isActive ? 'text-success' : 'text-danger'}`}>
                            {product.isActive ? "Available" : "Unavailable"}
                        </td>
                        <td>
                            <Button onClick={() => handleEditClick(product)} 
                            className="bg-warning text-dark mx-1" size="sm">
                            Edit</Button>
                        </td>
                        <td>
                            {user.id ? (
                                <Form onSubmit={(e) => handleProductActivation(e, product._id, product.isActive)}>
                                    <Button variant={product.isActive ? "success" : "danger"} size="sm" type="submit">
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
