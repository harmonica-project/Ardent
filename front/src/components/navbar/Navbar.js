import { Navbar, Nav, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import util from '../../assets/js/util';
import dbApi from '../../assets/js/dbApi';
import './navbar.css';

const NavbarComponent = () => {
    const [currentUser, setCurrentUser] = useState(null);

    window.addEventListener('storage', () => {
        console.log('yo')
        setCurrentUser(localStorage.getItem("currentUser"));
    });

    const getAuthPart = () => {
        if(currentUser) {
            return(<Nav>
                <Navbar.Text className="navbarLoginItem">Connected: {util.getUser(currentUser)}</Navbar.Text>
                <Nav.Link className="navbarLoginLink" onClick={logoutUser} href="/">Logout</Nav.Link>
            </Nav>)
        }
        else {
            return(<Nav>
                <Nav.Link className="navbarLoginLink" href="/login">Login</Nav.Link>
            </Nav>)
        }
    }

    const logoutUser = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("currentUser");
    }

    useEffect(() => {
        setCurrentUser(localStorage.getItem("currentUser"));
    }, [])

    return (
        <Navbar bg="light" expand="lg" className="navbarMain">
            <Navbar.Brand href="/">SLR architecture extraction tool</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/architectures">Architectures</Nav.Link>
            </Navbar.Collapse>
            { getAuthPart() }
        </Navbar>
    )
}

export default NavbarComponent;