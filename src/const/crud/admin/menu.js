import iconList from '@/const/iconList'

export const tableOption = {
  rowKey: 'ID',
  headerAlign: 'center',
  align: 'center',
  border: true,
  index: true,
  simplePage: true,
  viewBtn: true,
  column: [{
    label: '菜单名称',
    prop: 'MENU_NAME',
    align: 'left',
    width: 200,
    rules: [{
      required: true,
      message: "请输入菜单名称",
      trigger: "blur"
    }]
  }, {
    label: '菜单类型',
    prop: 'MENU_TYPE',
    slot: true,
    type: 'select',
    width: 80,
    value: 1,
    dicData: [{
      label: '目录',
      value: 1
    }, {
      label: '菜单',
      value: 2
    }, {
      label: '按钮',
      value: 3
    }]
  }, {
    label: '菜单路由',
    prop: 'MENU_URL'
  }, {
    label: '菜单权限',
    prop: 'MENU_PERMISSION'
  }, {
    label: '排序号',
    prop: 'SORT_NO',
    type: 'number',
    value: 10,
    hide: true,
    width: 60,
    rules: [{
      required: true,
      message: "请输入菜单排序号",
      trigger: "blur"
    }]
  }, {
    label: '路由缓存',
    prop: 'KEEP_ALIVE',
    type: 'switch',
    hide: true,
    width: 60,
    value: 0,
    dicData: [{
      label: '关闭',
      value: 0
    }, {
      label: '开启',
      value: 1
    }]
  }, {
    label: '父级菜单',
    prop: 'PARENT_MENU_ID',
    type: 'tree',
    dicData: []
  }, {
    label: '菜单图标',
    prop: 'MENU_ICON',
    type: "icon-select",
    width: 60,
    iconList: iconList
  }],
}
