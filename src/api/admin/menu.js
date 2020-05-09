import request from '@/router/axios'
import {cleanPostData} from '@/util/util'

export function GetMenu(children) {
  return request({
    url: '/admin/menu/tree',
    method: 'get',
    params: {
      children: children
    }
  })
}

export function fetchMenuTree(query) {
  return request({
    url: '/admin/menu',
    method: 'get',
    data: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'post',
    data: {
      data: cleanPostData(obj)
    }
  })
}

export function getObj(id) {
  return request({
    url: '/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/menu',
    method: 'delete',
    data: {
      id: id
    }
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/menu',
    method: 'put',
    data: {
      data: cleanPostData(obj)
    }
  });
}
