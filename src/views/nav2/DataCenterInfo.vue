<template>
        <div>
            <section>
                <table style="border:thin dashed darkgray;width:60%">
                    <thead>
                    <th></th>
                    <th height="32px" style="font-size:25px;text-align: left" >详情</th>
                    </thead>
                    <tbody style="border:thin solid darkgray;">
                    <template v-for="(val,key,index) in dataCenterInfo">
                        <tr>
                            <td align="right" style="font-weight:bold">{{key}}:</td>
                            <td align="left">{{val}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </section>
        </div>
</template>
<script>
  import {getDataCenterInfoApi} from "../../api/api";

    export default {
        data() {
            return {
                dataCenterInfo:null,
            };
        },
        methods: {
            getDataCenterInfo(para){
                 getDataCenterInfoApi(para).then((res) => {
                    this.dataCenterInfo = res.data.data;
                });

            },
        },
        mounted() {
            this.getDataCenterInfo(this.$route.query);
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

</style>