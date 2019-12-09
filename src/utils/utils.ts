import {parse} from 'querystring';
import {pathToRegexp} from 'path-to-regexp';
import moment from 'moment';
import md5 from 'md5';
import uuid from 'uuid/v4';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const {NODE_ENV} = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path: string }>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(({path}) => path && pathToRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

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
