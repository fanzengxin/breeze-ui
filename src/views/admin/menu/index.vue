<template>
    <basic-container>
        <el-row>
            <el-col style='margin-top:15px;'>
                <avue-crud :option="option"
                           :data="treeData"
                           :permission="permissionList"
                           ref="crud"
                           v-model="form"
                           @refresh-change="handleRefreshChange"
                           @row-update="update"
                           @row-save="create"
                           @row-del="rowDel"
                           :before-open="handleOpenBefore">
                    <template slot-scope="scope"
                              slot="MENU_TYPE">
                        <div style="text-align:center">
                            <el-tag v-if="scope.row.MENU_TYPE === 1" size="small">目录</el-tag>
                            <el-tag v-if="scope.row.MENU_TYPE === 2" size="small" type="success">菜单</el-tag>
                            <el-tag v-if="scope.row.MENU_TYPE === 3" size="small" type="danger">按钮</el-tag>
                        </div>
                    </template>
                    <template slot-scope="scope"
                              slot="MENU_ICON">
                        <div style="text-align:center">
                            <i :class="scope.row.MENU_ICON"></i>
                        </div>
                    </template>
                </avue-crud>
            </el-col>
        </el-row>
    </basic-container>
</template>

<script>
    import {addObj, delObj, fetchMenuTree, putObj} from '@/api/admin/menu'
    import {tableOption} from '@/const/crud/admin/menu'
    import {createTree} from '@/util/util'
    import {mapGetters} from 'vuex'

    export default {
        name: 'breezeMenu',
        data() {
            return {
                option: tableOption,
                listQuery: {
                    lazy: false,
                    parentId: 0
                },
                treeData: [],
                treeDic: [],
                form: {}
            }
        },
        created() {
            this.getList();
        },
        computed: {
            ...mapGetters(['permissions']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permissions.sys_menu_add, false),
                    delBtn: this.vaildData(this.permissions.sys_menu_del, false),
                    editBtn: this.vaildData(this.permissions.sys_menu_edit, false)
                };
            }
        },
        methods: {
            getList() {
                fetchMenuTree(this.listQuery).then(response => {
                    // 加载表格数据
                    this.treeData = createTree(response.dataList, 0, "ID", "PARENT_MENU_ID");
                    let menus = [];
                    response.dataList.forEach(data => {
                        if (data.MENU_TYPE < 3) {
                            menus.push({
                                value: data.ID,
                                label: data.MENU_NAME,
                                parentId: data.PARENT_MENU_ID,
                                children: []
                            });
                        }
                    });
                    // 加载父级菜单数据字典
                    this.option.column.forEach(ele => {
                        if (ele.prop === "PARENT_MENU_ID") {
                            ele.dicData = [{
                                value: 0,
                                label: "顶级菜单",
                                children: createTree(menus, 0, "value", "parentId")
                            }];
                        }
                    });
                });
            },
            /**
             * 刷新列表
             */
            handleRefreshChange() {
                this.listQuery.parentId = 0;
                this.treeData = [];
                this.getList();
            },
            handleOpenBefore(done) {
                done();
            },
            create(row, done, loading) {
                addObj(row).then(() => {
                    this.handleRefreshChange();
                    done();
                    this.$notify.success('创建成功')
                }).catch(() => {
                    loading();
                });
            },
            update(row, index, done, loading) {
                putObj(row).then(() => {
                    this.handleRefreshChange();
                    done();
                    this.$notify.success('修改成功')
                }).catch(() => {
                    loading();
                });
            },
            rowDel(row) {
                if (row.children && row.children.length > 0) {
                    this.$message.warning("该数据存在下级数据，无法删除");
                    return;
                }
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    return delObj(row.ID);
                }).then(() => {
                    this.handleRefreshChange();
                    this.$message.success("删除成功");
                });
            }
        }
    }
</script>

