import request from '@/utils/request'
const baseUrl = 'http://localhost:3000'
export function fetchList(params) {
  return request({
    params,
    url: `${baseUrl}/playlist/list`,
    method:'get'
  })
}
export function fetchDetai(params) {
  return request({
    params,
    url: `${baseUrl}/playlist/getById`,
    method:'get'
  })
}
export function update(parmas){
  return request({
    url:`${baseUrl}/playlist/updatePlaylist`,
    data:{
      ...parmas
    },
    method:'post'
  })
}
export function playlistDelete(params){
  return request({
    url:`${baseUrl}/playlist/delete`,
    params,
    method:'get'
  })
}