import { useState, useEffect, useContext } from 'react';
import { Table } from 'react-bootstrap';
import UserContext from '../UserContext';

export default function UserOrders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/order/my-orders', {
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
        
         setOrders(data.orders);
       
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
      <h1>My Orders</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover>
        <thead>
          <tr>
          <th>Order ID</th>
          	<th>Product ID</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Total Price</th>
            <th>Date Ordered</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
          	order.productsOrdered.map(product => (
            <tr key={`${order._id}-${product.productId}`}>
            <td>{order._id}</td>
			<td>{product.productId}</td>
            <td>{product.quantity}</td>
            <td>{product.subTotal}</td>
            <td>{order.totalPrice}</td>
            <td>{new Date(order.orderedOn).toLocaleString()}</td>
            <td>{order.status}</td>
            </tr>
            ))
          ))}
        </tbody>
      </Table>
      )}
    </div>
  );
}