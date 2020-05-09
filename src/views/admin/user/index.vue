<template>
  <div class="user">
    <basic-container>
      <el-row>
        <el-col :span="5"
                style='margin-top:15px;'>
          <avue-tree :option="deptTreeOption"
                     :data="treeDeptData"
                     @node-click="getNodeData">
          </avue-tree>
        </el-col>
        <el-col :span="19"
                style='margin-top:15px;'>
          <avue-crud :option="option"
                     ref="crud"
                     v-model="form"
                     :page="page"
                     @on-load="getList"
                     @size-change="sizeChange"
                     @current-change="currentChange"
                     :table-loading="listLoading"
                     @search-change="handleFilter"
                     @refresh-change="handleRefreshChange"
                     @row-update="update"
                     @row-save="create"
                     :before-open="handleOpenBefore"
                     :data="list">
            <template slot="menuLeft">
              <el-button v-if="sys_user_add"
                         class="filter-item"
                         @click="handleCreate"
                         size="small"
                         type="primary"
                         icon="el-icon-plus">添加
              </el-button>
            </template>
            <template slot="search">
              <el-form-item>
                <el-checkbox v-model="containsSubDept">包含子部门</el-checkbox>
              </el-form-item>
            </template>
            <template slot="USER_NAME"
                      slot-scope="scope">
              <span>{{scope.row.USER_NAME}}</span>
            </template>
            <template slot="ROLES"
                      slot-scope="scope">
                              <span v-for="(role,index) in scope.row.roleList"
                                    :key="index">
                                <el-tag>{{role.roleName}}</el-tag>&nbsp;&nbsp;
                              </span>
            </template>
            <template slot="ROLESForm">
              <avue-select v-model="form.ROLES"
                           multiple
                           placeholder="请选择角色"
                           :dic="rolesOptions"
                           :props="roleProps"></avue-select>
            </template>
            <template slot="DEPTS"
                      slot-scope="scope">
              <span>{{scope.row.label}}</span>
            </template>
            <template slot="DEPTSForm">
              <avue-input v-model="form.DEPTS"
                          type="tree"
                          placeholder="请选择所属部门"
                          :dic="treeDeptData"
                          :props="deptTreeProps"></avue-input>
            </template>
            <template slot="STATUS"
                      slot-scope="scope">
              <div style="text-align:center">
                <el-tag v-if="scope.row.STATUS === 1" size="small" type="success">启用</el-tag>
                <el-tag v-if="scope.row.STATUS === 0" size="small" type="danger">禁用</el-tag>
              </div>
            </template>
            <template slot="menu"
                      slot-scope="scope">
              <el-button v-if="sys_user_edit"
                         size="small"
                         type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(scope.row,scope.index)">编辑
              </el-button>
              <el-button v-if="sys_user_del"
                         size="small"
                         type="text"
                         icon="el-icon-delete"
                         @click="deletes(scope.row,scope.index)">删除
              </el-button>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
  import {addObj, delObj, fetchList, getObj, putObj} from "@/api/admin/user";
  import {fetchList as roleList} from "@/api/admin/role";
  import {fetchTree} from "@/api/admin/dept";
  import {tableOption} from '@/const/crud/admin/user';
  import {mapGetters} from "vuex";

  export default {
    name: "breezeUser",
    data() {
      return {
        deptTreeOption: {
          nodeKey: 'id',
          size: 'small',
          menu: false,
          addBtn: false
        },
        option: tableOption,
        treeDeptData: [],
        checkedKeys: [],
        role: [],
        roleProps: {
          label: "ROLE_NAME",
          value: 'ROLE_CODE'
        },
        deptTreeProps: {
          children: 'children',
          label: 'label',
          value: 'id'
        },
        filterText: '',
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20, // 每页显示多少条,
          isAsc: false//是否倒序
        },
        params: {},
        containsSubDept: false,
        list: [],
        listLoading: true,
        form: {},
        rolesOptions: [],
      };
    },
    computed: {
      ...mapGetters(["permissions"])
    },
    watch: {},
    created() {
      this.getDeptTree();
      this.getRoleList();
      this.sys_user_add = this.permissions["sys_user_add"];
      this.sys_user_edit = this.permissions["sys_user_edit"];
      this.sys_user_del = this.permissions["sys_user_del"];
    },
    methods: {
      getDeptTree() {
        fetchTree().then(response => {
          this.treeDeptData = response;
        });
      },
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.label.indexOf(value) !== -1;
      },
      getList(page, params) {
        this.listLoading = true;
        if (!params) {
          params = {};
        }
        params.deptId = this.params.deptId;
        this.params = params;
        if (this.containsSubDept) {
          this.params.childrenDept = "," + this.params.deptId + ",";
        } else {
          this.params.childrenDept = ",,";
        }
        fetchList(Object.assign({
          page: page.currentPage,
          pageSize: page.pageSize
        }, this.params)).then(response => {
          this.list = response.dataList;
          this.page.total = response.dataTotal;
          this.listLoading = false;
        });
      },
      getNodeData(data) {
        this.params.deptId = data.id;
        this.getList(this.page, {});
      },
      getRoleList() {
        roleList().then(response => {
          this.rolesOptions = response.dataList;
        });
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.page = current
      },
      handleFilter(param, done) {
        this.getList(this.page, param);
        done()
      },
      handleRefreshChange() {
        this.getList(this.page)
      },
      handleCreate() {
        this.$refs.crud.rowAdd();
      },
      handleOpenBefore(show, type) {
        getObj(this.form.ID).then(response => {
          this.form = response;
          if (this.form.DEPTS && this.form.DEPTS.length > 0) {
            this.form.DEPTS = parseInt(this.form.DEPTS[0]);
          }
          window.boxType = type;
          if (type === 'add') {
            this.form.ROLES = [];
          }
          show();
        });
      },
      handleUpdate(row, index) {
        this.$refs.crud.rowEdit(row, index);
        this.form.password = undefined;
      },
      create(row, done, loading) {
        addObj(this.form).then(() => {
          this.getList(this.page);
          done();
          this.$notify.success('创建成功')
        }).catch(() => {
          loading();
        });
      },
      update(row, index, done, loading) {
        putObj(this.form).then(() => {
          this.getList(this.page);
          done();
          this.$notify.success('修改成功')
        }).catch(() => {
          loading();
        });
      },
      deletes(row) {
        this.$confirm("此操作将永久删除该用户(用户名:" + row.USER_ID + "), 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消", type: "warning"
          }
        ).then(() => {
          delObj(row.ID).then(() => {
            this.getList(this.page);
            this.$notify.success('删除成功')
          }).catch(() => {
            this.$notify.error('删除失败')
          });
        });
      }
    }
  };
</script>
<style lang="scss">
  .user {
    height: 100%;

    &__tree {
      padding-top: 3px;
      padding-right: 20px;
    }

    &__main {
      .el-card__body {
        padding-top: 0;
      }
    }
  }
</style>

