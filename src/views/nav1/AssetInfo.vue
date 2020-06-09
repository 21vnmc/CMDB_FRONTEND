<template>
  <el-table
    :data="asset_info_list"
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
  import {getAssetInfoApi} from "../../api/api";
  export default {
    methods: {
      getAssetNode(asset_id){
        let para = {asset_id:asset_id};
        getAssetInfoApi(para).then((res) => {
            this.asset_info_object = res.data.data;
            console.log(this.asset_info_object);
            this.handleObject(this.asset_info_object);
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
      handleObject(asset_info_object){
        for(let key in asset_info_object){
          this.asset_info_list.push({'Column_key':key,'Column_value':asset_info_object[key]});
        }
      }
    },
    data() {
      return {
        asset_info_list :[],
        asset_info_object:null,
      }
    },

    mounted() {
			let asset_id = this.$route.query.id;
            this.getAssetNode(asset_id);
		},
  }
</script>