import React from 'react'
import propTypes from 'prop-types'
import styles from './index.module.css'
export default function HouseList({
  houseImg,
  title,
  desc,
  tags,
  price,
  onClick,
  style,
}) {
  return (
    <div className={styles.house} onClick={onClick} style={style}>
      <div className={styles.imgWrap}>
        <img className={styles.img} src={houseImg} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {tags.map((tag, index) => {
            const tagClass = 'tag' + (index + 1)
            return (
              <span
                className={[styles.tag, styles[tagClass]].join(' ')}
                key={tag}
              >
                {tag}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>
      </div>
    </div>
  )
}
HouseList.propTypes = {
  houseImg: propTypes.string,
  title: propTypes.string,
  desc: propTypes.string,
  tags: propTypes.array.isRequired,
  price: propTypes.number,
  onClick: propTypes.func,
}
