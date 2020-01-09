import request from '@/utils/request';
const baseUrl = 'http://localhost:3000';

export function getSwiper() {
  return request({
    url: `${baseUrl}/swiper/list`,
    method: 'get'
  })
}
export function swiperDelete(params) {
  return request({
    url: `${baseUrl}/swiper/delete`,
    method: 'get',
    params: { ...params }
  })
}