import request from '@/router/axios'
import {cleanPostData} from '@/util/util'

export function fetchList(query) {
    return request({
        url: '/admin/user/page',
        method: 'get',
        params: query
    });
}

export function addObj(obj) {
    return request({
        url: '/admin/user',
        method: 'post',
        data: {
            data: cleanPostData(obj)
        }
    });
}

export function getObj(id) {
    return request({
        url: '/admin/user/get',
        method: 'get',
        params: {
            id: id
        }
    });
}

export function delObj(id) {
    return request({
        url: '/admin/user',
        method: 'delete',
        params: {
            id: id
        }
    });
}

export function putObj(obj) {
    return request({
        url: '/admin/user',
        method: 'put',
        data: {
            data: cleanPostData(obj)
        }
    });
}