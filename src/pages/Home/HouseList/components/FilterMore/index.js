import React, { Component } from 'react'

import FilterFooter from '../../../../../components/FilterFooter/index.js'

import styles from './index.module.css'
import { Spring, animated } from 'react-spring'
export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultData,
  }
  onTagClick(val) {
    // console.log(val)
    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]
    if (!selectedValues.includes(val)) {
      newSelectedValues.push(val)
    } else {
      const index = selectedValues.findIndex((item) => item === val)
      newSelectedValues.splice(index, 1)
    }
    // console.log(newSelectedValues)
    this.setState({
      selectedValues: newSelectedValues,
    })
  }
  // 清除tags
  onClean = () => {
    // console.log(111)
    this.setState({
      selectedValues: [],
    })
  }
  // 渲染标签
  renderFilters(data) {
    const { selectedValues } = this.state

    // 高亮类名： styles.tagActive
    return data.map((item) => {
      const isSelected = selectedValues.includes(item.value)
      return (
        <span
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          key={item.label}
          onClick={() => this.onTagClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }
  onSave = () => {
    const { selectedValues } = this.state
    const { onSave, type } = this.props
    onSave(type, selectedValues)
  }
  render() {
    const {
      onCancel,
      type,
      data: { roomType, oriented, floor, characteristic },
    } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
          {(props) => {
            // 说明遮罩层已经完成动画效果，隐藏了
            if (props.opacity === 0) {
              return null
            }

            return (
              <div className={styles.mask} onClick={() => onCancel(type)} />
            )
          }}
        </Spring>

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onClean}
          onOk={this.onSave}
        />
      </div>
    )
  }
}
