import React, { useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function SetUserAsAdmin({ user }) {
    const { user: currentUser } = useContext(UserContext);

    const handleSetAsAdmin = async (e) => {
        e.preventDefault();

        try {
            if (!currentUser.isAdmin) {
                throw new Error("Unauthorized");
            }

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user._id}/setAsAdmin`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to set user as admin');
            }

            Swal.fire({
                title: "User successfully set as admin",
                icon: 'success',
                text: "User successfully set as admin"
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: "Error",
                icon: 'error',
                text: error.message || "An error occurred while setting the user as admin."
            });
        }
    };

    if (!currentUser.isAdmin || !user || user.isAdmin) {
        return null;
    }

    return (
        <Form onSubmit={handleSetAsAdmin}>
            <Button variant="success" size="sm" type="submit">
                Admin
            </Button>
        </Form>
    );
}