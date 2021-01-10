import axios from 'axios';

const API_URL = "<API_URL>"
const getAuthInfo = () => {
    const authInfo = {
        auth: {
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password")
        }
    }

    if (authInfo.auth.username && authInfo.auth.password) return authInfo;
    return {}
}

const dbApi = {
    loginUser: authInfo => { return axios.get(API_URL + '/login', authInfo, {withCredentials: true}) },
    getArchitectures: () => { return axios.get(API_URL + '/architectures', getAuthInfo(), {withCredentials: true}) },
    getComponents: () => { return axios.get(API_URL + '/components', getAuthInfo(), {withCredentials: true}) },
    getComponentsNames: () => { return axios.get(API_URL + '/components_names', getAuthInfo(), {withCredentials: true}) },
    getPropertiesNames: cname => { return axios.get(API_URL + '/properties_names/' + cname, getAuthInfo(), {withCredentials: true}) },
    getPropertyValues: pkey => { return axios.get(API_URL + '/properties_values/' + pkey, getAuthInfo(), {withCredentials: true}) },
    getArchitecture: architectureId => { return axios.get(API_URL + '/architecture/' + architectureId, getAuthInfo(), {withCredentials: true}) },
    saveArchitecture: architecture => { return axios.post(API_URL + '/architecture', architecture, getAuthInfo(), {withCredentials: true}) },
    saveProperty: property => { return axios.post(API_URL + '/property', property, getAuthInfo(), {withCredentials: true}) },
    saveConnection: connection => { return axios.post(API_URL + '/connection', connection, getAuthInfo(), {withCredentials: true}) },
    deleteArchitecture: architectureId => { return axios.delete(API_URL + '/architecture/' + architectureId, getAuthInfo(), {withCredentials: true}) },
    deleteProperty: propertyId => { return axios.delete(API_URL + '/property/' + propertyId, getAuthInfo(), {withCredentials: true}) },
    deleteConnection: connectionId => { return axios.delete(API_URL + '/connection/' + connectionId, getAuthInfo(), {withCredentials: true}) },
    saveNewComponent: component => { return axios.post(API_URL + '/component', component, getAuthInfo(), {withCredentials: true}) },
    saveExistingComponent: component => { return axios.put(API_URL + '/component/' + component.id, component, getAuthInfo(), {withCredentials: true}) },
    deleteComponent: componentId => { return axios.delete(API_URL + '/component/' + componentId, getAuthInfo(), {withCredentials: true}) },
    getComponent: componentId => { return axios.get(API_URL + '/component/' + componentId, getAuthInfo(), {withCredentials: true}) },
    uploadXLS: fileData => { 
        const formData = new FormData(); 
        formData.append( 
            "xlsArchitectures", 
            fileData, 
            fileData.name 
          ); 
        return axios.post(API_URL + '/xls/', formData, getAuthInfo(), {withCredentials: true}) 
    }
}

export default dbApi;