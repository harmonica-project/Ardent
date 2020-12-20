import { Navbar, Nav, Form } from 'react-bootstrap';
import './navbar.css';

const NavbarComponent = props => {
    const handleUserChange = e => {
        props.changeUser(e.target.value);
    } 

    return (
        <Navbar bg="light" expand="lg" className="navbarMain">
            <Navbar.Brand href="/">SLR architecture extraction tool</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/architectures">Architectures</Nav.Link>
            </Navbar.Collapse>
            <Form inline>
                <Form.Control as="select" onChange={handleUserChange}>
                    <option value={0}>Anonymous</option>
                    <option value={1}>Nicolas Six</option>
                    <option value={2}>Nicolas Herbaut</option>
                    <option value={3}>Claudia Negri Ribalta</option>
                </Form.Control>
            </Form>
        </Navbar>
    )
}

export default NavbarComponent;