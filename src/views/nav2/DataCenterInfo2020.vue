<template>
  <el-table
    :data="data_center_info_list"
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
  import {getDataCenterInfoApi} from "../../api/api";
  export default {
    methods: {
      getDataCenterNode(d_id){
        let para = {d_id:d_id};
        getDataCenterInfoApi(para).then((res) => {
            this.data_center_info_object = res.data.data;
            console.log(this.data_center_info_object);
            this.handleObject(this.data_center_info_object);
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
      handleObject(data_center_info_object){
        for(let key in data_center_info_object){
          this.data_center_info_list.push({'Column_key':key,'Column_value':data_center_info_object[key]});
        }
      }
    },
    data() {
      return {
        data_center_info_list :[],
        data_center_info_object:null,
      }
    },

    mounted() {
			let d_id = this.$route.query.d_id;
            this.getDataCenterNode(d_id);
		},
  }
</script>