import { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import UserContext from '../UserContext';

export default function AllOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/order/all-orders', {
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
   <Container className="mt-2"> 
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form.Control
            type="text"
            placeholder="Search by User ID or Order ID"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>
      <h2> All User Orders</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered responsive className="mt-3">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Total Price</th>
              <th>Ordered On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) =>
             order.productsOrdered.map((product) => (
                <tr key={`${order._id}-${product.productId._id}`}>
                  <td>{order._id}</td>
                  <td>{order.userId._id}</td>
                  <td>{product.productId._id}</td>
                  <td>{product.productId.name}</td>                  
                  <td>{product.quantity}</td>
                  <td>{product.subTotal}</td>
                  <td>{order.totalPrice}</td>
                  <td>{new Date(order.orderedOn).toLocaleString()}</td>
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