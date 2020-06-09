<template>
  <el-table
    :data="apart_info_list"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="Column_key"
      label="数据中心"
      width="280">
    </el-table-column>
    <el-table-column
      prop="Column_value"
      label="机房名称"
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
  import {getApartInfoApi} from "../../api/api";
  export default {
    methods: {
      getApartNode(d_id){
        let para = {d_id:d_id};
        getApartInfoApi(para).then((res) => {
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
          this.apart_info_list.push({'Column_key':this.d_name,'Column_value':data_center_info_object[key]});
        }
      }
    },
    data() {
      return {
        apart_info_list :[],
        apart_info_object:null,
        d_name:'',
      }
    },

    mounted() {
			let d_id = this.$route.query.d_id;
			this.d_name = this.$route.query.d_name;
            this.getApartNode(d_id);
		},
  }
</script>