import { Form, Button} from 'react-bootstrap';
import { useState, useEffect} from 'react';

export default function Register() {

		const [firstName,setFirstName] = useState("");
		const [lastName,setLastName] = useState("");
		const [email,setEmail] = useState("");
		const [mobileNo,setMobileNo] = useState("");
		const [password,setPassword] = useState("");
		const [confirmPassword,setConfirmPassword] = useState("");
		const [isActive,setIsActive] = useState(false);

					console.log(firstName);
                    console.log(lastName);
                    console.log(email);
                    console.log(mobileNo);
                    console.log(password);
                    console.log(confirmPassword);

                    function registerUser(e){
                    	e.preventDefault();
                    	fetch('http://localhost:4003/b3/users/register', {
                    		method: 'POST',
                    		headers: {
                    			"Content-Type": "application/json"
                    		},
                    		body: JSON.stringify({
                    			firstName : firstName,
                    			lastName : lastName,
                    			email: email,
                    			mobileNo : mobileNo,
                    			password: password
                    		})
                    	}).then(res => res.json())
                    	.then(data =>{
                    		console.log(data);
                    		if(data.message === "Registered Successfully"){
                    			setFirstName('');
                    			setLastName('');
                    			setEmail('');
                    			setMobileNo('');
                    			setPassword('');
                    			setConfirmPassword('');
                    			alert("Registration Successful")
                    		}else if (data.error === 'Invalid email'){
                    			alert("Email is invalid");
                    		}else if(data.error === "Mobile number must be at least 11 digits"){
                    			alert("Mobile number must be at least 11 digitsd");
                    		}else if(data.error === "Password must be atleast 8 characters"){
                    			alert("Password must be atleast 8 characters");
                    		}else {
                    			alert("Internal server error")
                    		}
                    	})
                    }
                //     useEffect() has two argument, function and dependency
                // - function - represents the side effect you want to perform. This will be executed when the component renders.
                // - dependency - optional array. The effect will run when there are changes in the component's dependencies. When there is no provided array, the effect will run on every render of the component.

        useEffect(()=>{
        	if((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword) && (mobileNo.length === 11)){

        		setIsActive(true)
        	} else {
        		setIsActive(false)
        	}
        }, [firstName, lastName, email, mobileNo, password, confirmPassword])

	return(
			<Form onSubmit={(e) => registerUser(e)}>
			<h1 className="my-5 text-center">Register</h1>

			<Form.Group className="mb-3">
			  <Form.Label>First Name:</Form.Label>
			  <Form.Control 
			  type="text" 
			  placeholder="Enter First Name" 
			  required
			  value={firstName}
			  onChange={e => {setFirstName(e.target.value)}}
			  />
			</Form.Group>

			<Form.Group className="mb-3">
			  <Form.Label>Last Name:</Form.Label>
			  <Form.Control 
			  type="text" 
			  placeholder="Enter Last Name" 
			  required
			  value={lastName}
			  onChange={e => {setLastName(e.target.value)}}
			  />
			</Form.Group>

		      <Form.Group className="mb-3">
		        <Form.Label>Email:</Form.Label>
		        <Form.Control 
		        type="email" 
		        placeholder="Enter email" 
		        required
		        value={email}
			  	onChange={e => {setEmail(e.target.value)}}
		        />
		      </Form.Group>

		      <Form.Group className="mb-3">
		        <Form.Label>Mobile No:</Form.Label>
		        <Form.Control 
		        type="text" 
		        placeholder="Enter 11 Digit No." 
		        required
		        value={mobileNo}
			  	onChange={e => {setMobileNo(e.target.value)}}
		        />
		      </Form.Group>

		      <Form.Group className="mb-3">
		        <Form.Label>Password:</Form.Label>
		        <Form.Control 
		        type="password" 
		        placeholder="Enter Password" 
		        required
		        value={password}
			  	onChange={e => {setPassword(e.target.value)}}
		        />
		      </Form.Group>

		      <Form.Group className="mb-3">
		        <Form.Label>Confirm Password:</Form.Label>
		        <Form.Control 
		        type="password" 
		        placeholder="Confirm Password" 
		        required
		        value={confirmPassword}
			  	onChange={e => {setConfirmPassword(e.target.value)}}
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