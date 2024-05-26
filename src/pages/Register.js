import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
    <Container className="d-flex justify-content-center align-items-center">
      <Form onSubmit={registerUser} className="w-50 border border-4 mt-2 px-5">
        <Row>
          <Col>
            <h3 className="my-2 text-center">Register</h3>
            <Row>
              <Col md={1} ></Col>
              <Col md={10}>
                <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-secondary">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-secondary">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text" 
                placeholder="Enter Last Name"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-secondary">
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

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-secondary">
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

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-secondary">
              <Form.Label>Password:</Form.Label>
              <Form.Control 
                type="password"
                placeholder="Enter Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 fw-bolder lh-1 fs-6 text-secondary">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
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
          <Col md={7} ></Col>
          <Col md={2}>
            <Button className="text-center"
              variant={isActive ? "primary" : "danger"}
              type="submit"
              id="submitBtn"
              className="mb-3 mr-5"
              disabled={!isActive}
            >
              Submit
            </Button>
          </Col>
          <Col md={3}>
            <Button
              variant="secondary"
              type="reset"
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
