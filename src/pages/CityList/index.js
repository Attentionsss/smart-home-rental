import React from 'react'
import axios from 'axios'
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'

import { AutoSizer, List } from 'react-virtualized'
import { getCurrentCity } from '../../utils'
import NavHeader from '../../components/NavHeader'
// 数据格式化
const formatCitylist = (list) => {
  const cityList = {}
  list.forEach((item) => {
    let str = item.pinyin.substr(0, 1)
    // console.log(str)
    if (cityList[str]) {
      cityList[str].push(item)
    } else {
      cityList[str] = [item]
    }
  })

  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex,
  }
  // console.log(cityIndex)
}
// 格式化cityIndex
const formatCityIndex = (s) => {
  switch (s) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return s.toUpperCase()
  }
}
const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']
export default class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
    }
    this.cityListComponent = React.createRef()
  }

  async componentDidMount() {
    await this.getCitylist()
    this.cityListComponent.current.measureAllRows()
  }
  // 获取城市列表数据的方法
  async getCitylist() {
    const { data: res } = await axios.get(
      'http://localhost:8080/area/city?level=1'
    )

    const { cityList, cityIndex } = formatCitylist(res.body)

    const { data: hot } = await axios.get('http://localhost:8080/area/hot')
    cityList['hot'] = hot.body
    cityIndex.unshift('hot')

    const curCity = await getCurrentCity()
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    // console.log(cityList)
    this.setState({
      cityList,
      cityIndex,
    })
  }
  changeCity({ label, value }) {
    if (HOUSE_CITY.indexOf(label) !== -1) {
      // console.log(label)
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源信息', 1, null, false)
    }
  }
  // List组件渲染每一行的方法：
  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]

    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {cityList[letter].map((item) => (
          <div
            className="name"
            key={item.value}
            onClick={() => this.changeCity(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  // 创建动态计算每一行高度的方法
  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    // console.log(cityList)
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }
  // 封装渲染右侧索引列表的方法
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => (
      <li
        className="city-index-item"
        key={item}
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index)
          // this.setState({ activeIndex: index })
        }}
      >
        <span className={activeIndex === index ? 'index-active' : ''}>
          {item === 'hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }
  // 用于获取List组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    const { activeIndex } = this.state
    // console.log(startIndex)
    if (startIndex !== activeIndex)
      this.setState({
        activeIndex: startIndex,
      })
  }

  render() {
    return (
      <div className="citylist">
        {/* 顶部导航栏 */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        {/* 城市索引 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}
