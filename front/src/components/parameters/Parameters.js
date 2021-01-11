import { Container, Form } from 'react-bootstrap';
import { createRef, useState } from 'react';

const Parameters = () => {
    const [debugModeInputState, setDebugModeInputState] = useState(localStorage.getItem("debugMode") ? true : false)
    const refs = {
        debugModeInputRef: createRef()
    }

    const handleDebugModeChange = e => {
        if(e.target.checked) {
            localStorage.setItem("debugMode", true);
        }
        else {
            localStorage.removeItem("debugMode");
        }
        setDebugModeInputState(e.target.checked);
    }
    
    return (
        <Container>
            <h1>Parameters</h1>
            <Form>
                <Form.Group controlId="formDebugCheckbox">
                    <Form.Check type="checkbox" label="Activate debug mode" ref={refs.debugModeInputRef} checked={debugModeInputState} onChange={handleDebugModeChange}/>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default Parameters;