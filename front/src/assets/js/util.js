const util = {
    JSONEmpty: obj => {
        return Object.keys(obj).length === 0;
    },
    getUser: userId => {
        switch(userId) {
            case 1:
                return "Nicolas Six";
            case 2: 
                return "Nicolas Herbaut";
            case 3: 
                return "Claudia Negri Ribalta";
            default:
                return "Anonymous";
        }
    }
}

export default util;