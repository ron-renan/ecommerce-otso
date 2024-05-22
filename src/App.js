import {BrowserRouter as Router} from 'react-router-dom';
import{Route, Routes} from 'react-router-dom';
import {useState, useEffect } from 'react';
import AppNavBar from './components/AppNavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import ProductView from './pages/ProductView';

import './App.css';
import {UserProvider} from './UserContext';
import {Container} from 'react-bootstrap';

function App() {
   const [user, setUser] = useState({
    id: null,
    isAdmin: null
    // token: localStorage.getItem('token')
  })

  useEffect(() => {
    console.log(user);
    console.log(localStorage)
  }, [user]);

  const unsetUser = () => {
    localStorage.clear();
  }

  return (
  <UserProvider value={{user, setUser, unsetUser}}>  
    <Router>
   <Container>
    <AppNavBar />
    <Routes>
      <Route path="/" element ={<Home />}/>      
      <Route path="/products" element ={<Products />}/>      
      <Route path="/products/:productId" element ={<ProductView />}/>      
      <Route path="/addProduct" element ={<AddProduct />}/>
      <Route path="/register" element ={<Register />}/>
      <Route path="/profile" element ={<Profile />}/>
      <Route path="/login" element ={<Login />}/> 
      <Route path="/logout" element ={<Logout />}/>   
      </Routes>
    </Container>
    </Router>
  </UserProvider>  
  );
}

export default App;
