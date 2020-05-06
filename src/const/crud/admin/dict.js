import {fetchList} from '@/api/admin/dict'

var validateDictCode = (rule, value, callback) => {
    console.log(rule);
    if (window.boxType === 'edit') {
        callback();
    }
    fetchList({
        dictCode: value,
        type: 0
    }).then(response => {
        let result = response.dataList.length;
        if (result > 0) {
            callback(new Error('字典编码已经存在'));
        } else {
            callback();
        }
    });
}

export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    showClomnuBtn: false,
    searchMenuSpan: 6,
    searchSize: 'mini',
    column: [{
        label: '字典编码',
        prop: 'DICT_CODE',
        editDisabled: true,
        rules: [{
            required: true,
            message: '请输入字典编码',
            trigger: 'blur'
        }, {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
        }, {
            validator: validateDictCode,
            trigger: 'blur'
        }]
    }, {
        label: '字典描述',
        prop: 'DICT_DESC',
        rules: [{
            required: true,
            message: '请输入字典编码',
            trigger: 'blur'
        }]
    }, {
        label: '排序',
        prop: 'SORT',
        type: 'number',
        hide: true,
        rules: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
        }]
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

export const subTableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    showClomnuBtn: false,
    searchSize: 'mini',
    column: [{
        width: 150,
        label: '字典项',
        prop: 'DICT_DESC',
        rules: [{
            required: true,
            message: '请输入字典项',
            trigger: 'blur'
        }, {
            min: 1,
            max: 32,
            message: '长度在 1 到 32 个字符',
            trigger: 'blur'
        }, {
            validator: validateDictCode,
            trigger: 'blur'
        }]
    }, {
        label: '字典值',
        prop: 'DICT_VALUE',
        rules: [{
            required: true,
            message: '请输入字典值',
            trigger: 'blur'
        }]
    }, {
        label: '排序',
        prop: 'SORT',
        type: 'number',
        span: 24,
        hide: true,
        rules: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
        }]
    }, {
        span: 24,
        label: '备注',
        prop: 'REMARKS',
        type: 'textarea',
        hide: true
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
