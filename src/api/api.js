import axios from 'axios';

axios.defaults.withCredentials = true

let base = 'http://127.0.0.1:8000';

export const requestLogin = params => { return axios.post(`${base}/api/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/api/user/list`, { params: params }); };

export const getDeviceListApi = params => { return axios.get(`${base}/api/asset/deviceList`, { params: params }); };

export const getDepartmentListApi = params => { return axios.get(`${base}/api/asset/departmentList`, { params: params }); };

export const getDataCenterListApi = params => { return axios.get(`${base}/api/asset/dataCenterList`, { params: params }); };

export const getAreaListApi = params => { return axios.get(`${base}/api/asset/areaList`, { params: params }); };

export const getProductListApi = params => { return axios.get(`${base}/api/asset/productList`, { params: params }); };

export const getModelListApi = params => { return axios.get(`${base}/api/asset/modelList`, { params: params }); };

export const getAgentListApi = params => { return axios.get(`${base}/api/asset/agentList`, { params: params }); };

export const getAgentModelApi = params => { return axios.get(`${base}/api/asset/getAgentModel`, { params: params }); };

export const getDeviceTypeListApi = params => { return axios.get(`${base}/api/asset/deviceTypeList`, { params: params }); };

export const getLocationApi = params => { return axios.get(`${base}/api/asset/getLocation`, { params: params }); };

export const requestLogout = params => { return axios.get(`${base}/api/logout`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editDeviceApi = params => { return axios.put(`${base}/api/asset/editDevice`, { params: params }); };

export const addDeviceApi = params => { return axios.post(`${base}/api/asset/addDevice`, { params: params }); };

export const removeDeviceApi = params => { return axios.delete(`${base}/api/asset/removeDevice`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };