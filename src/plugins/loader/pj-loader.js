/**
 * 自定义实现一个loader解析
 */
const {getOptions} = require('loader-utils');

module.exports =  function(content,map,meta){
    
    let options = getOptions(this);
    /**
     * 同步调用
     * 1. 调用this.callback() 是，必须返回 undefined
     * 2. 直接返回执行结果 return someSyncOperation(content)
     */
    // this.callback(null,someSyncOperation(content),map,meta)
    // return;
    /**
     * 异步调用
     * 1. this.async() 获取异步调用的回调函数
     */
    // let callback = this.async();
    // someAsyncOperation(content,function(err,result){
    //     if (err) return callback(err)

    //     callback(null,result,map,meta)
    // })
    content = content.replace(/\{name\}/g,options.name);

    return `export default ${JSON.stringify(content)}`;
}