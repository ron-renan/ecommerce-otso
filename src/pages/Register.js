import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {

  const { user, setUser } = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);


  function clearForm(){
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobileNo('');
      setPassword('');
      setConfirmPassword('');
  }
  function registerUser(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/users/register` , {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        mobileNo,
        password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        switch(data.error) {
          case "Invalid email format":
            Swal.fire({
              title: "Invalid Email",
              icon: "error",
              text: "Please enter a valid email address."
            });
            break;
          case "User with this email or mobile number already exists":
            Swal.fire({
              title: "User Already Exists",
              icon: "error",
              text: "A user with this email or mobile number already exists."
            });
            break;
          case "Password must be atleast 8 characters":
            Swal.fire({
              title: "Weak Password",
              icon: "error",
              text: "Password must be at least 8 characters long."
            });
            break;
          case "Internal server error":
            Swal.fire({
              title: "Server Error",
              icon: "error",
              text: "Something went wrong. Please try again later."
            });
            break;
          default:
            Swal.fire({
              title: "Error",
              icon: "error",
              text: "An unknown error occurred."
            });
        }
      } else {
        
        clearForm();
        setUser();

        Swal.fire({
          title: "Registration Successful",
          icon: "success",
          text: "Welcome to our e-commerce site."
        });
      }
    })
  }

  useEffect(() => {
    if (
      firstName && lastName && email && mobileNo && password && confirmPassword &&
      password === confirmPassword && mobileNo.length === 11
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  if (user.id !== null) {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md={3} x={12}>
          
        </Col>
        <Col md={6} x={12}>
          <Form onSubmit={registerUser} className="w-100 border border-1 border-success rounded-3 mt-5 pb-4 px-3">
                <h3 className="my-2 text-center text-success">Register</h3>
                  <Form.Group className="mb-3 fw-bolder lh-1 px-5 fs-6 text-success">
                  <Form.Label>First Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First Name"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 px-5 text-success">
                  <Form.Label>Last Name:</Form.Label>
                  <Form.Control
                    type="text" 
                    placeholder="Enter Last Name"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 px-5 text-success">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control 
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autocomplete="email"
                  />
                </Form.Group>

                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 px-5 text-success">
                  <Form.Label>Mobile No:</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Enter 11 Digit No."
                    required
                    value={mobileNo}
                    onChange={e => setMobileNo(e.target.value)}
                     autocomplete="tel"
                  />
                </Form.Group>

                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 px-5 text-success">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control 
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 px-5 text-success">
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control 
                    className="accent" 
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="success"
                  type="submit"
                  id="submitBtn"
                  className="accent d-inline text-center ms-5"
                  disabled={!isActive}
                >
                  Submit
                </Button>
                <Button
                  className="accent d-inline text-center ms-5"
                  variant="secondary"
                  type="button"
                  id="cancelBtn"
                  onClick={clearForm}>
                  Cancel
                </Button>
          </Form>

        </Col>
        <Col md={3} x={12}></Col>
      </Row>
      
    </Container>
  );
}
