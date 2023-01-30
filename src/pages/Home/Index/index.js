import React from 'react'
import axios from 'axios'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import './index.scss'
import Nav1 from '../../../assets/images/nav-1.png'
import Nav2 from '../../../assets/images/nav-2.png'
import Nav3 from '../../../assets/images/nav-3.png'
import Nav4 from '../../../assets/images/nav-4.png'

import SearchHeader from '../../../components/SearchHeader'
import { getCurrentCity } from '../../../utils'
import { BASE_URL } from '../../../utils/url.js'

const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list',
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list',
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map',
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent',
  },
]
// navigator.geolocation.getCurrentPosition((position) => {
//   console.log(position)
// })
export default class Index extends React.Component {
  state = {
    swipers: [],
    isSwiperLoaded: false,
    // imgHeight: 176,
    groups: [],
    // 最新资讯
    news: [],
    curCityName: '杭州',
  }
  async getSwipers() {
    const { data: res } = await axios.get('http://localhost:8080/home/swiper')
    // console.log(res)
    this.setState({
      swipers: res.body,
      isSwiperLoaded: true,
    })
  }
  async getGroups() {
    const { data: res } = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA|88cff55c-aaa4-e2e0',
      },
    })
    this.setState({
      groups: res.body,
    })
  }
  // 获取最新资讯
  async getNews() {
    const { data: res } = await axios.get(
      'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: res.body,
    })
  }

  async componentDidMount() {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   console.log(position)
    // })
    this.getSwipers()
    this.getGroups()
    this.getNews()

    const res = await getCurrentCity()
    // console.log(res)
    this.setState({
      curCityName: res.label,
    })
  }
  // 渲染轮播图
  renderSwipers() {
    return this.state.swipers.map((item) => (
      <a
        key={item.id}
        href="#!"
        style={{
          display: 'inline-block',
          width: '100%',
          height: this.state.imgHeight,
        }}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'))
            this.setState({ imgHeight: 'auto' })
          }}
        />
      </a>
    ))
  }
  // 渲染导航
  renderNavs() {
    return navs.map((item) => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt=""></img>
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
  render() {
    return (
      <div className="homeIndex">
        {/* 轮播图 */}
        <div className="swiper">
          {this.state.isSwiperLoaded ? (
            <Carousel autoplay infinite>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
          <SearchHeader curCityName={this.state.curCityName} />
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">{this.renderNavs()}</Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组<span className="more">更多</span>{' '}
          </h3>
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
