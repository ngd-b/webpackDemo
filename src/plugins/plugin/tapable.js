/**
 * tapabel 练习使用
 */
const {
    SyncHook,
} = require("tapable");

// 声明同步钩子函数
// 指定参数，数组类型
let hook = new SyncHook(["name"]);

// 新增一个钩子事件
hook.tap("AddUser",name=>console.log(`接收到的名称参数：${name}`))
// 触发调用
hook.call("admin");