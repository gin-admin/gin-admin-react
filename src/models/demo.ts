import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryDemo } from '@/services/demo';

export interface DemoStateType {
  list?:Array<any>;
}

export interface DemoModeType {
  namespace: string;
  state:DemoStateType;
  effects: {
    initData: Effect;
  };
  reducers: {
    queryList: Reducer<DemoStateType>;
  };
}

const DemoMode:DemoModeType = {
  namespace: 'demo',
  state: {
   list:[]
  },
  effects: {
    *initData({ payload }, {call, put}) {
      let data = yield call(queryDemo);
      yield put({
        type: "queryList",
        data: data
      });
    }
  },

  reducers: {
    queryList(state, result) {
      let data = [...result.data];
      return {
        list: data
      };
    }
  }
};

export default DemoMode;

