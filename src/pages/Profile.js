import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';

export default function Profile() {
    const { user } = useContext(UserContext);

    const [details, setDetails] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
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
            <Container fluid className="w-50 mb-5" style={{marginTop: "3.8rem"}} >
            <Row>
                <Col className="p-3 ps-5 mt-1 bg-success text-white rounded-3">
                    <h3>Profile</h3>
                    <h6 className="mt-3">{`${details.firstName} ${details.lastName}`}</h6>
                    <hr />
                    <h5>Contacts</h5>
                    <ul>
                        <li>Email: {details.email}</li>
                        <li>Mobile No: {details.mobileNo}</li>
                    </ul>
                </Col>
            </Row>

            <Row className="pt-2">
                <Col className="bg-success text-white rounded-3">
                    <ResetPassword />
                </Col>
            </Row>

            <Row className="pt-2">
                <Col className="py-4 pt-4 bg-success rounded-3">
                    <UpdateProfile updateDetails={updateProfileDetails} profileData={details} />
                </Col>
            </Row>
            </Container>
        </>
    );
}