import {useContext, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import UserContext from '../UserContext';
export default function Logout(){
	//localStorage.clear();

	// Placing the "setUser" setter function inside of a useEffect is necessary because of updates within React JS that a state of another component cannot be updated while trying to render a different component
            // By adding the useEffect, this will allow the Logout page to render first before triggering the useEffect which changes the state of our user
	const{unsetUser, setUser} = useContext(UserContext);
	unsetUser();
	useEffect(() => {
		setUser({id:null, isAdmin:null
	});
	})
	return(
		<Navigate to="/login" />
		)
}