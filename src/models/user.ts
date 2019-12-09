import * as userService from '@/services/user';

import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';

export interface UserModelState {
  search?: any;
  data?: {
    list: any;
    pagination: any;
  };
  submitting?: boolean;
  formType?: any;
  formTitle?: string;
  formID?: string;
  formVisible?: boolean;
  formData?: any;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    loadForm: Effect;
    fetchForm: Effect;
    submit: Effect;
    del: Effect;
    changeStatus: Effect;
  };
  reducers: {
    saveData: Reducer<UserModelState>;
    saveSearch: Reducer<UserModelState>;
    changeFormVisible: Reducer<UserModelState>;
    saveFormTitle: Reducer<UserModelState>;
    saveFormType: Reducer<UserModelState>;
    saveFormID: Reducer<UserModelState>;
    saveFormData: Reducer<UserModelState>;
    changeSubmitting: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    search: {},
    data: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
  },
  effects: {
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {};

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select((state: any) => state.user.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select((state: any) => state.user.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(userService.query, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put }) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新建用户',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑用户',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: { record_id: payload.id },
          }),
        ];
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(userService.get, payload);
      yield put({
        type: 'saveFormData',
        payload: response,
      });
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select((state: any) => state.user.formType);
      let response;
      if (formType === 'E') {
        params.record_id = yield select((state: any) => state.user.formID);
        response = yield call(userService.update, params);
      } else {
        response = yield call(userService.create, params);
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });
        yield put({
          type: 'fetch',
        });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(userService.del, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetch' });
      }
    },
    *changeStatus({ payload }, { call, put, select }) {
      let response;
      if (payload.status === 1) {
        response = yield call(userService.enable, payload);
      } else {
        response = yield call(userService.disable, payload);
      }

      if (response.status === 'OK') {
        let msg = '启用成功';
        if (payload.status === 2) {
          msg = '停用成功';
        }
        message.success(msg);
        const data = yield select((state: any) => state.user.data);
        const newData = { list: new Array(0), pagination: data.pagination };

        for (let i = 0; i < data.list.length; i += 1) {
          const item = data.list[i];
          if (item.record_id === payload.record_id) {
            item.status = payload.status;
          }

          newData.list.push(item);
        }

        yield put({
          type: 'saveData',
          payload: newData,
        });
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
  },
};

export default UserModel;
