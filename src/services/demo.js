import request, { methods } from '@/utils/request';

const router = 'demos';

export async function query(params = {}) {
  return request(`/v1/${router}`, { params });
}

export async function get(id, params = {}) {
  return request(`/v1/${router}/${id}`, { params });
}

export async function create(data) {
  return request(`/v1/${router}`, {
    method: methods.POST,
    data,
  });
}

export async function update(id, data) {
  return request(`/v1/${router}/${id}`, {
    method: methods.PUT,
    data,
  });
}

export async function del(id, params = {}) {
  return request(`/v1/${router}/${id}`, {
    method: methods.DELETE,
    params,
  });
}

export async function enable(id, params = {}) {
  return request(`/v1/${router}/${id}/enable`, {
    method: methods.PATCH,
    params,
  });
}

export async function disable(id, params = {}) {
  return request(`/v1/${router}/${id}/disable`, {
    method: methods.PATCH,
    params,
  });
}
