import request from '@/utils/request';

export async function queryDemo() {
  return request('/test/demo');
}
