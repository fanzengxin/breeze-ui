<template>
    <basic-container>
        <el-row>
            <el-col style='margin-top:15px;'>
                <avue-crud :option="option"
                           :data="tableData"
                           ref="crud"
                           v-model="form"
                           @refresh-change="handleRefreshChange">
                    <template slot="search">
                        <el-form-item label="连接">
                            <el-input v-model="query.connName"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库">
                            <el-input v-model="query.dbName"></el-input>
                        </el-form-item>
                    </template>
                    <template slot-scope="scope"
                              slot="menu"
                              v-if="codeGenerator_btn_permission">
                        <el-button icon="el-icon-plus"
                                   size="small"
                                   type="text"
                                   @click="createCode(scope.row)">生成
                        </el-button>
                    </template>
                </avue-crud>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="formShow"
                   width="70%"
                   top="5vh"
                   :close-on-click-modal="false"
                   title="代码生成">
            <avue-form v-if="formShow"
                       ref="form"
                       v-model="form"
                       :option="formOption"
                       @submit="submit">
                <template slot-scope="{row}" slot="COLUMN_NAME">
                    {{row.COLUMN_NAME}}
                </template>
                <template slot-scope="{row}" slot="COLUMN_COMMENT">
                    {{row.COLUMN_COMMENT}}
                </template>
                <template slot-scope="{row}" slot="COLUMN_TYPE">
                    {{row.COLUMN_TYPE}}
                </template>
            </avue-form>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {columnList, tableList} from '@/api/tools/generator'
    import {formOption, tableOption} from '@/const/crud/tools/generator'
    import {mapGetters} from 'vuex'

    export default {
        name: 'breezeConn',
        data() {
            return {
                option: tableOption,
                formOption: formOption,
                tableData: [],
                codeGenerator_btn_permission: false,
                query: {
                    connName: "default",
                    dbName: "breeze"
                },
                form: {
                    packageCode: 'org.breeze.admin',
                    moduleCode: '',
                    moduleName: '',
                    moduleAuthor: ''
                },
                formShow: false,
            }
        },
        created() {
            this.getList();
            this.codeGenerator_btn_permission = this.permissions['tools_code_generator'];
        },
        computed: {
            ...mapGetters(['userInfo', 'permissions']),
        },
        methods: {
            getList() {
                tableList(this.query).then(response => {
                    // 加载表格数据
                    this.tableData = response.dataList;
                });
            },
            /**
             * 刷新列表
             */
            handleRefreshChange() {
                this.getList();
            },
            createCode(row) {
                this.query.tableName = row.TABLE_NAME;
                columnList(this.query).then(response => {
                    this.form.dynamic = response.dataList;
                    this.form.dynamic.forEach(ele => {
                        ele.SHOW_TYPE = ['list','show','view','add','edit'];
                        ele.INPUT_TYPE = 'input';
                    });
                    if (this.form.moduleAuthor == null || this.form.moduleAuthor == '') {
                        this.form.moduleAuthor = this.userInfo.userName;
                    }
                    this.formShow = true;
                });
            },
            submit(form) {
                console.log(form);
            }
        }
    }
</script>

