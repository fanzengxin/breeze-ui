<template>
    <div class="execution">
        <basic-container>
            <el-row>
                <el-col style='margin-top:15px;'>
                    <avue-crud ref="crud"
                               :page="page"
                               :data="tableData"
                               :table-loading="tableLoading"
                               :option="tableOption"
                               :permission="permissionList"
                               :before-open="handleOpenBefore"
                               v-model="form"
                               @on-load="getList"
                               @refresh-change="refreshList"
                               @row-update="handleUpdate"
                               @row-save="handleSave"
                               @size-change="sizeChange"
                               @current-change="currentChange"
                               @search-change="searchChange"
                               @row-del="rowDel">
                        <template slot-scope="scope"
                                  slot="menu"
                                  v-if="dictManager_btn_permission">
                            <el-button icon="el-icon-plus"
                                       size="small"
                                       type="text"
                                       @click="handleDictValueShow(scope.row,scope.index)">字典值
                            </el-button>
                        </template>
                    </avue-crud>
                </el-col>
            </el-row>
            <el-dialog
                    :visible.sync="dialogDictValueVisible"
                    width="65%"
                    :close-on-click-modal="false"
                    title="添加字典值">
                <div class="dialog-main-tree">
                    <avue-crud ref="crud"
                               :page="subPage"
                               :data="subTableData"
                               :table-loading="tableLoading"
                               :option="subTableOption"
                               :permission="permissionList"
                               :before-open="handleOpenBefore"
                               v-model="subForm"
                               @refresh-change="refreshList"
                               @row-update="handleUpdate"
                               @row-save="handleSubSave"
                               @size-change="sizeChange"
                               @current-change="currentChange"
                               @search-change="searchChange"
                               @row-del="rowDel">>
                    </avue-crud>
                </div>
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
    import {addObj, delObj, fetchList, putObj} from '@/api/admin/dict'
    import {subTableOption, tableOption} from '@/const/crud/admin/dict'
    import {mapGetters} from 'vuex'

    export default {
        name: 'breezeDict',
        data() {
            return {
                tableData: [],
                subTableData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                subPage: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                tableLoading: false,
                tableOption: tableOption,
                subTableOption: subTableOption,
                dictManager_btn_permission: false,
                dialogDictValueVisible: false,
                dictParent: '0',
                dictValueType: 0,
                form: {},
                subForm: {}
            };
        },
        created() {
            this.dictManager_btn_permission = this.permissions['sys_dict_add'];
        },
        mounted: function () {
        },
        computed: {
            ...mapGetters(['permissions']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permissions.sys_dict_add, false),
                    editBtn: this.vaildData(this.permissions.sys_dict_edit, false),
                    delBtn: this.vaildData(this.permissions.sys_dict_del, false)
                };
            }
        },
        methods: {
            getList(page, params) {
                if (params) {
                    params.dictParent = this.dialogDictValueVisible ? this.dictParent : 0;
                } else {
                    params = {
                        dictParent: this.dialogDictValueVisible ? this.dictParent : 0
                    };
                }
                this.tableLoading = true
                fetchList(Object.assign({
                    current: page.currentPage,
                    size: page.pageSize
                }, params)).then(response => {
                    if (this.dialogDictValueVisible) {
                        this.subTableData = response.dataList;
                        this.subPage.total = response.dataTotal;
                    } else {
                        this.tableData = response.dataList;
                        this.page.total = response.dataTotal;
                    }
                    this.tableLoading = false;
                });
            },
            refreshList() {
                if (this.dialogDictValueVisible) {
                    this.getList(this.subPage, this.subForm);
                } else {
                    this.getList(this.page, this.form);
                }
            },
            handleOpenBefore(show, type) {
                window.boxType = type;
                show();
            },
            rowDel: function (row) {
                if (this.dialogDictValueVisible) {
                    this.dictDel(row);
                } else {
                    fetchList({dictParent: row.DICT_CODE}).then(response => {
                        if (response.dataList.length > 0) {
                            this.$message.warning("该字典项存在字典值数据，无法删除");
                        } else {
                            this.dictDel(row);
                        }
                    });
                }
            },
            dictDel(row) {
                var _this = this
                this.$confirm('是否确认删除名为"' + row.DICT_DESC + '"的数据项?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delObj(row.ID);
                }).then(() => {
                    if (this.dialogDictValueVisible) {
                        this.getList(this.subPage, this.subForm);
                    } else {
                        this.getList(this.page, this.form);
                    }
                    _this.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                }).catch(function () {
                });
            },
            /**
             * @title 数据更新
             * @param row 为当前的数据
             * @param index 为当前更新数据的行数
             * @param done 为表单关闭函数
             *
             **/
            handleUpdate: function (row, index, done) {
                row.value_type = this.dictValueType;
                putObj(row).then(() => {
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    });
                    if (this.dialogDictValueVisible) {
                        this.getList(this.subPage, this.subForm);
                    } else {
                        this.getList(this.page, this.form);
                    }
                    done();
                })
            },
            /**
             * @title 字典项数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            handleSave: function (row, done) {
                row.dict_type = 0;
                row.dict_parent = 0;
                this.handleDictSave(row, done);
            },
            /**
             * @title 字典值数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            handleSubSave: function (row, done) {
                row.dict_type = 1;
                row.dict_parent = this.dictParent;
                row.value_type = this.dictValueType;
                this.handleDictSave(row, done);
            },
            handleDictSave: function (row, done) {
                addObj(row).then(() => {
                    this.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    });
                    if (this.dialogDictValueVisible) {
                        this.getList(this.subPage, this.subForm);
                    } else {
                        this.getList(this.page, this.form);
                    }
                    done();
                });
            },
            handleDictValueShow(row) {
                this.dictParent = row.DICT_CODE;
                this.dictValueType = row.VALUE_TYPE;
                this.dialogDictValueVisible = true;
                this.getList(this.subPage, this.subForm);
            },
            searchChange(form, done) {
                if (this.dialogDictValueVisible) {
                    this.getList(this.subPage, this.subForm);
                } else {
                    this.getList(this.page, this.form);
                }
                done();
            },
            sizeChange(pageSize) {
                if (this.dialogDictValueVisible) {
                    this.subPage.pageSize = pageSize;
                } else {
                    this.page.pageSize = pageSize;
                }
            },
            currentChange(current) {
                if (this.dialogDictValueVisible) {
                    this.subPage.currentPage = current;
                } else {
                    this.page.currentPage = current;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>

