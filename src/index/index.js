import _ from "lodash";
import {printMe} from "../print.js";
import "./index.css";
import "./index.less";
// import Icon from "./001.png";
// import Data from "./data.xml"

function component() {
    var parent = document.createElement("div");
    var element = document.createElement('div');
    var btn = document.createElement("button");
    var p_el = document.createElement('p');
  
    // Lodash
    p_el.innerHTML = _.join(['Hello', 'webpack','we will get hte more info and practice demo'], ' ');
    element.classList.add("hello");
    parent.appendChild(p_el);
    btn.innerHTML="click me to check out the console & will print something  ";
    btn.onclick=printMe;
    element.appendChild(btn);
    parent.appendChild(element);

    // icon
    // var icon = new Image();
    // icon.src= Icon;
    // element.appendChild(icon);

    // console.log(Data);

    return parent;
  }
  
  let element = component();
  document.body.appendChild(element);

  if(module.hot){
    module.hot.accept('../print.js',function(){
        console.log("accepting the updated pringMe module");
       // printMe();
       document.body.removeChild(element);
       element = component();
       document.body.appendChild(element);
    });
  }