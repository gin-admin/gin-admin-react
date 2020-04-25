import request, { methods, baseURL } from '@/utils/request';

// 验证码ID
export async function captchaID() {
  return request(`/v1/pub/login/captchaid`);
}

// 图形验证码
export function captcha(id) {
  return `${baseURL}/v1/pub/login/captcha?id=${id}`;
}

export async function login(data) {
  return request(`/v1/pub/login`, {
    method: methods.POST,
    data,
    hideNotify: true,
  });
}

export async function logout() {
  return request(`/v1/pub/login/exit`, {
    method: methods.POST,
  });
}

export async function updatePwd(data) {
  return request(`/v1/pub/current/password`, {
    method: methods.PUT,
    data,
  });
}

export async function getCurrentUser() {
  return request(`/v1/pub/current/user`);
}

export async function queryMenuTree() {
  return request(`/v1/pub/current/menutree`);
}
