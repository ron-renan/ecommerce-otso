import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';


export default function UserView({ productsData }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const activeProducts = productsData.filter(product => product.isActive);
    setProducts(activeProducts);
    setFilteredProducts(activeProducts);
  }, [productsData]);


  return (
    <>

      <div className="product-list">
   
          <ProductCard courseProp={product} key={product._id} />
     
      </div>
    </>

}