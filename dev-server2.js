const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config')

const devServer = webpackConfig.devServer||{};
const port = devServer.port || 9898;

const app = express();

webpackConfig.entry = addEntry(webpackConfig.entry);

/*
在 plugins 数组中加入
new webpack.HotModuleReplacementPlugin()
*/
webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin()
])

const compiler = webpack(webpackConfig);


const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    quiet: false
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 10000,
   
})

app.use(hotMiddleware);
app.use(devMiddleware);

// app.get('/', function (req, res) {
//   res.sendFile(resolve("./index.html" ));
// })

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    server = app.listen(port)
})

function addEntry(entry) {
    let t = './client.js';
    if (Array.isArray(entry)) {
        entry.unshift(t)
        return entry
    } else if (typeof entry == "string") {
        return [t, entry]
    } else if (typeof entry == "object") {
        let result = {};
        for (let [key, value] of Object.entries(entry)) {
            result[key] = addEntry(value)
        }
        return result
    }
}