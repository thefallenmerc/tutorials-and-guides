import Markdown from 'react-markdown';
import React from 'react';
import axios from 'axios';
import config from '../config/app';
import './MarkdownView.scss';

export default class MarkdownView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            mainContentHeading: 'Please wait ...',
            source: '# Loading please wait...'
        }
    }

    componentDidMount() {
        this.setMainContent(this.props.url);
    }

    render() {
        return (
            <div>
                <div className={this.state.mainContentHeading ? 'mainContentHeading' : ''}>
                    {this.getName(this.state.mainContentHeading)}
                </div>
                <div className="mainContentContent">
                    {
                        this.state.isLoading ? 'Loading...' : <Markdown source={this.state.source} />
                    }
                </div>
            </div>
        );
    }

    setMainContent(url = '') {
        url = this.getFileNameFromRoute(url);
        this.setState({
            isLoading: true
        })
        // set main source
        axios.get(config.serverAddress + url).then(response => {
            this.setState({
                mainContentHeading: url.split('/').pop().replace(/\.md/, ''),
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

    getFileNameFromRoute(route = '') {
        const name = '/src' + route + '.md';
        return name;
    }

    setHighlightedState(state) {
        this.setState(state);
        window.Prism.highlightAll();
    }

}