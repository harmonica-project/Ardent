import { Container, Jumbotron, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Home = () => {
    const history = useHistory();

    return (
    <Container>
        <Jumbotron>
            <h1>Hello! 🙂</h1>
            <p>
                I developed this app to input architectures, components, and properties to form a knowledge base and extract patterns later.
            </p>
            <p>
                <b>Here is a quick tutorial -</b> first, change the user in the corner-right of the app as yourself. Then, 
                for each paper, create a new architecture, add a reference to the paper and a short description, then 
                select the components and their properties that are present into the architecture described in the paper. 
                If a component or a property does not exist yet, you can just create it! 
                And if you need help, feel free to PM me on Slack <a href="https://app.slack.com/client/TEG1QQZ0A/DTCQNE7KR">@Nicolas Six</a>.
            </p>
            <p>
            {localStorage.getItem("currentUser") ? <Button variant="primary" onClick={() => history.push("/architectures")}>Go to architectures</Button> : <Button variant="primary" onClick={() => history.push("/login")}>Login to start</Button>}
            </p>
        </Jumbotron>
    </Container>
    )
}

export default Home;