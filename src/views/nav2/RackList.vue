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
                    <el-button type="success" size="small" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <!--https://www.jianshu.com/p/6a9d247a4993-->
        <el-table :data="pageRacks" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection" width="35">
            </el-table-column>
            <el-table-column type="index" width="55">
            </el-table-column>
            <el-table-column prop="name" label="数据中心-房间名称" width="770" sortable>
                <template slot-scope="scope">
                    <router-link :to="{ name: 'rack_info', query: { r_id: scope.row.id } }" target="_blank">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>

            <el-table-column prop="unit_size" label="大小(U)" width="180" sortable>
			</el-table-column>

            <el-table-column prop="apartment_name" label="房间" width="180" sortable>
			</el-table-column>

            <el-table-column prop="data_center_name" label="机房" width="180" sortable>
			</el-table-column>

            <el-table-column label="操作" width="210">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
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
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

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
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item label="数据中心" prop="data_center_id">
                    <el-select v-model="addForm.data_center_id" placeholder="请选择">
                        <el-option
                                v-for="item in getDataCenterList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="机房名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off" style="width:218px"></el-input>
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
        removeApartmentApi,
        addApartmentApi,
        batchRemoveDeviceApi, editAssetApi,
        getApartmentApi,
        getRacksApi,
        getRoomTypeApi,
    } from '../../api/api';
    import {mapActions, mapGetters} from "vuex";
    import axios from "axios";

    export default {
        data() {
            return {
                filters: {},
                pageRacks: [],
                roomTypeList: [],
                file:null,
                sels: [],
                total: 100,
                pageSize: 10,
                pageCount: 5,
                currentPage: 1,
                listLoading: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '设备名称', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    name:'',
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
                    name:'',
                    data_center_id:null,
                }

            }
        },
        methods: {
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleReset: function () {
                this.filters = {}
            },
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
				this.origin_editForm = JSON.parse(JSON.stringify(this.editForm));
            },
            handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeApartmentApi(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getApartment();
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
                var ids = this.sels.map(item => item.device_id).toString();
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
                this.getApartment(this.currentPage, this.pageSize, this.filters);
            },
            addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
                            addApartmentApi(para).then((res) => {
							if (res.data && res.data.code == 200) {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getApartment();
							}else{
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: res.data.msg,
									type: 'warning'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getApartment();
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
							let new_value_object = {apartment_id:editForm_object.id,data_center_id:editForm_object.data_center_id};
							for(let key in editForm_object){
								let flag;
								if ( editForm_object[key] instanceof  Array ){
									flag = JSON.stringify(editForm_object[key]) != JSON.stringify(this.origin_editForm[key]);
								}else{
									flag = this.origin_editForm[key] !== editForm_object[key]
								}
								if(flag){
									new_value_object[key] = editForm_object[key];
									count += 1;
								}
							}
							if (count !== 0){
								editApartmentApi(new_value_object).then((res) => {
									if(res.data.code === 200){
										this.editLoading = false;
										//NProgress.done();
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.editLoading = false;
										this.getApartment();
									}else{
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.editLoading = false;
										this.$message({
											message: res.data.msg,
											type: 'warning'
									});
									}
								});
							}
							else{
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
                // ...
            ])
        },
    }

</script>

<style scoped>
    .customWidth {
        width: 80%;
    }

</style>