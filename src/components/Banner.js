import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({data}) {

    console.log(data);
    const {title, content, destination, label} = data;

    return (
        <Row>
            <Col className="p-5 text-center mt-5 second">
                <h4>{title}</h4>
                <p>{content}</p>
                <Link className="btn btn-success accent" to={destination}>{label}</Link>
            </Col>
        </Row>
    );
}