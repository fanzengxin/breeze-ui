import request from '@/router/axios'
import {cleanPostData} from '@/util/util'

export function fetchList(query) {
  return request({
    url: '/admin/role/page',
    method: 'get',
    params: query
  })
}

export function deptRoleList() {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/admin/role',
    method: 'get',
    data: {
      id: id
    }
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/role',
    method: 'post',
    data: {
      data: cleanPostData(obj)
    }
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/role',
    method: 'put',
    data: {
      data: cleanPostData(obj)
    }
  })
}

export function delObj(id) {
  return request({
    url: '/admin/role',
    method: 'delete',
    data: {
      id: id
    }
  })
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/admin/role/menu',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree(roleCode) {
  return request({
    url: '/admin/menu/role',
    method: 'get',
    params: {
      roleCode: roleCode
    }
  });
}

export function permissionUpdate(roleCode, permissions) {
  return request({
    url: '/admin/role/permissions',
    method: 'post',
    data: {
      roleCode: roleCode,
      permissions: permissions
    }
  });
}
