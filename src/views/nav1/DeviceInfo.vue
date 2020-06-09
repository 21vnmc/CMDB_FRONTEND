<template>
  <el-table
    :data="device_info_list"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="Column_key"
      label="字段"
      width="180">
    </el-table-column>
    <el-table-column
      prop="Column_value"
      label="数值"
      width="580">
    </el-table-column>
  </el-table>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<script>
  import {getDeviceInfoApi} from "../../api/api";
  export default {
    methods: {
      getDeviceNode(device_id){
        let para = {device_id:device_id};
        getDeviceInfoApi(para).then((res) => {
            this.device_info_object = res.data.data;
            this.handleObject(this.device_info_object);
        });

      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
      handleObject(device_info_object){
        for(let key in device_info_object){
          this.device_info_list.push({'Column_key':key,'Column_value':device_info_object[key]});
        }
      }
    },
    data() {
      return {
        device_info_list :[],
        device_info_object:null,
      }
    },
    mounted() {
			// this.handleObject(this.getDeviceInfo);
			let device_id = this.$route.query.id;
            this.getDeviceNode(device_id);
		},
  }
</script>