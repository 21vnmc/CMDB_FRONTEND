
function filterAsyncRoutes(router,role) {
    const res = router.filter(route => {
        return route.meta.roles.includes(role)
    });
    return res
}

export const increment = ({commit}) => {
    commit('INCREMENT');
}
export const decrement = ({commit}) => {
    commit('DECREMENT');
}

export const generateRoutes = ({commit},{router,role}) => {
    // let {role} = data;
    let routes = filterAsyncRoutes(router,role);
    commit('SET_ROUTERS',routes);
}

export const areaList = ({commit},{area_list}) => {
    commit('SET_AREAS',area_list);
}

export const dataCenterList = ({commit},{dataCenter_list}) => {
    commit('SET_DATA_CENTERS',dataCenter_list);
}

export const apartmentList = ({commit},{apartment_list}) => {
    commit('SET_APARTMENTS',apartment_list);
}

export const departmentList = ({commit},{department_list}) => {
    commit('SET_DEPARTMENTS',department_list);
}

export const productList = ({commit},{product_list}) => {
    commit('SET_PRODUCTS',product_list);
}

export const deviceTypeList = ({commit},{device_type_list}) => {
    commit('SET_DEVICE_TYPES',device_type_list);
}

export const modelList = ({commit},{model_list}) => {
    commit('SET_MODELS',model_list);
}

export const manufacturerList = ({commit},{manufacturer_list}) => {
    commit('SET_MANUFACTURERS',manufacturer_list);
}

export const deviceInfo = ({commit},{device_info}) => {
    commit('SET_DEVICE_INFO',device_info);
}

export const costCenterList = ({commit},{cost_center_list}) => {
    commit('SET_COST_CENTERS',cost_center_list);
}

export const companyList = ({commit},{company_list}) => {
    commit('SET_COMPANIES',company_list);
}

export const assetNameList = ({commit},{asset_name_list}) => {
    commit('SET_ASSET_NAMES',asset_name_list);
}

export const unitSizeList = ({commit},{unit_size_list}) => {
    commit('SET_UNIT_SIZES',unit_size_list);
}