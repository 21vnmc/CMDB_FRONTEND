<template>
  <el-table
    :data="rack_info_list"
    style="width: 100%"
    >
    <el-table-column
      prop="rack_name"
      label="机柜名称"
      width="280">
    </el-table-column>
    <el-table-column
      prop="apart_name"
      label="房间名称"
      width="280">
    </el-table-column>
    <el-table-column
      prop="center_name"
      label="中心名称"
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
  import {getRackInfoApi} from "../../api/api";
  export default {
    methods: {
      getRackNode(d_id){
        let para = {d_id:d_id};
        getRackInfoApi(para).then((res) => {
            this.rack_info_list = res.data.data;
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
        rack_info_list :[],
      }
    },

    mounted() {
			let d_id = this.$route.query.d_id;
            this.getRackNode(d_id);
		},
  }
</script>