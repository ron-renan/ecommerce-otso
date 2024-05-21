import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';



export default function AppNavbar() {

  const {user} = useContext(UserContext);

  return (
      <Navbar expand="lg" className="bg-light">
          <Container>
            <Navbar.Brand as={Link} to="/">E-Commerce App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>
                {(user.isAdmin) && 
                <Nav.Link as={NavLink} to="/addProduct" exact="true" >Add Product</Nav.Link>
                }
                {(user.id !== null ) ? 
                <>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                </>
                : 
                <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
            }
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  )
}
