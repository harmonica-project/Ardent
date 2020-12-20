import { useParams, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Container, Jumbotron } from 'react-bootstrap';
import { Form, Table } from 'react-bootstrap';
import { architectures } from '../../assets/js/fakeData';
import { FaPen, FaTimes } from 'react-icons/fa';

const Architecture = ({opType}) => {
    const getLabel = () => {
        switch(opType) {
            case 'new':
            case 'edit':
                return 'Save';
            case 'view':
                return 'Edit';
        }
    }

    const initArchitecture = archId => {
        //console.log('id : ' + id)
        for(var i = 0; i < architectures.length; i++) {
            //console.log('iteration')
            //console.log(i, architectures[i])
            if(parseInt(architectures[i].id) === parseInt(archId)) {
                return architectures[i];
            }
        }

        return {};
    }

    const formBtnHandler = id => {
        if (pageOp === 'edit') {
            setPageOp('view');
            setFormBtnLabel('Edit')
            history.push('/architecture/' + id);
        } 
        else if (pageOp === 'view') {
            setPageOp('edit');
            setFormBtnLabel('Save')
            history.push('/architecture/' + id + '/edit')
        }
    }

    const getComponentArray = (arch) => {
        if(arch["components"]) {
            return arch.components.map((c, i) => {
                return(
                    <tr key={"comp_" + i}>
                        <td style={{cursor:"pointer"}} onClick={() => history.push("/component/" + c.id)}>{c.id}</td>
                        <td style={{cursor:"pointer"}} onClick={() => history.push("/component/" + c.id)}>{c.name}</td>
                        <td hidden={pageOp === 'view' ? true : false}>
                            <Button variant="secondary" size="sm" onClick={() => history.push("/component/" + c.id + "/edit")}><FaPen/></Button>&nbsp;
                            <Button variant="danger" size="sm"><FaTimes/></Button>
                        </td>
                    </tr>
                )
            }) 
        }
    }

    const getForm = () => {
        var a = false;
        if(pageOp === 'view' || pageOp === 'edit') {
            if (architecture === {}) {
                return architectureNotFoundContainer()                   
            }
        }

        return (
            <Form>
                <h1>{pageOp === 'new' ? 'Create an architecture' : 'Architecture #' + architecture.id}</h1>
                {pageOp === 'new' ? '' : <p className="lead">By {architecture.doneBy}</p>}
                <hr/>
                <Form.Group controlId="formArchitecturePaper">
                    <Form.Label>Associated paper</Form.Label>
                    <Form.Control type="text" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecture.paper} disabled={pageOp === 'view' ? true : false}/>
                </Form.Group>
                <Form.Group controlId="formArchitectureDesc">
                    <Form.Label>Architecture description</Form.Label>
                    <Form.Control as="textarea" rows="5" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecture.paper} disabled={pageOp === 'view' ? true : false}/>
                </Form.Group>
                <p>Components</p>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th hidden={pageOp === 'view' ? true : false}></th>
                        </tr>
                    </thead>
                    <tbody>
                        { getComponentArray(architecture) }
                    </tbody>
                </Table>
                <Button variant="secondary" onClick={() => history.push("/architectures/")}>Return</Button>&nbsp;
                <Button onClick={formBtnHandler.bind(this, architecture.id)}>{formBtnLabel}</Button>&nbsp;
                <Button variant="success" onClick={formBtnHandler.bind(this, architecture.id)} hidden={pageOp === 'view' ? true : false}>Add component</Button>
            </Form>
        )
    }

    const architectureNotFoundContainer = () => {
        return(
            <Jumbotron>
            <h1>Architecture not found</h1>
                <p>
                    It seems that the architecture does not exists. It might have been deleted by another user, please return to the architecture page.
                </p>
                <p>
                    <Button onClick={() => history.push('/architectures')}>Return to architectures</Button>
                </p>
            </Jumbotron>
        )
    }

    let { id } = useParams();
    const initialLabel = getLabel(opType)
    const history = useHistory();
    const [pageOp, setPageOp] = useState(opType);
    const [formBtnLabel, setFormBtnLabel] = useState(initialLabel)
    const [architecture, getArchitecture] = useState(initArchitecture(id))

    return <Container>{getForm()}</Container>
}

export default Architecture;