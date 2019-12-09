import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card } from 'antd';
import {AnyAction, Dispatch} from "redux";

const namespace = "demo";

interface DemoProps {
  initData: Function;
}

@connect((state: any) => {
  // 数据绑定到 this.props
  return {
    data: state[namespace]
  };
},(dispatch:Dispatch<AnyAction>) => {
  // 函数绑定到 this.props
  return {
    initData: () => {
       dispatch({
        type: namespace + "/initData"
      });
    }
  };
})
class Index extends Component<DemoProps> {

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <PageHeaderWrapper>
        <Card>
          hello world
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
