import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword === currentPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Current password is the same as the new password. Please choose a different password.',
        icon: 'error',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword, currentPassword }),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text: 'Password reset successful',
          icon: 'success',
        });
        setShowModal(false); // Close modal on success
        setNewPassword('');
        setCurrentPassword('');
      } else {
        const result = await response.json();
        Swal.fire({
          title: 'Error',
          text: result.message || 'Something went wrong',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error: ' + error.message,
        icon: 'error',
      });
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Change Password
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit" onClick= {handleSubmit}>
              Reset Password
            </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}