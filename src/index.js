import React from 'react'
import ReactDOM from 'react-dom'
// 导入antd-mobile的样式：
import 'antd-mobile/dist/antd-mobile.css'

// 导入字体图标库的样式文件
import './assets/fonts/iconfont.css'

// 导入 react-virtualized 组件的样式
import 'react-virtualized/styles.css'

import './utils/url'
// 注意：应该将 组件 的导入放在样式导入后面，从而避免样式覆盖的问题
import App from './App'
import './index.css'
ReactDOM.render(<App />, document.getElementById('root'))
