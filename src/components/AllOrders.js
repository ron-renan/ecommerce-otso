import { useState, useEffect, useContext } from 'react';
import { Table, Container, Row, Col, Form } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function AllOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/order/all-orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    `${order._id} ${order.userId._id}`.includes(searchTerm)
  );

  return (

    <Container className="mt-5 pt-1">
    <h2 className="text-center mt-3 text-success">All User Orders</h2>

      <Row>
        <Col md={{ span: 6, offset: 3 }} className="my-2">
          <Form.Control
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>
    
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover responsive="md" size="sm" className="table-fluid">
          <thead className="text-center py-5 fs-7 admin-header">
            <tr>
              <th className="py-3 text-light d-none d-md-table-cell">Order ID</th>
              <th className="py-3 text-light d-none d-md-table-cell">User</th>
              <th className="py-3">Product Name</th>
              <th className="py-3">Qty</th>
              <th className="py-3 text-light d-none d-md-table-cell">Subtotal</th>
              <th className="py-3">Total Price</th>
              <th className="py-3">Ordered On</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredOrders.map((order) =>
              order.productsOrdered.map((product) => (
                <tr key={`${order._id}-${product.productId._id}`}>
                  <td className="d-none d-md-table-cell">{order._id}</td>
                  <td className="d-none d-md-table-cell">{order.userId._id}</td>
                  <td>{product.productId.name}</td>                  
                  <td>{product.quantity}</td>
                  <td className="d-none d-md-table-cell">{product.subTotal}</td>
                  <td>{order.totalPrice}</td>
                  <td>{new Date(order.orderedOn).toLocaleString('en-US')}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    
    </Container>
  );
}