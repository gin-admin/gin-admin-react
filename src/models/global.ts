import * as loginService from '@/services/login';

import { Effect, Subscription } from 'dva';

import { Reducer } from 'redux';

export interface CurrentUser {
  user_name: string;
  real_name: string;
  role_names?: Array<string>;
}

export interface MenuAction {
  code?: string;
  name?: string;
}

export interface MenuResource {
  code?: string;
  name?: string;
  method?: string;
  path?: string;
}

export interface MenuParam {
  record_id?: string;
  name?: string;
  sequence?: number;
  icon?: string;
  router?: string;
  hidden?: number;
  parent_id?: string;
  parent_path?: string;
  creator?: string;
  created_at?: string;
  actions?: MenuAction[];
  resources?: MenuResource[];
}

export interface GlobalModelState {
  title?: string;
  copyRight?: string;
  defaultURL?: string;
  collapsed?: boolean;
  openKeys?: [];
  selectedKeys?: [];
  user?: CurrentUser;
  menuPaths?: { [key: string]: MenuParam };
  menuMap?: { [key: string]: MenuParam };
  menus?: MenuParam[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    menuEvent: Effect;
    fetchUser: Effect;
    fetchMenuTree: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    changeOpenKeys: Reducer<GlobalModelState>;
    changeSelectedKeys: Reducer<GlobalModelState>;
    saveUser: Reducer<GlobalModelState>;
    saveMenuPaths: Reducer<GlobalModelState>;
    saveMenuMap: Reducer<GlobalModelState>;
    saveMenus: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    title: '权限管理脚手架',
    copyRight: '2019 LyricTian',
    defaultURL: '/dashboard',
    openKeys: [],
    selectedKeys: [],
    user: {
      user_name: 'root',
      real_name: '超级管理员',
      role_names: [],
    },
    menuPaths: {},
    menuMap: {},
    menus: [],
  },

  effects: {
    *menuEvent({ pathname }, { put, select }) {
      let p = pathname;
      if (p === '/') {
        p = yield select((state: { global: { defaultURL: string } }) => state.global.defaultURL);
      }

      const menuPaths = yield select(
        (state: { global: { menuPaths: any } }) => state.global.menuPaths,
      );
      const item = menuPaths[p];
      if (!item) {
        return;
      }

      if (item.parent_path && item.parent_path !== '') {
        yield put({
          type: 'changeOpenKeys',
          payload: item.parent_path.split('/'),
        });
      }

      yield put({
        type: 'changeSelectedKeys',
        payload: [item.record_id],
      });
    },
    *fetchUser(_, { call, put }) {
      const response = yield call(loginService.getCurrentUser);
      yield put({
        type: 'saveUser',
        payload: response,
      });
    },
    *fetchMenuTree({ pathname }, { call, put }) {
      const response = yield call(loginService.queryMenuTree);
      const menuData = response.list || [];
      yield put({
        type: 'saveMenus',
        payload: menuData,
      });

      const menuPaths = {};
      const menuMap = {};

      function fillData(data: any) {
        for (let i = 0; i < data.length; i += 1) {
          menuMap[data[i].record_id] = data[i];
          if (data[i].router !== '') {
            menuPaths[data[i].router] = data[i];
          }
          if (data[i].children && data[i].children.length > 0) {
            fillData(data[i].children);
          }
        }
      }

      fillData(menuData);

      yield [
        put({
          type: 'saveMenuPaths',
          payload: menuPaths,
        }),
        put({
          type: 'saveMenuMap',
          payload: menuMap,
        }),
        put({
          type: 'menuEvent',
          pathname,
        }),
      ];
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeOpenKeys(state, { payload }) {
      return {
        ...state,
        openKeys: payload,
      };
    },
    changeSelectedKeys(state, { payload }) {
      return {
        ...state,
        selectedKeys: payload,
      };
    },
    saveUser(state, { payload }) {
      return { ...state, user: payload };
    },
    saveMenuPaths(state, { payload }) {
      return { ...state, menuPaths: payload };
    },
    saveMenuMap(state, { payload }) {
      return { ...state, menuMap: payload };
    },
    saveMenus(state, { payload }) {
      return { ...state, menus: payload };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
