<template>
    <div>
        <div class="left">
            <table class="left-table" v-if="tableData.length!==0">
                <thead>
                <th height="16px">设备</th>
                <th >U位</th>
                </thead>
                <tbody>
                <template v-for="(item,index) in tableData.slice().reverse()">
                    <tr :key="index">
                        <td width="15%" align="center" valign="middle">{{item.rowSpanData[0].index}}</td>

                        <td :rowspan="item.rowSpanData.length" v-if="!item.current"
                            v-bind:style="!item.rowSpanName ?'background-color:#FFF;':'background-color:#ff9999;'"
                        >
                            {{!item.rowSpanName ? '' : item.rowSpanName}}
                        </td>
                        <td :rowspan="item.rowSpanData.length" v-else
                            v-bind:style="'background-color:#00FFFF;'"
                        >
                            {{!item.rowSpanName ? '' : item.rowSpanName}}
                        </td>
                    </tr>

                    <tr v-for="(ele,inx) in item.rowSpanData.length-1" :key="index+'-'+inx">
                        <td width="15%">{{item.rowSpanData[ele].index}}</td>
                    </tr>
                </template>
                <tr bgcolor="#888" height="16px">
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <img hspace="50" height="30px" src="../../../static/rackwheel.png">
                        <img hspace="35" height="30px" src="../../../static/rackwheel.png">
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="right">
            <section>
                <table style="border:thin dashed darkgray;width: 500px">
                    <thead>
                    <th></th>
                    <th height="32px" style=" font-size:25px;padding-right: 150px" >汇总</th>
                    </thead>
                    <tbody style="border:thin solid darkgray;">
                    <template v-for="(val,key,index) in deviceInfo">
                        <tr>
                            <td align="right" style="font-weight:bold">{{key}}:</td>
                            <td align="left" v-if="key==='设备状态' && val==2" style="color:#00FFFF">下线</td>
                            <td align="left" v-else-if="key==='设备状态' && val==1" style="color:green">在线</td>
                            <td align="left" v-else>{{val}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>

            </section>
        </div>

    </div>

</template>
<script>
    import {getDeviceInfoApi, getRackDetailApi} from "../../api/api";

    export default {
        data() {
            return {
                deviceInfo:null,
                tableData:[],
            };
        },
        methods: {

            getRackDetailNode(para) {
                getRackDetailApi(para).then((res) => {
                    this.tableData = res.data.data.rack_position_info;
                });

            },
            getDeviceInfo(para){
                 getDeviceInfoApi(para).then((res) => {
                    this.deviceInfo = res.data.data;
                });

            },
        },
        mounted() {
            this.getRackDetailNode(this.$route.query);
            this.getDeviceInfo(this.$route.query);
        },
    };
</script>
<style scoped>
    .left-table {
        background-color: #FAFAFA;
        width: 300px;
        border: 1px solid;
        border-collapse: collapse;
    }
    .left-table th {
        background-color: #888;
        height: 20px;
    }
    thead th {
        text-align: center;
    }
    td {
    border: none;
}

    .left-table th,.left-table  td {
        /*padding-left: 20px;*/
        border: 1px solid #e9eaec;
        line-height: 15px;
        text-align: center;
    }

    .left {
        float: left;

    }

    .right {
        float: right;
        margin-right: 200px;
    }

    .right-table {
        border-bottom: #333 1px dashed;
    }
</style>