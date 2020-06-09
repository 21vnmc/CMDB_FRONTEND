import axios from 'axios';

axios.defaults.withCredentials = true

let base = 'http://127.0.0.1:8000';

export const requestLogin = params => { return axios.post(`${base}/api/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/api/user/list`, { params: params }); };

export const getDeviceListApi = params => { return axios.get(`${base}/api/asset/deviceList`, { params: params }); };
export const getUserListApi = params => { return axios.get(`${base}/api/user/userList`, { params: params }); };
export const getAssetListApi = params => { return axios.get(`${base}/api/asset/assetList`, { params: params }); };

export const getDepartmentListApi = params => { return axios.get(`${base}/api/asset/departmentList`, { params: params }); };
export const queryDataBaseApi = params => { return axios.get(`${base}/api/common/query`, { params: params }); };
export const queryRoleApi = params => { return axios.get(`${base}/api/common/query`, { params: params }); };
export const queryDataBaseForeignApi = params => { return axios.get(`${base}/api/common/queryForeign`, { params: params }); };
export const getRackPositionApi = params => { return axios.get(`${base}/api/rack/rackPositionList`, { params: params }); };

export const getDataCenterListApi = params => { return axios.get(`${base}/api/asset/dataCenterList`, { params: params }); };

export const getAreaListApi = params => { return axios.get(`${base}/api/asset/areaList`, { params: params }); };

export const getProductListApi = params => { return axios.get(`${base}/api/asset/productList`, { params: params }); };
export const getUnitSizeListApi = params => { return axios.get(`${base}/api/asset/unitSizeList`, { params: params }); };

export const getModelListApi = params => { return axios.get(`${base}/api/asset/modelList`, { params: params }); };


export const getManufacturerModelApi = params => { return axios.get(`${base}/api/asset/getManufacturerModel`, { params: params }); };
export const getDataCenterApartApi = params => { return axios.get(`${base}/api/asset/getDataCenterApart`, { params: params }); };

export const getRecipientApi = params => { return axios.get(`${base}/api/asset/getRecipient`, { params: params }); };

export const getCostApi = params => { return axios.get(`${base}/api/asset/getCost`, { params: params }); };


export const getCompanyListApi = params => { return axios.get(`${base}/api/asset/CompanyList`, { params: params }); };


export const getAssetNameListApi = params => { return axios.get(`${base}/api/asset/AssetNameList`, { params: params }); };
export const getDataCenterApi = params => { return axios.get(`${base}/api/dc/getDataCenter`, { params: params }); };
export const getApartmentApi = params => { return axios.get(`${base}/api/apart/getApartment`, { params: params }); };
export const getRacksApi = params => { return axios.get(`${base}/api/rack/getRack`, { params: params }); };
export const getRackDetailApi = params => { return axios.get(`${base}/api/rack/getRackDetail`, { params: params }); };
export const getRoomTypeApi = params => { return axios.get(`${base}/api/common/query`, { params: params }); };

export const getDeviceInfoApi = params => { return axios.get(`${base}/api/asset/getDeviceInfo`, { params: params }); };
export const getRackInfoApi = params => { return axios.get(`${base}/api/rack/getRackInfo`, { params: params }); };
export const getApartmentInfoApi = params => { return axios.get(`${base}/api/apart/getApartmentInfo`, { params: params }); };
export const getRackDeviceInfoApi = params => { return axios.get(`${base}/api/rack/getRackDeviceInfo`, { params: params }); };
export const getApartInfoApi = params => { return axios.get(`${base}/api/rack/getApartInfo`, { params: params }); };
export const getDataCenterInfoApi = params => { return axios.get(`${base}/api/rack/getDataCenterInfo`, { params: params }); };
export const getAssetInfoApi = params => { return axios.get(`${base}/api/asset/getAssetInfo`, { params: params }); };

export const getDeviceTypeListApi = params => { return axios.get(`${base}/api/asset/deviceTypeList`, { params: params }); };

export const getLocationApi = params => { return axios.get(`${base}/api/asset/getLocation`, { params: params }); };

export const requestLogout = params => { return axios.get(`${base}/api/logout`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editDeviceApi = params => { return axios.put(`${base}/api/asset/editDevice`, { params: params }); };
export const editUserApi = params => { return axios.put(`${base}/api/user/editUser`, { params: params }); };

export const editAssetApi = params => { return axios.put(`${base}/api/asset/editAsset`, { params: params }); };
export const editDataCenterApi = params => { return axios.put(`${base}/api/dc/editDataCenter`, { params: params }); };
export const editApartmentApi = params => { return axios.put(`${base}/api/apart/editApartment`, { params: params }); };
export const editRackApi = params => { return axios.put(`${base}/api/rack/editRack`, { params: params }); };

export const addDeviceApi = params => { return axios.post(`${base}/api/asset/addDevice`, { params: params }); };
export const addUserApi = params => { return axios.post(`${base}/api/user/addUser`, { params: params }); };
export const addDataCenterApi = (formData,config) => { return axios.post(`${base}/api/dc/addDataCenter`, formData,config); };
export const addApartmentApi = params => { return axios.post(`${base}/api/apart/addApartment`, { params: params }); };
// export const addRackApi = params => { return axios.post(`${base}/api/rack/addRack`, { params: params }); };
export const addRackApi = params => { return axios.post(`${base}/api/rack/addRack`, { params: params }); };

export const addAssetApi = params => { return axios.post(`${base}/api/asset/addAsset`, { params: params }); };

export const removeDeviceApi = params => { return axios.delete(`${base}/api/asset/removeDevice`, { params: params }); };
export const removeUserApi = params => { return axios.delete(`${base}/api/user/removeUser`, { params: params }); };
export const removeDataCenterApi = params => { return axios.delete(`${base}/api/dc/removeDataCenter`, { params: params }); };
export const removeApartmentApi = params => { return axios.delete(`${base}/api/apart/removeApartment`, { params: params }); };
export const removeRackApi = params => { return axios.delete(`${base}/api/rack/removeRack`, { params: params }); };
export const batchRemoveDeviceApi = params => { return axios.delete(`${base}/api/asset/batchRemoveDevice`, { params: params }); };
export const batchRemoveUserApi = params => { return axios.delete(`${base}/api/user/batchRemoveUesr`, { params: params }); };
export const removeAssetApi = params => { return axios.delete(`${base}/api/asset/removeAsset`, { params: params }); };
export const batchRemoveAssetApi = params => { return axios.delete(`${base}/api/asset/batchRemoveAsset`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };