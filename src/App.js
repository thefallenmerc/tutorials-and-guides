import React, { Component } from 'react';
import './App.scss';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import MarkdownView from './components/MarkdownView';
import config from './config/app';
// import Prism from 'prismjs';

class App extends Component {

  routesList = [];

  constructor() {
    super();
    this.state = {
      isLoading: false,
      mainContentHeading: '',
      source: 'Please select an option first!',
      sidebarContent: 'Loading...',
      routesList: []
    };

    // set sidemenu
    axios.get(config.serverAddress + '/content.json').then(response => {
      // console.log(response);
      if (Array.isArray(response.data)) {
        this.setState({
          sidebarContent: this.makeMenu(response.data)
        });
        this.getRouteList(response.data);
        this.setState({
          routesList: this.routesList
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Router>
          <div className="sideBar">
            <div className="sideBarHeading">{config.name}</div>
            <div className="sideBarContent">
              {this.state.sidebarContent}
            </div>
          </div>
          <div className="mainContent">
            <div className="">
              {this.renderRoutes()}
            </div>
          </div>
        </Router>
      </div>
    );
  }

  makeMenu(listOfItems = [], depth = '0') {
    const list = [];
    for (const index in listOfItems) {
      const currentItem = listOfItems[index];
      list.push(this.makeMenuItem(currentItem, index));
    }
    return (
      <ul>
        {list}
      </ul>
    );
  }

  /**
   * Creates a menu li for object
   * @param {object} currentItem 
   * @param {number} index 
   */
  makeMenuItem(currentItem, index = 0) {
    const isFile = currentItem.type === 'file';
    return (
      <li key={0 + '' + index}>
        {
          isFile
            ?
            <Link to={this.getRouteFromFileName(currentItem.path)}>{this.getName(currentItem.name)}</Link>
            :
            <button>{this.getName(currentItem.name)}</button>
        }
        {isFile ? '' : this.makeMenu(currentItem.content)}
      </li>
    );
  }

  getName(name = '') {
    return name.replace(/\.md/, '').replace(/_/g, ' ');
  }

  getRouteFromFileName(name = '') {
    const nameArray = name.split('/').filter(e => e);
    // remove src from array
    nameArray.splice(nameArray.findIndex(e => e === 'src'), 1);
    //  remove md from array
    nameArray.push(nameArray.pop().replace('.md', ''));
    return '/' + nameArray.join('/');
  }

  getRouteList(listOfItems = []) {
    for (const item of listOfItems) {
      if (item.type === 'directory') {
        this.getRouteList(item.content);
      } else {
        const routeForFile = this.getRouteFromFileName(item.path);
        this.routesList.push(routeForFile);
      }
    }
  }

  renderRoutes() {
    const routesList = [
      <Route key="/" exact path="/">
        {/* {
                    withRouter(props => {
                      return (props)
                  } */}
        Please select an option
      </Route>
    ]
    for (const route of this.state.routesList) {
      routesList.push(
        <Route key={route} exact path={route}>
          <MarkdownView url={route}></MarkdownView>
        </Route>
      );
    }
    return (
      <Switch>
        {routesList}
      </Switch>
    );
  }

}

export default App;
