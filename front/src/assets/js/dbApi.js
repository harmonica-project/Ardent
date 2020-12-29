const API_URL = "http://localhost:8080"

const dbApi = {
    getArchitectures: () => {
        const requestOptions = {
            method: 'GET',
            headers: {    
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
        }
        return fetch(API_URL + '/architectures', requestOptions);
    },
    getArchitecture: architectureId => {
        const requestOptions = {
            method: 'GET',
            headers: {    
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
        }
        return fetch(API_URL + '/architecture/' + architectureId, requestOptions);
    },
    getComponent: componentId => {
        const requestOptions = {
            method: 'GET',
            headers: {    
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
        }
        return fetch(API_URL + '/component/' + componentId, requestOptions);
    }
}

export default dbApi;