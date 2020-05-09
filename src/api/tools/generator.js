import request from '@/router/axios'

export function tableList(query) {
  return request({
    url: '/tools/conn/table',
    method: 'get',
    params: query
  });
}

export function columnList(query) {
  return request({
    url: '/tools/conn/column',
    method: 'get',
    params: query
  });
}