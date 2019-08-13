

import _ from "lodash";
import {printMe} from "../print.js";
import "./index.less";

function component(){
    var div = document.createElement("div");
    var input = document.createElement("input");
    input.placeholder = "请输入查询条件";
    div.classList.add("search");

    div.innerHTML = _.join(["公共页面","组件提取"],"");
    div.appendChild(input);

    return div;
}

document.body.appendChild(component());