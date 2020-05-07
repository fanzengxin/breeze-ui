import {fetchList} from '@/api/admin/user'
import {getStoreDict} from '@/util/store'

var validateUserId = (rule, value, callback) => {
    if (window.boxType === 'edit') {
        callback();
    }
    fetchList({
        userId: value
    }).then(response => {
        let result = response.dataList.length;
        if (result > 0) {
            callback(new Error('用户名已经存在'));
        } else {
            callback();
        }
    })
}

export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    menuWidth: 130,
    searchMenuSpan: 6,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    column: [{
        fixed: true,
        label: 'ID',
        prop: 'ID',
        span: 24,
        hide: true,
        addDisplay: false,
        editDisplay: false
    }, {
        fixed: true,
        label: '用户名',
        prop: 'USER_ID',
        editDisabled: true,
        search: true,
        span: 24,
        rules: [{
            required: true,
            message: '请输入用户名'
        }, {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
        }, {
            validator: validateUserId,
            trigger: 'blur'
        }]
    }, {
        fixed: true,
        label: '姓名',
        prop: 'USER_NAME',
        editDisabled: true,
        slot: true,
        search: true,
        span: 24,
        rules: [{
            required: true,
            message: '请输入用户名'
        }, {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
        }]
    }, {
        label: '密码',
        prop: 'PASSWORD',
        type: 'password',
        value: '',
        hide: true,
        span: 24,
        rules: [{
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
        }]
    }, {
        label: '所属部门',
        prop: 'DEPTS',
        formslot: true,
        slot: true,
        span: 24,
        hide: true,
        rules: [{
            required: true,
            message: '请选择部门',
            trigger: 'change'
        }]
    }, {
        label: '手机号',
        prop: 'PHONE',
        type: 'phone',
        value: '',
        span: 24,
        rules: [{
            min: 6,
            max: 20,
            message: '长度在 11 个字符',
            trigger: 'blur'
        }]
    }, {
        label: '角色',
        prop: 'ROLES',
        formslot: true,
        slot: true,
        overHidden: true,
        span: 24,
        hide: true,
        rules: [{
            required: true,
            message: '请选择角色',
            trigger: 'blur'
        }]
    }, {
        label: '性别',
        prop: 'GENDER',
        type: 'select',
        span: 12,
        border: true,
        hide: true,
        // 动态从后台获取数据字典
        dicUrl: '/admin/dict',
        dicQuery: {
            dictCode: "SYS_GENDER"
        }
    }, {
        label: '状态',
        prop: 'STATUS',
        type: 'switch',
        slot: true,
        border: true,
        span: 12,
        width: 80,
        value: 1,
        addDisplay: false,
        // 从前端缓存中获取数据字典
        dicData: getStoreDict('SYS_USER_STATUS')
    }, {
        width: 150,
        label: '创建时间',
        prop: 'CREATE_TIME',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'timestamp',
        editDisplay: false,
        addDisplay: false,
        span: 24
    }]
}
