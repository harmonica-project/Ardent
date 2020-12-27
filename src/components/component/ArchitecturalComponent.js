import { Form, Jumbotron, Button, Container, Table } from 'react-bootstrap';
import { Component, useState } from 'react';
import { FaPen, FaTimes } from 'react-icons/fa';
import { architectures } from '../../assets/js/fakeData';
import { useParams, useHistory } from 'react-router-dom';
import util from '../../assets/js/util';

const ArchitecturalComponent = ({opType}) => {
    const formUpdateHandler = () => {
        return;
    }
    
    const formBtnHandler = (aid, cid) => {
        if (pageOp === 'edit') {
            setPageOp('view');
            setFormBtnLabel('Edit')
            history.push('/architecture/' + aid + "/component/" + cid);
        } 
        else if (pageOp === 'view') {
            setPageOp('edit');
            setFormBtnLabel('Save')
            history.push('/architecture/' + aid + "/component/" + cid + '/edit')
        }
    }

    const getLabel = () => {
        switch(opType) {
            case 'new':
            case 'edit':
                return 'Save';
            case 'view':
                return 'Edit';
        }
    }

    // Temporary
    const initArchitecturalComponent = compId => {
        for(var i = 0; i < architectures.length; i++) {
            for (var j = 0; j < architectures[i].components.length; j++) {
                if(parseInt(architectures[i].components[j].id) === parseInt(compId)) {
                    return architectures[i].components[j];
                }
            }
        }
        
        return {}
    }

    const getForm = () => {
        if(pageOp === 'view' || pageOp === 'edit') {
            if (util.JSONEmpty(architecturalComponent)) {
                return architecturalComponentNotFoundContainer()                   
            }
        }


        return (
            <Form onChange={formUpdateHandler.bind(this)}>
                <h1>{pageOp === 'new' ? 'Create a component' : 'Component #' + architecturalComponent.id}</h1>
                <p className="lead">In architecture #{aid}</p>
                <hr/>
                <Form.Group controlId="formArchitecturePaper">
                    <Form.Label>Component name</Form.Label>
                    <Form.Control type="text" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecturalComponent.name} disabled={pageOp === 'view' ? true : false}/>
                </Form.Group>
                <p>Properties</p>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Key</th>
                        <th>Value</th>
                        <th hidden={pageOp === 'view' ? true : false}></th>
                        </tr>
                    </thead>
                    <tbody>
                        { getPropertiesArray(architecturalComponent) }
                    </tbody>
                </Table>
                <Button variant="secondary" onClick={() => history.push("/architecture/" + aid)}>Return</Button>&nbsp;
                <Button onClick={formBtnHandler.bind(this, aid, cid)}>{formBtnLabel}</Button>&nbsp;
            </Form>
        )
    }

    const getPropertiesArray = (comp) => {
        if(comp["properties"]) {
            return comp["properties"].map((p, i) => {
                return(
                    <tr key={"prop_" + i}>
                        <td>{p.id}</td>
                        <td>{p.key}</td>
                        <td>{p.value}</td>
                        <td hidden={pageOp === 'view' ? true : false}>
                            <Button variant="secondary" size="sm"><FaPen/></Button>&nbsp;
                            <Button variant="danger" size="sm"><FaTimes/></Button>
                        </td>
                    </tr>
                )
            }) 
        }
    }

    const architecturalComponentNotFoundContainer = () => {
        return(
            <Jumbotron>
            <h1>Component not found</h1>
                <p>
                    It seems that the component does not exists. It might have been deleted by another user, please walk back to architecture page or go to the architecture list.
                </p>
                <p>
                    <Button onClick={() => history.push('/architecture/' + aid)}>Return to architecture</Button>
                </p>
            </Jumbotron>
        )
    }

    let { cid, aid } = useParams();
    const initialLabel = getLabel(opType)
    const history = useHistory();
    const [pageOp, setPageOp] = useState(opType);
    const [formBtnLabel, setFormBtnLabel] = useState(initialLabel)
    const [architecturalComponent, setArchitecturalComponent] = useState(initArchitecturalComponent(cid))

    return <Container>{getForm()}</Container>
}

export default ArchitecturalComponent;