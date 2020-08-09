/**
 * 自定义插件 
 */

function PJWebpacakPlugin(options){
    // 接收实例化时的参数 options
}
// 原型链上必须有apply函数
PJWebpacakPlugin.prototype.apply = function(compiler){
    // webpack编译运行时调用一次 apply 方法，
    
    compiler.plugin("entryOption",function(context,entry){
        // entry 配置项完成后，可访问entry配置

        console.log(entry);
    });

    compiler.plugin("afterPlugins",function(compiler){
        // 在初始化插件plugin之后，
        console.info(compiler.records);
    })  

    compiler.plugin("done",function(stats){
        // webpack 编译完成之后出发
        console.info(compiler);
    });
}

// 模块导出
module.exports = PJWebpacakPlugin;