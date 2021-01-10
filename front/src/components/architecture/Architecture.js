import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useContext, useEffect, createRef } from 'react';
import { Button, Container, Jumbotron, Form, Table } from 'react-bootstrap';
import { FaPen, FaTimes } from 'react-icons/fa';
import { UserContext } from '../../App';
import { v4 } from 'uuid';
import util from '../../assets/js/util';
import dbApi from '../../assets/js/dbApi';

const Architecture = ({opType}) => {
    const getLabel = () => {
        switch(opType) {
            case 'new':
            case 'edit':
                return 'Save';
            case 'view':
                return 'Edit';
            default:
                return 'Undefined';
        }
    }

    const formBtnHandler = id => {
        switch(pageOp) {
            case 'edit':
                setPageOp('view');
                setFormBtnLabel('Edit')
                history.push('/architecture/' + id);
                break;
            case 'view': 
                setPageOp('edit');
                setFormBtnLabel('Save')
                history.push('/architecture/' + id + '/edit');
                break;
            case 'new':
                saveNewArchitecture();
                break;
            default:
                return;
        }
    }

    const saveNewArchitecture = () => {
        const generatedId = v4();
        const newArchitecture = {
            id: generatedId,
            paper: refs.inputPaper.current.value,
            description: refs.inputDesc.current.value,
            done_by: parseInt(refs.inputDoneBy.current.value)
        }

        dbApi.saveArchitecture(newArchitecture)
            .then(({data}) => {
                if(data.success) {
                    history.push('/architecture/' + generatedId + '/edit');
                    setArchitecture(newArchitecture);
                    setPageOp('edit');
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }

    const deleteArchitectureBtnHandler = architectureId => {
        if(window.confirm("Deletion of architecture " + architectureId + " is definitive. Confirm?")) {
            dbApi.deleteArchitecture(architectureId)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    history.push('/architectures');
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
        }
    }

    const deleteComponentBtnHandler = componentId => {
        if(window.confirm("Deletion of component " + componentId + " is definitive. Confirm?")) {
            dbApi.deleteComponent(componentId)
            .then(({data})=> {
                if(data.success) {
                    removeComponent(componentId);
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
        }
    }

    const removeComponent = componentId => {
        var newComponentsList = [...architecture.components];
        var index = -1;
        
        for(var i = 0; i < newComponentsList.length; i++) {
            if(newComponentsList[i].id === componentId)  {
                index = i;
                break;
            }
        }

        if (index > -1) {
            newComponentsList.splice(index, 1);
        }

        setArchitecture({
            ...architecture,
            components: newComponentsList
        });
    }

    const getComponentArray = () => {
        if(architecture["components"]) {
            return architecture.components.map((c, i) => {
                return(
                    <tr key={"comp_" + i}>
                        <td style={{cursor:"pointer"}} onClick={() => history.push("/architecture/" + aid + "/component/" + c.id)}>{c.id}</td>
                        <td style={{cursor:"pointer"}} onClick={() => history.push("/architecture/" + aid + "/component/" + c.id)}>{c.name}</td>
                        <td hidden={pageOp === 'view' ? true : false}>
                            <Button variant="secondary" size="sm" onClick={() => history.push("/architecture/" + aid + "/component/" + c.id + "/edit")}><FaPen/></Button>&nbsp;
                            <Button variant="danger" size="sm"onClick={deleteComponentBtnHandler.bind(this, c.id)}><FaTimes/></Button>
                        </td>
                    </tr>
                )
            }) 
        }
    }

    const formUpdateHandler = e => {
        switch(e.target.id) {
            case 'formArchitecturePaper':
                setArchitecture({
                    ...architecture,
                    paper: e.target.value
                });
                break;

            case 'formArchitectureDesc':
                setArchitecture({
                    ...architecture,
                    desc: e.target.value
                });
                break;

            case 'formArchitectureDoneBy':
                setArchitecture({
                    ...architecture,
                    done_by: e.target.value
                })
                break;

            default:
                return;
        }
    }

    const getForm = () => {
        if(pageOp === 'view' || pageOp === 'edit') {
            if (util.JSONEmpty(architecture)) {
                return architectureNotFoundContainer()                   
            }
        }

        return (
            <Form onChange={formUpdateHandler.bind(this)}>
                <h1>{pageOp === 'new' ? 'Create an architecture' : 'Architecture #' + architecture.id}</h1>
                {pageOp === 'new' ? '' : <p className="lead">By {util.getUser(architecture.done_by)}</p>}
                <hr/>
                <Form.Group controlId="formArchitecturePaper">
                    <Form.Label>Associated paper</Form.Label>
                    <Form.Control ref={refs.inputPaper} type="text" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecture.paper} disabled={pageOp === 'view' ? true : false}/>
                </Form.Group>
                <Form.Group controlId="formArchitectureDesc">
                    <Form.Label>Architecture description</Form.Label>
                    <Form.Control ref={refs.inputDesc} as="textarea" rows="5" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecture.description} disabled={pageOp === 'view' ? true : false}/>
                </Form.Group>
                <Form.Label>Writer</Form.Label>
                <Form.Group controlId="formArchitectureDoneBy">
                    <Form.Control ref={refs.inputDoneBy} as="select" disabled={pageOp === 'view' ? true : false} defaultValue={pageOp === 'new' ? user : architecture.done_by}>
                        <option value={""}>Anonymous</option>
                        <option value={"six"}>Nicolas Six</option>
                        <option value={"herbaut"}>Nicolas Herbaut</option>
                        <option value={"negri"}>Claudia Negri Ribalta</option>
                    </Form.Control>
                </Form.Group>
                <p>Components</p>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th hidden={pageOp === 'view'}></th>
                        </tr>
                    </thead>
                    <tbody>
                        { getComponentArray(architecture) }
                    </tbody>
                </Table>
                <Button style={{marginRight: '5px'}} variant="secondary" onClick={() => history.push("/architectures/")}>Return</Button>
                <Button style={{marginRight: '5px'}} onClick={formBtnHandler.bind(this, architecture.id)}>{formBtnLabel}</Button>
                <Button style={{marginRight: '5px'}} variant="success" onClick={() => history.push("/architecture/" + aid + "/component/new")} hidden={pageOp !== 'edit'}>Add component</Button>
                <Button variant="danger" onClick={deleteArchitectureBtnHandler.bind(this, aid)} hidden={pageOp === 'new'}>Delete architecture</Button>
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

    let { aid } = useParams();
    const initialLabel = getLabel(opType)
    const history = useHistory();
    const user = useContext(UserContext);
    const [pageOp, setPageOp] = useState(opType);
    const [formBtnLabel, setFormBtnLabel] = useState(initialLabel)
    const [architecture, setArchitecture] = useState([])
    const refs = {
        inputDesc: createRef(),
        inputPaper: createRef(),
        inputDoneBy: createRef()
    }

    useEffect(() => {
        if(opType !== 'new') {
                dbApi.getArchitecture(aid)
                    .then(({data}) => {
                        if(data.success) {
                            setArchitecture(data.result)
                        }
                    })
                    .catch(error => {
                        if(error.response.status === 401) util.loginFailedHandler(history);
                    })
        }
    }, [])

    return <Container>{getForm()}</Container>
}

export default Architecture;