import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';

export default function Profile() {
    const { user } = useContext(UserContext);

    const [details, setDetails] = useState({});

    useEffect(() => {
        fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/users/details', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {

            // Set the user states values with the user details upon successful login.
            if (data.user && data.user._id) {
                setDetails(data.user);
                console.log(details);

            } else if (data.error === 'User not found') {
                Swal.fire({
                    title: 'User not found',
                    icon: 'error',
                    text: 'Something went wrong, kindly contact us for assistance.'
                });
            } else {
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Something went wrong, kindly contact us for assistance.'
                });
            }
        });
    }, []);

    // Function to update profile details
    const updateProfileDetails = (newDetails) => {
        setDetails(prevDetails => ({
            ...prevDetails,
            ...newDetails
        }));
    };


    return (
        user.id === null 
        ? <Navigate to="/products" /> 
        : <>
            <Container fluid className="w-75">
            <Row>
                <Col className="p-5 bg-primary text-white">
                    <h1 className="my-5">Profile</h1>
                    <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
                    <hr />
                    <h4>Contacts</h4>
                    <ul>
                        <li>Email: {details.email}</li>
                        <li>Mobile No: {details.mobileNo}</li>
                    </ul>
                </Col>
            </Row>

            <Button variant="dark">
                <UpdateProfile/>
            </Button>
            <Button variant="dark">
                <ResetPassword/>
            </Button>
            </Container>
        </>
    );
}
