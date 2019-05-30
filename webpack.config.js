const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    // entry:"./src/index.js",
    entry:{
        app:"./src/index.js",
        appTs:"./src/index.ts"
        // print:"./src/print.js",
    },
    output:{
        //filename:"bundle.js",
        filename:"[name].bundle.js",
        path:path.resolve(__dirname,"dist"),
        // publicPath:"/"
    },
    devtool:"inline-source-map",
    devServer:{
        contentBase:"./dist",
        hot:true
    },
    plugins:[
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title:"Output Management"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve:{
        extensions:[".tsx",".ts",".js"]
    },
    module:{
         rules:[
             {
                 test:/\.css$/,
                use:[
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test:/\.(png|jpg|svg|gif)$/,
                use:[
                    "file-loader"
                ]
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    "file-loader"
                ]
            },
            {
                test:/\.m?js$/,
                exclude:/(node_modules|bower_components)/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:["@babel/preset-env"]
                    }
                }
            },
            {
                test:/\.tsx?$/,
                use:'ts-loader',
                exclude:/node_modules/
            }
    //         {
    //             test:/\.(csv|tsv)$/,
    //             use:[
    //                 "csv-loader"
    //             ]
    //         },
    //         {
    //             test:/\.xml$/,
    //             use:[
    //                 "xml-loader"
    //             ]
    //         }
         ]
     }
}