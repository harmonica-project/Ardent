import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './App.css';

import React, { Component, createContext } from 'react';
import NavbarComponent from './components/navbar/Navbar';
import Home from './components/home/Home';
import ArchitectureList from './components/architecture/ArchitectureList';
import ErrorPage from './components/error/ErrorPage';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Architecture from './components/architecture/Architecture';
import ArchitecturalComponent from './components/component/ArchitecturalComponent';

export const UserContext = createContext(0);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 0,
    };

    this.changeUser = id => {
      this.setState(state => ({
        user: id
      }));
    };
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        <div className="App">
          <NavbarComponent changeUser={this.changeUser}/>
          <Router>
              <Switch>
                <Route path={'/architecture/:aid/component/new'}>
                  <ArchitecturalComponent opType={"new"}/>
                </Route>
                <Route path={'/architecture/:aid/component/:cid/edit'}>
                  <ArchitecturalComponent opType={"edit"}/>
                </Route>
                <Route path={'/architecture/:aid/component/:cid'}>
                  <ArchitecturalComponent opType={"view"}/>
                </Route>
                <Route exact path={'/architecture/new'}>
                  <Architecture opType={"new"}/>
                </Route>
                <Route path={'/architecture/:aid/edit'}>
                  <Architecture opType={"edit"}/>
                </Route>
                <Route path={'/architecture/:aid'}>
                  <Architecture opType={"view"}/>
                </Route>
                <Route exact path='/architectures' component={ArchitectureList}/>
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
      </UserContext.Provider>
    );
  }
}

export default App;