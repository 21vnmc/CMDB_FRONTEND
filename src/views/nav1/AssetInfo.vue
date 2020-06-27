<template>
        <div>
            <section>
                <table style="border:thin dashed darkgray;width:100%">
                    <thead>
                    <th></th>
                    <th height="32px" style=" font-size:25px;padding-right: 150px" >汇总</th>
                    </thead>
                    <tbody style="border:thin solid darkgray;">
                    <template v-for="(val,key,index) in assetInfo">
                        <tr>
                            <td align="right" style="font-weight:bold;width: 120px">{{key}}:</td>
                            <td align="left" v-if="key==='设备状态' && (val=='在用'||val == '在线') " style="color:#00FFFF">{{val}}</td>
                            <td align="left" v-else-if="key==='设备状态' && val=='闲置'" style="color:red">{{val}}</td>
                            <td align="left" v-else-if="key==='设备状态' && val=='报废'" style="color:#C80D4F82">{{val}}</td>
                            <td align="left" v-else>{{val}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>

            </section>
        </div>


</template>
<script>
    import {getAssetInfoApi} from "../../api/api";

    export default {
        data() {
            return {
                assetInfo:null,
            };
        },
        methods: {
            getAssetInfo(para){
                 getAssetInfoApi(para).then((res) => {
                    this.assetInfo = res.data.data;
                });

            },
        },
        mounted() {
            this.getAssetInfo(this.$route.query);
        },
    };
</script>
<style scoped>
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

    .right-table {
        border-bottom: #333 1px dashed;
    }
</style>