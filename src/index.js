import _ from "lodash";
import printMe from "./print.js";
import "./style.css";
// import Icon from "./001.png";
// import Data from "./data.xml"

function component() {
    var element = document.createElement('div');
    var btn = document.createElement("button");
  
    // Lodash
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add("hello");
    btn.innerHTML="click me to check out the console ";
    btn.onclick=printMe;
    element.appendChild(btn);
    

    // icon
    // var icon = new Image();
    // icon.src= Icon;
    // element.appendChild(icon);

    // console.log(Data);

    return element;
  }
  
  let element = component();
  document.body.appendChild(element);

  if(module.hot){
    module.hot.accept('./print.js',function(){
        console.log("accepting the updated pringMe module");
       // printMe();
       document.body.removeChild(element);
       element = component();
       document.body.appendChild(element);
    });
  }