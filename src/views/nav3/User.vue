<template>
    <section>

        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item>
					<el-input v-model="filters.username" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getFilterUsers(filters)">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" size="small" @click="handleReset">重置</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

        <!--数据列表-->
        <el-table :data="pageUsers"  border v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="35">
			</el-table-column>
            <el-table-column
                    prop="username"
                    label="用户名"
                    width="180">
            </el-table-column>
			<el-table-column
                    prop="email"
                    label="邮箱"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="role_name"
                    label="组">
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

        <!--编辑界面-->
		<el-dialog width="50%" title="编辑" :visible="editFormVisible"  :append-to-body="true" :close-on-click-modal="true"
		@close='closeDialog'
		>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="editForm.username" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="editForm.email" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

				</el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
						<el-form-item label="密码" prop="password">
							<el-input show-password v-model="editForm.password" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
                </el-row>


				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="组">
							<el-select filterable v-model="editForm.role_id"
									   placeholder="请选择">
								<el-option
										v-for="item in role_list"
										:key="item.id"
										:label="item.name ? item.name:'空'"
										:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

				</el-row>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

        <!--新增界面-->
        <el-dialog width="50%" title="新增" :visible="addFormVisible" :append-to-body="true" :close-on-click-modal="true"
                   @close='closeAddDialog'
        >
           <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="addForm.username" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="addForm.email" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

				</el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
						<el-form-item label="密码" prop="password">
							<el-input show-password v-model="addForm.password" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
                </el-row>


				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="组" prop="role_id">
							<el-select filterable v-model="addForm.role_id"
									   placeholder="请选择">
								<el-option
										v-for="item in role_list"
										:key="item.id"
										:label="item.name ? item.name:'空'"
										:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

				</el-row>
		   </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
        </el-dialog>

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
    </section>


</template>

<script>
	import {
		batchRemoveDeviceApi,
		batchRemoveUserApi,
		getUserListApi,
		queryDataBaseApi,
		queryRoleApi,
		removeUserApi, editUserApi, addDeviceApi,addUserApi
	} from "../../api/api";

    export default {
        data() {
            return {
                filters: {
				},
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addFormVisible:false,
                addLoading: false,
                listLoading: false,
                page_users: [],
                total: 100,
				pageSize:10,
				pageCount:5,
				currentPage: 1,
                users: [],
                pageUsers:[],
                role_list:[],
                sels:[],
                editForm:{
                	user_id:'',
                    username:'',
                    password:'',
                    role_id:'',
                },
                addForm:{},
                editFormRules: {
					username: [
						{ required: true, message: '用户名称', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '邮箱', trigger: 'blur' }
					],
                    password: [
						{ required: true, message: '密码', trigger: 'blur' }
					],
                    role_id: [
						{ required: true, message: '组名', trigger: 'blur' ,type:'number' }
					]
				},
                addFormRules: {
					username: [
						{ required: true, message: '用户名称', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '邮箱', trigger: 'blur' }
					],
                    password: [
						{ required: true, message: '密码', trigger: 'blur' }
					],
					role_id: [
						{ required: true, message: '组名', trigger: 'blur' ,type:'number' }
					]
				},
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods:{
            selsChange: function (sels) {
				this.sels = sels;
			},
            closeDialog(){
				this.editFormVisible = false;
			},
			closeAddDialog(){
				this.addFormVisible = false;
			},
            getFilterUsers(filters) {
			   	this.handleCurrentChange(1);
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
					let para = { id: row.user_id };
					removeUserApi(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},

            //点击查询
			handleCurrentChange(val) {
				this.currentPage = val;
				Object.keys(this.filters).forEach((key) => (this.filters[key] == null || this.filters[key] == '') && delete this.filters[key]);
				if(this.currentPage<=this.pageCount){
					this.total = this.totalSize;
				}else{
					let offset = this.currentPage - this.pageCount;
					this.total = this.totalSize + offset * this.pageSize;
				}
				this.getUsers(this.currentPage,this.pageSize,this.filters);
			},
            //获取资产列表
			getUsers(pageNumber=1,pageSize=10,filterRule=this.filters) {
				let para = {
					pageNumber: pageNumber,
					pageSize: pageSize,
					filterRule: filterRule,
				};
				// let ret_list = [];
				this.listLoading = true;
				//NProgress.start();
				getUserListApi(para).then((res) => {
					this.pageUsers = res.data.data.result;
					this.listLoading = false
					let page_count = res.data.data.length;
					this.total = page_count;
					//NProgress.done();
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
							let new_value_object = {user_id: editForm_object.user_id};
							console.log(new_value_object,1111)
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
								editUserApi(new_value_object).then((res) => {
									this.editLoading = false;
									//NProgress.done();
									if (res.data.code === 200) {
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.editLoading = false;
										// location.reload();
										this.getUsers();
									} else {
										this.$message({
											message: res.data.msg,
											type: 'warning'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.editLoading = false;
										this.getUsers();
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addUserApi(para).then((res) => {
							if (res.data && res.data.code == 200) {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								location.reload();
								// this.getNodes();
							}else{
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: res.data.msg,
									type: 'warning'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							}
							});
						});
					}
				});
			},
            getGroups() {
				let para = {database_name:'roles'}
				queryRoleApi(para).then((res) => {
					this.role_list = res.data.data;
				});
			},
			handleReset: function () {
				this.filters = {}
				this.page_devices = this.devices;
			},
            handleAdd:function(){
            	this.addFormVisible = true;
			},
            //批量删除
			batchRemove: function () {
				let ids = this.sels.map(item => item.username_id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUserApi(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
        },
        mounted() {
            this.getUsers();
            this.getGroups();
        }
    }
</script>