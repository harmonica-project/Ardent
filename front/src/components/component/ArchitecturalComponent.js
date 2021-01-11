import { Form, Jumbotron, Button, Container, Table } from 'react-bootstrap';
import { useState, useEffect, createRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useParams, useHistory } from 'react-router-dom';
import { v4 } from 'uuid';
import util from '../../assets/js/util';
import dbApi from '../../assets/js/dbApi';

const ArchitecturalComponent = ({opType}) => {
    const formBtnHandler = (aid, cid) => {
        switch(pageOp) {
            case 'edit':
                saveExistingComponent(aid, cid)
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

    const saveExistingComponent = (aid, cid) => {
        const newComponent = {
            id: cid,
            name: (componentNameAsInput ? refs.inputTextName.current.value : refs.inputSelectName.current.value),
            architectureId: aid,
            description: refs.inputDesc.current.value
        }

        dbApi.saveExistingComponent(newComponent)
            .then(({data}) => {
                if(data.success) {
                    setArchitecturalComponent({
                        ...architecturalComponent,
                        ...newComponent
                    });
                    getComponentsNames();
                    setPageOp('view');
                    setFormBtnLabel('Edit')
                    history.push('/architecture/' + aid + "/component/" + cid);
                }
            })
            .catch(error => {
                console.log(error)
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }

    const saveNewComponent = aid => {
        const generatedId = v4();
        const newComponent = {
            id: generatedId,
            name: (componentNameAsInput ? refs.inputTextName.current.value : refs.inputSelectName.current.value),
            architectureId: aid,
            description: refs.inputDesc.current.value
        }

        dbApi.saveNewComponent(newComponent)
            .then(({data}) => {
                if(data.success) {
                    setArchitecturalComponent({
                        ...newComponent,
                        properties: [],
                        connections: []
                    });
                    setLoaded({
                        ...loaded,
                        architecturalComponent: true
                    });
                    getComponentsNames();
                    getReferenceArchitecture();
                    setPageOp('edit');
                    history.push('/architecture/' + aid + '/component/' + generatedId + "/edit");
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }

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

    const handleComponentNameAsInput = () => {
        setComponentNameAsInput(!componentNameAsInput);
    }

    const getComponentSelectOptions = () => {
        const alreadyOut = [];

        return (
            componentsNames.map(nameJson => {
                if(!alreadyOut.includes(nameJson.name)) {
                    alreadyOut.push(nameJson.name);
                    return <option key={"name_" + nameJson.name} selected={nameJson.name === architecturalComponent["name"]} value={nameJson.name}>{nameJson.name}</option>
                }
                return false;
            })
        )
    }
    const getForm = () => {
        if(pageOp === 'view' || pageOp === 'edit') {
            if (util.JSONEmpty(architecturalComponent)) {
                return architecturalComponentNotFoundContainer()                   
            }
            if(!loaded.architecturalComponent) return (<div>Loading ...</div>)
        }

        return (
            <div>
                <Form>
                    <h1>{pageOp === 'new' ? 'Create a component' : 'Component #' + util.reduceUUID(architecturalComponent.id)}</h1>
                    <p className="lead">In architecture #{util.reduceUUID(aid)}</p>
                    <hr/><p>Component name</p>
                    <Form inline>
                        <Button onClick={handleComponentNameAsInput} style={{marginRight: "5px"}} hidden={pageOp === 'view'}>{componentNameAsInput ? "Click to use existing component name" : "Click to add a new component name"}</Button>
                        <Form.Control onChange={handleComponentNameChange.bind(this)} ref={refs.inputTextName} type="text" style={{flexGrow: '1'}} placeholder="Unknown" hidden={!componentNameAsInput} disabled={pageOp === 'view'}></Form.Control>
                        <Form.Control onChange={handleComponentNameChange.bind(this)} ref={refs.inputSelectName}  as="select" style={{flexGrow: '1'}} hidden={componentNameAsInput} disabled={pageOp === 'view'}>
                            {
                                getComponentSelectOptions()
                            }
                        </Form.Control>
                    </Form><br/>
                    <Form.Group controlId="formComponentDesc">
                        <Form.Label>Component description</Form.Label>
                        <Form.Control ref={refs.inputDesc} as="textarea" rows="5" placeholder="Unknown" defaultValue={pageOp === 'new' ? '' : architecturalComponent.description} disabled={pageOp === 'view' ? true : false}/>
                    </Form.Group>
                    <Button style={{marginRight: '5px'}}  variant="secondary" onClick={() => history.push("/architecture/" + aid)}>Return</Button>
                    <Button style={{marginRight: '5px'}}  onClick={formBtnHandler.bind(this, aid, cid)}>{formBtnLabel}</Button>
                    <Button variant="danger" onClick={deleteComponentBtnHandler.bind(this, cid, aid)} hidden={pageOp === 'new'}>Delete component</Button>
                </Form>
                <div hidden={pageOp === 'new'}>
                    <hr/><h3>Properties</h3><br/>
                        { getPropertiesTable() }
                </div>
                <div hidden={pageOp === 'new'}>
                    <hr/><h3>Connections to other components</h3><br/>
                        { getConnectionsTable() }
                </div>
                <div hidden={pageOp !== 'edit'}>
                    <hr/><h3>Add a new property</h3><br/>
                    <input ref={refs.inputPropertyTextKey} type="text" className="form-control" name="propertiesKeysInput" list="propertiesKeysInputList" onChange={handleInputPropertyKeyChange}/>
                        <datalist id="propertiesKeysInputList">
                            {
                                propertiesKeys.map(nameJson => {
                                    return (<option key={"key_" + nameJson.key} value={nameJson.key}/>)
                                })
                            }
                        </datalist>
                    <input ref={refs.inputPropertyTextValue} type="text" className="form-control" name="propertiesValuesInput" list="propertiesValuesInputList" hidden={hiddenValueField}/>
                        <datalist id="propertiesValuesInputList">
                            {
                                propertiesValues.map(nameJson => {
                                    return (<option key={"key_" + nameJson.value} value={nameJson.value}/>)
                                })
                            }
                        </datalist>
                    <br/>
                    <Button variant="success" onClick={saveProperty} hidden={pageOp !== 'edit'}>Add property</Button>
                    <hr/><h3>Add a new connexion to another component</h3><br/>
                    <Form.Control ref={refs.inputSelectComponentForLink} as="select" style={{flexGrow: '1'}}>
                    {
                        referenceArchitecture["components"].map(component => {
                            return <option key={"id_" + component.id} value={component.id}>{component.name}</option>
                        })
                    }
                    </Form.Control><br/>
                    <Button variant="success" onClick={saveConnections} hidden={pageOp !== 'edit'}>Add connection</Button>
                </div>
            </div>
        )
    }

    const saveConnections = () => {
        const generatedId = v4();
        const newConnection = {
            id: generatedId,
            first_component: cid,
            second_component: refs.inputSelectComponentForLink.current.value
        }

        dbApi.saveConnection(newConnection)
                .then(({data}) => {
                    if(data.success) {
                        var newAc = {...architecturalComponent};
                        newAc["connections"].push(newConnection);
                        setArchitecturalComponent(newAc);
                    }
                })
                .catch(error => {
                    if(error.response.status === 401) util.loginFailedHandler(history);
                })
    }

    const deleteConnectionBtnHandler = connectionId => {
        dbApi.deleteConnection(connectionId)
            .then(({data}) => {
                if(data.success) {
                    var newAc = {...architecturalComponent};
                    for(var i = 0; i < newAc["connections"].length; i++) {
                        if (newAc["connections"][i].id === connectionId) {
                            newAc["connections"].splice(i, 1);
                            break;
                        }
                    }

                    setArchitecturalComponent(newAc);
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }

    const saveProperty = () => {
        if(refs.inputPropertyTextKey.current.value.length > 0 && refs.inputPropertyTextValue.current.value.length > 0) {
            const generatedId = v4();
            const newProperty = {
                id: generatedId,
                key: refs.inputPropertyTextKey.current.value,
                value: refs.inputPropertyTextValue.current.value,
                component_id: architecturalComponent.id
            }

            dbApi.saveProperty(newProperty)
                    .then(({data}) => {
                        if(data.success) {
                            var newAc = {...architecturalComponent};
                            newAc["properties"].push(newProperty);
                            setArchitecturalComponent(newAc);
                        }
                    })
                    .catch(error => {
                        if(error.response.status === 401) util.loginFailedHandler(history);
                    })
        }
        }

    const handleInputPropertyKeyChange = () => {
        if(refs.inputPropertyTextKey.current.value === "") setHiddenValueField(true);
        else {
            setHiddenValueField(false);
            dbApi.getPropertyValues(refs.inputPropertyTextKey.current.value)
                .then(({data}) => {
                    if(data.success) {
                        setPropertiesValues(data.result)
                    }
                })
                .catch(error => {
                    if(error.response.status === 401) util.loginFailedHandler(history);
                })
        }
    }

    const deleteComponentBtnHandler = (componentId, aid) => {
        if(window.confirm("Deletion of component " + componentId + " is definitive. Confirm?")) {
            dbApi.deleteComponent(componentId)
            .then(({data}) => {
                if(data.success) {
                    history.push('/architecture/' + aid);
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
        }
    }

    const getPropertiesTable = () => {
        if(architecturalComponent["properties"] && architecturalComponent["properties"].length > 0) {
            return (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th hidden={!util.inDebugMode()}>#</th>
                        <th>Key</th>
                        <th>Value</th>
                        <th hidden={pageOp === 'view' ? true : false}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {architecturalComponent["properties"].map((p, i) => {
                            return (
                                <tr key={"prop_" + i}>
                                    <td hidden={!util.inDebugMode()}>{util.reduceUUID(p.id)}</td>
                                    <td>{p.key}</td>
                                    <td>{p.value}</td>
                                    <td hidden={pageOp === 'view' ? true : false}>
                                        <Button variant="danger" size="sm"><FaTimes onClick={deletePropertyBtnHandler.bind(this, p.id)} /></Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            )
        }
        else {
            return(<h5>No property yet. Please add them from the <i>edit</i> menu.</h5>);
        }
    }

    const getComponentName = id => {
        if(componentsNames) {
            for(var i = 0; i < componentsNames.length; i++) {
                if(componentsNames[i].id === id) return componentsNames[i].name;
            }
        }
        
        return "Unknown (ID: " + id + ")";
    }

    const getConnectionsTable = () => {
        if(architecturalComponent["connections"] && architecturalComponent["connections"].length > 0) {
            return (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th hidden={!util.inDebugMode()}>#</th>
                        <th>Component 1</th>
                        <th>Component 2</th>
                        <th hidden={pageOp === 'view' ? true : false}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {architecturalComponent["connections"].map((c, i) => {
                            return (
                                <tr key={"prop_" + i}>
                                    <td hidden={!util.inDebugMode()}>{util.reduceUUID(c.id)}</td>
                                    <td>{getComponentName(c.first_component)}</td>
                                    <td>{getComponentName(c.second_component)}</td>
                                    <td hidden={pageOp === 'view' ? true : false}>
                                        <Button variant="danger" size="sm"><FaTimes onClick={deleteConnectionBtnHandler.bind(this, c.id)} /></Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            )
        }
        else {
            return(<h5>No connections yet. Please add them from the <i>edit</i> menu.</h5>);
        }
    }

    const deletePropertyBtnHandler = propertyId => {
        dbApi.deleteProperty(propertyId)
            .then(({data}) => {
                if(data.success) {
                    var newAc = {...architecturalComponent};
                    for(var i = 0; i < newAc["properties"].length; i++) {
                        if (newAc["properties"][i].id === propertyId) {
                            newAc["properties"].splice(i, 1);
                            break;
                        }
                    }

                    setArchitecturalComponent(newAc);
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
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

    const handleComponentNameChange = elt => {
        if(elt) updateAvailableProperties(elt.target.value);
        else updateAvailableProperties("");
    }

    const updateAvailableProperties = componentName => {
        dbApi.getPropertiesNames(componentName)
        .then(({data}) => {
            if(data.success) {
                setPropertiesKeys(data.result)
            }
        })
        .catch(error => {
            if(error.response.status === 401) util.loginFailedHandler(history);
        })
    }

    const getComponentsNames = () => {
        dbApi.getComponentsNames()
            .then(({data}) => {
                if(data.success) {
                    setComponentsNames(data.result)
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }

    const getReferenceArchitecture = () => { 
        dbApi.getArchitecture(aid)
            .then(({data}) => {
                if(data.success) {
                    setReferenceArchitecture(data.result)
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }

    let { cid, aid } = useParams();
    const initialLabel = getLabel(opType)
    const history = useHistory();
    const [pageOp, setPageOp] = useState(opType);
    const [formBtnLabel, setFormBtnLabel] = useState(initialLabel)
    const [architecturalComponent, setArchitecturalComponent] = useState({properties: [], connections: []})
    const [referenceArchitecture, setReferenceArchitecture] = useState({components:[]})
    const [componentsNames, setComponentsNames] = useState([])
    const [propertiesKeys, setPropertiesKeys] = useState([])
    const [propertiesValues, setPropertiesValues] = useState([])
    const [componentNameAsInput, setComponentNameAsInput] = useState(false)
    const [hiddenValueField, setHiddenValueField] = useState(true);
    const [loaded, setLoaded] = useState({
        architecturalComponent: false
    })
    const refs = {
        inputSelectName: createRef(),
        inputTextName: createRef(),
        inputDesc: createRef(),
        inputPropertyTextKey: createRef(),
        inputPropertyTextValue: createRef(),
        inputSelectComponentForLink: createRef()
    }

    useEffect(() => {
        if(opType !== 'new') {
            dbApi.getComponent(cid)
                .then(({data}) => {
                    if(data.success) {
                        setArchitecturalComponent(data.result);
                        updateAvailableProperties(data.result.name);
                        setLoaded({
                            ...loaded,
                            architecturalComponent: true
                        })
                    }
                })
                .catch(error => {
                    if(error.response.status === 401) util.loginFailedHandler(history);
                })
        }

        getComponentsNames();
        getReferenceArchitecture();
    }, [])

    return <Container>{getForm()}</Container>
}

export default ArchitecturalComponent;