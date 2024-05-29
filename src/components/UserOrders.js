import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import PendingView from './PendingOrder'
import CompletedView from './CompletedView'

export default function UserOrders() {
    const { user, cartCount } = useContext(UserContext);
    const [orderData, setOrderData] = useState([]);
    const [pendingOrders, setPendingOrders ] = useState([]);
    const [completedOrders, setCompletedOrders ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/order/my-orders`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();

                console.log('Fetched Orders:', data);

                if (data.message === "'No order found for this user'") {
                    Swal.fire({
                        title: "No Order",
                        icon: 'error',
                        text: "No Orders found"
                    });
                } else {
                    setOrderData(data.orders);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                Swal.fire({
                    title: "Something went wrong",
                    icon: 'error',
                });
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

   useEffect(() => {
    const pending = [];
    const completed = [];
    const cancel = [];
    orderData.forEach(order => {
        if (order.status.toLowerCase() === "pending") {
            pending.push(order);
        } else if (order.status.toLowerCase() === "cancelled") {
            cancel.push(order);
        } else {
            completed.push(order);
        }
    });
    setPendingOrders(pending);
    setCompletedOrders([...completed, ...cancel]);
}, [orderData]);


    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            {pendingOrders.length && <PendingView pendingData={pendingOrders} />}
            {completedOrders.length && <CompletedView completedData={completedOrders} />}
        </>
    );
}
