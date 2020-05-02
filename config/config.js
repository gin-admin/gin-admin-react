// https://umijs.org/config/
import pageRoutes from './router.config';

export default {
  // add for transfer to umi
  antd: {},
  dva: {
    hmr: true,
  },
  targets: {
    ie: 11,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
  },
  dynamicImport: false,
  // 路由配置
  routes: pageRoutes,
  hash: true,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': '#1890ff',
  },
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:10088/',
      changeOrigin: true,
    },
  },
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
};
