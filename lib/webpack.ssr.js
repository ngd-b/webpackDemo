
const merge = require("webpack-merge");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-plugin");
const baseConfig = require("./webpack.base");

const ssrConfig = {
    mode:"production",
    module:{
        rules:[
            {
               test:/\.css$/,
               use:"ignore-loader"
           },
           {
                test:/\.less$/,
                use:"ignore-loader"
            }
        ]
    },
    plugins:[
        new OptimizeCssAssetsPlugin({
            assetNameRegExp:/\.css$/g,
            cssProcessor:require("cssnano")
        }),
        new HtmlWebpackExternalsPlugin({
            externals:[
                {
                    module:"react",
                    entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
                    global: 'React',
                },
                {
                    module: 'react-dom',
                    entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
                    global: 'ReactDOM',
                }
            ]
        })
    ],
    optimization:{ 
        splitChunks:{
            minSize:0,
            cacheGroups:{
                commons:{
                    name:"commons",
                    chunks:'all',
                    minChunks:3
                }
            }
        }
    },
}

module.exports = merge(baseConfig,ssrConfig);