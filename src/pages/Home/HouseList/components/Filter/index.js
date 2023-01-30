import React, { Component } from 'react'
import { API } from '../../../../../utils/api'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import { Spring, animated } from 'react-spring'
// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}
//选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: [],
}
const OPEN_TYPES = ['area', 'mode', 'price']
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filtersData: {},
    selectedValues,
  }
  async getFiltersdata() {
    const { value } = JSON.parse(window.localStorage.getItem('hkzf_city'))
    const { data: res } = await API(`/houses/condition?id=${value}`)
    // console.log(res)
    this.setState({
      filtersData: res.body,
    })
  }
  componentDidMount() {
    this.htmlbody = document.body
    this.getFiltersdata()
  }
  renderFilterPicker() {
    const {
      openType,
      selectedValues,
      filtersData: { area, subway, rentType, price },
    } = this.state
    if (!OPEN_TYPES.includes(openType)) return null

    let data = []
    let cols = 3
    // let defaultValue
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        // defaultValue=selectedValues[openType]
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={selectedValues[openType]}
      />
    )
  }
  renderFilterMore() {
    const {
      openType,
      selectedValues: { more },
      filtersData: { roomType, oriented, floor, characteristic },
    } = this.state
    if (openType !== 'more') return null
    const data = {
      roomType,
      oriented,
      floor,
      characteristic,
    }
    return (
      <FilterMore
        onCancel={this.onCancel}
        data={data}
        type={openType}
        onSave={this.onSave}
        defaultData={more}
      />
    )
  }
  // 点击标题菜单实现高亮
  // 注意：this指向的问题！！！
  // 说明：要实现完整的功能，需要后续的组件配合完成！
  onTitleClick = (type) => {
    this.htmlbody.className = 'body-fixed'
    // console.log(type)
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach((key) => {
      if (key === type) {
        // console.log(key, type)
        newTitleSelectedStatus[type] = true
        return
      }
      const selectedValue = selectedValues[key]

      if (
        key === 'area' &&
        (selectedValue.length !== 2 || selectedValue[0] !== 'area')
      ) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedValue[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedValue[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedValue.length !== 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus,
    })
  }
  // 关闭对话框
  onCancel = (type) => {
    // console.log(type)
    this.htmlbody.className = ''
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedValue = selectedValues[type]

    if (
      type === 'area' &&
      (selectedValue.length !== 2 || selectedValue[0] !== 'area')
    ) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedValue[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedValue[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedValue.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus,
    })
  }
  // 确认
  onSave = (type, value) => {
    this.htmlbody.className = ''
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedValue = value

    if (
      type === 'area' &&
      (selectedValue.length !== 2 || selectedValue[0] !== 'area')
    ) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedValue[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedValue[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedValue.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    const newSelectedValue = {
      ...this.state.selectedValues,
      [type]: value,
    }
    const filters = {}
    const { area, mode, price, more } = newSelectedValue
    const areaKey = area[0]
    let areaValue = null
    if (area.length === 2) areaValue = area[1]
    else if (area.length === 3) {
      area[2] !== 'null' ? (areaValue = area[2]) : (areaValue = area[1])
    }
    filters[areaKey] = areaValue
    filters.mode = mode[0]
    filters.price = price[0]
    filters.more = more.join(',')
    // console.log(filters)
    this.props.onFilters(filters)
    this.setState({
      openType: '',
      selectedValues: newSelectedValue,
      titleSelectedStatus: newTitleSelectedStatus,
    })
  }
  render() {
    const { titleSelectedStatus, openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {OPEN_TYPES.includes(openType) ? (
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
            {(props) => (
              <div
                style={props}
                className={styles.mask}
                onClick={() => this.onCancel(openType)}
              />
            )}
          </Spring>
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />
          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}
          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}{' '}
        </div>
      </div>
    )
  }
}
