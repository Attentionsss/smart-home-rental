import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'

import Home from './pages/Home'
import Map from './pages/map'
import CityList from './pages/CityList'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Rent from './pages/Rent'
import AuthRoute from './components/AuthRoute'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'
function App() {
  return (
    <Router>
      <div className="App">
        {/* <Link to="/home">首页</Link>
        <Link to="/citylist">城市</Link> */}
        <Route path="/home" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        <Route
          exact
          path="/"
          render={() => <Redirect to="/home"></Redirect>}
        ></Route>
        <Route path="/citylist" component={CityList}></Route>

        {/* houseDetail */}
        <Route path="/detail/:id" component={HouseDetail}></Route>

        <Route path="/login" component={Login}></Route>

        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </div>
    </Router>
  )
}

export default App
