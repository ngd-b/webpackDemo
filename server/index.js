

if(typeof window === 'undefined'){
    global.window = {}
}

const path = require("path");
const express = require("express");
const {renderToString} = require("react-dom/server");
const SSR = require(path.join(__dirname,"../dist/search-server"));

const server= (port)=>{
    const app = express();
    app.use(express.static('dist'));
    app.get('/search',(req,res)=>{
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html);
    });

    app.listen(port,()=>{
        console.log(`the server listen port ${port}`);
    });
};

server(process.env.PORT || 3000);

const renderMarkup = (str)=>{
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <div id="app">${str}</div>
    </body>
    </html>`;
}