import { Container, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import dbApi from "../../assets/js/dbApi";

const Login = () => {
    const history = useHistory();
    const handleSubmit = e => {
        e.preventDefault()
        dbApi.loginUser({auth: {
            username: e.target.formUsername.value,
            password: e.target.formPassword.value
        }})
            .then(response => {
                if(response.data.success) {
                    localStorage.setItem("currentUser", response.data.loggedUser);
                    localStorage.setItem("username", e.target.formUsername.value);
                    localStorage.setItem("password", e.target.formPassword.value)
                    history.push("/architectures");
                }
            })
        }

    return(
        <Container>
            <h1>Login menu</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter your username" />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button type="submit">Submit</Button>
            </Form>
        </Container>
    )
}

export default Login;