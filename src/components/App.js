import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import User from './User';
import { ProtectedRoute } from '../gurds/ProtectedRoute'
import { LoginRoute } from '../gurds/LoginRoute'

class App extends Component {

  render() {
    return (
      <div>
      <Router>
      <Switch>
          <LoginRoute exact path='/login' component={Login}></LoginRoute>
          <Route exact path='/signup' component={Signup}></Route>
          <ProtectedRoute exact path='/home' component={Home}></ProtectedRoute>
          <ProtectedRoute exact path='/user' component={User}></ProtectedRoute>
          <Route path='*' exact={true} render={() => <Redirect to="/login" />}></Route>
      </Switch>
    </Router>
      </div>
      
    );
  }
}

export default App;
