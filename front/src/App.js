import './assets/css/bootstrap.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './App.css';

import React, { Component, createContext } from 'react';
import NavbarComponent from './components/navbar/Navbar';
import Home from './components/home/Home';
import ArchitectureList from './components/architecture/ArchitectureList';
import ErrorPage from './components/error/ErrorPage';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Architecture from './components/architecture/Architecture';
import ArchitecturalComponent from './components/component/ArchitecturalComponent';
import Login from './components/login/Login';

export const UserContext = createContext(0);

const ProtectedRoute = ({ component: Comp, path, ...rest }) => {
  var currentUser = localStorage.getItem('currentUser');

  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        return currentUser ? <Comp {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
          <NavbarComponent changeUser={this.changeUser}/>
          <Router>
              <Switch>
                <ProtectedRoute path={'/architecture/:aid/component/new'}>
                  <ArchitecturalComponent opType={"new"}/>
                </ProtectedRoute>
                <ProtectedRoute path={'/architecture/:aid/component/:cid/edit'}>
                  <ArchitecturalComponent opType={"edit"}/>
                </ProtectedRoute>
                <ProtectedRoute path={'/architecture/:aid/component/:cid'}>
                  <ArchitecturalComponent opType={"view"}/>
                </ProtectedRoute>
                <ProtectedRoute exact path={'/architecture/new'}>
                  <Architecture opType={"new"}/>
                </ProtectedRoute>
                <ProtectedRoute path={'/architecture/:aid/edit'}>
                  <Architecture opType={"edit"}/>
                </ProtectedRoute>
                <ProtectedRoute path={'/architecture/:aid'}>
                  <Architecture opType={"view"}/>
                </ProtectedRoute>
                <ProtectedRoute exact path='/architectures' component={ArchitectureList}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/' component={Home}/>
                <Route 
                  default 
                  render={
                    () => <ErrorPage 
                            errorCode={404} 
                            errorMsgShort={"Page not found"} 
                            errorMsgLong={"This page does not exists. Please return to the previous page or the menu."} 
                          />
                  }/>
              </Switch>
            </Router>
        </div>
    );
  }
}

export default App;
