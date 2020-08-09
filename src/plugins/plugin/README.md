> 自定义webpack 插件及相关API释义

### `plugin` 介绍

&emsp;&emsp;插件可以在项目构建的过程中，额外处理一些工作；不同于`loader`的是，它可以针对整个webpack编译流程中的所有文件。

插件定义：

* 导出为一个函数模块，其原型链上定义一个`apply`方法。接收一个`compiler`参数。
* 通过`compiler`的`plugin`方法监听各个阶段的事件，回调获取到这个时间段的`compilation`对象实例，从而处理当前特定的数据。
* 如果是异步处理时，则需要在处理完之后调用提供的回调函数`callback`

#### `Tapable`

webpack的核心工具，用于提供插件接口。`compiler`扩展与此。

暴露了三个方法`tap`、`tapAsync`、`tapPromise`。

* `tap` 触发绑定同步的钩子事件。
* `tapSync/tapPromise` 触发处理异步的钩子事件。

还可以通过`tapable`提供的钩子类给插件添加一个新的钩子。然后在你需要的时候调用。

[`tabable 项目地址`](https://github.com/webpack/tapable)

在`webpack`中的所用，`compiler`、`compilation`继承并扩展`tapable`。

#### 可供使用的钩子

`sync` 同步；`async`异步；

|钩子类型|释义||
|----|---|----|
|SyncHook|触发所有函数，同步调用||
|SyncBailHook|只要存在函数执行结果返回，则不会调用其他函数||
|SyncWaterfallHook|连续调用执行，之前的函数结果作为下一次函数的参数||
|SyncLoopHook|||
|AsyncParallelHook|触发所有函数，异步执行，并行调用||
|AsyncParallelBailHook|||
|AsyncSeriesHook|触发所有函数，异步执行，连续调用||
|AsyncSeriesBailHook|||
|AsyncSeriesWaterfallHook|||

```js
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
```

#### `compiler`

&emsp;&emsp;在webpack启动后，`compiler`对象包含webpack所有可操作的配置，包括：options、loader、plugin。插件在实例化调用时，接收`compiler`作为参数。

`compiler`提供关键时间段的事件监听。

&emsp;&emsp;当webpack 初次启动时，`compiler`执行一次`new MyPlugin()` 调用`apply`方法，将其中通过`compiler`绑定的事件回调加入钩子函数的依赖数组中。如果重新编译则触发钩子事件，从而执行回调函数。


##### 触发调用的钩子事件

通过`compiler.hooks.somehook.tap()`触发钩子事件。

|钩子名称|释义|所属钩子类型|
|------|-----|-----|
|entryOption|`entry`配置项处理过后|SyncBailHook|
|afterPlugins|初始完插件后，|SyncHook|
|afterResolvers|`resolver`安装完成之后|SyncHook|
|environment|environment 准备好之后|SyncHook|
|afterEnvironment|environment 安装完成之后|SyncHook|
|beforeRun|`compiler.run()`执行之前|AsyncSeriesHook|
|run|开始读取records之前，|AsyncSeriesHook|
|beforeCompile|编译参数创建之后|AsyncSeriesHook|
|compile|新的编译创建之后|SyncHook|
|emit|生成资源到`output`目录之前|AsyncSeriesHook|
|afterEmit|生成资源到`output`目录之后|AsyncSeriesHook|
|done|编译(`compliation`)完成|SyncHook|
|failed|编译(`compliation`)失败之后|SyncHook|
|invalid|监听模式下，编译无效时|SyncHook|
|watchClose|监听模式停止后|SyncHook|

#### `compilation`

&emsp;&emsp;`compilation`标识webpack运行时构建的当前对象，每一次文件的改动重新编译都会生成新的`compilation`。它包含了当前的模块资源、编译生成资源、变化的文件、依赖状态信息等。

`compilation`提供关键时间段的回调，可自定义处理数据。

`compilation`扩展自`tapable`,在创建新的构建时可已出发一些事件钩子函数。

|钩子名称|释义|钩子类型|
|-----|--------|----------|
|buildModule|在模块构建前触发|SyncHook|
|rebuildModule|在模块重新构建前触发|SyncHook|
|failedModule|在模块构建失败时触发|SyncHook|
|succeedModule|在模块构建成功时触发|SyncHook|
|finishModules|在所有模块构建完成时触发|SyncHook|
|finishRebuildingModule|在某一个模块完成重新构建时触发|SyncHook|
|seal|编译(`compilation`)停止接收新模块时触发|SyncHook|
|unseal|编译(`compilation`)开始接收新模块时触发|SyncHook|
|optimizeDependencies|依赖优化开始时触发|SyncBailHook|
|optimize|优化阶段开始时触发|SyncHook|
|optimizeChunks|优化`chunk`时触发|SyncBailHook|
|afterOptimizeChunks|优化`chunk`完成时触发|SyncHook|
|optimizeTree|异步优化依赖树|AsyncSeriesHook|
|reviveModules|从`records`中恢复模块信息|SyncHook|
|optimizeModuleOrder|按优先级优化模块排序|SyncHook|
|optimizeChunkOrder|按优先级优化`chunk`排序|SyncHook|
|beforeOptimizeChunkIds|优化某个`chunk id`前触发|SyncHook|
|optimizeChunkIds|优化每个`chunk id`|SyncHook|
|afterOptimizeChunkIds|每个`chunk id`优化完成之后|SyncHook|
|recordModules|将模块信息存入`records`|SyncHook|
|recordChunks|将`chunk`信息存入`records`|SyncHook|
|beforeHash|在编译被哈希之前|SyncHook|
|afterHash|在编译被哈希之后|SyncHook|
|record|将`compilation`相关信息存入`records`之后|SyncHook|
|beforeChunkAssets|在创建`chunk`资源之前|SyncHook|
|additionalChunkAssets|为`chunk`附加附属资源|SyncHook|
|additionalAssets|为编译`compilation`附加附属资源|AsyncSeriesHook|
|optimizeChunkAssets|优化所有`chunk`资源|AsyncSeriesHook|
|afterOptimizeChunkAssets|`chunk`优化完成|SyncHook|
|optimizeAssets|优化存储在`compilation.assets`中的所有资源|AsyncSeriesHook|
|afterOptimizeAssets|资源优化结束|SyncHook|
|moduleAsset|一个模块的一个资源被加到编译中|SyncHook|
|chunkAsset|一个`chunk`的一个资源被加到编译中|SyncHook|

### 实现一个plugin

plugin在webpack启动后，执行一次。传入当前的配置对象`compiler`，

```js
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
```

导入使用，
```js
// 自定义插件应用
const CustomPlugin = require("./src/plugins/plugin/index");

module.exports = {
    plugins:[
        // ...
        new CustomPlugin()
    ]
}
```