'use strict'

const React  = require("react");
// const ReactDOM = require('react-dom');
const ps = require("./index.less");

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:"haha"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e){
        console.log(e);
        this.setState({
            value:e.target.value
        });
    }
    handleClick(e){
        console.log(e);
    }
    render(){
        return (<div className="search">
            <p>{this.state.value}</p>
            <input type="text" value={this.state.value} onChange = {this.handleChange} />
            <button onClick={this.handleClick}>确认</button>
        </div>)
    }
}

module.exports = <Search />;