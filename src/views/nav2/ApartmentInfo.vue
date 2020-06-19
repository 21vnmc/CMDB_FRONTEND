<template>
        <div>
            <section>
                <table style="border:thin dashed darkgray;width:80%">
                    <thead>
                    <th style="font-size:25px;text-align: right;">详</th>
                    <th height="32px" style="font-size:25px;text-align: left;">情
                    </th>
                    </thead>
                    <tbody style="border:thin solid darkgray;">
                    <template v-for="(val,key,index) in apartmentInfo">
                        <tr>
                            <td width="50%" align="right" style="font-weight:bold;">{{key}}:</td>
                            <td width="50%" align="left">{{val}}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>

                <table style="border:thin dashed darkgray;width:80%;margin-top: 20px">
                    <thead>
                    <th height="32px" style="font-size:25px;text-align: center;">归属的机柜
                    </th>
                    </thead>
                    <tbody style="border:thin solid darkgray;">
                    <template v-for="(item,index) in belongRacks">
                        <tr>
                            <td style="text-align: center">
                                <a :href="'/rackDetail?rack_id='+ item.id">{{item.name}}</a>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>

            </section>
        </div>
</template>
<script>
  import {getApartmentInfoApi} from "../../api/api";

    export default {
        data() {
            return {
                apartmentInfo:null,
                belongRacks:null,
            };
        },
        methods: {
            getApartmentInfo(para){
                 getApartmentInfoApi(para).then((res) => {
                    this.apartmentInfo = res.data.data.apartment;
                    this.belongRacks = res.data.data.racks;
                    console.log(this.belongRacks,123)
                });

            },
        },
        mounted() {
            this.getApartmentInfo(this.$route.query);
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