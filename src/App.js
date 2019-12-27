import React, { Component } from 'react';
import './App.scss';
import Markdown from 'react-markdown';
import axios from 'axios';
// import Prism from 'prismjs';

class App extends Component {
  // serverAddress = 'http://localhost:2323';
  serverAddress = 'https://raw.githubusercontent.com/thefallenmerc/tutorials-n-guides/master/static';
  name = 'Quick How-Tos';

  constructor() {
    super();
    this.state = {
      isLoading: false,
      mainContentHeading: '',
      source: 'Please select an option first!',
      sidebarCotent: 'Loading...'
    };

    // set sidemenu
    axios.get(this.serverAddress + '/content.json').then(response => {
      // console.log(response);
      if (Array.isArray(response.data)) {
        this.setState({
          sidebarCotent: this.makeMenu(response.data)
        });
      }
    });
  }
  render() {
    return (
      <div>
        <div className="sideBar">
    <div className="sideBarHeading">{this.name}</div>
          {this.state.sidebarCotent}</div>
        <div className="mainContent">
          <div className={this.state.mainContentHeading ? 'mainContentHeading' : ''}>
            {this.getName(this.state.mainContentHeading)}
          </div>
          <div className="mainContentContent">
            {
              this.state.isLoading ? 'Loading...' : <Markdown source={this.state.source} />
            }
          </div>
        </div>
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
        <button className={
          isFile ? 'sideBarFileLink' : ''
        }
          onClick={isFile ? () => { this.setMainContent(currentItem) } : () => { }}
        >{this.getName(currentItem.name)}</button>
        {isFile ? '' : this.makeMenu(currentItem.content)}
      </li>
    );

  }

  setMainContent(currentItem = '/') {
    const url = currentItem.path;
    this.setState({
      isLoading: true
    })
    // set main source
    axios.get(this.serverAddress + url).then(response => {
      this.setState({
        mainContentHeading: currentItem.name.replace(/\.md/, ''),
        source: response.data
      });
    }).catch(e => {
    }).finally(() => {
      this.setHighlightedState({ isLoading: false });
    })
  }

  getName(name = '') {
    return name.replace(/\.md/, '').replace(/_/g, ' ');
  }

  setHighlightedState(state) {
    this.setState(state);
    window.Prism.highlightAll();
  }

}

export default App;
