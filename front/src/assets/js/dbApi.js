const API_URL = "http://localhost:8080"
const defaultHeaders = {    
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

const dbApi = {
    getArchitectures: () => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/architectures', requestOptions);
    },
    getComponents: () => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/components', requestOptions);
    },
    getComponentsNames: () => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/components_names', requestOptions);
    },
    getArchitecture: architectureId => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/architecture/' + architectureId, requestOptions);
    },
    saveArchitecture: architecture => {
        const requestOptions = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(architecture)
        }
        return fetch(API_URL + '/architecture/', requestOptions);
    },
    getComponent: componentId => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/component/' + componentId, requestOptions);
    }
}

export default dbApi;