import { Form, Jumbotron, Button, Container, Table, InputGroup } from 'react-bootstrap';
import { useState, useEffect, createRef } from 'react';
import { FaPen, FaTimes } from 'react-icons/fa';
import { useParams, useHistory } from 'react-router-dom';
import { v4 } from 'uuid';
import util from '../../assets/js/util';
import dbApi from '../../assets/js/dbApi';

const ArchitecturalComponent = ({opType}) => {
    const formUpdateHandler = () => {
        return;
    }
    
    const formBtnHandler = (aid, cid) => {
        switch(pageOp) {
            case 'edit':
                setPageOp('view');
                setFormBtnLabel('Edit')
                history.push('/architecture/' + aid + "/component/" + cid);
                break;
            case 'view': 
                setPageOp('edit');
                setFormBtnLabel('Save')
                history.push('/architecture/' + aid + "/component/" + cid + '/edit')
                break;
            case 'new':
                saveNewComponent(aid);
                break;
            default:
                return;
        }
    }

    const saveNewComponent = aid => {
        const generatedId = v4();
        const newComponent = {
            id: generatedId,
            name: (componentNameAsInput ? refs.inputTextName.current.value : refs.inputSelectName.current.value),
            architectureId: aid,
            description: refs.inputDesc.current.value
        }

        dbApi.saveComponent(newComponent)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    history.push('/architecture/' + aid + '/component/' + generatedId + "/edit");
                    setArchitecturalComponent(newComponent);
                    setPageOp('edit');
                }
            })
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

    const handleComponentNameAsInput = () => {
        setComponentNameAsInput(!componentNameAsInput);
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
                <p>Component name</p>
                <Form inline>
                    <Button onClick={handleComponentNameAsInput} style={{marginRight: "5px"}} hidden={pageOp === 'view'}>{componentNameAsInput ? "Click to use existing component name" : "Click to add a new component name"}</Button>
                    <Form.Control ref={refs.inputTextName} type="text" style={{flexGrow: '1'}} placeholder="Unknown" hidden={!componentNameAsInput} disabled={pageOp === 'view'}></Form.Control>
                    <Form.Control ref={refs.inputSelectName}  as="select" style={{flexGrow: '1'}} hidden={componentNameAsInput} disabled={pageOp === 'view'}>
                        {
                            componentsNames.map(nameJson => {
                                return <option key={"name_" + nameJson.name} selected={nameJson.name === architecturalComponent["name"]} value={nameJson.name}>{nameJson.name}</option>
                            })
                        }
                    </Form.Control>
                </Form><br/>
                <Form.Group controlId="formComponentDesc">
                    <Form.Label>Component description</Form.Label>
                    <Form.Control ref={refs.inputDesc} as="textarea" rows="5" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecturalComponent.description} disabled={pageOp === 'view' ? true : false}/>
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
                <Button style={{marginRight: '5px'}}  variant="secondary" onClick={() => history.push("/architecture/" + aid)}>Return</Button>
                <Button style={{marginRight: '5px'}}  onClick={formBtnHandler.bind(this, aid, cid)}>{formBtnLabel}</Button>
                <Button style={{marginRight: '5px'}}  variant="success" onClick={() => history.push("/architecture/" + aid + "/component/" + cid + "/property/new")} hidden={pageOp !== 'edit'}>Add property</Button>
                <Button variant="danger" onClick={deleteComponentBtnHandler.bind(this, cid, aid)} hidden={pageOp === 'new'}>Delete component</Button>
            </Form>
        )
    }

    const deleteComponentBtnHandler = (componentId, aid) => {
        if(window.confirm("Deletion of component " + componentId + " is definitive. Confirm?")) {
            dbApi.deleteComponent(componentId)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    history.push('/architecture/' + aid);
                }
            })
        }
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
    const [architecturalComponent, setArchitecturalComponent] = useState([])
    const [componentsNames, setComponentsNames] = useState([])
    const [componentNameAsInput, setComponentNameAsInput] = useState(false)
    const refs = {
        inputSelectName: createRef(),
        inputTextName: createRef(),
        inputDesc: createRef()
    }

    useEffect(() => {
        if(opType !== 'new') {
            dbApi.getComponent(cid)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    setArchitecturalComponent(data.result)
                }
            })
        }

        dbApi.getComponentsNames()
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    setComponentsNames(data.result)
                }
            })
    }, [])

    return <Container>{getForm()}</Container>
}

export default ArchitecturalComponent;