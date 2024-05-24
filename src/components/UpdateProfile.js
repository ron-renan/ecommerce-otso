import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const UpdateProfile = ({ updateDetails, profileData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: ''
  });

  useEffect(() => {
  if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      Swal.fire({
        title: 'Success',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      });
      updateDetails(formData); // Update parent component's state with new profile data
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update profile',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div>
      <h4 className="text-success">Update Profile</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName" className="text-success">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="lastName" className="text-success">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="mobileNo" className="text-success">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button className="my-5" variant="success" type="submit">
          Update Profile
        </Button>
      </Form>
    </div>
  );
};

export default UpdateProfile;