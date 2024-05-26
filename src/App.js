import {BrowserRouter as Router } from 'react-router-dom';
import{Route, Routes} from 'react-router-dom';
import {useState, useEffect } from 'react';
import AppNavBar from './components/AppNavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import RetrieveOrders from './pages/RetrieveOrders';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import Order from './pages/Order';
import PlaceOrder from './pages/PlaceOrder';
import Users from './pages/Users';

import './App.css';
import {UserProvider} from './UserContext';
import Container from 'react-bootstrap/Container';

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
      <Route path="/cart" element ={<Cart />}/>      
      <Route path="/myorder" element={<PlaceOrder />} />     
      <Route path="/order" element={<Order />} />     
      <Route path="/addProduct" element ={<AddProduct />}/>
      {/*<Route path="/order/my-orders" element ={<RetrieveOrders />}/>      */}
      <Route path="/products/:productId" element ={<ProductView />}/>      
      <Route path="/addProduct" element ={<AddProduct />}/>   
      <Route path="/register" element ={<Register />}/>
      <Route path="/profile" element ={<Profile />}/>
      <Route path="/login" element ={<Login />}/> 
      <Route path="/logout" element ={<Logout />}/> 
      <Route path="*" element ={<Error />}/>   
      <Route path="/users" element ={<Users />}/>      
    </Routes>
    </Container>
    </Router>
  </UserProvider>  
  );
}

export default App;
