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
    <div className="mt-5 pt-1">
      <h4 className="my-3 text-success">All User Orders</h4>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover responsive="md" className="table-fluid">
          <thead className="text-center py-5 fs-7 admin-header">
            <tr>
              <th className="py-3 text-light d-none d-md-table-cell">Order ID</th>
              <th className="py-3 text-light d-none d-md-table-cell">User</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th className="py-3 text-light d-none d-md-table-cell">Subtotal</th>
              <th>Total Price</th>
              <th>Ordered On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.map((order) =>
              order.productsOrdered.map((product) => (
                <tr key={`${order._id}-${product.productId._id}`}>
                  <td className="d-none d-md-table-cell">{order._id}</td>
                  <td className="d-none d-md-table-cell">{order.userId._id}</td>
                  <td>{product.productId.name}</td>                  
                  <td>{product.quantity}</td>
                  <td className="d-none d-md-table-cell">{product.subTotal}</td>
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