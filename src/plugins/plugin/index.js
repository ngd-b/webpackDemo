/**
 * 自定义插件 
 */

function PJWebpacakPlugin(options){
    // 接收实例化时的参数 options
}
// 原型链上必须有apply函数
PJWebpacakPlugin.prototype.apply = function(compiler){
    // webpack编译运行时调用 apply 方法，
    
}

// 模块导出
module.exports = PJWebpacakPlugin;