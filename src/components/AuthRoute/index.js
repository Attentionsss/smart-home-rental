import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils'

const AuthRoute = ({ component: Component, ...rest }) => {
  console.log(rest)
  return (
    <Route
      {...rest}
      render={(props) => {
        const isLogin = isAuth()
        if (isLogin) {
          return <Component {...props}></Component>
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            ></Redirect>
          )
        }
      }}
    ></Route>
  )
}
export default AuthRoute
