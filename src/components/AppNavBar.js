import { useContext, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Ensure you have this CSS file

export default function AppNavbar() {
  const { user, cartCount, refreshCartCount } = useContext(UserContext);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);


  return (
    <Navbar expand="lg" className="bg-success fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="accent">E-Commerce App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user.id && !user.isAdmin && (
              <Nav.Link as={NavLink} to="/cart" exact="true" className="position-relative accent">
                <FontAwesomeIcon icon={faShoppingCart} />
                <span className="cart-count accent fw-bolder">{cartCount}</span>
              </Nav.Link>
            )}
            <Nav.Link as={NavLink} to="/" exact="true" className="accent">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products" exact="true" className="accent">Products</Nav.Link>
            {user.isAdmin && (
              <Nav.Link as={NavLink} to="/addProduct" exact="true" className="accent">Add Product</Nav.Link>
            )}
            {user.id ? (
              <>
                <Nav.Link as={Link} to="/profile" className="accent">Profile</Nav.Link>
                <Nav.Link as={Link} to="/logout" className="accent">Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="accent">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="accent">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
