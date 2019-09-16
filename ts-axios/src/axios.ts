import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types/index';
import { buildURL } from './helper/url';
import { transformRequest, transformResponse } from './helper/data';
import { processHeaders } from './helper/header';
import xhr from './xhr';
function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then(res => {
    return transResponseData(res);
  });
}
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config);
  config.headers = transfromHeaders(config);
  config.data = transformRequestData(config);
}
function transformUrl(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params);
}
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data);
}
function transfromHeaders(config): any {
  const { headers = {}, data } = config;
  return processHeaders(headers, data)
}
function transResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}
export default axios;
