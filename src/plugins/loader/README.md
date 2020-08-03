
> 自定义实现webpack loader加载模块，解析指定的类型文件

### loader
`loader`导出为一个函数的node模块，可通过`this`访问上下文。

特点：

* `loader`单一职责，只负责解决单一的功能。
* 可链式调用，将多个单一任务的`loader`链式调用去解决文件。

    ```js
    {
        test:/\.less$/,
        use:[
            'css-loader',
            'less-laoder',
        ]
    }
    ```
    执行顺序为栈调用顺序,先执行`less-loader`,后执行`css-loader`.

* 模块化输出，保证内部无状态。
* 使用`loader-utils`工具包，处理loader内部的字符串转化、方法参数解析、路径解析等。
* 避免绝对路径，使用`loader-utils`可转换为相对路径。
* 提取通用代码。
* 依赖处理


#### 基础概念

`loader`接收上一个loader处理后的结果字符串或者`buffer`。

1. 同步调用处理或者异步调用处理，返回处理结果。
    ```js
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
        let callback = this.async();
        someAsyncOperation(content,function(err,result){
            if (err) return callback(err)

            callback(null,result,map,meta)
        })
    }
    ```
2. 通过定义`pitch`函数，链式调用`loader`时会先执行各个`pitch`函数，先执行的`loader`会受到后执行`loader`中`pitch`函数影响。
    如果`pitch`函数返回一个结果，则会跳过其他`loader`，直接从此处执行。
    ```js
    //1. 正常 执行顺序  c-b-a
    use:[
        'a-loader',
        'b-loader',
        'c-loader'
    ]
    //2. 如果 a和b 中定义了pitch, 则在c-loader中可以拿到一些暴露的值； 执行顺序 c-b-a
    use:[
        'a-loader',       // 暴露了 属性 data.name="admin"
        'b-loader',     // 可以使用 data.name
        'c-loader'        // 可以使用data.name
    ]
    //3. 如果 b-loader pitch函数返回了一个值，则跳过c-loader执行 ,
    //   执行顺序为 b-a
    use:[
        'a-loader',
        'b-loader',            // pitch 中  return result
        'c-loader'
    ]
    // 在loader中设置pitch函数
    module.exports.pitch = function(remainRequest,precedingRequest,data){
        // ... 
        data.name = "admin"
    }
    ```
3. 默认返回结果值为转换后的`utf-8`字符串，设置`raw`返回原始`buffer`.
    ```js
    module.exports.raw = true;
    ```
#### API释义
通过`this`访问内部的属性、方法。

|属性|释义|示例|
|---|---|---|
|`.version`|版本号||
|`.context`|模块所在的目录。||
|`.request`|解析到的请求路径。||
|`.query`|指向配置的`options`;或者指向请求路径的`?`后面部分||
|`.callback`|调用返回结果的函数，可返回多个；直接使用`return`返回，只能返回一个。||
|`.async`|异步执行回调。||
|`.data`|执行阶段共享的数据`data`||
|`.cacheable(true:Boolean)`|设置是否可被缓存，默认缓存||
|`.loaders`|所有laoder组成的数组||
|`.loaderIndex`|当前loader在`loaders`数组中的下标||
|`.resource`|`request`中的资源部分，包括`query`||
|`.resourcePath`|资源文件的路径||
|`.resourceQuery`|资源的query参数||
|`.target`|编译目标，配置项配置,比如：`web`/`node`||
|`.webpack`|标识是否是由`webpack`编译||
|`.sourceMap`|||
|`.emitWarning`|发出一个警告||
|`.emitError`|标识是否是由`webpack`编译||
|`.loadModule`|加载一个外部模块，并应用到所有loader||
|`.resolve`|||
|`.addDependency`|加入一个文件作为产生loader结果的依赖||
|`.addContextDependency`|||
|`.clearDependencies`|移除所有loader结果所有的依赖||
|`.emitFile`|||
|`.fs`|用于访问`compilation`和`inputFileSystem`属性。||

[loader API地址](https://www.webpackjs.com/api/loaders/)

#### 使用方式

1. webpack 配置文件中配置`loader`
    ```js
    module:{
        rules:[
            // ...
            {
                test:/\.pj$/,
                use:{
                    loader:path.resolve(__dirname,"./src/plugins/loader"),
                }
            }
        ]
    }
    ```
2. 多个`loader`时，采用配置属性`resolveLoader`,加载文件下所有的loader包。
    ```js
    module:{
        rules:[
            // ...
            {
                test:/\.pj$/,
                use:{
                    loader:'pj-loader',
                    options:{
                        // ... 
                    }
                }
            }
        ]
    },
    resolveLoader:{
        modules:[
            'node_modules',
            path.resolve(__dirname,"./src/plugins/loader")
        ]
    }
    ```
3. `npm-link` 将独立的loader包关联到`node_modules`上，不需要【2】中的`resolveLoader`配置
    ```js
    // 暂时没有测试成功

    npm link "./src/plugins/loaders"
    ```

### 自定义实现一个 `loader`

用于解析`.pj`后缀的模板文件，并替换里面的模板字符串。
```js
/**
 * 自定义实现一个loader解析
 */
const {getOptions} = require('loader-utils');

module.exports =  function(content,map,meta){
    let options = getOptions(this);
    
    content = content.replace(/\{name\}/g,options.name);

    return `export default ${JSON.stringify(content)}`;
}
```
解析文件`.pj`长这样：
```html
admin,{name}
```

配置`webpack.dev.js`文件，加入自定义`loader`配置解析`.pj`文件。

```js
module:{
    rules:[
        // ... 
        {
            test:/\.pj$/,
            use:{
                loader:path.resolve(__dirname,"./src/plugins/loader"),
                options:{
                    name:"hello"          // 配置项，由 getOptions获取其中的属性值
                }
            }
        }
    ]
}
```
在主文件中导入使用`index.pj`,`npm run dev`查看输出。

```js
import Text from "../plugins/loader/index.pj";
console.log(Text);          // 输出： admin,hello
```




