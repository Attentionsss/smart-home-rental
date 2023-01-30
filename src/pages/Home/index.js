import React from 'react'
import { Route } from 'react-router-dom'

import { TabBar } from 'antd-mobile'

import Index from './Index/index'
import News from './News'
import HouseList from './HouseList'
import Profile from './Profile'
import './index.css'
const tabItems = [
  {
    title: '首页',
    path: '/home',
    icon: 'icon-ind',
  },
  {
    title: '资讯',
    path: '/home/news',
    icon: 'icon-infom',
  },
  {
    title: '找房',
    path: '/home/list',
    icon: 'icon-findHouse',
  },
  {
    title: '我的',
    path: '/home/profile',
    icon: 'icon-my',
  },
]
export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname)
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    // console.log(1111)
  }
  // 渲染TabBarItem
  rederTabBarItem() {
    return tabItems.map((item) => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`}></i>}
        selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          })
          this.props.history.push(item.path)
        }}
      ></TabBar.Item>
    ))
  }
  render() {
    return (
      <div className="home">
        {/* 二级路由 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/news" component={News} />
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* tabBar组件 */}
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent={true}>
          {this.rederTabBarItem()}
        </TabBar>
      </div>
    )
  }
}
