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