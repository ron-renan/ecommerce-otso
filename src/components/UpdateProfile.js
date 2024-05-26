import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';
import Login from '../pages/Login';

export default function UpdateProfile() {
    const { user } = useContext(UserContext);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedDetails, setEditedDetails] = useState({});
    const [message, setMessage] = useState('');

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/users/profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ editedDetails: editedDetails }),
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Profile updated successfully',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error || 'Failed to update profile',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error: ' + error.message,
            });
        }
    };

    const handleEditProfile = () => {
        fetchProfile();
        setShowEditModal(false);
    };

    return (
        (user.id === null)
            ? <Login />
            : <>
                <Button onClick={() => setShowEditModal(true)}>Edit Profile</Button>

                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" value={editedDetails.firstName || ''} onChange={e => setEditedDetails({ ...editedDetails, firstName: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" value={editedDetails.lastName || ''} onChange={e => setEditedDetails({ ...editedDetails, lastName: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={editedDetails.email || ''} onChange={e => setEditedDetails({ ...editedDetails, email: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="mobileNo">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control type="text" value={editedDetails.mobileNo || ''} onChange={e => setEditedDetails({ ...editedDetails, mobileNo: e.target.value })} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleEditProfile}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
                {message && <p>{message}</p>}
            </>
    );
}