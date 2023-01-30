import React, { useState, useEffect } from 'react'
import { Flex, WingBlank } from 'antd-mobile'
import { API } from '../../../utils'
import { BASE_URL } from '../../../utils/url'
// import MyNavBar from "../../components/MyNavBar";
import { getCity } from '../../../utils/city'
import './index.css'

export default function News(props) {
  const [news, setnews] = useState([])
  const [cityId, setcityId] = useState('')
  // 获取资讯数据
  useEffect(() => {
    const getCurCity = async () => {
      const { value } = await getCity()
      setcityId(value)
    }

    const getNews = async () => {
      const res = await API.get('/home/news', {
        params: {
          area: cityId,
        },
      })
      setnews(res.data.body)
    }
    getCurCity()
    getNews()
  }, [cityId])

  // 渲染最新资讯
  const renderNews = () => {
    return news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={BASE_URL + item.imgSrc} alt="" />
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

  return (
    <div className="root">
      {/* <MyNavBar onLeftClick={() => props.history.goBack()}>最新资讯</MyNavBar> */}
      <div className="news">
        <WingBlank size="md">{renderNews()}</WingBlank>
      </div>
    </div>
  )
}
