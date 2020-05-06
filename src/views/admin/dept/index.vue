<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div class="filter-container">
                <el-button-group>
                    <el-button type="primary"
                               v-if="deptManager_btn_add"
                               icon="plus"
                               size="small"
                               @click="handlerAdd">添加
                    </el-button>
                    <el-button type="primary"
                               v-if="deptManager_btn_edit"
                               icon="edit"
                               size="small"
                               @click="handlerEdit">编辑
                    </el-button>
                    <el-button type="primary"
                               v-if="deptManager_btn_del"
                               icon="delete"
                               size="small"
                               @click="handleDelete">删除
                    </el-button>
                </el-button-group>
            </div>
            <el-row>
                <el-col :span="8"
                        style='margin-top:15px;'>
                    <avue-tree :option="deptTreeOption"
                               :data="treeData"
                               @node-click="getNodeData">
                    </avue-tree>
                </el-col>
                <el-col :span="16"
                        style='margin-top:15px;'>
                    <el-card class="box-card">
                        <el-form :label-position="labelPosition"
                                 label-width="80px"
                                 :rules="rules"
                                 :model="form"
                                 ref="form">
                            <el-form-item label="父级节点"
                                          prop="PARENT_ID">
                                <el-input v-model="form.PARENT_ID"
                                          :disabled="formEdit"
                                          placeholder="请输入父级节点"></el-input>
                            </el-form-item>
                            <el-form-item label="节点编号"
                                          prop="ID"
                                          v-if="formEdit">
                                <el-input v-model="form.ID"
                                          :disabled="formEdit"
                                          placeholder="节点编号"></el-input>
                            </el-form-item>
                            <el-form-item label="部门名称"
                                          prop="DEPT_NAME">
                                <el-input v-model="form.DEPT_NAME"
                                          :disabled="formEdit"
                                          placeholder="请输入名称"></el-input>
                            </el-form-item>
                            <el-form-item label="部门全称"
                                          prop="FULL_NAME">
                                <el-input v-model="form.FULL_NAME"
                                          :disabled="formEdit"
                                          placeholder="请输入名称"></el-input>
                            </el-form-item>
                            <el-form-item label="部门类型"
                                          prop="DEPT_TYPE">
                                <el-radio v-model="form.DEPT_TYPE"
                                          :disabled="formEdit"
                                          label="1">机构
                                </el-radio>
                                <el-radio v-model="form.DEPT_TYPE"
                                          :disabled="formEdit"
                                          label="2">部门
                                </el-radio>
                            </el-form-item>
                            <el-form-item label="排序"
                                          prop="SORT_NO">
                                <el-input type="number"
                                          v-model="form.SORT_NO"
                                          :disabled="formEdit"
                                          placeholder="请输入排序"></el-input>
                            </el-form-item>
                            <el-form-item v-if="formStatus == 'update'">
                                <el-button type="primary"
                                           @click="update">更新
                                </el-button>
                                <el-button @click="onCancel">取消
                                </el-button>
                            </el-form-item>
                            <el-form-item v-if="formStatus == 'create'">
                                <el-button type="primary"
                                           @click="create">保存
                                </el-button>
                                <el-button @click="onCancel">取消
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
        </basic-container>
    </div>
</template>

<script>
    import {addObj, delObj, fetchTree, getObj, putObj} from '@/api/admin/dept'
    import {mapGetters} from 'vuex'

    export default {
        name: 'dept',
        data() {
            return {
                list: null,
                total: null,
                formEdit: true,
                formAdd: true,
                formStatus: '',
                showElement: false,
                typeOptions: ['0', '1'],
                methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
                listQuery: {
                    name: undefined
                },
                deptTreeOption: {
                    nodeKey:'id',
                    size:'small',
                    menu: false,
                    addBtn: false
                },
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                rules: {
                    parentId: [
                        {required: true, message: '请输入父级节点', trigger: 'blur'}
                    ],
                    deptId: [
                        {required: true, message: '请输入节点编号', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'}
                    ],
                },
                labelPosition: 'right',
                form: {},
                currentData: {
                    ID: 0
                },
                deptManager_btn_add: false,
                deptManager_btn_edit: false,
                deptManager_btn_del: false
            }
        },
        created() {
            this.getList()
            this.deptManager_btn_add = this.permissions['sys_dept_add']
            this.deptManager_btn_edit = this.permissions['sys_dept_edit']
            this.deptManager_btn_del = this.permissions['sys_dept_del']
        },
        computed: {
            ...mapGetters(['permissions'])
        },
        methods: {
            getList() {
                fetchTree(this.listQuery).then(response => {
                    this.treeData = response;
                });
            },
            filterNode(value, data) {
                if (!value) {
                    return true
                }
                return data.label.indexOf(value) !== -1;
            },
            getNodeData(data) {
                if (!this.formEdit) {
                    this.formStatus = 'update';
                }
                getObj(data.id).then(response => {
                    if (response.dataList.length == 0) {
                        this.$notify({
                            title: '异常',
                            message: '数据不存在',
                            type: 'error',
                            duration: 2000
                        })
                    } else {
                        this.form = response.dataList[0];
                    }
                });
                this.currentData = data;
                this.showElement = true;
            },
            handlerEdit() {
                if (this.form.ID) {
                    this.formEdit = false;
                    this.formStatus = 'update';
                }
            },
            handlerAdd() {
                this.resetForm();
                this.formEdit = false;
                this.formStatus = 'create';
            },
            handleDelete() {
                if (this.currentData.children && this.currentData.children.length > 0) {
                    this.$message.warning("该数据存在下级数据，无法删除");
                    return;
                }
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delObj(this.form.ID).then(() => {
                        this.getList();
                        this.resetForm();
                        this.onCancel();
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                    })
                })
            },
            update() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    putObj(this.form).then(() => {
                        this.getList()
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        });
                    });
                });
            },
            create() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    addObj(this.form).then(() => {
                        this.getList();
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        });
                    });
                });
            },
            onCancel() {
                this.formEdit = true;
                this.formStatus = '';
            },
            resetForm() {
                this.form = {
                    PARENT_ID: this.form.ID,
                    DEPT_TYPE: '2',
                    PARENT_IDS: this.form.PARENT_IDS ? (this.form.PARENT_IDS + this.form.ID + ",") :
                        (",0," + this.form.ID + ",")
                }
            }
        }
    }
</script>

