import request from '@/router/axios'
import {cleanPostData} from '@/util/util'

export function fetchList(query) {
    return request({
        url: '/admin/dict/page',
        method: 'get',
        params: query
    });
}

export function getList(query) {
    return request({
        url: '/admin/dict',
        method: 'get',
        params: query
    });
}

export function getAllDict() {
    return request({
        url: '/admin/dict/all',
        method: 'get'
    });
}

export function checkLastUpdateTime() {
    return request({
        url: '/admin/dict/check',
        method: 'get'
    });
}

export function addObj(obj) {
    return request({
        url: '/admin/dict',
        method: 'post',
        data: {
            data: cleanPostData(obj)
        }
    });
}

export function getObj(id) {
    return request({
        url: '/admin/dict',
        method: 'get',
        params: {
            id: id
        }
    });
}

export function delObj(id) {
    return request({
        url: '/admin/dict',
        method: 'delete',
        params: {
            id: id
        }
    });
}

export function putObj(obj) {
    return request({
        url: '/admin/dict',
        method: 'put',
        data: {
            data: cleanPostData(obj)
        }
    })
}
