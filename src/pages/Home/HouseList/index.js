import { Flex, Toast } from 'antd-mobile'
import React from 'react'

import Filter from './components/Filter'
import SearchHeader from '../../../components/SearchHeader'
import HouseItem from '../../../components/HouseItem'
import Sticky from '../../../components/Sticky'
import NoHouse from '../../../components/NoHouse'
import styles from './index.module.css'
import { API } from '../../../utils/api'
import { BASE_URL } from '../../../utils/url'
import { getCurrentCity } from '../../../utils'
import {
  List,
  WindowScroller,
  AutoSizer,
  InfiniteLoader,
} from 'react-virtualized'

export default class HouseList extends React.Component {
  state = {
    count: 0,
    list: [],
    isloading: true,
  }
  label = ''
  value = ''

  // 初始化数据
  filters = {}
  onFilters = (val) => {
    window.scrollTo(0, 0)
    // console.log(val)
    this.filters = val
    this.getHouseLust()
  }
  // 获取房屋数据
  async getHouseLust() {
    this.setState({
      isloading: true,
    })
    Toast.loading('加载中...', 0, null, false)
    const { data: res } = await API.get('/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20,
      },
    })

    Toast.hide()

    const { count, list } = res.body
    if (count > 0) Toast.info(`共找到${count}套房源`, 2, null, false)
    this.setState({
      count,
      list,
      isloading: false,
    })
    // console.log(res)
  }

  // 渲染房屋列表
  renderHousesList = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]
    // console.log(item)
    if (!item) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        style={style}
        houseImg={BASE_URL + item.houseImg}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
        onClick={() => this.props.history.push(`/detail/${item.houseCode}`)}
      />
    )
  }
  isRowLoaded = ({ index }) => {
    const { list } = this.state
    return !!list[index]
  }
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise((reslove) => {
      // console.log(startIndex, stopIndex)
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex,
        },
      }).then((res) => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list],
        })
        reslove()
      })
    })
  }
  renderList = () => {
    const { count, isloading } = this.state
    if (count === 0 && !isloading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    autoHeight //设置高度 windowscroll 最终渲染的高度
                    width={width} //视口的宽度
                    height={height} //视口的宽度
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.renderHousesList}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value

    this.getHouseLust()
  }
  render() {
    return (
      <div style={{ scrollBehavior: 'smooth' }}>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            style={{ zIndex: 100 }}
            onClick={() => this.props.history.go(-1)}
          ></i>
          <SearchHeader
            curCityName={this.label}
            className={styles.searchHeader}
          />
        </Flex>

        {/* 条件筛选栏 */}
        <Sticky height={40}>
          <Filter onFilters={this.onFilters} />
        </Sticky>

        {this.renderList()}
      </div>
    )
  }
}
