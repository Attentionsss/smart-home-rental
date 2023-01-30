import React from 'react'
import './index.css'
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'

// import API from 'API'
import { API } from '../../utils/api.js'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { BASE_URL } from '../../utils/url.js'
import HouseItem from '../../components/HouseItem'

const labelStyle = {
  // 设置label的样式
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center',
}
const BMapGL = window.BMapGL

export default class Map extends React.Component {
  state = {
    housesList: [],
    isShowlist: false,
  }
  // 初始化地图
  initMap() {
    const { label, value } = JSON.parse(
      window.localStorage.getItem('hkzf_city')
    )
    const map = new BMapGL.Map('container')
    this.map = map
    // const point = new BMapGL.Point(116.404, 39.915)

    // map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom(true)
    // map.setMapType(BMAP_EARTH_MAP)

    //创建地址解析器实例
    const myGeo = new BMapGL.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      async (point) => {
        if (point) {
          // 初始化地图
          map.centerAndZoom(point, 11)
          // 添加控件
          map.addControl(new BMapGL.ScaleControl())
          map.addControl(new BMapGL.ZoomControl())

          this.renderOverlsys(value)
        } else {
          alert('您选择的地址没有解析到结果！')
        }
      },
      label
    )
    map.addEventListener('movestart', () => {
      if (this.state.isShowlist)
        this.setState({
          isShowlist: false,
        })
    })
  }
  // 渲染覆盖物
  async renderOverlsys(id) {
    try {
      Toast.loading('加载中...', 0, null, false)
      const { data: res } = await API.get(`/area/map?id=${id}`)
      const { nextZoom, type } = this.getTypeAndZoom()
      Toast.hide()

      // console.log(nextZoom, type)
      res.body.forEach((item) => {
        this.createOverlays(item, nextZoom, type)
      })
    } catch (e) {
      Toast.hide()
    }
  }
  // 创建覆盖物
  createOverlays(data, zoom, type) {
    // console.log(item)
    const {
      coord: { latitude, longitude },
      label: areaName,
      count,
      value: areaValue,
    } = data
    const areaPoint = new BMapGL.Point(longitude, latitude)

    if (type === 'circle') {
      this.createCircle(areaPoint, areaName, areaValue, count, zoom)
    } else {
      this.createRect(areaPoint, areaName, areaValue, count)
    }
  }
  createCircle(areaPoint, areaName, areaValue, count, zoom) {
    const label = new BMapGL.Label('', {
      // 创建文本标注
      position: areaPoint, // 设置标注的地理位置
      offset: new BMapGL.Size(-35, -35), // 设置标注的偏移量
    })

    label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${areaName}</p>
      <p>${count}</p>
    </div>
  `)
    label.setStyle(labelStyle)
    // 覆盖物样式
    label.id = areaValue
    label.addEventListener('click', () => {
      this.map.centerAndZoom(areaPoint, zoom)
      this.renderOverlsys(areaValue)
      this.map.clearOverlays()
    })
    this.map.addOverlay(label)
    // map.addOverlay(
    //   new window.BMapGL.Marker(point, { title: '北京市海淀区上地10街' })
    // )
  }
  createRect(areaPoint, areaName, areaValue, count) {
    const label = new BMapGL.Label('', {
      // 创建文本标注
      position: areaPoint, // 设置标注的地理位置
      offset: new BMapGL.Size(-50, -28), // 设置标注的偏移量
    })

    label.setContent(`
    <div class="${styles.rect}">
    <span class='${styles.housename}'>${areaName}</span>
    <span class='${styles.housenum}'>${count}套</span>
    <i class='${styles.arrow}'></i>
    </div>
  `)
    label.setStyle(labelStyle)
    // 覆盖物样式
    label.id = areaValue
    label.addEventListener('click', (e) => {
      this.getHousesList(areaValue)
      // this.map.centerAndZoom(areaPoint, 13)
      // this.map.clearOverlays()
      const { clientX, clientY } = e.domEvent.changedTouches[0]
      // console.log(clientX, clientY)
      this.map.panBy(
        window.innerWidth / 2 - clientX,
        (window.innerHeight - 330) / 2 - clientY
      )
    })
    this.map.addOverlay(label)
    // map.addOverlay(
    //   new window.BMapGL.Marker(point, { title: '北京市海淀区上地10街' })
    // )
  }
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let nextZoom, type
    // console.log(room)

    if (zoom > 10 && zoom < 12) {
      // 区
      nextZoom = 13
      type = 'circle'
    } else if (zoom > 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }
    return {
      nextZoom,
      type,
    }
  }
  async getHousesList(id) {
    try {
      Toast.loading('加载中...', 0, null, false)
      const { data: res } = await API.get(`/houses?cityId=${id}`)
      Toast.hide()

      this.setState({
        housesList: res.body.list,
        isShowlist: true,
      })
    } catch (e) {
      Toast.hide()
    }
  }
  // 渲染房屋列表
  renderHousesList = () => {
    return this.state.housesList.map((item) => (
      <HouseItem
        key={item.houseCode}
        houseImg={BASE_URL + item.houseImg}
        title={item.title}
        desc={item.desc}
        tags={item.tags}
        price={item.price}
      />
      // <div className={styles.house} key={item.houseCode}>
      //   <div className={styles.imgWrap}>
      //     <img className={styles.img} src={BASE_URL + item.houseImg} alt="" />
      //   </div>
      //   <div className={styles.content}>
      //     <h3 className={styles.title}>{item.title}</h3>
      //     <div className={styles.desc}>{item.desc}</div>
      //     <div>
      //       {item.tags.map((tag, index) => {
      //         const tagClass = 'tag' + (index + 1)
      //         return (
      //           <span
      //             className={[styles.tag, styles[tagClass]].join(' ')}
      //             key={tag}
      //           >
      //             {tag}
      //           </span>
      //         )
      //       })}
      //     </div>
      //     <div className={styles.price}>
      //       <span className={styles.priceNum}>{item.price}</span> 元/月
      //     </div>
      //   </div>
      // </div>
    ))
  }
  componentDidMount() {
    this.initMap()
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" className={styles.container}></div>

        {/* 房源列表 */}
        {/* 添加 styles.show 展示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowlist ? styles.show : '',
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
      </div>
    )
  }
}
