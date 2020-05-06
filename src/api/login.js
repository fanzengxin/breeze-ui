/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
import request from '@/router/axios'

export const loginByUsername = (username, password, verifyCode, verifyCodeId) => {
  return request({
    url: '/auth/login',
    method: 'post',
    params: {username, password, verifyCode, verifyCodeId}
  });
}

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

export const getVerifyCode = (verifyCodeId) => {
  return request({
    url: '/auth/code',
    method: 'get',
    params: {
      verifyCodeId: verifyCodeId
    }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}