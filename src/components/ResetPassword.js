import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword === currentPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Current password is the same with new password. Try another password',
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
        body: JSON.stringify({ newPassword: newPassword, currentPassword: currentPassword }),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success',
          text: 'Password reset successful',
          icon: 'success',
        });
      } else {
        const result = await response.json();
        Swal.fire({
          title: 'Error',
          text: result.error || 'Something went wrong',
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
    <div>
      <h2>Reset Password</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="currentPassword">
          <Form.Label>Current Password:</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={{width: "45vw"}}
          />
        </Form.Group>
        <Form.Group controlId="newPassword">
          <Form.Label>New Password:</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{width: "45vw"}}
          />
        </Form.Group>
        <Button className="mt-4" variant="primary" type="submit">
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;