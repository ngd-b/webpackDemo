
const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

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
    entry:entry,
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"[name]_[chunkhash:8].js"
    },
    stats:"errors-only",
    plugins:[
        new MiniCssExtractPlugin({
            filename:"[name]_[contenthash:8].css"
        }),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        function(){
            this.hooks.done.tap('done',(stats)=>{
                if(stats.compilation.errors&&stats.compilation.errors.length&&process.argv.indexOf('-watch')==-1){
                    console.log('build error __^^__');
                    process.exit(3);
                }
            });
        }
    ].concat(htmlWebpackPlugin),
    module:{
        rules:[
            {
               test:"/\.js$/",
               use:[
                   "babel-loader"
               ]
            },
            {
               test:/\.css$/,
               use:[
                   MiniCssExtractPlugin.loader,
                   "css-loader"
               ]
           },
           {
               test:/\.less$/,
               use:[
                   MiniCssExtractPlugin.loader,
                   "css-loader",
                   "less-loader",
                   {
                       loader:'postcss-loader',
                       options:{
                           plugins:()=>{
                               require('autoprefixer')({
                                   browsers:['last 2 version',"> 1%","ios 7"]
                               });
                           }
                       }
                   },
                   {
                       loader:"px2rem-loader",
                       options:{
                           remUnit:75,
                           remPrecision:8
                       }
                   }
               ]
           },
           {
               test:/\.(png|jpg|svg|gif)$/,
               use:[
                   {
                       loader:"file-loader",
                       options:{
                           name:'[name]_[hash:8].[ext]'
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
                           name:'[name]_[hash:8].[ext]'
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
               test:/\.(csv|tsv)$/,
               use:[
                   "csv-loader"
               ]
           },
           {
               test:/\.xml$/,
               use:[
                   "xml-loader"
               ]
           }
        ]
    }
}