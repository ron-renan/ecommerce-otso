import { Card, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';


export default function ProductCard({productProp}) {

        // console.log(props);
        // console.log(typeof props)

        const {_id, name, description, price} = productProp;
        // Use the state hook for this component to be able to store its state
        // States are used to keep track of information related to individual components
        // Syntax
            // const [getter, setter] = useState(initialGetterValue);
        const [count, setCount] = useState(1)
        const [quantity, setQuantity] = useState(10);

        function addToCart(){
            if (quantity > 0) {
                setCount(count + 1);
                console.log('Buyer: ' + count);
                setQuantity(setQuantity - 1);
                console.log('Quantity: ' + quantity)
            } else {
                alert("Product is out of stock");
            };
        }
   

       return (
    <Card id="productComponent">
      <Card.Body>
        <Card.Title>{productProp.name}</Card.Title>
        <Card.Subtitle>Description:</Card.Subtitle>
                     <Card.Text>{productProp.description}</Card.Text>
                     <Card.Subtitle>Price:</Card.Subtitle>
                    <Card.Text>PhP {productProp.price}</Card.Text>
                     <Card.Text>Quantity: {quantity}</Card.Text>
                    <Link className="btn btn-primary" to={`/products/${_id}`}>Add to Cart</Link>
      </Card.Body>
    </Card>
  );

   }
