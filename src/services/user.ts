import { stringify } from 'qs';
import request from '../utils/request';

const router = 'users';

export async function query(params: any) {
  return request(`/v1/${router}?${stringify(params)}`);
}

export async function get(params: any) {
  return request(`/v1/${router}/${params.record_id}`);
}

export async function create(params: any) {
  return request(`/v1/${router}`, {
    method: 'POST',
    body: params,
  });
}

export async function update(params: any) {
  return request(`/v1/${router}/${params.record_id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function del(params: any) {
  return request(`/v1/${router}/${params.record_id}`, {
    method: 'DELETE',
  });
}

export async function enable(params: any) {
  return request(`/v1/${router}/${params.record_id}/enable`, {
    method: 'PATCH',
  });
}

export async function disable(params: any) {
  return request(`/v1/${router}/${params.record_id}/disable`, {
    method: 'PATCH',
  });
}
