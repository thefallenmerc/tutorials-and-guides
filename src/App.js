import React, { Component } from 'react';
import './App.scss';
import Markdown from 'react-markdown';
import axios from 'axios';
// import Prism from 'prismjs';

class App extends Component {
  serverAddress = 'https://raw.githubusercontent.com/thefallenmerc/tutorials-n-guides/master/static';
  name = 'TUTS';

  constructor() {
    super();
    this.state = {
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
          <div className="sideBarHeading">MENU</div>
          {this.state.sidebarCotent}</div>
        <div className="mainContent">
          <div className={this.state.mainContentHeading ? 'mainContentHeading' : ''}>
            {this.getName(this.state.mainContentHeading)}
          </div>
          <div className="mainContentContent">
            <Markdown source={this.state.source} /></div>
        </div>
      </div>
    );
  }

  makeMenu(listOfItems = [], depth = '0') {
    const list = [];
    for (const index in listOfItems) {
      const currentItem = listOfItems[index];
      if (currentItem.type === 'directory') {
        list.push((
          <li key={0 + '' + index}>
            <button>{this.getName(currentItem.name)}</button>
            {this.makeMenu(currentItem.content)}
          </li>
        ));
      } else {
        list.push((
          <li key={0 + '' + index}>
            <button onClick={() => { this.setMainContent(currentItem) }}>{this.getName(currentItem.name)}</button>
          </li>
        ))
      }
    }
    return (
      <ul>
        {list}
      </ul>
    );
  }

  setMainContent(currentItem = '/') {
    const url = currentItem.path;
    console.log('currentItem', currentItem);
    // set main source
    axios.get(this.serverAddress + url).then(response => {
      this.setState({
        mainContentHeading: currentItem.name.replace(/\.md/, ''),
        source: response.data
      });
      window.Prism.highlightAll();
    }).catch(e => {
      console.log('something went wrong', e);
    })
  }

  getName(name = '') {
    return name.replace(/\.md/, '').replace(/_/g, ' ');
  }

}

export default App;
