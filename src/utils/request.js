import axios from 'axios';
import moment from 'moment';
import { history } from 'umi';
import { stringify, parse } from 'qs';
import { notification } from 'antd';
import store, { storeKeys } from './store';

let refreshTimeout;
let lastAccessTime;

export const baseURL = '/api';

export const contentType = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
};

export const headerKeys = {
  ContentType: 'Content-Type',
  Authorization: 'Authorization',
};

export const methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

// 获取访问令牌
export function getAccessToken() {
  const token = store.get(storeKeys.AccessToken);
  if (!token) {
    return '';
  }
  return token.access_token;
}

// 包装带有令牌的URL
export function wrapURLWithToken(url) {
  const ss = url.split('?');
  const query = parse(ss[1]);
  query.accessToken = getAccessToken();
  return `${ss[0]}?${stringify(query)}`;
}

// 登出
export function logout() {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  store.remove(storeKeys.AccessToken);
  const { redirect } = parse(window.location.href.split('?')[1]);
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
}

// request 拦截器
function requestInterceptors(c) {
  const config = { ...c };
  const token = store.get(storeKeys.AccessToken);
  if (token) {
    config.headers[headerKeys.Authorization] = `${token.token_type} ${token.access_token}`;
  }
  return config;
}

const instance = axios.create({
  baseURL,
  timeout: 10000,
});
instance.interceptors.request.use(requestInterceptors);

// ajax请求
export default function request(url, options = { method: methods.GET }) {
  const oldToken = store.get(storeKeys.AccessToken);
  if (oldToken && oldToken.expires_at - lastAccessTime <= 0) {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    logout();
    // eslint-disable-next-line compat/compat
    return Promise.reject(new Error('The token has expired'));
  }
  lastAccessTime = moment().unix();

  const opts = { ...options };
  let showNotify = true;
  if (opts.hideNotify) {
    showNotify = false;
    delete opts.hideNotify;
  }

  const config = {
    method: opts.method,
    headers: {},
    paramsSerializer: params => {
      return stringify(params);
    },
    ...opts,
  };

  if (
    !(config.headers && config.headers[headerKeys.ContentType]) &&
    [methods.POST, methods.PUT, methods.PATCH].indexOf(config.method) > -1
  ) {
    config.headers[headerKeys.ContentType] = contentType.json;
  }

  return instance
    .request({ url, ...config })
    .then(res => {
      const { data } = res;
      return data;
    })
    .catch(error => {
      const { response } = error;
      const { status, data } = response;

      if (status === 401 && data.error && data.error.code === 9999) {
        logout();
        return response;
      }

      if (showNotify) {
        let msg = '请求发生错误';
        if (status === 504) {
          msg = '未连接到服务器';
        } else if (data && data.error) {
          msg = data.error.message;
        }

        notification.error({
          message: `${config.baseURL}${url}`,
          description: msg,
        });
      }
      return response;
    });
}

// 放入访问令牌
export function setToken(token) {
  lastAccessTime = token.expires_at;
  store.set(storeKeys.AccessToken, token);
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  // 提前10分钟更新令牌
  const timeout = token.expires_at - moment().unix() - 10;
  if (timeout > 0) {
    refreshTimeout = setTimeout(() => {
      const oldToken = store.get(storeKeys.AccessToken);
      if (oldToken && oldToken.expires_at - lastAccessTime <= 0) {
        if (refreshTimeout) {
          clearTimeout(refreshTimeout);
        }
        return;
      }

      request('/v1/pub/refresh-token', {
        method: methods.POST,
      }).then(res => {
        setToken(res);
      });
    }, timeout * 1000);
  }
}
