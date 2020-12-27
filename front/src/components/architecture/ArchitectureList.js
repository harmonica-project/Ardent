import { Button, Container, Table } from 'react-bootstrap';
import { FaPen, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { architectures } from '../../assets/js/fakeData';

const ArchitectureList = () => {
    const history = useHistory();
    
    const searchChangeHandler = e => {
        var term = e.target.value;

        if(term !== "") {
            var newArchitecturesList = [...architecturesList];
            for (var i = 0; i < newArchitecturesList.length; i++) {
                if (newArchitecturesList[i].paper.includes(term)) newArchitecturesList[i]["show"] = true;
                else newArchitecturesList[i]["show"] = false;
            }
            setArchitecturesList(newArchitecturesList);
        }
    }

    const [architecturesList, setArchitecturesList] = useState(architectures);

    return (
        <Container>
            <h1>Architectures</h1>
            <hr/>
            <input type="text" className="form-control" placeholder="Search by paper name..." onChange={searchChangeHandler.bind(this)}></input><br/>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Paper</th>
                    <th>Description</th>
                    <th>Done by</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    { architecturesList.map((a, i) => {
                        return(
                            <tr key={"arch_" + i} hidden={a.show === false ? true : false}>
                                <td style={{cursor:"pointer"}} onClick={() => history.push("/architecture/" + a.id)}>{a.id}</td>
                                <td style={{cursor:"pointer"}} onClick={() => history.push("/architecture/" + a.id)}>{a.paper}</td>
                                <td style={{cursor:"pointer"}} onClick={() => history.push("/architecture/" + a.id)}>{a.desc}</td>
                                <td style={{cursor:"pointer"}} onClick={() => history.push("/architecture/" + a.id)}>{a.doneBy}</td>
                                <td>
                                    <Button size="sm" variant="secondary" onClick={() => history.push("/architecture/" + a.id + "/edit")}><FaPen/></Button>&nbsp;
                                    <Button size="sm" variant="danger"><FaTimes/></Button>
                                </td>
                            </tr>
                        )
                    }) }
                </tbody>
            </Table>
            <Button variant="success" onClick={() => history.push('/architecture/new')}>New architecture</Button>
        </Container>
    )
}

export default ArchitectureList;