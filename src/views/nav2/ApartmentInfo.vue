<template>
<div>
    <el-table
    :data="apart_info_list"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="Column_key"
      label="字段"
      width="280">
    </el-table-column>
    <el-table-column
      prop="Column_value"
      label="数值"
      width="580">
    </el-table-column>
      <hr>
  </el-table>
      <el-table
    :data="belong_rack_list"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="rack_id"
      label="机柜ID"
      width="280">
    </el-table-column>
    <el-table-column
      prop="rack_name"
      label="机柜名称"
      width="580">
    </el-table-column>
  </el-table>
</div>

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
  import {getApartmentInfoApi} from "../../api/api";
  export default {
    methods: {
      getApartmentNode(a_id,d_name){
        let para = {a_id:a_id};
        getApartmentInfoApi(para).then((res) => {
            this.apartment_info_object = res.data.data.apartment_info;
            this.belong_rack_list = res.data.data.belong_rack;
            this.apartment_info_object['数据中心名称'] = d_name;
            this.handleObject(this.apartment_info_object);
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
          this.apart_info_list.push({'Column_key':key,'Column_value':data_center_info_object[key]});
        }
      }
    },
    data() {
      return {
        apart_info_list :[],
        belong_rack_list :[],
        apart_info_object:{},
        d_name:'',
      }
    },

    mounted() {
			let a_id = this.$route.query.a_id;
			let d_name = this.$route.query.d_name;

            this.getApartmentNode(a_id,d_name);
		},
  }
</script>