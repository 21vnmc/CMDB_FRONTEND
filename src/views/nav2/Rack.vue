<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="机柜名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" v-on:click="filterApartment(filters)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" size="small" @click="handleReset">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" size="small"  @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <!--https://www.jianshu.com/p/6a9d247a4993-->
        <el-table :data="pageRacks" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="35">
            </el-table-column>
<!--            <el-table-column type="index" width="55">-->
<!--            </el-table-column>-->
            <el-table-column prop="name" label="机柜名称" width="250" sortable>
                <template slot-scope="scope">
                    <router-link :to="{ name: 'rack_detail', query: { rack_id: scope.row.id } }" target="_self">
                        {{scope.row.name != null ? scope.row.name : '空'}}
                    </router-link>
                </template>
            </el-table-column>

            <el-table-column prop="unit_size" label="大小(U)" width="100" sortable>
                <template slot-scope="scope">
                    {{scope.row.unit_size != null ? scope.row.unit_size:'空' }}
                </template>
            </el-table-column>

            <el-table-column prop="apartment_name" label="房间" width="230" sortable>
                <template slot-scope="scope">
                    {{scope.row.apartment_name != null ? scope.row.apartment_name:'空'}}
                </template>
            </el-table-column>

            <el-table-column prop="data_center_name" label="机房" width="300" sortable>
                <template slot-scope="scope">
                    {{scope.row.data_center_name != null ? scope.row.data_center_name:'空'}}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
                        <i class="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"/>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)"/>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button size="small" type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-count="pageCount"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    :total="total"
                    style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible="editFormVisible" :close-on-click-modal="false" @close="closeEditDialog">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
               <el-form-item label="机房房间" prop="data_center_apartment">
                    <el-cascader
                            ref="editCascade"
                            :props="optionProps"
                            :options="cascadeDataCenterApartData"
                            v-model="data_center_apartment"
                            @active-item-change="handleDataCenterApartChange"
                            @chage="itemChange">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="大小(U)" prop="unit_size_id">
                    <el-select v-model="editForm.unit_size_id" placeholder="请选择">
                        <el-option
                                v-for="item in unit_size_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属部门" prop="department_id">
                    <el-select v-model="editForm.department_id" placeholder="请选择">
                        <el-option
                                v-for="item in department_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off" style="width:218px"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible="addFormVisible" :close-on-click-modal="false" @close="closeAddDialog">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item label="机房房间" prop="data_center_apartment">
                    <el-cascader
                            ref="addCascade"
                            :props="optionProps"
                            :options="cascadeDataCenterApartData"
                            v-model="addForm.data_center_apartment"
                            @active-item-change="handleDataCenterApartChange"
                            @chage="itemChange">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="机柜名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off" style="width:218px"></el-input>
                </el-form-item>

                <el-form-item label="租用类型" prop="asset_status_id">
                    <el-radio-group v-model="addForm.rent_type">
                        <el-radio class="radio" :label="0">散U租用</el-radio>
                        <el-radio class="radio" :label="1">整柜租用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="大小(U)" prop="unit_size_id">
                    <el-select v-model="addForm.unit_size_id" placeholder="请选择">
                        <el-option
                                v-for="item in unit_size_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="部门" prop="department_id">
                    <el-select v-model="addForm.department_id" placeholder="请选择">
                        <el-option
                                v-for="item in department_list"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
        editApartmentApi,
        editRackApi,
        removeApartmentApi,
        removeRackApi,
        addApartmentApi,
        addRackApi,
        getRackDetailApi,
        batchRemoveDeviceApi, editAssetApi,
        getApartmentApi,
        getRacksApi,
        getRoomTypeApi, getDataCenterApartApi, queryDataBaseApi,
    } from '../../api/api';
    import {mapActions, mapGetters} from "vuex";
    import axios from "axios";

    export default {
        data() {
            return {
                optionProps: {
                    label: 'name',
                    value: 'id',
                    children: 'children'
                },
                spanArr: [],//二维数组，用于存放单元格合并规则
                position: 0,//用于存储相同项的开始index
                activeIndex: '1',
                activeIndex2: '1',
                cascadeDataCenterApartData: [],
                selectedManufacturerModelOptions: [],
                data_center_apartment:[],
                filters: {},
                isShow: true,
                pageRacks: [],
                RackInfo: [],
                roomTypeList: [],
                file: null,
                sels: [],
                total: 100,
                pageSize: 10,
                pageCount: 5,
                currentPage: 1,
                listLoading: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                unit_size_list:[],
                department_list:[],
                editFormRules: {
                    name: [
                        {required: true, message: '设备名称', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    name: '',
                    data_center_apartment: [],
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],

                },
                //新增界面数据
                addForm: {
                    name: '',
                    unit_size_id: null,
                    data_center_apartment: [],
                    department_id: null,
                    rent_type: 1,
                }

            }
        },
        methods: {
            closeEditDialog(){
                this.editFormVisible = false;
            },
            closeAddDialog(){
                this.addFormVisible = false;
            },
            rowspan() {
            this.RackInfo.forEach((item,index) => {
              if( index === 0){
                  this.spanArr.push(1);
                  this.position = 0;
              }else{
                  if(this.RackInfo[index].device_name === this.RackInfo[index-1].device_name ){
                      this.spanArr[this.position] += 1;
                      this.spanArr.push(0);
                  }else{
                      this.spanArr.push(1);
                      this.position = index;
                  }
              }
          })
        },
            //表格单元格合并
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
          if (columnIndex === 0) {
              const _row = this.spanArr[rowIndex];
              const _col = _row>0 ? 1 : 0;
              return {
                  rowspan: _row,
                  colspan: _col
              }
          }
          if(columnIndex === 1){
              const _row = this.spanArr[rowIndex];
              const _col = _row>0 ? 1 : 0;
              return {
                  rowspan: _row,
                  colspan: _col
              }
          }
      },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);

            },
            itemChange(val) {

            },
            getDetail(val){
                this.isShow = false;
                let para = {"rack_id":val}
                getRackDetailApi(para).then((res) => {
                        this.listLoading = false;
                        console.log(res.data.data,1);
                        this.RackInfo = res.data.data;
                        this.rowspan();

                    });

            },
            handleDataCenterApartChange(val) {
                this.getDataCenterApartNodes(val)
            },
            getDataCenterApartNodes(val) {
                let objectId
                let mulLen
                if (!val) {
                    objectId = null
                    mulLen = 0  // 1.一级
                } else if (val.length === 1) {
                    objectId = val[0]
                    mulLen = val.length // 2.二级
                }

                getDataCenterApartApi({objectId: objectId, mulLen: mulLen}).then(response => {
                    if (response.data && response.data.code == 200) {
                        let Items = response.data.data;
                        if (mulLen === 0) { // 初始化 加载一级 省
                            this.cascadeDataCenterApartData = Items.map((value, i) => {
                                if (!value.name) {
                                    value.name = '空';
                                }
                                return {
                                    id: value.id,
                                    name: value.name,
                                    children: []
                                }
                            })
                        } else if (mulLen === 1) { // 点击一级 加载二级 市
                            this.cascadeDataCenterApartData.map((value, i) => {
                                if (value.id === val[0]) {
                                    if (!value.children.length) {
                                        value.children = Items.map((value, i) => {
                                            if (!value.name) {
                                                value.name = '空';
                                            }
                                            return {
                                                id: value.id,
                                                name: value.name
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    } else {
                        console.log(response.data.msg)
                    }
                }, error => {
                    console.log(error)
                })
            },

            handleReset: function () {
                this.filters = {}
            },
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                let dc_apartment = [row.data_center_id,row.apartment_id];
                let dc_apartment_val = [];

				for (let i=0;i<dc_apartment.length-1;i++){
					dc_apartment_val.push(dc_apartment[i]);
					this.getDataCenterApartNodes(dc_apartment_val);
				}
                this.data_center_apartment = dc_apartment;
                this.editForm = Object.assign({}, row);
                this.origin_editForm = JSON.parse(JSON.stringify(this.editForm));
            },
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeRackApi(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRacks();
                    });
                }).catch(() => {

                });
            },
            filterApartment() {
                this.handleCurrentChange(1);
            },
            //单个文件上传
            handleUpload(raw) {
                this.file = raw.file;
            },
            /*
               handleUpload(raw) {
                  this.files.push(raw.file);
                },
             */

            //显示新增界面
            handleAdd: function () {
                this.addForm = {}
                this.addFormVisible = true;
            },
            batchRemove: function () {
                let ids = this.sels.map(item => item.device_id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveDeviceApi(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDevices();
                    });
                }).catch(() => {

                });
            },
            getRoomType() {
                getRoomTypeApi().then(response => {
                    this.roomTypeList = response.data.data;
                }, error => {
                    console.log(error)
                })
            }
            ,
            getRacks(pageNumber = 1, pageSize = 10, filterRule = this.filters) {
                let para = {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    filterRule: filterRule,
                };
                getRacksApi(para).then(response => {
                    this.pageRacks = response.data.data.result;
                    this.listLoading = false
                    this.total = response.data.data.length;
                    //NProgress.done();
                }, error => {
                    console.log(error)
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                Object.keys(this.filters).forEach((key) => (this.filters[key] == null || this.filters[key] == '') && delete this.filters[key]);
                if (this.currentPage <= this.pageCount) {
                    this.total = this.totalSize;
                } else {
                    let offset = this.currentPage - this.pageCount;
                    this.total = this.totalSize + offset * this.pageSize;
                }
                this.getRacks(this.currentPage, this.pageSize, this.filters);
            },
            getUnitSizes(){
				let para = {database_name:'unit_size'}
				queryDataBaseApi(para).then((res) => {
				    this.unit_size_list = res.data.data;
				});
			   },
            getDepartments() {
				let para = {database_name:'department'}
				queryDataBaseApi(para).then((res) => {
					this.department_list = res.data.data;
				});
			},
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            addRackApi(para).then((res) => {
                                if (res.data && res.data.code == 200) {
                                    this.addLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: '提交成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getRacks();
                                } else {
                                    this.addLoading = false;
                                    //NProgress.done();
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'warning'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getRacks();
                                }
                            });

                        });
                    }
                });
            },
            //编辑
            editSubmit: function (self) {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let editForm_object = Object.assign({}, this.editForm);
                            let count = 0;
                            let new_value_object = {
                                rack_id: editForm_object.id,
                            };
                            for (let key in editForm_object) {
                                let flag;
                                if (editForm_object[key] instanceof Array) {
                                    flag = JSON.stringify(editForm_object[key]) != JSON.stringify(this.origin_editForm[key]);
                                } else {
                                    flag = this.origin_editForm[key] !== editForm_object[key]
                                }
                                if (flag) {
                                    new_value_object[key] = editForm_object[key];
                                    count += 1;
                                }
                            }
                            if (count !== 0) {
                                if(new_value_object.hasOwnProperty('name')){
                                    new_value_object.apartment_id = this.editForm.apartment_id;
                                    new_value_object.data_center_id = this.editForm.data_center_id;
                                }
                                editRackApi(new_value_object).then((res) => {
                                    if (res.data.code === 200) {
                                        this.editLoading = false;
                                        //NProgress.done();
                                        this.$message({
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.$refs['editForm'].resetFields();
                                        this.editFormVisible = false;
                                        this.editLoading = false;
                                        this.getRacks();
                                    } else {
                                        this.$refs['editForm'].resetFields();
                                        this.editFormVisible = false;
                                        this.editLoading = false;
                                        this.$message({
                                            message: res.data.msg,
                                            type: 'warning'
                                        });
                                    }
                                });
                            } else {
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.editLoading = false;
                                this.$message({
                                    message: '没有更新',
                                    type: 'warning'
                                });
                            }


                            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');

                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },

        },
        mounted() {
            this.getRacks();
            this.getDataCenterApartNodes();
            this.getUnitSizes();
            this.getDepartments();
            // this.getRoomType();
        },
        computed: {
            ...mapGetters([
                'getAreaList',
                'getDataCenterList',
                'getApartmentList',
                'getDepartmentList',
                'getProductList',
                'getDeviceTypeList',
                'getModelList',
                'getDeviceInfo',
                'getUnitSizeList',
                // ...
            ])
        },
    }

</script>

<style scoped>
    .customWidth {
        width: 80%;
    }

    .text-wrapper {
      white-space: pre-wrap;
    }

    a {
        text-decoration: none;
    }

    .router-link-active {
        text-decoration: none;
    }

</style>
