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
    }
}

export default util;