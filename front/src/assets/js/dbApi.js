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
    getPropertiesNames: cname => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/properties_names/' + cname, requestOptions);
    },
    getPropertyValues: pkey => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/properties_values/' + pkey, requestOptions);
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
    saveProperty: property => {
        const requestOptions = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(property)
        }
        return fetch(API_URL + '/property/', requestOptions);
    },
    saveConnection: connection => {
        const requestOptions = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(connection)
        }
        return fetch(API_URL + '/connection/', requestOptions);
    },
    deleteArchitecture: architectureId => {
        const requestOptions = {
            method: 'DELETE',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/architecture/' + architectureId, requestOptions);
    },
    deleteProperty: propertyId => {
        const requestOptions = {
            method: 'DELETE',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/property/' + propertyId, requestOptions);
    },
    deleteConnection: connectionId => {
        const requestOptions = {
            method: 'DELETE',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/connection/' + connectionId, requestOptions);
    },
    saveComponent: component => {
        const requestOptions = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(component)
        }
        return fetch(API_URL + '/component/', requestOptions);
    },
    deleteComponent: componentId => {
        const requestOptions = {
            method: 'DELETE',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/component/' + componentId, requestOptions);
    },
    getComponent: componentId => {
        const requestOptions = {
            method: 'GET',
            headers: defaultHeaders
        }
        return fetch(API_URL + '/component/' + componentId, requestOptions);
    },
    uploadXLS: fileData => {
        console.log(fileData)
        const formData = new FormData(); 
        formData.append( 
            "xlsArchitectures", 
            fileData, 
            fileData.name 
          ); 
        const requestOptions = {
            method: 'POST',
            body: formData
        }
        return fetch(API_URL + '/xls/', requestOptions);
    }
}

export default dbApi;