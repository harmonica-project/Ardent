import { Button, Container, Form } from 'react-bootstrap';
import { FaPen, FaTimes } from 'react-icons/fa';
import { useState, useEffect, createRef } from 'react';
import { useHistory } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import dbApi from '../../assets/js/dbApi';
import util from '../../assets/js/util';

const ArchitectureList = () => {
    const history = useHistory();
    const { SearchBar } = Search;

    const [architecturesList, setArchitecturesList] = useState([]);
    const xlsFileRef = createRef();

    useEffect(() => {
        getArchitectures()
    }, [])

    const getArchitectures = () => {
        dbApi.getArchitectures()
            .then(({data, status}) => {
                console.log(status)
                if(data.success) {
                    setArchitecturesList(data.result);
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
    }
    
    const removeArchitecture = architectureId => {
        var newArchitecturesList = [...architecturesList];
        var index = -1;
        
        for(var i = 0; i < newArchitecturesList.length; i++) {
            if(newArchitecturesList[i].id === architectureId)  {
                index = i;
                break;
            }
        }

        if (index > -1) {
            newArchitecturesList.splice(index, 1);
        }

        setArchitecturesList(newArchitecturesList);
    }

    const deleteArchitectureBtnHandler = architectureId => {
        if(window.confirm("Deletion of architecture " + architectureId + " is definitive. Confirm?")) {
            dbApi.deleteArchitecture(architectureId)
            .then(({data}) => {
                if(data.success) {
                    removeArchitecture(architectureId);
                }
            })
            .catch(error => {
                if(error.response.status === 401) util.loginFailedHandler(history);
            })
        }
    }

    const actionsGenerator = architectureId => {
        return(
            <div>
                <Button size="sm" variant="secondary" onClick={() => history.push("/architecture/" + architectureId + "/edit")}><FaPen/></Button>&nbsp;
                <Button size="sm" variant="danger" onClick={deleteArchitectureBtnHandler.bind(this, architectureId)}><FaTimes/></Button>
            </div>
        )
    }

    const reduceDesc = desc => {
        if (desc.length < 100) return desc;
        else {
            return desc.substring(0,100) + " [...]";
        }
    }

    const columns = [{
            dataField: 'id',
            text: '#'
        }, {
            dataField: 'paper',
            text: 'Paper name',
            sort: true
        }, {
            dataField: 'description',
            text: 'Description',
            sort: true,
            formatter: reduceDesc
        }, {
            dataField: 'done_by',
            text: 'Done by',
            sort: true,
            formatter: util.getUser
        }, {
            dataField: 'id',
            text: 'Actions',
            sort: true,
            formatter: actionsGenerator
     }];

    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            if(e.target.tagName === "TD") {
                history.push("/architecture/" + row.id)
            }
        }
    };

    const uploadXLS = () => {
        if(xlsFileRef.current.files[0]) {
            dbApi.uploadXLS(xlsFileRef.current.files[0])
                .then(({data}) => {
                    if(data.success) {
                        getArchitectures()
                    }
                })
                .catch(error => {
                    if(error.response.status === 401) util.loginFailedHandler(history);
                })
        }
    }

    return (
        <Container>
            <h1>Architectures</h1>
            <hr/>
            <ToolkitProvider
                keyField="id"
                data={ architecturesList }
                columns={ columns }
                search
            >
                {
                    props => (
                    <div>
                        <SearchBar 
                            { ...props.searchProps }
                            delay={ 1000 }
                            placeholder="Search something in the table ..."
                        />
                        <BootstrapTable
                        { ...props.baseProps }
                        pagination={ paginationFactory() }
                        rowEvents={ rowEvents }
                        />
                    </div>
                    )
                }
            </ToolkitProvider>
            <Button variant="success" onClick={() => history.push('/architecture/new')}>New architecture</Button><hr/>
            <Form>
                <h5>Direct generation of empty architectures through XLS (parsif.al) file</h5>
                <Form.File ref={xlsFileRef} /><br/>
                <Button variant="success" onClick={uploadXLS}>Upload</Button>
            </Form>
            <br/>
        </Container>
    )
}

export default ArchitectureList;