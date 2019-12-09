import md5 from 'md5';
import moment from 'moment';
import { parse } from 'querystring';
import uuid from 'uuid/v4';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

// md5加密
export function md5Hash(value: string) {
  return md5(value);
}

// 格式化时间戳
export function formatTimestamp(val: any, format: string) {
  let f = 'YYYY-MM-DD HH:mm:ss';
  if (format) {
    f = format;
  }
  return moment.unix(val).format(f);
}

// 解析时间戳
export function parseTimestamp(val: any) {
  return moment.unix(val);
}

// 解析日期
export function parseDate(val: any) {
  return moment(val);
}

// 格式化日期
export function formatDate(val: any, format: string) {
  let f = 'YYYY-MM-DD HH:mm:ss';
  if (format) {
    f = format;
  }
  return moment(val).format(f);
}

// 创建UUID
export function newUUID() {
  return uuid();
}
