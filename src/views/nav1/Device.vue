<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="设备名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.serial_num" placeholder="sn号码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.via_num" placeholder="资产编号"></el-input>
				</el-form-item>
				<el-form-item >
					<el-select filterable v-model="filters.query_field" placeholder="搜索类型"
					@change="changeQueryItem"
					>
					<el-option
					  v-for="item in query_fields"
					  :key="item.query_object"
					  :label="item.name"
					  :value="item.query_object">
					</el-option>
				  </el-select>
					</el-form-item>
				<el-form-item >
					<el-select filterable v-model="filters.field_value" placeholder="请选择">
					<el-option
					  v-for="item in field_values"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
					</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getFilterDevices(filters)">查询</el-button>
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
		<el-table :data="pageDevices" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="35">
			</el-table-column>
			<el-table-column prop="name" label="设备名称" width="180" sortable>
				<template slot-scope="scope">
					<router-link :to="{ name: 'device_info', query: { rack_id: scope.row.rack_id,device_id: scope.row.id } }" target="_self">
						{{scope.row.name != null ? scope.row.name : '空'}}
					</router-link>
				</template>
			</el-table-column>
<!--			<el-table-column prop="ip_addr" label="ip地址" width="150" sortable>-->
<!--			</el-table-column>-->
			<el-table-column prop="device_type" label="硬件类型" width="100" sortable>
			</el-table-column>
			<el-table-column prop="data_center_name/apart_name/rack_name" label="数据中心/机房/机柜" width="350" sortable>
				 <template slot-scope="scope">
					 <router-link :to="{ name: 'data_center_info', query: { d_id: scope.row.department_id } }" target="_self">
                       {{scope.row.data_center_name != null ? scope.row.data_center_name:'空'}}
                    </router-link>/
					 <router-link :to="{ name: 'apartment_info', query: { a_id: scope.row.apartment_id,d_name:scope.row.data_center_name } }" target="_self">
                        {{scope.row.apart_name != null ? scope.row.apart_name:'空' }}
                    </router-link>/
					 <router-link :to="{ name: 'rack_detail', query: { rack_id: scope.row.rack_id } }" target="_self">
                        {{scope.row.rack_name  == null ? "空":scope.row.rack_name }}
                    </router-link>
				</template>
			</el-table-column>
<!--			<el-table-column prop="rack_name" label="机柜名称" width="120" sortable>-->
<!--			</el-table-column>-->
<!--			<el-table-column prop="apart_name" label="机房" width="120" sortable>-->
<!--			</el-table-column>-->
			<el-table-column prop="department_name" label="所属部门" width="200" sortable>
			</el-table-column>
			<el-table-column prop="name" label="设备端口" width="100" sortable>
				<template slot-scope="scope">
					<router-link
							:to="{ name: 'device_port', query: {device_id: scope.row.id } }"
							target="_self">
						端口详情
					</router-link>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" content="修改" placement="top-start">
						<i class="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)"/>
					</el-tooltip>
					<el-tooltip  class="item" effect="dark" content="删除" placement="top-start">
						<i class="el-icon-delete" @click="handleDel(scope.$index, scope.row)"/>
					</el-tooltip>
<!--					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--					<el-button type="success" size="mini" @click="handleDeviceInfo(scope.$index, scope.row)">详情</el-button>-->
<!--					<el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
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
		<el-dialog width="50%" title="编辑" :visible="editFormVisible"  :append-to-body="true" :close-on-click-modal="true"
		@close='closeDialog'
		>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="设备名称" prop="name">
							<el-input v-model="editForm.name" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="ip地址" prop="ip_addr">
							<el-input v-model="editForm.ip_addr" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="序列号" prop="serial_num">
							<el-input v-model="editForm.serial_num" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="资产编号" prop="via_num">
							<el-input v-model="editForm.via_num" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="地区" prop="area_id">
							<el-select filterable v-model="editForm.area_id"
									   placeholder="请选择"
									   @change="changeAreaItem">
								<el-option
										v-for="item in area_list"
										:key="item.id"
										:label="item.name ? item.name:'空'"
										:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="中心" prop="data_center_id">
							<el-select filterable v-model="editForm.data_center_id" placeholder="请选择"
									   @change="changeDataCenterItem"
							>
								<el-option
										v-for="item in data_center_list"
										:key="item.id"
										:label="item.name ? item.name:'空'"
										:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>


				<el-row :gutter="20">
					<el-col :span="12"><el-form-item label="机房" prop="apartment_id">
					<el-select filterable v-model="editForm.apartment_id" placeholder="请选择"
							   @change="changeApartmentItem"
					>
						<el-option
								v-for="item in apartment_list"
								:key="item.id"
								:label="item.name ? item.name:'空'"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item></el-col>
					<el-col :span="12"><el-form-item label="机柜" prop="rack_id">
					<el-select filterable v-model="editForm.rack_id" placeholder="请选择"
							   @change="changeRackItem"
					>
						<el-option
								v-for="item in rack_list"
								:key="item.id"
								:label="item.name ? item.name:'空'"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item></el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="位置" prop="rack_position">
					<el-select v-model="editForm.rack_position" placeholder="请选择">
						<el-option
								v-for="item in rack_position_list"
								:key="item.name"
								:label="item.name ? item.name:'空'"
								:value="item.name">
						</el-option>
					</el-select>
				</el-form-item></el-col>
					<el-col :span="12">
						<el-form-item label="大小" prop="unit_size" >
							<el-input v-model="editForm.unit_size" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>


				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="厂商型号" prop="manufacturer_model">
					<el-cascader
							ref="editManufacturerModelCascade"
							:props="optionProps"
							:options="cascaderManufacturerModelData"
							v-model="editForm.manufacturer_model"
							@active-item-change="handleManufacturerModelChange"
							@chage="itemChange">
					</el-cascader>
				</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" prop="status">
							<el-radio-group v-model="editForm.status">
								<el-radio class="radio" :label="1" value="1">在线</el-radio>
								<el-radio class="radio" :label="2" value="2">下线</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>


				<el-form-item label="部门" prop="department_id">
					<el-select filterable v-model="editForm.department_id" placeholder="请选择">
						<el-option
								v-for="item in getDepartmentList"
								:key="item.id"
								:label="item.name ? item.name:'空'"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="产品类型" prop="product_id">
					<el-select filterable v-model="editForm.product_id" placeholder="请选择">
						<el-option
								v-for="item in getProductList"
								:key="item.id"
								:label="item.name ? item.name:'空'"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible="addFormVisible" :append-to-body="true"  :close-on-click-modal="false" @close="closeAddDialog">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="设备名称" prop="name">
							<el-input v-model="addForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="ip地址" prop="ip_addr">
							<el-input v-model="addForm.ip_addr" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="序列号" prop="serial_num">
							<el-input v-model="addForm.serial_num" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="资产编号" prop="via_num">
							<el-input v-model="addForm.via_num" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="snmp字符" prop="snmp_str">
							<el-input v-model="addForm.snmp_string" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="U位大小" prop="unit_size">
							<el-input v-model="addForm.unit_size" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-form-item label="状态" prop="status">
						<el-radio-group v-model="addForm.status">
							<el-radio class="radio" :label="1">在线</el-radio>
							<el-radio class="radio" :label="2">下线</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="产品类型" prop="product_id">
					<el-select v-model="addForm.product_id" placeholder="请选择">
						<el-option
								v-for="item in getProductList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属部门" prop="department_id">
					<el-select v-model="addForm.department_id" placeholder="请选择">
						<el-option
								v-for="item in getDepartmentList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="设备类型" prop="device_type_id">
					<el-select v-model="addForm.device_type_id" placeholder="请选择">
						<el-option
								v-for="item in getDeviceTypeList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="地区" prop="area_id">
					<el-select filterable v-model="addForm.area_id" placeholder="请选择"
							   @change="changeAddAreaItem"
					>
						<el-option
								v-for="item in area_list"
								:key="item.id"
								:label="item.name ? item.name:'空'"
								:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="中心" prop="data_center_id">
                    <el-select filterable v-model="addForm.data_center_id" placeholder="请选择"
                               @change="changeAddDataCenterItem"
                    >
                        <el-option
                                v-for="item in data_center_list"
                                :key="item.id"
                                :label="item.name ? item.name:'空'"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="机房" prop="apartment_id">
                    <el-select filterable v-model="addForm.apartment_id" placeholder="请选择"
                               @change="changeAddApartmentItem"
                    >
                        <el-option
                                v-for="item in apartment_list"
                                :key="item.id"
                                :label="item.name ? item.name:'空'"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="机柜" prop="rack_id">
                    <el-select filterable v-model="addForm.rack_id" placeholder="请选择"
                               @change="changeAddRackItem"
                    >
                        <el-option
                                v-for="item in rack_list"
                                :key="item.id"
                                :label="item.name ? item.name:'空'"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="U位" prop="rack_position">
                    <el-select v-model="addForm.rack_position" placeholder="请选择"
					@change="changeAddRackPositionItem"
					>
                        <el-option
                                v-for="item in rack_position_list"
                                :key="item.name"
                                :label="item.name ? item.name:'空'"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="厂商型号" prop="agent_model">
					<el-cascader
							ref="addAgentModelCascade"
							:props="optionProps"
							:options="cascaderManufacturerModelData"
							v-model="addForm.manufacturer_model"
							@active-item-change="handleManufacturerModelChange"
							@chage="itemChange">
					</el-cascader>
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
		getDeviceListApi,
		editDeviceApi,
		addDeviceApi,
		removeDeviceApi,
		batchRemoveDeviceApi,
		getLocationApi,
		getManufacturerModelApi, queryDataBaseApi,getRackPositionApi,queryDataBaseForeignApi
	} from '../../api/api';
	import {mapActions,mapGetters} from "vuex";

	export default {
		data() {
			return {
				query_fields:[
					{query_object:'product',name:'产品类型'},
					{query_object:'department',name:'归属部门'},
					{query_object:'device_type',name:'设备类型'},
				],
				field_values:[],
				optionProps:{
					label: 'name',
					value: 'id',
					children: 'children'
				},
				filters: {
				},
				area_list:[],
				data_center_list:[],
				apartment_list:[],
				rack_list:[],
				props:{
					label: 'name',
					value: 'id',
					children: 'dataCenters'
				},
				devices: [],
				filter_devices:[],
				page_devices:[],
				selectedOptions:[],
				rack_position_list:[],
				selectedManufacturerModelOptions:[],
				cascaderData:[],
				cascaderManufacturerModelData:[],
				departments:[],
				products:[],
				pageDevices: [],
				total: 100,
				pageSize:10,
				pageCount:5,
				currentPage: 1,
				listLoading: false,
				sels: [],//列表选中列
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
			    editFormRules: {
					name: [
						{ required: true, message: '请输入设备名称', trigger: 'blur' }
					],
					ip_addr: [
						{ required: true, message: '请输入IP地址', trigger: 'blur' }
					],
					serial_num: [
						{ required: true, message: '请输入序列号', trigger: 'blur' }
					],
					via_num: [
						{ required: true, message: '请输入资产号', trigger: 'blur' }
					],
					product_id: [
						{ required: true, message: '请输入产品类型', trigger: 'blur',type:'number' }
					],
					department_id: [
						{ required: true, message: '请输入归属部门', trigger: 'blur',type:'number' }
					],
					rack_position: [
						{ required: true, message: '请输入机柜位置', trigger: 'blur',type:'number' }
					],
					rack_id: [
						{ required: true, message: '请选择机柜', trigger: 'blur',type:'number' }
					],
					apartment_id: [
						{ required: true, message: '请输入房间', trigger: 'blur',type:'number' }
					],
					data_center_id: [
						{ required: true, message: '请输入中心', trigger: 'blur',type:'number' }
					],
					area_id: [
						{ required: true, message: '请输入大区', trigger: 'blur',type:'number' }
					],
					status: [
						{ required: true, message: '请输入状态', trigger: 'blur',type:'number' }
					],
					unit_size: [
						{ required: true, message: '请输入设备大小', trigger: 'blur' }
					],
					location: [
						{ required: true,type:'array', message: '请输入具体位置', trigger: 'blur' }
					],
					manufacturer_model: [
						{ required: true,type:'array', message: '请输入厂商型号', trigger: 'blur'}
					],
					device_type_id: [
						{ required: true, message: '请输入设备类型', trigger: 'blur',type:'number' }
					],
				},

				//编辑界面数据
				editForm: {
					id:'',
					serial_num:'',
					ip_addr:'',
					name:'',
					via_num:'',
					product_id:'',
					department_id:'',
					rack_position:'',
					area_id:'',
					data_center_id:'',
					apartment_id:'',
					rack_id:'',
					// location:[],
					manufacturer_model:[],
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入设备名称', trigger: 'blur' }
					],
					ip_addr: [
						{ required: true, message: '请输入IP地址', trigger: 'blur' }
					],
					serial_num: [
						{ required: true, message: '请输入序列号', trigger: 'blur' }
					],
					via_num: [
						{ required: true, message: '请输入资产号', trigger: 'blur' }
					],
					product_id: [
						{ required: true, message: '请输入产品类型', trigger: 'blur',type:'number' }
					],
					department_id: [
						{ required: true, message: '请输入归属部门', trigger: 'blur',type:'number' }
					],
					status: [
						{ required: true, message: '请输入状态', trigger: 'blur',type:'number' }
					],
					unit_size: [
						{ required: true, message: '请输入设备大小', trigger: 'blur' }
					],
					location: [
						{ required: true,type:'array', message: '请输入具体位置', trigger: 'blur' }
					],
					manufacturer_model: [
						{ required: true,type:'array', message: '请输入厂商型号', trigger: 'blur'}
					],
					device_type_id: [
						{ required: true, message: '请输入设备类型', trigger: 'blur',type:'number' }
					],
				},
				//新增界面数据
				addForm: {

				}

			}
		},
		methods: {
			changeQueryItem(val){
				let para = {database_name:val}
				queryDataBaseApi(para).then((res) => {
					// this.filters.field_value = null;
					this.field_values = res.data.data;
				});

			},
			changeAreaItem(val){
				this.editForm.data_center_id = null;
				this.editForm.apartment_id = null;
				this.editForm.rack_id = null;
				this.editForm.rack_position = null;
				this.apartment_list = [];
				this.rack_list = [];
				this.rack_position_list = [];
			   	let para = {database_name:'area',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.data_center_list = res.data.data;
				});
			},
			changeDataCenterItem(val){
				this.editForm.apartment_id = null;
				this.editForm.rack_id = null;
				this.editForm.rack_position = null;
				this.rack_list = [];
				this.rack_position_list = [];
			   	let para = {database_name:'data_center',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.apartment_list = res.data.data;
				});
			},
			changeApartmentItem(val){
				this.editForm.rack_id = null;
				this.editForm.rack_position = null;
				this.rack_position_list = [];
			   	let para = {database_name:'apartment',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.rack_list = res.data.data;
				});
			},
			changeRackItem(val){
				let para = {rack_id: val};
				getRackPositionApi(para).then((res) => {
					this.rack_position_list = res.data.data;
				});
			},
			changeAddAreaItem(val){
				this.addForm.data_center_id = null;
				this.addForm.apartment_id = null;
				this.addForm.rack_id = null;
				this.addForm.rack_position = null;
				this.apartment_list = [];
				this.rack_list = [];
				this.rack_position_list = [];
			   	let para = {database_name:'area',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.data_center_list = res.data.data;
				});
			},
			changeAddDataCenterItem(val){
				this.addForm.apartment_id = null;
				this.addForm.rack_id = null;
				this.addForm.rack_position = null;
				this.rack_list = [];
				this.rack_position_list = [];
			   	let para = {database_name:'data_center',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.apartment_list = res.data.data;
				});
			},
			changeAddApartmentItem(val){
				this.addForm.rack_id = null;
				this.addForm.rack_position = null;
				this.rack_position_list = [];
			   	let para = {database_name:'apartment',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.rack_list = res.data.data;
				});
			},
			changeAddRackItem(val){
				let para = {rack_id: val};
				getRackPositionApi(para).then((res) => {
					this.rack_position_list = res.data.data;
				});
			},
			changeAddRackPositionItem(val){
				this.$forceUpdate();
			},
			getDepartments() {
				let para = {database_name:'department'}
				queryDataBaseApi(para).then((res) => {
					this.departmentList({department_list: res.data.data});
				});
			},
			getDataCenters() {
				let para = {database_name:'data_center'}
				queryDataBaseApi(para).then((res) => {
					this.data_center_list = res.data.data;
					this.dataCenterList({dataCenter_list: res.data.data});
				});
			},
			getAreas() {
				let para = {database_name:'area'}
				queryDataBaseApi(para).then((res) => {
					this.area_list = res.data.data;
					this.areaList({area_list: res.data.data});
				});
			},
			getProducts() {
				let para = {database_name:'product'}
				queryDataBaseApi(para).then((res) => {
					this.productList({product_list: res.data.data});

				});
			},
			getDeviceTypes() {
				let para = {database_name:'device_type'}
				queryDataBaseApi(para).then((res) => {
					this.deviceTypeList({device_type_list: res.data.data});
				});
			},
			getCompanies(){
				let para = {database_name:'company'}
				queryDataBaseApi(para).then((res) => {
					this.companyList({company_list:res.data.data});
				});
			   },
			getAssetNames(){
				let para = {database_name:'asset_name'}
				queryDataBaseApi(para).then((res) => {
					this.assetNameList({asset_name_list:res.data.data});
				});
			   },
			getUnitSizes(){
				let para = {database_name:'unit_size'}
				queryDataBaseApi(para).then((res) => {
					this.unitSizeList({unit_size_list:res.data.data});
				});
			   },

			closeDialog(){
				this.editFormVisible = false;
			},
			closeAddDialog(){
				this.addFormVisible = false;
			},
			//获取位置级联选择器
		    // getNodes (val) {
			// 	  let objectId
			// 	  let mulLen
			// 	  if (!val) {
			// 		objectId = null
			// 		mulLen = 0  // 1.一级
			// 	  } else if (val.length === 1) {
			// 		objectId = val[0]
			// 		mulLen = val.length // 2.二级
			// 	  } else if (val.length === 2) {
			// 		objectId = val[1]
			// 		mulLen = val.length // 3.三级
			// 	  }else if (val.length === 3) {
			// 		  objectId = val[2]
			// 		  mulLen = val.length // 4.四级
			// 	  }
			//
			// 	  getLocationApi({objectId:objectId,mulLen:mulLen}).then(response => {
			// 		if (response.data && response.data.code == 200) {
			// 		  let Items = response.data.data
			// 		  if (mulLen === 0) { // 初始化 加载一级 省
			// 			this.cascaderData = Items.map((value, i) => {
			// 				if(!value.name){
			// 						value.name = '空';
			// 					}
			// 				  return {
			// 					id: value.id,
			// 					name: value.name,
			// 					children: []
			// 				  }
			// 			})
			// 		  } else if (mulLen === 1) { // 点击一级 加载二级 市
			// 			this.cascaderData.map((value, i) => {
			// 			  if (value.id === val[0]) {
			// 				if (!value.children.length) {
			// 				  value.children = Items.map((value, i) => {
			// 				  	if(!value.name){
			// 						value.name = '空';
			// 					}
			// 					return {
			// 					  id: value.id,
			// 					  name: value.name,
			// 					  children: []
			// 					}
			// 				  })
			// 				}
			// 			  }
			// 			})
			// 		  } else if (mulLen === 2) { // 点击二级 加载三级 区
			// 			this.cascaderData.map((value, i) => {
			// 			  if (value.id === val[0]) {
			// 				value.children.map((value, i) => {
			// 				  if (value.id === val[1]) {
			// 					if (!value.children.length) {
			// 					  value.children = Items.map((value, i) => {
			// 					  	if(!value.name){
			// 						value.name = '空';
			// 					}
			// 						return {
			// 						  id: value.id,
			// 						  name: value.name,
			// 							children: []
			// 						}
			// 					  })
			// 					}
			// 				  }
			// 				})
			// 			  }
			// 			})
			// 		  }else if (mulLen === 3) { // 点击三级 加载四级 区
			// 			this.cascaderData.map((value, i) => {
			// 			  if (value.id === val[0]) {
			// 				value.children.map((value, i) => {
			// 				  if (value.id === val[1]) {
			// 				  	value.children.map((value, i) => {
			// 					  if (value.id === val[2]) {
			// 						if (!value.children.length) {
			// 						  value.children = Items.map((value, i) => {
			// 						  	if(!value.name){
			// 						value.name = '空';
			// 					}
			// 							return {
			// 							  id: value.id,
			// 							  name: value.name
			// 							}
			// 						  })
			// 						}
			// 					  }
			// 					})
			//
			//
			// 				  }
			// 				})
			// 			  }
			// 			})
			// 		  }
			// 		} else {
			// 		  console.log(response.data.msg)
			// 		}
			// 	  }, error => {
			// 		console.log(error)
			// 	  })
			// 	},
			//获取厂商级联选择器
			getManufacturerNodes(val) {
				let objectId
				let mulLen
				if (!val) {
					objectId = null
					mulLen = 0  // 1.一级
				} else if (val.length === 1) {
					objectId = val[0]
					mulLen = val.length // 2.二级
				}
				getManufacturerModelApi({objectId: objectId, mulLen: mulLen}).then(response => {
					if (response.data && response.data.code == 200) {
						let Items = response.data.data
						if (mulLen === 0) { // 初始化 加载一级 省
							this.cascaderManufacturerModelData = Items.map((value, i) => {
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
							this.cascaderManufacturerModelData.map((value, i) => {
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
			//点击location选择器的时候触发
			handleItemChange(val) {
				this.getNodes(val)
			},
			//点击厂商型号选择器的时候触发
			handleManufacturerModelChange(val) {
				this.getManufacturerNodes(val)
			},

			...mapActions({
				areaList:"areaList",
				dataCenterList:"dataCenterList",
				apartmentList:"apartmentList",
				departmentList:"departmentList",
				productList:"productList",
				deviceTypeList:"deviceTypeList",
				companyList:'companyList',
				assetNameList:'assetNameList',
				unitSizeList:'unitSizeList',
			  }),
			itemChange(val) {
			},
			visibleChange(val){
				if(this.editForm.location.length !== 4){
					this.$message({
							message: '设备存放位置没有选择完成，请重新选择',
							type: 'warning'
						});
				}else{
					if(!val){
						let para = {rack_id:this.$refs.editLocationCascade.checkedValue[3]};
						getRackPositionApi(para).then((res) => {
							this.rack_position_list = res.data.data;
						});
					}
				}
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
				this.getDevices(this.currentPage,this.pageSize,this.filters);
			},
			//获取资产列表
			getDevices(pageNumber=1,pageSize=10,filterRule=this.filters) {

				let para = {
					pageNumber: pageNumber,
					pageSize: pageSize,
					filterRule: filterRule,
				};
				this.listLoading = true;
				//NProgress.start();
				getDeviceListApi(para).then((res) => {
					this.pageDevices = res.data.data.result;
					this.listLoading = false
					let page_count = res.data.data.length;
					this.total = page_count;
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
					let para = { id: row.id };
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
			handleDeviceInfo:function (index,row) {

				 let routeUrl = this.$router.resolve({
					path: "/deviceInfo",
					query: {id:row.id}
				});
				window.open(routeUrl.href, '_blank');
			}
			,
			handleEdit: function (index, row) {
			   	this.editFormVisible = true;
			   	// let para = {database_name:'area',primary_key_id:row.area_id}
				// queryDataBaseForeignApi(para).then((res) => {
				// 	this.data_center_list = res.data.data;
				// });
				let para = {database_name:'data_center',primary_key_id:row.data_center_id}
				queryDataBaseForeignApi(para).then((res) => {
					this.apartment_list = res.data.data;
				});
				para = {database_name:'apartment',primary_key_id:row.apartment_id}
				queryDataBaseForeignApi(para).then((res) => {
					this.rack_list = res.data.data;
				});
                para = {rack_id: row.rack_id};
				getRackPositionApi(para).then((res) => {
					this.rack_position_list = res.data.data;
				});

				let location = [row.area_id,row.data_center_id,row.apartment_id,row.rack_id,row.rack_position];
				let manufacturer_model = [row.manufacturer_id,row.model_id];
			   	let manufacturer_model_val = [];

				for (let i=0;i<manufacturer_model.length-1;i++){
					manufacturer_model_val.push(manufacturer_model[i]);
					this.getManufacturerNodes(manufacturer_model_val);
				}
				row.location = location;
				row.manufacturer_model = manufacturer_model;
				row.rack_position = row.rack_position ? row.rack_position:'空';
				row.status = parseInt(row.status);
				this.editForm = Object.assign({}, row);
				this.origin_editForm = JSON.parse(JSON.stringify(this.editForm));
			},
			//显示新增界面
			handleReset: function () {
				this.filters = {}
				this.page_devices = this.devices;
			}
			,
			handleAdd: function () {
				this.addFormVisible = true;
				this.selectedOptions = [];
				this.addForm = {
					status:1,
				}
			},
			getFilterDevices(filters) {
			   	this.handleCurrentChange(1);
			},
			//编辑
			editSubmit: function (self) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let location = [this.editForm.area_id,this.editForm.data_center_id,this.editForm.apartment_id,this.editForm.rack_id,this.editForm.rack_position]
							this.editForm.location = location;
							let editForm_object = Object.assign({}, this.editForm);
							let count = 0;
							let new_value_object = {id: editForm_object.id};
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
								if (new_value_object.hasOwnProperty('location')){
									let exclude_key_array = ['area_id', 'data_center_id', 'apartment_id', 'rack_id', 'rack_position']
									for (let key in new_value_object){
										let result = exclude_key_array.includes(key);
										if(result){
											delete new_value_object[key];
										}
									}
								}
								editDeviceApi(new_value_object).then((res) => {
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
										this.getDevices();
									} else {
										this.$message({
											message: res.data.msg,
											type: 'warning'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.editLoading = false;
										this.getDevices();
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
							Object.keys(this.addForm).forEach((key) => (this.filters[key] == null || this.filters[key] == '') && delete this.filters[key]);
							this.addLoading = true;
                            this.addForm.location = [this.addForm.area_id,this.addForm.data_center_id,this.addForm.apartment_id,this.addForm.rack_id,this.addForm.rack_position]
							let para = Object.assign({}, this.addForm);
                            let exclude_key_array = ['area_id', 'data_center_id', 'apartment_id', 'rack_id', 'rack_position']
                            for (let key in para){
                                let result = exclude_key_array.includes(key);
                                if(result){
                                    delete para[key];
                                }
                            }

							addDeviceApi(para).then((res) => {
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
								this.getNodes();
							}
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
				let ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
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
			}
		},
		mounted() {
			this.getDevices();
			// this.getNodes();
			this.getManufacturerNodes();
			this.getDepartments();
			this.getDataCenters();
			this.getAreas();
			this.getProducts();
			this.getDeviceTypes();
			this.getCompanies();
			this.getAssetNames();
			this.getUnitSizes();
		},
		computed: {
			...mapGetters([
			  'getAreaList',
			  'getDataCenterList',
			  'getApartmentList',
			  'getDepartmentList',
			  'getProductList',
			  'getDeviceTypeList',
			])
		},
	}

</script>

<style scoped>
       .customWidth{
        width:80%;
    }

	    a {
        text-decoration: none;
    }

    .router-link-active {
        text-decoration: none;
    }

</style>