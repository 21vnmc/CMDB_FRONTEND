import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    permissionRoutes:null,
    areaList:null,
    dataCenterList:null,
    apartmentList:null,
    departmentList:null,
    productList:null,
    deviceTypeList:null,
    modelList:null,
    manufacturerList:null,
    deviceInfo:{},
    costCenterList:null,
    companyList:null,
    assetNameList:null,
    unitSizeList:null,
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    SET_ROUTERS(state, routes) {
        //添加路由
        // router.addRoutes(routes);
        state.permissionRoutes = routes; // 权限路由
    },
    SET_AREAS(state,area_list) {
        state.areaList = area_list;
    },
    SET_DATA_CENTERS(state,dataCenter_list) {
        state.dataCenterList = dataCenter_list;
    },
    SET_APARTMENTS(state,apartment_list) {
        state.apartmentList = apartment_list;
    },
    SET_DEPARTMENTS(state,department_list) {
        state.departmentList = department_list;
    },
    SET_PRODUCTS(state,product_list) {
        state.productList = product_list;
    },
    SET_MODELS(state,model_list) {
        state.modelList = model_list;
    },
    SET_DEVICE_TYPES(state,device_type_list) {
        state.deviceTypeList = device_type_list;
    },
    SET_MANUFACTURERS(state,manufacturer_list) {
        state.manufacturerList = manufacturer_list;
    },
    SET_DEVICE_INFO(state,device_info) {
        state.deviceInfo = device_info;
    },
    SET_COST_CENTERS(state,cost_center_list) {
        state.costCenterList = cost_center_list;
    },
    SET_COMPANIES(state,company_list) {
        state.companyList = company_list;
    },
    SET_ASSET_NAMES(state,asset_name_list) {
        state.assetNameList = asset_name_list;
    },
    SET_UNIT_SIZES(state,unit_size_list) {
        state.unitSizeList = unit_size_list;
    },
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})