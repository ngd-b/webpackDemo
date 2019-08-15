'use strict'

const React  = require("react");
// const ReactDOM = require('react-dom');

class Search extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:"haha"
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(val){
        
    }
    handleClick(val){
        console.log(val);
        this.setState({
            value:val
        });
    }
    render(){
        return (<div className="">
            <p>{this.state.value}</p>
            <input type="text" />
            <button onClick={this.handleClick}>确认</button>
        </div>)
    }
}

module.exports = <Search />;