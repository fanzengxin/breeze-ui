export const tableOption = {
  border: true,
  index: true,
  stripe: true,
  menuAlign: 'center',
  menuWidth: 120,
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  searchMenuSpan: 6,
  column: [{
    label: '表名称',
    prop: 'TABLE_NAME',
    align: 'center',
    search: true
  }, {
    label: '表注释',
    prop: 'TABLE_COMMENT',
    align: 'center'
  }, {
    label: '表编码',
    prop: 'TABLE_COLLATION',
    align: 'center'
  }, {
    label: '索引',
    prop: 'ENGINE',
    align: 'center'
  }, {
    type: 'datetime',
    valueFormat: 'timestamp',
    format: 'yyyy-MM-dd hh:mm:ss',
    label: '创建时间',
    prop: 'CREATE_TIME',
    align: 'center'
  }]
}

export const formOption = {
  submitText: '生成',
  column: [{
    label: '包名称',
    prop: 'packageCode',
    tip: '包名称，用于生成代码的文件的文件夹路径，如 org.breeze.admin 等',
    span: 12,
    maxlength: 32,
    suffixIcon: 'el-icon-arrow-right',
    prefixIcon: 'el-icon-arrow-left',
    minlength: 1,
    rules: [{
      required: true,
      message: "模块编码",
      trigger: "blur"
    }]
  }, {
    label: '模块编码',
    prop: 'moduleCode',
    tip: '模块编码，用于生成代码的文件的名称核心部分，如 user、dept 等',
    span: 12,
    maxlength: 32,
    suffixIcon: 'el-icon-arrow-right',
    prefixIcon: 'el-icon-arrow-left',
    minlength: 1,
    rules: [{
      required: true,
      message: "模块编码",
      trigger: "blur"
    }]
  }, {
    label: "模块名称",
    prop: "moduleName",
    tip: '模块名称，用于生成代码注释部分，如 用户管理、部门管理 等',
    span: 12,
    maxlength: 32,
    suffixIcon: 'el-icon-arrow-right',
    prefixIcon: 'el-icon-arrow-left',
    minlength: 1,
    rules: [{
      required: true,
      message: "请输入作者",
      trigger: "blur"
    }]
  }, {
    label: "作者",
    prop: "moduleAuthor",
    tip: '代码作者',
    span: 12,
    maxlength: 32,
    suffixIcon: 'el-icon-arrow-right',
    prefixIcon: 'el-icon-arrow-left',
    minlength: 1,
    rules: [{
      required: true,
      message: "请输入作者",
      trigger: "blur"
    }]
  }, {
    label: '字段管理',
    prop: 'dynamic',
    type: 'dynamic',
    span: 24,
    children: {
      border: true,
      addBtn: false,
      stripe: true,
      align: 'center',
      column: [{
        label: '字段',
        prop: 'COLUMN_NAME',
        width: 100,
        formslot: true
      }, {
        label: '描述',
        width: 120,
        prop: 'COLUMN_COMMENT',
        formslot: true
      }, {
        label: '类型',
        width: 80,
        prop: 'COLUMN_TYPE',
        formslot: true
      }, {
        label: '展示',
        prop: "SHOW_TYPE",
        type: 'checkbox',
        dicData: [{
          label: '列表',
          value: 'list'
        }, {
          label: '查询',
          value: 'search'
        }, {
          label: '展示',
          value: 'show'
        }, {
          label: '预览',
          value: 'view'
        }, {
          label: '新增',
          value: 'add'
        }, {
          label: '修改',
          value: 'edit'
        }]
      }, {
        label: '输入方式',
        prop: "INPUT_TYPE",
        width: 130,
        type: 'select',
        dicData: [{
          label: 'input',
          value: 'input'
        }, {
          label: 'select',
          value: 'select'
        }, {
          label: 'radio',
          value: 'radio'
        }, {
          label: 'checkbox',
          value: 'checkbox'
        }]
      }]
    }
  }]
}
