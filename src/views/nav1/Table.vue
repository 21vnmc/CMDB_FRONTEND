<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getFilterDevices(filters.name)">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<!--https://www.jianshu.com/p/6a9d247a4993-->
		<el-table :data="pageDevices" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="35">
			</el-table-column>
			<el-table-column type="index" width="30">
			</el-table-column>
			<el-table-column prop="device_name" label="设备名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="ip_addr" label="ip地址" width="150" sortable>
			</el-table-column>
			<el-table-column prop="device_type" label="硬件类型" width="120" sortable>
			</el-table-column>
			<el-table-column prop="rack_name" label="机柜名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="apart_name" label="机房" width="120" sortable>
			</el-table-column>
			<el-table-column prop="data_center_name" label="数据中心" width="120" sortable>
			</el-table-column>
<!--			<el-table-column prop="area_name" label="地区" width="120" sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>-->
<!--			<el-table-column prop="unitSize" label="U位大小" width="120"  sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="age" label="年龄" width="100" sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="birth" label="生日" width="120" sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="addr" label="地址" min-width="180" sortable>-->
<!--			</el-table-column>-->
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="devices.length" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false" >
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="设备名称" prop="device_name" >
						<el-input  v-model="editForm.device_name" auto-complete="off" style="width:218px"></el-input>
					</el-form-item>

					<el-form-item label="ip地址" prop="ip_addr" >
						<el-input v-model="editForm.ip_addr" auto-complete="off" style="width:218px"></el-input>
					</el-form-item>
						<el-form-item label="序列号" prop="serial_num" >
							<el-input v-model="editForm.serial_num" auto-complete="off" style="width:218px"></el-input>
						</el-form-item>

					<el-form-item label="资产编号" prop="vianet_num" >
						<el-input v-model="editForm.vianet_num" auto-complete="off" style="width:218px"></el-input>
					</el-form-item>


<!--				<el-form-item label="大区" prop="area_name">-->
<!--					 <el-select v-model="area" placeholder="请选择" @change="selectDataCenter">-->
<!--						<el-option-->
<!--						  v-for="(item,index) in getAreaList"-->
<!--						  :key="index"-->
<!--						  :label="item.name"-->
<!--						  :value="item.id">-->
<!--						</el-option>-->
<!--					</el-select>-->
<!--				</el-form-item>-->

<!--				<el-form-item label="数据中心">-->
<!--					 <el-select v-model="dataCenter" placeholder="请选择" @change="selectApartment">-->
<!--						<el-option-->
<!--						  v-for="(item,index) in getDataCenterList"-->
<!--						  :key="index"-->
<!--						  :label="item.name"-->
<!--						  :value="item.id">-->
<!--						</el-option>-->
<!--					</el-select>-->
<!--				</el-form-item>-->

<!--				<el-form-item label="房间">-->
<!--					 <el-select v-model="apartment" placeholder="请选择" >-->
<!--						<el-option-->
<!--						  v-for="(item,index) in getApartmentList"-->
<!--						  :key="index"-->
<!--						  :label="item.name"-->
<!--						  :value="item.id">-->
<!--						</el-option>-->
<!--					</el-select>-->
<!--				</el-form-item>-->

				<el-form-item label="位置">
					<el-cascader
						 ref="myCascader"
						:props="optionProps"
						:options="cascaderData"
						 v-model="this.selectedOptions"
						@active-item-change="handleItemChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>

			<el-form-item label="部门">
					<el-select v-model="editForm.department_id" placeholder="请选择">
					<el-option
					  v-for="item in getDepartmentList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
			</el-form-item>

				<el-form-item label="产品类型">
					<el-select v-model="editForm.product_id" placeholder="请选择">
					<el-option
					  v-for="item in getProductList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
			</el-form-item>


<!--				<el-form-item label="性别">-->
<!--					<el-radio-group v-model="editForm.sex">-->
<!--						<el-radio class="radio" :label="1">男</el-radio>-->
<!--						<el-radio class="radio" :label="0">女</el-radio>-->
<!--					</el-radio-group>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="年龄">-->
<!--					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="生日">-->
<!--					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="地址">-->
<!--					<el-input type="textarea" v-model="editForm.addr"></el-input>-->
<!--				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="设备名称" prop="name">
							<el-input v-model="addForm.name"  auto-complete="off"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="ip地址" prop="ip_addr"  >
							<el-input v-model="addForm.ip_addr" auto-complete="off" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>




				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="序列号" prop="serial_num" >
							<el-input v-model="addForm.serial_num" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="资产编号" prop="vianet_num" >
							<el-input v-model="addForm.vianet_num" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>



				<el-row	:gutter="20">
					<el-col :span="12">
						<el-form-item label="snmp字符" prop="snmp_str" >
							<el-input v-model="addForm.snmp_string" auto-complete="off" ></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="U位大小" prop="snmp_str" >
							<el-input v-model="addForm.unit_size" auto-complete="off" ></el-input>
						</el-form-item>
					</el-col>
				</el-row>

					<el-row>
						<el-form-item label="状态">
						<el-radio-group v-model="addForm.status">
							<el-radio class="radio" :label="1">在线</el-radio>
							<el-radio class="radio" :label="2">下线</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-row>

				<el-form-item label="产品类型">
					<el-select v-model="addForm.product_id" placeholder="请选择">
					<el-option
					  v-for="item in getProductList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
					</el-form-item>
				<el-form-item label="所属部门">
					<el-select v-model="addForm.department_id" placeholder="请选择">
					<el-option
					  v-for="item in getDepartmentList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
					</el-form-item>
				<el-form-item label="设备类型">
					<el-select v-model="addForm.device_type_id" placeholder="请选择">
					<el-option
					  v-for="item in getDeviceTypeList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
					</el-form-item>

				<el-form-item label="位置">
					<el-cascader
						 ref="addLocationCascader"
						:props="optionProps"
						:options="cascaderData"
						 v-model="this.selectedOptions"
						@active-item-change="handleItemChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>

				<el-form-item label="厂商型号">
					<el-cascader
						 ref="addAgentModelCascader"
						:props="optionProps"
						:options="cascaderAgentModelData"
						 v-model="this.selectedOptions"
						@active-item-change="handleAddItemChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>




<!--				<el-form-item label="年龄">-->
<!--					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="生日">-->
<!--					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="地址">-->
<!--					<el-input type="textarea" v-model="addForm.addr"></el-input>-->
<!--				</el-form-item>-->
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
	import {getModelListApi,getAgentListApi,getAgentModelApi,
		getDeviceTypeListApi,getProductListApi,getDepartmentListApi,
		getDeviceListApi, batchRemoveUser,getAreaListApi, editDeviceApi,addDeviceApi,removeDeviceApi,
		addUser,getDataCenterListApi,getLocationApi } from '../../api/api';
	import {mapActions,mapGetters} from "vuex";

	export default {
		data() {
			return {
				optionProps:{
					label: 'name',
					value: 'id',
					children: 'children'
				},
				filters: {
					name: ''
				},
				area:'',
				dataCenter:'',
				department:'',
				product:'',
				apartment:'',
				props:{
					label: 'name',
					value: 'id',
					children: 'dataCenters'
				},
				devices: [],
				selectedOptions:[],
				cascaderData:[],
				cascaderAgentModelData:[],
				departments:[],
				products:[],
				pageDevices: [],
				total: 0,
				pageSize:10,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					device_name: [
						{ required: true, message: '设备名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					device_id:'',
					device_name: '',
					origin_device_name:'',
					device_type: '',
					department_id:'',
					origin_department_id:'',
					ip_addr:'',
					origin_ip_addr:'',
					vianet_num:'',
					origin_vianet_num:'',
					serial_num:'',
					origin_serial_num:'',
					product_id:'',
					product_name:'',
					origin_product_id:'',
					rack_id:'',
					apartment_id:'',
					data_center_id:'',
					area_id:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入设备名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					status: 1,
					ip_addr:'',
					serial_num:'',
					vianet_num:'',
					snmp_string:'',
					unit_size:'',
					product_id:'',
					department_id:'',
					device_type_id:'',
					model_id: null,
					agent_id: null,
				}

			}
		},
		methods: {
			   getDepartments(){
					getDepartmentListApi().then((res) => {
						this.departmentList({department_list:res.data.data});
					});
			   },
			   getDataCenters(){
					getDataCenterListApi().then((res) => {
						this.dataCenterList({dataCenter_list:res.data.data});
					});
			   },
			   getAreas(){
			   		getAreaListApi().then((res) => {
						this.areaList({area_list:res.data.data});
				});
			   },
				getProducts(){
			   		getProductListApi().then((res) => {
						this.productList({product_list:res.data.data});

				});
			   },
			  getDeviceTypes(){
				getDeviceTypeListApi().then((res) => {
					this.deviceTypeList({device_type_list:res.data.data});
				});
			   },
			getModels(){
				getModelListApi().then((res) => {
					this.modelList({model_list:res.data.data});
				});
			   },
			getAgents(){
				getAgentListApi().then((res) => {
					this.agentList({agent_list:res.data.data});
				});
			   },
			   getNodes (val) {
				  let objectId
				  let mulLen
				  if (!val) {
					objectId = null
					mulLen = 0  // 1.一级
				  } else if (val.length === 1) {
					objectId = val[0]
					mulLen = val.length // 2.二级
				  } else if (val.length === 2) {
					objectId = val[1]
					mulLen = val.length // 3.三级
				  }else if (val.length === 3) {
					  objectId = val[2]
					  mulLen = val.length // 4.四级
				  }
				  getLocationApi({objectId:objectId,mulLen:mulLen}).then(response => {
					if (response.data && response.data.code == 200) {
					  let Items = response.data.data
					  if (mulLen === 0) { // 初始化 加载一级 省
						this.cascaderData = Items.map((value, i) => {
						  return {
							id: value.id,
							name: value.name,
							children: []
						  }
						})
					  } else if (mulLen === 1) { // 点击一级 加载二级 市
						this.cascaderData.map((value, i) => {
						  if (value.id === val[0]) {
							if (!value.children.length) {
							  value.children = Items.map((value, i) => {
								return {
								  id: value.id,
								  name: value.name,
								  children: []
								}
							  })
							}
						  }
						})
					  } else if (mulLen === 2) { // 点击二级 加载三级 区
						this.cascaderData.map((value, i) => {
						  if (value.id === val[0]) {
							value.children.map((value, i) => {
							  if (value.id === val[1]) {
								if (!value.children.length) {
								  value.children = Items.map((value, i) => {
									return {
									  id: value.id,
									  name: value.name,
										children: []
									}
								  })
								}
							  }
							})
						  }
						})
					  }else if (mulLen === 3) { // 点击三级 加载四级 区
						this.cascaderData.map((value, i) => {
						  if (value.id === val[0]) {
							value.children.map((value, i) => {
							  if (value.id === val[1]) {
							  	value.children.map((value, i) => {
								  if (value.id === val[2]) {
									if (!value.children.length) {
									  value.children = Items.map((value, i) => {
										return {
										  id: value.id,
										  name: value.name
										}
									  })
									}
								  }
								})


							  }
							})
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
			getAgentNodes (val) {
				  let objectId
				  let mulLen
				  if (!val) {
					objectId = null
					mulLen = 0  // 1.一级
				  } else if (val.length === 1) {
					objectId = val[0]
					mulLen = val.length // 2.二级
				  }
				  getAgentModelApi({objectId:objectId,mulLen:mulLen}).then(response => {
					if (response.data && response.data.code == 200) {
					  let Items = response.data.data
					  if (mulLen === 0) { // 初始化 加载一级 省
						this.cascaderAgentModelData = Items.map((value, i) => {
						  return {
							id: value.id,
							name: value.name,
							children: []
						  }
						})
					  } else if (mulLen === 1) { // 点击一级 加载二级 市
						this.cascaderAgentModelData.map((value, i) => {
						  if (value.id === val[0]) {
							if (!value.children.length) {
							  value.children = Items.map((value, i) => {
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
			handleItemChange (val) {
			  this.getNodes(val)
			},
			handleAddItemChange (val) {
			  this.getAgentNodes(val)
			},

			...mapActions({
				areaList:"areaList",
				dataCenterList:"dataCenterList",
				apartmentList:"apartmentList",
				departmentList:"departmentList",
				productList:"productList",
				deviceTypeList:"deviceTypeList",
				modelList:"modelList",
				agentList:"agentList",
			  }),
			itemChange(val) {

			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.pageDevices = this.devices.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
			},
			//获取资产列表
			getDevices() {
				let para = {
					name: this.filters.name
				};
				// let ret_list = [];
				this.listLoading = true;

				//NProgress.start();
				getDeviceListApi(para).then((res) => {
					this.total = res.data.data.length;
					this.devices = res.data.data;
					// ret_list = util.formatFlaskObjects(res.data.data.area_list);
					this.pageDevices = this.devices.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.device_id };
					console.log(para,11112222);
					removeDeviceApi(para).then((res) => {
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
			//显示编辑界面
			handleEdit: function (index, row) {
			   	let location;
			   	if (row.rack_name.length ===0 ||  row.apart_name.length ===0 || row.data_center_name.length ===0 || row.area_name === 0){
			   		location = [];
				}else{
					location = [row.area_id,row.data_center_id,row.apartment_id,row.rack_id];
				}
			   	let location_val = [];
				this.editFormVisible = true;
				for (let i=0;i<location.length-1;i++){
					location_val.push(location[i]);
					this.getNodes(location_val);
					// this.selectedOptions = location_val;
				}
				this.selectedOptions = location;
				row.origin_device_name = row.device_name;
				row.origin_ip_addr= row.ip_addr;
				row.origin_vianet_num = row.vianet_num;
				row.origin_serial_num = row.serial_num;
				row.origin_department_id = row.department_id;
				if (row.product_name.length === 0) {
					row.origin_product_id = null;
					row.product_id = null;
				}else{
					row.origin_product_id = row.product_id;
				}
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.selectedOptions = [];
				this.addForm =  {
					name: '',
					status: 1,
					ip_addr:'',
					serial_num:'',
					vianet_num:'',
					snmp_string:'',
					unit_size:'',
					product_id:'',
					department_id:'',
					device_type_id:'',
					model_id: null,
					agent_id: null,
				}
			},
			getFilterDevices(device_name) {
			  if (device_name.length === 0) {
			  	this.pageDevices = this.devices.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
			  	return
			  }
			  this.pageDevices =  this.devices.filter(item => (item.device_name).trim() === device_name);
			},
			//编辑
			editSubmit: function (self) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let reflect_object = {
								"device_name":"origin_device_name",
								"serial_num":"origin_serial_num",
								"vianet_num":"origin_vianet_num",
								"ip_addr":"origin_ip_addr",
								"department_id":"origin_department_id",
								"product_id":"origin_product_id",
							}
							let editForm_object = Object.assign({}, this.editForm);
							let para = {device_id:editForm_object.device_id};
							let labelValue = this.$refs.myCascader.currentValue;
							let labelValue_array = JSON.parse(JSON.stringify(labelValue));
							let origin_location = [editForm_object.area_id,editForm_object.data_center_id,editForm_object.apartment_id,editForm_object.rack_id]
							if ((JSON.stringify(origin_location) !== JSON.stringify(labelValue_array)) && labelValue_array.length !=0){
								para.location = labelValue_array;
							}
							for (let [key, value] of Object.entries(reflect_object)) {
								let new_value = Reflect.get(editForm_object,key);
								let old_value = Reflect.get(editForm_object,value);
								if ( old_value !== new_value ){
									Reflect.set(para,key,new_value);
								}
							}
							if (( Object.entries(para).length > 1)) {
								editDeviceApi(para).then((res) => {
									this.editLoading = false;
									//NProgress.done();
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.editLoading = false;
									this.getDevices();
								});
							}else{
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.editLoading = false;
									this.$message({
										message: '没有更新',
										type: 'warning'
									});
									// this.getDevices();
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
							let msg_ret = {msg:"",type:"error"};
							this.addLoading = true;
							//NProgress.start();
							let result = this.devices.filter( (item) => {


								 var device_name_ret
								 if (device_name_ret && this.addform.name.length !== 0){
								 	device_name_ret = item.device_name.trim() === this.addform.name;
								 	msg_ret.msg = "设备已经存在";
								 }
								var serial_num_ret;
								if (serial_num_ret && this.addForm.serial_num.length !== 0) {
									serial_num_ret = item.serial_num.trim() === this.addForm.serial_num;
									msg_ret.msg = "序列号已经存在";
								}
								var vianet_num_ret;
								if (vianet_num_ret && this.addForm.vianet_num.length !== 0) {
									vianet_num_ret = item.vianet_num.trim() === this.addForm.vianet_num;
									msg_ret.msg = "21vianet号已经存在";
								}
								var ip_addr_ret;
								if (ip_addr_ret && this.addForm.ip_addr.length !== 0) {
									ip_addr_ret = item.ip_addr.trim() === this.addForm.ip_addr;
									msg_ret.msg = "ip地址已经存在";
								}

								 return  serial_num_ret || vianet_num_ret || ip_addr_ret;
							});
							if (result.length !== 0) {
									this.$message({
									message: msg_ret.msg,
									type: msg_ret.type,
								});
									this.addFormVisible = false;
									this.addLoading = false;
									return
							}
							let locationValue = this.$refs.addLocationCascader.currentValue;
							let locationValue_array = JSON.parse(JSON.stringify(locationValue));
							let agentModelValue = this.$refs.addAgentModelCascader.currentValue;
							let agent_model_array = JSON.parse(JSON.stringify(agentModelValue));
							this.addForm.location = locationValue_array;
							this.addForm.agent_id = agent_model_array[0];
							this.addForm.model_id = agent_model_array[1];
							let para = Object.assign({}, this.addForm);
							console.log(1111,para);
							addDeviceApi(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getDevices();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
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
			}
		},
		mounted() {
			this.getDevices();
			this.getNodes();
			this.getAgentNodes();
			this.getDepartments();
			this.getDataCenters();
			this.getAreas();
			this.getProducts();
			this.getDeviceTypes();
			this.getModels();
			this.getAgents();

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
			  'getAgentList',
			  // ...
			])
		},
	}

</script>

<style scoped>
       .customWidth{
        width:80%;
    }

</style>