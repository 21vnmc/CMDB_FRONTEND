<template>
	<section>
		maintest
	</section>
</template>

<script>
	import {mapActions,mapGetters} from "vuex";
	import {
		getAreaListApi, getAssetNameListApi, getCompanyListApi,
		getDataCenterListApi,
		getDepartmentListApi,
		getDeviceTypeListApi,
		getProductListApi
	} from "../api/api";

	export default {
		computed:{
			...mapGetters
		},
		mounted() {
			this.getDepartments();
			this.getDataCenters();
			this.getAreas();
			this.getProducts();
			this.getDeviceTypes();
			this.getCompanies();
			this.getAssetNames();
		},
		methods: {
			getDepartments() {
				getDepartmentListApi().then((res) => {
					this.departmentList({department_list: res.data.data});
				});
			},
			getDataCenters() {
				getDataCenterListApi().then((res) => {
					this.dataCenterList({dataCenter_list: res.data.data});
				});
			},
			getAreas() {
				getAreaListApi().then((res) => {
					this.areaList({area_list: res.data.data});
				});
			},
			getProducts() {
				getProductListApi().then((res) => {
					this.productList({product_list: res.data.data});

				});
			},
			getDeviceTypes() {
				getDeviceTypeListApi().then((res) => {
					this.deviceTypeList({device_type_list: res.data.data});
				});
			},
			getCompanies(){
				getCompanyListApi().then((res) => {
					this.companyList({company_list:res.data.data});
				});
			   },
			getAssetNames(){
				getAssetNameListApi().then((res) => {
					this.assetNameList({asset_name_list:res.data.data});
				});
			   },
			...mapActions({
				areaList:"areaList",
				dataCenterList:"dataCenterList",
				apartmentList:"apartmentList",
				departmentList:"departmentList",
				productList:"productList",
				deviceTypeList:"deviceTypeList",
				companyList:'companyList',
				assetNameList:'assetNameList',
			  }),
		}
	}

</script>

<style scoped>

</style>