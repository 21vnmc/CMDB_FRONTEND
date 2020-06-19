<template>
	<el-row :gutter="50">
		<el-col :span="8">
			<el-card >
				<div slot="header" style="font-weight: bold;font-size: large">
					<span>设备数量</span>
				</div>
				<div class="number">
						<a :href="'/device'">{{device_num}}</a>
				</div>
			</el-card>
		</el-col>
		<el-col :span="8">
			<el-card >
				<div slot="header" style="font-weight: bold;font-size: large">
					<span>机柜数量</span>
				</div>
				<div class="number">
					<a :href="'/rack'">{{rack_num}}</a>
				</div>
			</el-card>
		</el-col>
		<el-col :span="8">
			<el-card >
				<div slot="header" style="font-weight: bold;font-size: large">
					<span>中心数量</span>
				</div>
				<div class="number">
					<a :href="'/dataCenter'">{{data_center_num}}</a>
				</div>
			</el-card>
		</el-col>

	</el-row>
</template>

<script>
	import {mapActions,mapGetters} from "vuex";
	import {getDeviceListApi,getTotalInfoApi} from "../api/api";


	export default {
		data() {
			return {
				device_num:null,
				rack_num:null,
				data_center_num:null,
			}
		},
		computed:{
			...mapGetters
		},
		mounted() {
			this.getTotalInfo();
		},
		methods: {
			getTotalInfo(){
				getTotalInfoApi().then((res) => {
					this.device_num = res.data.data.total_devices;
					this.rack_num = res.data.data.total_racks;
					this.data_center_num = res.data.data.total_data_centers;
				});

			}
		}
	}

</script>

<style scoped>
	.el-card {
		text-align: center;
	}
	.el-card div span {
		font-weight: bolder;
		font-size: large;
	}
	.el-card div .number{
		font-size: 2em;
		font-weight: bold;
		color: #999;
	}
	a{
		text-decoration: none;
	}

</style>