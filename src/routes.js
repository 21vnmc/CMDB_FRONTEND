import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Device from './views/nav1/Device.vue'
import DeviceInfo from './views/nav1/DeviceInfo.vue'
import AssetInfo from './views/nav1/AssetInfo.vue'
import DataCenterInfo from './views/nav2/DataCenterInfo.vue'
import ApartInfo from './views/nav2/ApartInfo.vue'
import ApartmentInfo from './views/nav2/ApartmentInfo.vue'
import RackInfo from './views/nav2/RackInfo.vue'
import RackDetail from './views/nav2/RackDetail.vue'
import RackDeviceInfo from './views/nav2/RackDeviceInfo.vue'
import Asset from './views/nav1/Asset.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import DataCenter from './views/nav2/DataCenter.vue'
import Apartment from './views/nav2/Apartment.vue'
import Rack from './views/nav2/Rack.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import User from './views/nav3/User.vue'
import Group from './views/nav3/Group.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        meta:{
            roles:['admin','user']
        }
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true,
        meta:{
            roles:['admin','user']
        }
    },
     {
        path: '/deviceInfo',
        component: DeviceInfo,
        name: '',
        meta:{
            roles:['admin','user']
        },
         hidden: true
    },
    {
        path: '/assetInfo',
        component: AssetInfo,
        name: '',
        meta:{
            roles:['admin','user']
        },
         hidden: true
    },

    {
        path: '/apartInfo',
        component: ApartInfo,
        name: 'relation_apart',
        meta:{
            roles:['admin','user']
        },
         hidden: true
    },
    {
        path: '/rackInfo',
        component: RackInfo,
        name: 'relation_rack',
        meta:{
            roles:['admin','user']
        },
         hidden: true
    },
     {
        path: '/rackDeviceInfo',
        component: RackDeviceInfo,
        name: 'relation_device',
        meta:{
            roles:['admin','user']
        },
         hidden: true
    },


     {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'el-icon-menu',
        leaf: true,//只有一个节点
        children: [
            { path: '/main', component: Main, name: '中心管理' }
        ],
         meta:{
            roles:['admin','user']
        }
    },
    {
        path: '/',
        component: Home,
        name: '资产管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            // { path: '/main', component: Main, name: '主页' },
            { path: '/device', component: Device, name: '设备管理' },
            { path: '/asset', component: Asset, name: '台账管理' },
            // { path: '/form', component: Form, name: 'Form' },
            // { path: '/user', component: user, name: '列表' },
        ],
        meta:{
            roles:['admin']
        }
    },
    {
        path: '/',
        component: Home,
        name: '机柜管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/dataCenter', component: DataCenter, name: '数据中心'},
            {
                path: '/dataCenterInfo',
                component: DataCenterInfo,
                name: 'data_center_info',
                meta: {
                    roles: ['admin', 'user']
                },
                hidden: true
            },
            {
                path: '/apartmentInfo',
                component: ApartmentInfo,
                name: 'apartment_info',
                meta:{
                    roles:['admin','user']
                },
                 hidden: true
            },
            { path: '/apartment', component: Apartment, name: '房间列表' },
            { path: '/rack', component: Rack, name: '机柜列表'},
            {
                path: '/rackDetail',
                component: RackDetail,
                name: 'rack_detail',
                meta:{
                    roles:['admin','user']
                },
                 hidden: true
            },
        ],
        meta:{
            roles:['admin','user']
        }
    },
    {
        path: '/',
        component: Home,
        name: '账号管理',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/user', component: User, name: '用户管理' },
            { path: '/group', component: Group, name: '组管理' }
        ],
         meta:{
            roles:['admin','user']
        }
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        hidden: true,
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ],
         meta:{
            roles:['admin','user']
        }
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ],
        meta:{
            roles:['admin']
        }
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' },
        meta:{
            roles:['admin']
        }
    }
];

export default routes;