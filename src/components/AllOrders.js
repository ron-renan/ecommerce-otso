import { useState, useEffect, useContext } from 'react';
import { Table } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function AllOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      <h1>All User Orders</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Total Price</th>
              <th>Ordered On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.productsOrdered.map((product) => (
                <tr key={`${order._id}-${product.productId._id}`}>
                  <td>{order._id}</td>
                  <td>{order.userId._id}</td>
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
    </div>
  );
}