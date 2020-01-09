import request from '@/utils/request';
const baseUrl = 'http://localhost:3000';

export function getBlogList(params) {
  return request({
    url: `${baseUrl}/blog/list`,
    method: 'get',
    params: { ...params }
  })
}
export function delBlogList(params) {
  return request({
    url: `${baseUrl}/blog/delete`,
    method: 'get',
    params: { ...params }
  })
}