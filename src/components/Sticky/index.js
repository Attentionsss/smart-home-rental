import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.css'

class Sticky extends React.Component {
  placeholder = createRef()
  content = createRef()
  handleScroll = () => {
    const { height } = this.props
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current
    const { top } = placeholderEl.getBoundingClientRect()
    // console.log(top)
    if (top < 0) {
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = `${height}px`
    } else {
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = ''
    }
  }
  componentDidMount() {
    // console.log(this.props.children)
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  render() {
    return (
      <div>
        {/* 占位符 */}
        <div ref={this.placeholder}></div>
        {/* 内容区域 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}
export default Sticky
Sticky.propTypes = {
  height: PropTypes.number.isRequired,
}
