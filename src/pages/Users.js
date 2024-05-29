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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, {
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
        <Col md={{ span: 6, offset: 3 }} className="my-5">
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
        <Table fluid striped bordered hover responsive="sm" size="sm" className="table-fluid mb-4">
          <thead className="text-center py-5 fs-7 admin-header">
            <tr>
              <th className="py-3 text-light d-none d-md-table-cell">User ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3 text-light d-none d-md-table-cell">Mobile Number</th>
              <th className="py-3">Admin</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="d-none d-md-table-cell">{user._id}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td className="d-none d-md-table-cell">{user.mobileNo}</td>
                <td className={`fw-bold ${user.isAdmin ? 'text-success' : 'text-danger'}`}>
                  {user.isAdmin ? "Yes" : "No"}
                </td>
                <td className="text-center py-1">
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