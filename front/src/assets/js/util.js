import { Alert } from 'react-bootstrap';

const util = {
    JSONEmpty: obj => {
        return Object.keys(obj).length === 0;
    },
    getUser: userId => {
        if (userId === "six") {
            return "Nicolas Six"
        }
        if (userId === "herbaut") {
            return "Nicolas Herbaut"
        }
        if (userId === "negri") {
            return "Claudia Negri Ribalta"
        }

        return "Anonymous";
    },
    loginFailedHandler: history => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        history.push("/login");
    },
    reduceUUID: uuid => {
        return uuid.split("-")[0];
    },
    getStatusLabel: status => {
        if(status === "done") return <Alert variant={"success"} style={{textAlign: "center"}}>Done</Alert>;
        if(status === "progress") return <Alert variant={"warning"} style={{textAlign: "center"}}>In progress</Alert>;
        if(status === "help") return <Alert variant={"danger"} style={{textAlign: "center"}}>Need help</Alert>;
        if(status === "added") return <Alert variant={"info"} style={{textAlign: "center"}}>Just added</Alert>;
        return <Alert variant={"secondary"} style={{textAlign: "center"}}>Unknown</Alert>;
    },
    inDebugMode: () => {
        return localStorage.getItem("debugMode")
    }
}

export default util;