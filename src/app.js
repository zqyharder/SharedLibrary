import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import Index from './pages/index'

import 'taro-ui/dist/style/index.scss' 

// import booksStore from './store/books'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

wx.cloud.init({
  //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
  env: 'zqy-z4rcl',
  traceUser: true,
})

//入口文件
// const store = {
//   booksStore
// }

class App extends Component {
//json配置
  config = {
    pages: [
      'pages/index/index',
      'pages/me/me',
      'pages/detail/detail',
      'pages/home/home',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    },
    "tabBar":{
      "selectedColor":"#EA5149",
      "list":[
        {
          "pagePath":"pages/index/index",
          "text":"首页",
          "iconPath":"img/book.png",
          "selectedIconPath":"img/book-active.png"
        },
        {
          "pagePath":"pages/me/me",
          "text":"我",
          "iconPath":"img/me.png",
          "selectedIconPath":"img/me-active.png"
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      // 把store传递在整个应用最外层
      <Provider>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
