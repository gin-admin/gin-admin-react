import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Typography, Card, Alert } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Home.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

@connect(state => ({
  global: state.global,
}))
class Home extends PureComponent {
  state = {
    currentTime: moment().format('HH:mm:ss'),
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ currentTime: moment().format('HH:mm:ss') });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getHeaderContent = () => {
    const {
      global: { user },
    } = this.props;

    const { role_names: roleNames } = user;

    const text = [];
    if (roleNames && roleNames.length > 0) {
      text.push(
        <span key="role" style={{ marginRight: 20 }}>{`所属角色：${roleNames.join('/')}`}</span>
      );
    }

    if (text.length > 0) {
      return text;
    }
    return null;
  };

  render() {
    const {
      global: { user },
    } = this.props;

    const { currentTime } = this.state;

    const breadcrumbList = [{ title: '首页' }];

    return (
      <PageHeaderLayout
        title={`您好，${user.real_name}，祝您开心每一天！`}
        breadcrumbList={breadcrumbList}
        content={this.getHeaderContent()}
        action={<span>当前时间：{currentTime}</span>}
      >
        <Card>
          <Alert
            message="gin-admin 6.0.0 现已发布，欢迎使用下载启动体验。"
            type="success"
            showIcon
            banner
            style={{
              margin: -12,
              marginBottom: 24,
            }}
          />
          <Typography.Text strong>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/LyricTian/gin-admin"
            >
              1. 下载并启动服务
            </a>
          </Typography.Text>
          <CodePreview>go get -v github.com/LyricTian/gin-admin/cmd/gin-admin</CodePreview>
          <CodePreview>cd $GOPATH/src/github.com/LyricTian/gin-admin</CodePreview>
          <CodePreview>
            go run cmd/gin-admin/main.go web -c ./configs/config.toml -m ./configs/model.conf --menu
            ./configs/menu.yaml
          </CodePreview>
          <CodePreview>
            启动成功之后，可在浏览器中输入地址进行访问：http://127.0.0.1:10088/swagger/index.html
          </CodePreview>
          <Typography.Text
            strong
            style={{
              marginBottom: 12,
            }}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/LyricTian/gin-admin-react"
            >
              2. 下载并运行 gin-admin-react
            </a>
          </Typography.Text>
          <CodePreview>git clone https://github.com/LyricTian/gin-admin-react.git</CodePreview>
          <CodePreview>cd gin-admin-react</CodePreview>
          <CodePreview>yarn</CodePreview>
          <CodePreview>yarn start</CodePreview>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Home;
