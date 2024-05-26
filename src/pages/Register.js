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

    fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/users/register' , {
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
        // setFirstName('');
        // setLastName('');
        // setEmail('');
        // setMobileNo('');
        // setPassword('');
        // setConfirmPassword('');

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
    <Container className="d-flex justify-content-center align-items-center" style={{height: "100vh"}} >
      <Form onSubmit={registerUser} className="w-40 border border-1 border-success rounded-3 mt-5 px-3">
        <Row>
          <Col>
            <h3 className="my-2 text-center text-success">Register</h3>
            <Row>
              <Col md={1} ></Col>
              <Col md={10}>
                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-success">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-success">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text" 
                placeholder="Enter Last Name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-success">
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

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-success">
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

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-success">
              <Form.Label>Password:</Form.Label>
              <Form.Control 
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-success">
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

              </Col>
              <Col md={1}></Col>
            </Row>
            
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={2} ></Col>
          <Col md={5}>
            <Button className="text-center"
              variant="success"
              type="submit"
              id="submitBtn"
              className="mb-3 accent"
              disabled={!isActive}
            >
              Submit
            </Button>
          </Col>
          <Col md={5}>
            <Button
              className="accent"
              variant="secondary"
              type="button"
              id="cancelBtn"
              onClick={clearForm}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
