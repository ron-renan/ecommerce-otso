import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [shownewPassword, setNewShowPassword] = useState(false);


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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
        method: 'PATCH',
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
    <div className="text-light p-3 ps-4">
      <h4>Reset Password</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="currentPassword">
          <Form.Label>Current Password:</Form.Label>
          <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            // style={{width: "34vw"}}
          />
          <InputGroup.Text onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </InputGroup.Text>
        </InputGroup>
        </Form.Group>
        <Form.Group controlId="newPassword">
          <Form.Label>New Password:</Form.Label>
          <InputGroup>
            <Form.Control
              type={shownewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              // style={{width: "35vw"}}
            />
            <InputGroup.Text onClick={() => setNewShowPassword(!shownewPassword)}>
              <FontAwesomeIcon icon={shownewPassword ? faEyeSlash : faEye} />
            </InputGroup.Text>
          </InputGroup>
          </Form.Group>
        <Button className="mt-4" variant="warning" type="submit">
          Reset Password
        </Button>
      </Form>
    </div>
  );
};

export default ResetPassword;