// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({ id: null, isAdmin: false });
  const [cartCount, setCartCount] = useState();

  const refreshCartCount = async () => {
    try {
      const response = await fetch('http://ec2-3-143-236-183.us-east-2.compute.amazonaws.com/b3/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }

      const data = await response.json();
      if (data) {
        setCartCount(data.items.length);  
      }
      
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const unsetUser = () => {
    setUser({ id: null, isAdmin: false });
    setCartCount(0);
    localStorage.clear();
  };

  useEffect(() => {
    if (user.id) {
      refreshCartCount();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, cartCount, setCartCount, refreshCartCount, unsetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
