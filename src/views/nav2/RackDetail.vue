<template>
    <div>
        <table>
            <thead>
            <th>设备</th>
            <th>U位</th>
            </thead>
            <tbody>
            <template v-for="(item,index) in tableData.slice().reverse()">

                <tr :key="index">
                    <td width="15%" align="center" valign="middle">{{item.rowSpanData[0].index}}</td>

                    <td :rowspan="item.rowSpanData.length"
                        v-bind:style="!item.rowSpanName ?'background-color:#FFF;':'background-color:darkolivegreen;'"
                    >

                        {{!item.rowSpanName ? '' : item.rowSpanName}}
                    </td>
                </tr>

                <tr v-for="(ele,inx) in item.rowSpanData.length-1" :key="index+'-'+inx">
                    <td width="15%">{{item.rowSpanData[ele].index}}</td>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>
<script>
import {getRackDetailApi} from "../../api/api";

export default
 {
  data() {
    return {
      tableData: [
        {
          rowSpanName: "合并单元格01",
          rowSpanData: [
            {
              value01: "01",
              value02: "02",
              value03: "03"
            },
            {
              value01: "01",
              value02: "02",
              value03: "03"
            },
            {
              value01: "01",
              value02: "02",
              value03: "03"
            }
          ]
        },
        {
          rowSpanName: "合并单元格02",
          rowSpanData: [
            {
              value01: "01",
              value02: "02",
              value03: "03"
            },
            {
              value01: "01",
              value02: "02",
              value03: "03"
            },
            {
              value01: "01",
              value02: "02",
              value03: "03"
            },
            {
              value01: "01",
              value02: "02",
              value03: "03"
            }
          ]
        },
        {
          rowSpanName: "合并单元格03",
          rowSpanData: [
            {
              value01: "01",
              value02: "02",
              value03: "03"
            },
            {
              value01: "01",
              value02: "02",
              value03: "03"
            }
          ]
        }
      ]
    };
  },
     methods: {

      getRackDetailNode(rack_id){
        let para = {rack_id:rack_id};
        getRackDetailApi(para).then((res) => {
            this.tableData = res.data.data;
        });

      },
     },
    mounted() {
      let r_id = this.$route.query.r_id;
      this.getRackDetailNode(r_id);
    },
 };
</script>
<style scoped>
    table {
        width: 300px;
        border: 1px solid #ccc;
        border-collapse: collapse;
    }

    thead th {
        text-align: center;
        background-color: #fafafa;
    }

    th, td {
        /*padding-left: 20px;*/
        border: 1px solid #e9eaec;
        line-height: 15px;
        text-align: center;
    }
</style>