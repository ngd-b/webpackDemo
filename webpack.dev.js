const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 自定义plugin
const CustomPlugin = require("./src/plugins/plugin/index");
const setMPA=()=>{
    const entry = {};
    const htmlWebpackPlugin = [];

    const entryFiles = glob.sync(path.join(__dirname,"./src/*/index.js"));
    Object.keys(entryFiles).map((index)=>{
        const entryFile = entryFiles[index];

        const pageName = entryFile.match(/src\/(.*)\/index\.js/);

        const name = pageName&&pageName[1];

        entry[name] = entryFile;
        htmlWebpackPlugin.push(
            new HtmlWebpackPlugin({
                title:"webpack demo",
                template:path.join(__dirname,`src/index.html`),
                filename:`${name}.html`,
                chunks:[name],
                inject:true,
                minify:{
                    html5:true,
                    collapseWhitespace:true,
                    presserveLineBreaks:true,
                    ninifyCSS:true,
                    minifyJS:true,
                    removeComments:false
                }
            })
        );
    });

    return {
        entry,
        htmlWebpackPlugin
    }
}
// 多页面打包
const {entry,htmlWebpackPlugin} = setMPA();

module.exports = {
    // entry:"./src/index.js",
    // entry:{
    //     app:"./src/index/index.js",
    //     appTs:"./src/index/index.ts"
    //     // print:"./src/print.js",
    // },
    entry:entry,
    mode:"development",
    output:{
        //filename:"bundle.js",
        filename:"[name].bundle.js",
        path:path.resolve(__dirname,"dist"),
        // publicPath:"/"
    },
    devtool:"inline-source-map",
    devServer:{
        contentBase:"./dist",
        hot:true,
        stats:"errors-only",
    },
    plugins:[
        // new CleanWebpackPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        // 自定义plugin  应用
        new CustomPlugin()
    ].concat(htmlWebpackPlugin),
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
                test:/\.less$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "less-loader"
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
            },
            {
                test:/\.pj$/,
                use:{
                    loader:path.resolve(__dirname,"./src/plugins/loader/pj-loader.js"),
                    options:{
                        name:"hello"
                    }
                }
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