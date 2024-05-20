import { Form, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

        export default function Login() {

            const { user, setUser } = useContext(UserContext);

            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');   
            const [isActive, setIsActive] = useState(true);

            function authenticate(e) {

                    // Prevents page redirection via form submission
                    e.preventDefault();
                    fetch('http://localhost:4003/b3/users/login',{

                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
        
                        email: email,
                        password: password
        
                    })
                })
                .then(res => res.json())
                .then(data => {

                    if(typeof data.access !== "undefined"){
                        localStorage.setItem("token", data.access);

                        // invoked the retrieveUserDetails function providing the token to be used to retrieve user details.
                        retrieveUserDetails(data.access);

                        // alert("Login successful");
                        
                        Swal.fire({
                            title: "Login Successful",
                            icon: "success",
                            text: "Welcome to E-Commerce App"
                        })

                    }
                    else{
                        Swal.fire({
                            title: "Authentication failed",
                            icon: "error",
                            text: "Check your login details and try again"
                        })
                    }

                    
                })
                // Clear input fields after submission
                setEmail('');
                setPassword('');
            }


            const retrieveUserDetails = (token) => {
                fetch('http://localhost:4003/b3/users/details',{
                headers: {
                    "Authorization": `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);

                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin
                    })

                });
            }

            useEffect(() => {

                setIsActive(email !== '' && password !== '');
                  
                }, [email, password]);

            return (    

                    (user.id !== null) ?
                        <Navigate to="/products/active" />
                    :
                    
                     <Form onSubmit={(e) => authenticate(e)}>
                            <h1 className="my-5 text-center">Login</h1>
                            <Form.Group controlId="userEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            { isActive ? 
                            <Button variant="primary" type="submit" id="submitBtn">
                                Submit
                            </Button>
                            : 
                            <Button variant="danger" type="submit" id="submitBtn" disabled>
                                Submit
                            </Button>
                        }
                        </Form>     
            )
        }