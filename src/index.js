import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import 'moment/locale/zh-cn';

ReactDOM.render(
        <LocaleProvider locale={zhCN}>
            <App />
        </LocaleProvider>
    
, document.getElementById('root'));
