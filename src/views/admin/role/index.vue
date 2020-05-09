<template>
  <basic-container>
    <el-row>
      <el-col style='margin-top:15px;'>
        <avue-crud :option="option"
                   :data="list"
                   :page="page"
                   :permission="permissionList"
                   ref="crud"
                   v-model="form"
                   :table-loading="listLoading"
                   @on-load="getList"
                   @refresh-change="handleRefreshChange"
                   @row-update="update"
                   @row-save="create"
                   @row-del="rowDel"
                   :before-open="handleOpenBefore">
          <template slot-scope="scope"
                    slot="ROLE_TYPE">
            <div style="text-align:center">
              <el-tag v-if="scope.row.ROLE_TYPE === 1" size="small">系统</el-tag>
              <el-tag v-if="scope.row.ROLE_TYPE === 2" size="small" type="success">机构</el-tag>
              <el-tag v-if="scope.row.ROLE_TYPE === 3" size="small" type="danger">部门</el-tag>
            </div>
          </template>
          <template slot-scope="scope"
                    slot="menu"
                    v-if="roleManager_btn_permission">
            <el-button icon="el-icon-plus"
                       size="small"
                       type="text"
                       @click="handlePermission(scope.row,scope.index)">权限
            </el-button>
          </template>
        </avue-crud>
      </el-col>
    </el-row>
    <el-dialog
        :visible.sync="dialogPermissionVisible"
        :close-on-click-modal="false"
        title="分配权限">
      <div class="dialog-main-tree">
        <el-tree
            ref="menuTree"
            :data="treeData"
            :default-checked-keys="checkedKeys"
            :check-strictly="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            node-key="MENU_PERMISSION"
            highlight-current
            show-checkbox
            default-expand-all/>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button
            type="primary"
            size="small"
            @click="updatePermession(roleCode)">更新
        </el-button>
        <el-button
            type="default"
            size="small"
            @click="cancal()">取消
        </el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {addObj, delObj, fetchList, fetchRoleTree, permissionUpdate, putObj} from '@/api/admin/role'
  import {tableOption} from '@/const/crud/admin/role'
  import {mapGetters} from 'vuex'

  export default {
    name: 'breezeRole',
    data() {
      return {
        option: tableOption,
        list: [],
        form: {},
        page: {
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条
          total: 0 // 总页数
        },
        listLoading: true,
        dialogPermissionVisible: false,
        treeData: [],
        defaultProps: {
          label: 'MENU_NAME',
          value: 'MENU_PERMISSION'
        },
        roleCode: '',
        checkedKeys: [],
        roleManager_btn_permission: false
      }
    },
    created() {
      this.roleManager_btn_permission = this.permissions['sys_role_permission'];
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_role_add, false),
          editBtn: this.vaildData(this.permissions.sys_role_edit, false),
          delBtn: this.vaildData(this.permissions.sys_role_del, false)
        };
      }
    },
    methods: {
      getList(page, params) {
        fetchList(Object.assign({
          page: page.currentPage,
          pageSize: page.pageSize
        }, params)).then(response => {
          this.list = response.dataList;
          this.page.total = response.dataTotal;
          this.listLoading = false;
        });
      },
      /**
       * 刷新列表
       */
      handleRefreshChange() {
        this.page = {
          currentPage: 1,
          pageSize: 20,
          total: 0
        };
        this.getList(this.page);
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
      },
      handlePermission(row) {
        this.roleCode = row.ROLE_CODE;
        fetchRoleTree(row.ROLE_CODE).then(response => {
          this.checkedKeys = [];
          this.treeData = [];
          response.dataList.forEach(node => {
            if (node["PARENT_MENU_ID"] === 0) {
              this.treeData.push(node);
            }
            if (node["PERMISSION"]) {
              this.checkedKeys.push(node["PERMISSION"]);
            }
            node.children = [];
            if (node.MENU_TYPE === 2) {
              node.children.push({
                MENU_NAME: '查看',
                MENU_PERMISSION: node.MENU_PERMISSION
              });
              node.MENU_PERMISSION = '';
            }
            response.dataList.forEach(subNode => {
              if (subNode["PARENT_MENU_ID"] === node["ID"]) {
                node.children.push(subNode);
              }
            });
          });
          this.dialogPermissionVisible = true;
        });
      },
      filterNode(value, data) {
        if (!value) {
          return true
        } else {
          return data.label.indexOf(value) !== -1;
        }
      },
      updatePermession(roleCode) {
        this.pms = '';
        this.pms = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
        permissionUpdate(roleCode, this.pms).then(() => {
          this.dialogPermissionVisible = false;
          this.$store.dispatch('GetMenu', {type: false});
          this.$notify.success('修改成功');
        })
      },
      cancal() {
        this.dialogPermissionVisible = false;
      },
    }
  }
</script>

