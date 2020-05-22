
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

export const agentList = ({commit},{agent_list}) => {
    commit('SET_AGENTS',agent_list);
}