import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import { API } from '../../utils/api'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: '',
  //   password: '',
  // }
  // handleForm = (e) => {
  //   const { name, value } = e.target
  //   this.setState({
  //     [name]: value,
  //   })
  // }
  // handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const { username, password } = this.state

  //   const res = await API.post('/user/login', {
  //     username,
  //     password,
  //   })
  //   console.log(res)
  //   const { body, description, status } = res.data
  //   if (status === 200) {
  //     window.localStorage.setItem('hkzf_token', body.token)
  //     this.props.history.go(-1)
  //   } else {
  //     Toast.info(description, 2, null, false)
  //   }
  // }
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              ></Field>
              <ErrorMessage
                className={styles.error}
                name="username"
                component="div"
              />
            </div>

            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                placeholder="请输入密码"
                type="password"
              ></Field>
              <ErrorMessage
                className={styles.error}
                name="password"
                component="div"
              />
            </div>

            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
Login = withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }),

  // Custom sync validation
  // validate: (values) => {
  //   const errors = {}

  //   if (!values.name) {
  //     errors.name = 'Required'
  //   }

  //   return errors
  // },
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('账号为必填项')
      .matches(REG_UNAME, '长度5到8位，只能出现数字、字母、下划线'),
    password: Yup.string()
      .required('账号为必填项')
      .matches(REG_PWD, '长度5到8位，只能出现数字、字母、下划线'),
  }),
  handleSubmit: async (values, { props }) => {
    // e.preventDefault()
    const { username, password } = values
    const res = await API.post('/user/login', {
      username,
      password,
    })
    // console.log(res)
    const { body, description, status } = res.data
    if (status === 200) {
      window.localStorage.setItem('hkzf_token', body.token)
      const {
        location: { state },
      } = props
      // console.log(props)
      if (!state) {
        props.history.go(-1)
      } else {
        props.history.replace(state.from.pathname)
      }
    } else {
      Toast.info(description, 2, null, false)
    }
  },
  // displayName: 'BasicForm',
})(Login)
export default Login
