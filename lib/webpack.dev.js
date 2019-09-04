
const merge = require("webpack-merge");
const webpack = require("webpack");
const baseConfig = require("./webpack.base");

const devConfig = {
    mode:"development",
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool:"inline-source-map",
    devServer:{
        contentBase:"./dist",
        hot:true,
        stats:"errors-only",
    },
}

module.exports = merge(baseConfig,devConfig);