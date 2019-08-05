const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    // entry:"./src/index.js",
    entry:{
        app:"./src/index.js",
        appTs:"./src/index.ts"
        // print:"./src/print.js",
    },
    mode:"production",
    output:{
        //filename:"bundle.js",
        filename:"[name]_[chunkhash:8].js",
        path:path.resolve(__dirname,"dist"),
        // publicPath:"/"
    },
    plugins:[
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title:"Output Management"
        }),
        new webpack.NamedModulesPlugin(),
        new MiniCssExtractPlugin({
            filename:"[name]_[contenthash:8].css"
        })
    ],
    resolve:{
        extensions:[".tsx",".ts",".js"]
    },
    module:{
         rules:[
             {
                 test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test:/\.(png|jpg|svg|gif)$/,
                use:[
                    {
                        loader:"file-loader",
                        options:{
                            name:'[name]_[hash:8][ext]'
                        }
                    }
                ]
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    {
                        loader:"file-loader",
                        options:{
                            name:'[name]_[hash:8][ext]'
                        }
                    }
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