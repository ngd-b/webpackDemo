const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = new express();
const config = require("./webpack.ssr.js");
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler,{
    publicPath:"/server.html"
}));

app.listen(3000,function(){
    console.log("the server running on port 3000 \n");
});