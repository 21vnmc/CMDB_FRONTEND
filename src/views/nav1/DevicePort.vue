<template>
    <section>
        <!--工具条-->
<!--		<el-col :span="24" class="toolbar">-->
<!--            <el-button type="warning" size="small" @click="handleUpdate">更新</el-button>-->
<!--		</el-col>-->
          <el-button size="mini" type="primary" @click="handleUpdate">更新</el-button>


        <el-table :data="pagePortList" style="width: 100%;">
            <el-table-column prop="port" label="端口名称" width="300" sortable>
            </el-table-column>
        </el-table>

    <!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination
					layout="prev, pager, next"
                    @current-change="handleCurrentChange"
					:page-count="pageCount"
					:page-size="pageSize"
					:current-page="currentPage"
					:total="devicePortList.length"
					style="float:right;">
			</el-pagination>
		</el-col>
    </section>
</template>
<script>
  import {updateDevicePortApi,getDevicePortApi} from "../../api/api";

    export default {
        data() {
            return {
                devicePortList:[],
                pagePortList : [],
                pageSize:10,
				pageCount:5,
				currentPage: 1,
            };
        },
        methods: {
            handleUpdate(){
                updateDevicePortApi(this.$route.query).then((res) => {
					this.getDevicePort(this.$route.query);
                });
            },
            handleCurrentChange(val){
                this.currentPage = val;
                let start =  this.pageSize * (this.currentPage-1);
                let end = this.pageSize * this.currentPage;
                this.pagePortList = this.devicePortList.slice(start,end);
            },
            getDevicePort(para){
                 getDevicePortApi(para).then((res) => {
                    this.devicePortList = res.data.data;
                    let start =  this.pageSize * (this.currentPage-1);
                    let end = this.pageSize * this.currentPage;
                    this.pagePortList = this.devicePortList.slice(start,end);
                });

            },
        },
        mounted() {
            this.getDevicePort(this.$route.query);
        },
    };
</script>
<style scoped>

</style>