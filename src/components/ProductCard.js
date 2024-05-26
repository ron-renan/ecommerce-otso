import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

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
  const {user} = useContext(UserContext);
    const addToCart = () => {
    if (quantity > 0) {
      setCount(count + 1);
      console.log('Buyer: ' + count);
      setQuantity(quantity - 1);
      console.log('Quantity: ' + quantity)
    } else {
      alert("Product is out of stock");
        }
    };
  // if(!user || !user.id) {
  //   return <Navigate to="/login" />
  // }
  
       return (
    <Card id="productComponent" >
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle>Description:</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Card.Subtitle>Price:</Card.Subtitle>
        <Card.Text>&#8369; {price}</Card.Text>
        <Card.Text>Quantity: {quantity}</Card.Text>
         {(!user || !user.id) ?
        <Link className="btn btn-primary" to={`/products/${_id}`}>details</Link>
        :
        <Button variant="success" block="true" onClick={addToCart}>
        Add To Cart</Button>
        }
      </Card.Body>
    </Card>
  );

}
