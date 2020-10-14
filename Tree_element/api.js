import axios from 'axios';
const baseURL = 'http://localhost:3000'
axios.defaults.baseURL = baseURL;
export const getTreeList = () => {
  return axios.get('/getTreeList')
}



export function request({ url, method = 'POST', data, onProgress = e => e, headers = {}, requestList = [] }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onProgress;
    console.log(baseURL + url);
    xhr.open(method, baseURL + url);
    Object.keys(headers).forEach(key =>
      xhr.setRequestHeader(key, headers[key])
    );
    xhr.send(data);
    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (requestList) {
            const i = requestList.findIndex(req => req === xhr);
            requestList.splice(i, 1);
          }
          // console.log(e);
          resolve({ data: e.target.response });
        } else if (xhr.status === 500) {
          reject('报错了，哥')
        }
      }
    };
    requestList.push(xhr);
  });
}
export async function post(url, data) {
  let ret = await request({
    url,
    data: JSON.stringify(data),
    headers: {
      "content-type": 'application/json'
    }
  })
  return JSON.parse(ret.data);
}
// function ts(gen) {
//   if (typeof gen === 'function') gen = gen()
//   if (!gen || typeof gen.next !== 'function') return
//   return function next() {
//     const res = gen.next()
//     if (res.done) return
//     setTimeout(next)
//   }
// }