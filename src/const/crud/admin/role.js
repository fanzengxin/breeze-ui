export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  align: 'center',
  viewBtn: true,
  column: [{
    label: '角色名称',
    prop: 'ROLE_NAME',
    width: 220,
    rules: [{
      required: true,
      message: '角色名称不能为空',
      trigger: 'blur'
    }, {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '角色标识',
    prop: 'ROLE_CODE',
    width: 120,
    editDisabled: true,
    rules: [{
      required: true,
      message: '角色标识不能为空',
      trigger: 'blur'
    }, {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '角色类型',
    prop: 'ROLE_TYPE',
    slot: true,
    type: 'select',
    width: 80,
    value: 1,
    dicData: [{
      label: '系统',
      value: 1
    }, {
      label: '机构',
      value: 2
    }, {
      label: '部门',
      value: 3
    }]
  }, {
    label: '角色描述',
    prop: 'ROLE_DESC',
    type: 'textarea',
    align: 'left',
    overHidden: true,
    span: 24
  }, {
    label: '创建时间',
    prop: 'CREATE_TIME',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm:ss',
    valueFormat: 'timestamp',
    addDisplay: false,
    editDisplay: false,
    viewDisplay: false
  }]
}
