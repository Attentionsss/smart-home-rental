import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity, API } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value
  //定时器
  timer = null

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: [],
  }
  handleSearchTxt = (val) => {
    // const { searchTxt } = this.state
    // console.log(val)
    this.setState({
      searchTxt: val,
    })

    if (!val) {
      return this.setState({
        tipsList: [],
      })
    }

    clearTimeout(this.timer)
    this.timer = setTimeout(async () => {
      const { data: res } = await API.get('/area/community', {
        params: {
          name: val,
          id: this.cityId,
        },
      })
      console.log(res)
      this.setState({
        tipsList: res.body,
      })
    }, 500)
  }
  onTipClick(item) {
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community,
    })
    // console.log(item)
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map((item) => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => this.onTipClick(item)}
      >
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleSearchTxt}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
