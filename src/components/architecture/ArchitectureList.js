import { Button, Container, Table } from 'react-bootstrap';
import { FaPen, FaTimes } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import { architectures } from '../../assets/js/fakeData';

const ArchitectureList = () => {
    const history = useHistory();
    
    return (
        <Container>
            <h1>Architectures</h1>
            <hr/>
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
                    { architectures.map((a, i) => {
                        return(
                            <tr key={"arch_" + i}>
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