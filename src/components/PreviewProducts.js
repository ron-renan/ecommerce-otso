import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props){

	const { breakPoint, data } = props

	const { _id, name, description, price } = data

	return(
		<Col xs={12} md={ breakPoint }> 
			<Card className="cardHighlights mx-2">
		      <Card.Body>
		        <Card.Title className="text-center">
		        <Link to={`/products/${ _id}`}>{ name }</Link>
		        </Card.Title>
		        <Card.Text>
		          { description }
		        </Card.Text>	        
		      </Card.Body>
		      <Card.Footer>
		      	<h5 className="text-center">&#8369; { price }</h5>
		      </Card.Footer>
		    </Card>
		</Col>
	)
}
