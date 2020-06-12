<template>
  <el-table
    :data="device_info_list"
    style="width: 100%"
    >
    <el-table-column
      prop="device_name"
      label="设备名称"
      width="280">
    </el-table-column>
    <el-table-column
      prop="device_type"
      label="设备类型"
      width="280">
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
  import {getRackDeviceInfoApi} from "../../api/api";
  export default {
    methods: {
      getRackDeviceNode(d_id){
        let para = {d_id:d_id};
        getRackDeviceInfoApi(para).then((res) => {
          console.log(res.data.data,11)
            this.device_info_list = res.data.data;
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
    },
    data() {
      return {
        device_info_list :[],
      }
    },

    mounted() {
			let d_id = this.$route.query.d_id;
            this.getRackDeviceNode(d_id);
		},
  }
</script>