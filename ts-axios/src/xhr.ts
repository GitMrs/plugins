import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index';
import { parseHeaders } from './helper/parseHeaders';
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve,reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config;
    const request = new XMLHttpRequest();
    if(timeout){
      request.timeout = timeout;
    }
    if (responseType) {
      request.responseType = responseType;
    }
    request.open(method.toUpperCase(), url, true);
    // 添加头部信息
    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
        // console.log(headers)
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    })
    request.send(data);
    // 数据响应处理
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return;
      }
      if(request.status === 0){
        return;
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response);
    }

    function handleResponse(response: AxiosResponse){
      if(response.status >= 200 && response.status < 300){
        resolve(response);
      }else{
        reject(new Error(`Request failed with status code ${request.status}`))
      }
    }

    // 错误处理
    request.onerror = function handleError(){
      reject(new Error('Network Error'));
    }
    // 超时处理
    request.ontimeout = function handleTimeout(){
      reject(new Error(`Timeout of ${timeout} ms exceeded`))
    }

  })
  // return data;
}