import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SetUserAsAdmin from '../components/SetUserAsAdmin';
import UserContext from '../UserContext';

export default function Users() {
  const { user: currentUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Error fetching users: ' + error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, navigate]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form.Control
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.mobileNo}</td>
                <td className={`fw-bold ${user.isAdmin ? 'text-success' : 'text-danger'}`}>
                  {user.isAdmin ? "Yes" : "No"}
                </td>
                <td>
                  {!user.isAdmin && currentUser.isAdmin && (
                    <SetUserAsAdmin user={user} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {error && <div className="text-danger mt-3">{error}</div>}
    </Container>
  );
}