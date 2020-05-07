import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from 'react-router-dom';
import {Provider} from 'react-redux';

import {store, persistor} from './store';
import App from './router/App';
import '../../style/index.scss';
import "lib-flexible"
/*import moment from 'moment';
import 'moment/locale/zh-cn';*/
import '../../utils/setRem'
// 对fetch做兼容
import 'whatwg-fetch';
import 'es6-promise';
import '../../utils/HBMBBridge'
import {PersistGate} from 'redux-persist/lib/integration/react';

/*moment.locale('en');*/
const Root: React.FC = () => (
    <Provider store={store}>
        {/*loading 和 persistor是2个必需属性*/}
        {/*loading={null} || loading={<LoadingView />} LoadingView为React组件*/}
        {/*最好将loading={null}，写成loading={<LoadingView />} 报错，原因暂不明*/}
        <PersistGate loading={null} persistor={persistor}>
            <Router>
                {/* 新版的antd用ConfigProvider配合moment使用国际化定义 */}
                <App/>
            </Router>
        </PersistGate>
    </Provider>
);
ReactDOM.render(<Root/>, document.getElementById('root') as HTMLElement);
