<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" ref="filters">
				<el-form-item>
					<el-input v-model="filters.via_serial" placeholder="资产编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.asset_serial" placeholder="sn号码"></el-input>
				</el-form-item>
				<el-form-item >
					<el-select filterable v-model="filters.query_field" placeholder="搜索字段"
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
					<el-select filterable v-model="filters.field_value" placeholder="字段数值">
					<el-option
					  v-for="item in field_values"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
					</el-form-item>
				<el-form-item >
					<el-select v-model="filters.company_id" placeholder="公司名称">
					<el-option
					  v-for="item in getCompanyList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
					<el-select v-model="filters.is_statistic_asset_id" placeholder="请选择">
						<el-option
								v-for="item in static_options"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
					</el-form-item>

				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getFilterAssets(filters)">查询</el-button>
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
		<el-table :data="pageAssets" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="35">
			</el-table-column>
<!--			<el-table-column type="index" width="30">-->
<!--			</el-table-column>-->
			<el-table-column prop="via_serial" label="资产编号" width="120" sortable>
				<template slot-scope="scope">
					<router-link :to="{ name: 'asset_info', query: { asset_id: scope.row.id } }" target="_self">
						{{scope.row.via_serial != null ? scope.row.via_serial : '空'}}
					</router-link>
				</template>
			</el-table-column>
			<el-table-column prop="asset_name" label="资产名称" width="100" sortable>
			</el-table-column>
<!--			<el-table-column prop="asset_serial" label="设备编号" width="220" sortable>-->
<!--				<template slot-scope="scope">-->
<!--					{{scope.row.asset_serial != null ? scope.row.asset_serial:'空' }}-->
<!--				</template>-->
<!--			</el-table-column>-->
			<el-table-column prop="asset_status" label="设备状态" width="120" sortable>
			</el-table-column>
			<el-table-column prop="data_center_name/apart_name/rack_name" label="数据中心/机房/机柜" width="350" sortable>
				 <template slot-scope="scope">
					{{scope.row.data_center_name}} /{{scope.row.apart_name != null ? scope.row.apart_name:'空' }}
					 /{{scope.row.rack_name  == null ? "空":scope.row.rack_name }}
				</template>
			</el-table-column>

			<el-table-column prop="relation_device" label="关联设备" width="120" sortable>
				<template slot-scope="scope" v-if="scope.row.relation_device">
					<router-link :to="{ name: 'device_info', query: { device_id: scope.row.relation_device,rack_id:scope.row.relation_device_rack_id} }" target="_self">
						关联设备
					</router-link>
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
<!--					<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--					<el-button type="success" size="mini" @click="getAssetInfo(scope.$index, scope.row)">详情</el-button>-->
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
		<el-dialog :fullscreen=true title="编辑" :visible="editFormVisible" :close-on-click-modal="false"
		@close="closeEditDialog">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="序列号" prop="asset_serial" >
							<el-input v-model="editForm.asset_serial" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
					<el-form-item label="资产编号" prop="via_serial" >
						<el-input v-model="editForm.via_serial" auto-complete="off" size="small"></el-input>
					</el-form-item>
						</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="状态" prop="asset_status_id">
							<el-select filterable v-model="editForm.asset_status_id"
									   placeholder="请选择"
									   @change="changeAssetStatusItem">
								<el-option
										v-for="item in asset_status_list"
										:key="item.id"
										:label="item.name ? item.name:'空'"
										:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否可盘" prop="is_statistic_asset_id">
						<el-radio-group v-model="editForm.is_statistic_asset_id">
							<el-radio class="radio" :label="1">可盘</el-radio>
							<el-radio class="radio" :label="2">不可盘</el-radio>
						</el-radio-group>
					</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="价格" prop="price">
							<el-input v-model="editForm.price" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="静值" prop="static_value">
							<el-input v-model="editForm.static_value" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="残值" prop="residual_value">
							<el-input v-model="editForm.residual_value" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="资产配置" prop="asset_config" >
							<el-input type="textarea" v-model="editForm.asset_config" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="资产描述" prop="asset_description" >
							<el-input type="textarea" v-model="editForm.asset_description" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="6">
						<!--下面原生方法没有生效，通过dateFormatter方法手动转换-->
						<el-form-item label="采购日期" prop="purchase_date">
							<el-date-picker
									@change="formatTime"
									type="date"
									placeholder="选择日期"
									v-model="editForm.purchase_date"
									format="yyyy-MM-dd"
									style="width: 100%;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="地区">
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
						<el-form-item label="中心">
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
					<el-col :span="12">
						<el-form-item label="机房">
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
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="机柜">
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
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="位置">
							<el-select disabled v-model="editForm.rack_position" placeholder="请选择">
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
<!--				<el-form-item label="位置" prop="location">-->
<!--					<el-cascader-->
<!--						 ref="editLocationCascade"-->
<!--						:props="optionProps"-->
<!--						:options="cascaderData"-->
<!--						 v-model="editForm.location"-->
<!--						@active-item-change="handleItemChange"-->
<!--						@chage="itemChange">-->
<!--					</el-cascader>-->
<!--				</el-form-item>-->

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

				<el-form-item label="借用信息" prop="recipient_info">
					<el-cascader
						 ref="editRecipientCascade"
						:props="optionProps"
						:options="cascaderRecipientData"
						 v-model="editForm.recipient_info"
						@active-item-change="handleRecipientChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>

				<el-form-item label="公司名称">
					<el-select v-model="editForm.company_id" placeholder="请选择">
					<el-option
					  v-for="item in getCompanyList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
			</el-form-item>

				<el-form-item label="成本中心" prop="cost_info">
					<el-cascader
						 ref="editCostCascade"
						:props="optionProps"
						:options="cascaderCostData"
						 v-model="editForm.cost_info"
						@active-item-change="handleCostChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>



			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog  :fullscreen=true title="新增" :visible="addFormVisible" :close-on-click-modal="false"
		@close="closeAddDialog">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="序列号" prop="asset_serial" >
							<el-input v-model="addForm.asset_serial" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>

					<el-col :span="8">
					<el-form-item label="资产编号" prop="via_serial" >
						<el-input v-model="addForm.via_serial" auto-complete="off" size="small"></el-input>
					</el-form-item>
						</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="状态" prop="asset_status_id">
						<el-radio-group v-model="addForm.asset_status_id">
							<el-radio class="radio" :label="1">在线</el-radio>
							<el-radio class="radio" :label="2">下线</el-radio>
						</el-radio-group>
					</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否可盘" prop="is_statistic_asset_id">
						<el-radio-group v-model="addForm.is_statistic_asset_id">
							<el-radio class="radio" :label="1">可盘</el-radio>
							<el-radio class="radio" :label="2">不可盘</el-radio>
						</el-radio-group>
					</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="价格" prop="price">
							<el-input v-model="addForm.price" auto-complete="off" size="small"
							></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="静值" prop="static_value">
							<el-input v-model="addForm.static_value" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="残值" prop="residual_value">
							<el-input v-model="addForm.residual_value" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="资产配置" prop="asset_config" >
							<el-input type="textarea" v-model="addForm.asset_config" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="资产描述" prop="asset_description" >
							<el-input type="textarea" v-model="addForm.asset_description" auto-complete="off" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="6">
						<el-form-item label="采购日期" prop="purchase_date">
							<el-date-picker
									format="yyyy-MM-dd"
									@change="dateChangeAdd"
									type="date"
									placeholder="选择日期"
									v-model="addForm.purchase_date"
									style="width: 100%;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="地区">
					<el-select filterable v-model="addForm.area_id" placeholder="请选择"
							   @change="changeAreaItem"
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
					<el-col :span="12">
						<el-form-item label="中心">
                    <el-select filterable v-model="addForm.data_center_id" placeholder="请选择"
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
					<el-col :span="12">
						<el-form-item label="机房">
                    <el-select filterable v-model="addForm.apartment_id" placeholder="请选择"
                               @change="changeApartmentItem"
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
					<el-col :span="12">
						<el-form-item label="机柜">
                    <el-select filterable v-model="addForm.rack_id" placeholder="请选择"
                               @change="changeRackItem"
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
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="位置">
                    <el-select disabled v-model="addForm.rack_position" placeholder="请选择">
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

				<el-form-item label="厂商型号" prop="manufacturer">
					<el-cascader
						 ref="addAgentModelCascade"
						:props="optionProps"
						:options="cascaderManufacturerModelData"
						 v-model="addForm.manufacturer_model"
						@active-item-change="handleManufacturerModelChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>

				<el-form-item label="借用信息" prop="recipient_info">
					<el-cascader
						 ref="addRecipientCascade"
						:props="optionProps"
						:options="cascaderRecipientData"
						 v-model="addForm.recipient_info"
						@active-item-change="handleRecipientChange"
						@chage="itemChange">
					</el-cascader>
				</el-form-item>

				<el-form-item label="公司名称" prop="company_id">
					<el-select v-model="addForm.company_id" placeholder="请选择">
					<el-option
					  v-for="item in getCompanyList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
			</el-form-item>

				<el-form-item label="设备名称" prop="asset_name_id">
					<el-select v-model="addForm.asset_name_id" placeholder="请选择">
					<el-option
					  v-for="item in getAssetNameList"
					  :key="item.id"
					  :label="item.name"
					  :value="item.id">
					</el-option>
				  </el-select>
				</el-form-item>

				<el-form-item label="成本中心" prop="cost_info">
					<el-cascader
						 ref="addCostCascade"
						:props="optionProps"
						:options="cascaderCostData"
						 v-model="addForm.cost_info"
						@active-item-change="handleCostChange"
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
		getManufacturerModelApi,
		getRecipientApi,
		getCostApi,
		getAssetListApi,
		editAssetApi,
		addAssetApi,
		removeAssetApi,
		batchRemoveAssetApi,
		getLocationApi, queryDataBaseApi, queryDataBaseForeignApi, getRackPositionApi
	} from '../../api/api';
	import {mapActions,mapGetters} from "vuex";

	export default {
		data() {
			return {
				field_values:[],
				query_fields:[
					{query_object:'asset_name',name:'资产名称'},
					{query_object:'department',name:'归属部门'},
					{query_object:'company',name:'公司名称'},
				],
				optionProps:{
					label: 'name',
					value: 'id',
					children: 'children'
				},
				static_options:[
					{id:1,name:'可盘资产'},
					{id:2,name:'不可盘资产'},
				],
				filters: {
				},
				area_list:[],
				asset_status_list:[],
				data_center_list:[],
				apartment_list:[],
				rack_list:[],
				rack_position_list:[{name:null}],
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
				assets: [],
				selectedOptions:[],
				selectedManufacturerModelOptions:[],
				selectedRicipientOptions:[],
				selectedCostOptions:[],
				cascaderData:[],
				cascaderManufacturerModelData:[],
				cascaderRecipientData:[],
				cascaderCostData:[],
				departments:[],
				products:[],
				pageAssets: [],
				total: 100,
				pageCount:5,
				pageSize:10,
				totalSize:100,
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
				origin_editForm:'',
				editForm: {
					id:'',
					via_serial:'',
					asset_serial:'',
					asset_status_id:'',
					asset_config:'',
					purchase_date:'',
					cost_center_name:'',
					cost_center_id:'',
					is_statistic_asset_id:'',
					price:'',
					static_value:'',
					residual_value:'',
					company_id:'',
					asset_name_id:'',
					asset_description:'',

					location:[],
					cost_info:[],
					recipient_info:[],
					manufacturer_model:[],
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					via_serial: [
						{ required: true, message: '请输入资产编号', trigger: 'blur' }
					],
					asset_serial: [
						{ required: true, message: '请输入资产序列号', trigger: 'blur' }
					],
					asset_status_id: [
						{ required: true, message: '请输入资产状态', trigger: 'blur',type:'number' }
					],
					is_statistic_asset_id: [
						{ required: true, message: '请输入是否可盘', trigger: 'blur',type:'number' }
					],
					price: [
						{ required: true, message: '请输入资产价格', trigger: 'blur' }
					],
					company_id: [
						{ required: true, message: '请输入公司名称', trigger: 'blur',type:'number' }
					],
					static_value: [
						{ required: true, message: '请输入资产净值', trigger: 'blur'}
					],
					residual_value: [
						{ required: true, message: '请输入资产残值', trigger: 'blur'}
					],
					location: [
						{ required: true,type:'array', message: '请输入具体位置', trigger: 'blur' }
					],
					manufacturer_model: [
						{ required: true,type:'array', message: '请输入设备型号', trigger: 'blur' }
					],
					recipient: [
						{ required: true,type:'array', message: '请输入借用信息', trigger: 'blur' }
					],
					cost_info: [
						{ required: true,type:'array', message: '请输入成本中心', trigger: 'blur' }
					],
					asset_name_id: [
						{ required: true, message: '请输入设备类型', trigger: 'blur',type:'number' }
					],
					purchase_date: [
						{ required: true, message: '请输入设备采购日期', trigger: 'blur' }
					],
				},

				//新增界面数据
				addForm: {

				}

			}
		},
		methods: {
			changeAssetStatusItem(val){

			},
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
				this.apartment_list = [];
				this.rack_list = [];
			   	let para = {database_name:'area',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.data_center_list = res.data.data;
				});
			},
			changeDataCenterItem(val){
				this.editForm.apartment_id = null;
				this.editForm.rack_id = null;
				this.rack_list = [];
			   	let para = {database_name:'data_center',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.apartment_list = res.data.data;
				});
			},
			changeApartmentItem(val){
				this.editForm.rack_id = null;
			   	let para = {database_name:'apartment',primary_key_id:val}
				queryDataBaseForeignApi(para).then((res) => {
					this.rack_list = res.data.data;
				});
			},
			changeRackItem(val){
				// this.editForm.rack_position = null;
				// let para = {rack_id: val};
				// getRackPositionApi(para).then((res) => {
				// 	this.rack_position_list = res.data.data;
				// });

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
				let para = {database_name:'area'}
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
			getAssetStatus() {
				let para = {database_name:'asset_status'}
				queryDataBaseApi(para).then((res) => {
					// this.deviceTypeList({device_type_list: res.data.data});
					this.asset_status_list = res.data.data;
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
			closeEditDialog(){
				this.editFormVisible = false;
			},
			closeAddDialog(){
				this.addFormVisible = false;
			},
			getAssetInfo:function (index,row) {

				 let routeUrl = this.$router.resolve({
					path: "/assetInfo",
					query: {id:row.id}
				});
				window.open(routeUrl.href, '_blank');
			},
			formatTime(val) {
				this.editForm.purchase_date=val;
				console.log(this.editForm.purchase_date,1100000022)
			},
			dateFormatter(str) {//默认返回yyyy-MM-dd HH-mm-ss
				let hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
				let d = new Date(str);
				let year = d.getFullYear();
				let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
				let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
				if (hasTime) {
					return [year, month, day].join('-');
				}
			},
			dateChangeAdd(val) {
				  this.addForm.purchase_date = val;
				},
			getFilterDevices(filterForm) {
			   	this.filter_devices = this.devices;
				for(let key in filterForm){
					if (filterForm[key].length !== 0){
						this.filter_devices =  this.filter_devices.filter(item => item[key] === filterForm[key]);

					}
				}
				this.page_devices = this.filter_devices;
				this.currentPage = 1;
				this.pageDevices = this.page_devices.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
				this.total = this.page_devices.length;
			},
			handleReset: function () {
				this.filters =  {
				}
				// this.page_devices = this.devices;
			},
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
			getRecipientNodes(val) {
				let objectId
				let mulLen
				if (!val) {
					objectId = null
					mulLen = 0  // 1.一级
				} else if (val.length === 1) {
					objectId = val[0]
					mulLen = val.length // 2.二级
				}
				getRecipientApi({objectId: objectId, mulLen: mulLen}).then(response => {
					if (response.data && response.data.code == 200) {
						let Items = response.data.data;
						if (mulLen === 0) { // 初始化 加载一级 省
							this.cascaderRecipientData = Items.map((value, i) => {
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
							this.cascaderRecipientData.map((value, i) => {
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
			getCostNodes(val) {
				let objectId
				let mulLen
				if (!val) {
					objectId = null
					mulLen = 0  // 1.一级
				} else if (val.length === 1) {
					objectId = val[0]
					mulLen = val.length // 2.二级
				}
				getCostApi({objectId: objectId, mulLen: mulLen}).then(response => {
					if (response.data && response.data.code == 200) {
						let Items = response.data.data;
						if (mulLen === 0) { // 初始化 加载一级 省
							this.cascaderCostData = Items.map((value, i) => {
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
							this.cascaderCostData.map((value, i) => {
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
			handleItemChange (val) {
			  this.getNodes(val)
			},
			handleManufacturerModelChange (val) {
			  this.getManufacturerNodes(val)
			},
			handleRecipientChange (val) {
			  this.getRecipientNodes(val)
			},
			handleCostChange (val) {
			  this.getCostNodes(val)
			},
			itemChange(val) {

			},
			handleCurrentChange(val) {
				this.currentPage = val;
				Object.keys(this.filters).forEach((key) => (this.filters[key] == null || this.filters[key] == '') && delete this.filters[key]);
				if(this.currentPage<=this.pageCount){
					this.total = this.totalSize;
				}else{
					let offset = this.currentPage - this.pageCount;
					this.total = this.totalSize + offset * this.pageSize;
				}
				this.getAssets(this.currentPage,this.pageSize,this.filters);

				// this.pageAssets = this.asset.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
			},
			//获取资产列表
			getAssets(pageNumber=1,pageSize=10,filterRule=this.filters) {
				let para = {
					pageNumber: pageNumber,
					pageSize: pageSize,
					filterRule: filterRule,
				};
				this.listLoading = true;
				//NProgress.start();
				getAssetListApi(para).then((res) => {
					this.pageAssets = res.data.data.result;
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
					removeAssetApi(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAssets();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				let para = {database_name:'area',primary_key_id:row.area_id}
				queryDataBaseForeignApi(para).then((res) => {
					this.data_center_list = res.data.data;
				});
				para = {database_name:'data_center',primary_key_id:row.data_center_id}
				queryDataBaseForeignApi(para).then((res) => {
					this.apartment_list = res.data.data;
				});
				para = {database_name:'apartment',primary_key_id:row.apartment_id}
				queryDataBaseForeignApi(para).then((res) => {
					this.rack_list = res.data.data;
				});
                // para = {rack_id: row.rack_id};
				// getRackPositionApi(para).then((res) => {
				// 	this.rack_position_list = res.data.data;
				// });


				let location = [row.area_id,row.data_center_id,row.apartment_id,row.rack_id,null];
				let manufacturer_model = [row.manufacturer_id,row.model_id];
				let recipient_info = [row.department_id,row.employee_id];
				let cost_info = [row.cost_name_id,row.cost_code_id];
			   	let manufacturer_model_val = [];
			   	let recipient_info_val = [];
			   	let cost_info_val = [];

				for (let i=0;i<manufacturer_model.length-1;i++){
					manufacturer_model_val.push(manufacturer_model[i]);
					this.getManufacturerNodes(manufacturer_model_val);
				}
				for (let i=0;i<recipient_info.length-1;i++){
					recipient_info_val.push(recipient_info[i]);
					this.getRecipientNodes(recipient_info_val);
				}
				for (let i=0;i<cost_info.length-1;i++){
					cost_info_val.push(cost_info[i]);
					this.getCostNodes(cost_info_val);
					// this.selectedOptions = location_val;
				}
				this.selectedManufacturerModelOptions = manufacturer_model;
				this.selectedRicipientOptions = recipient_info;
				this.selectedCostOptions = cost_info;
				row.location = location;
				row.manufacturer_model = manufacturer_model;
				row.recipient_info = recipient_info;
				row.cost_info = cost_info;
				if (row.relation_device){
					delete row.relation_device;
					delete row.relation_device_rack_id;
				}
				this.editForm = Object.assign({}, row);
				this.origin_editForm = JSON.parse(JSON.stringify(this.editForm));
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.selectedOptions = [];
				this.addForm =  {
					is_statistic_asset_id:1,
					asset_status_id:1,
					rack_position:null,
				}
			},
			getFilterAssets(filters) {
				this.handleCurrentChange(1);
			},
			//编辑
			editSubmit: function (self) {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let location = [this.editForm.area_id,this.editForm.data_center_id,this.editForm.apartment_id,this.editForm.rack_id,null]
							this.editForm.location = location;
							let editForm_object = Object.assign({}, this.editForm);
							let count = 0;
							let new_value_object = {id:editForm_object.id};

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
							if(new_value_object.purchase_date){
								new_value_object.purchase_date = this.dateFormatter(new_value_object.purchase_date);
							}
							if (count !== 0){
								if (new_value_object.hasOwnProperty('location')){
									let exclude_key_array = ['area_id', 'data_center_id', 'apartment_id', 'rack_id', 'rack_position']
									for (let key in new_value_object){
										let result = exclude_key_array.includes(key);
										if(result){
											delete new_value_object[key];
										}
									}
								}
								editAssetApi(new_value_object).then((res) => {
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
										this.getAssets();
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							Object.keys(this.addForm).forEach((key) => (this.filters[key] == null || this.filters[key] == '') && delete this.filters[key]);
							this.addLoading = true;
							this.addForm.location = [this.addForm.area_id,this.addForm.data_center_id,this.addForm.apartment_id,this.addForm.rack_id,null]
							let para = Object.assign({}, this.addForm);
							let exclude_key_array = ['area_id', 'data_center_id', 'apartment_id', 'rack_id', 'rack_position']
							for (let key in para){
                                let result = exclude_key_array.includes(key);
                                if(result){
                                    delete para[key];
                                }
                            }
							if(para.purchase_date){
								para.purchase_date = this.dateFormatter(para.purchase_date);
							}

							addAssetApi(para).then((res) => {
							if (res.data && res.data.code == 200) {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getAssets();
							}else{
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: res.data.msg,
									type: 'warning'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getAssets();
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
					batchRemoveAssetApi(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getAssets();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getAssets();
			// this.getNodes();
			this.getManufacturerNodes();
			this.getRecipientNodes();
			this.getCostNodes();
			this.getDepartments();
			this.getDataCenters();
			this.getAreas();
			this.getProducts();
			this.getDeviceTypes();
			this.getAssetStatus();
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
			  'getModelList',
			  'getManufacturerList',
			  'getCostCenterList',
			  'getCompanyList',
			  'getAssetNameList',
			  // ...
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