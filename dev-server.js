const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config')


const devServer = webpackConfig.devServer||{};
const port = devServer.port||9898;
const devConfig = {
  port: port,
  hot: true,
 ...devServer
};

/*
在 entry 入口数组中加入
"webpack-dev-server/client?http://localhost:8080/" 和 "webpack/hot/dev-server"
*/
webpackConfig.entry = addEntry(webpackConfig.entry);

/*
在 plugins 数组中加入
new webpack.HotModuleReplacementPlugin()
*/
webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.HotModuleReplacementPlugin()
])

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, devConfig);
server.listen(port, 'localhost', () => {
 console.log(`hot reload: http://localhost:${port}/`)
});

function addEntry(entry) {
 let t = `webpack-dev-server/client?http://localhost:${port}/`;
 let hot = 'webpack/hot/dev-server';

 if (typeof entry == "string") {
 entry = [entry]
 }

 if (Array.isArray(entry)) {

 return entry.concat([hot, t])
 } else if (typeof entry == "object") {
 let result = {};
 for (let [key, value] of Object.entries(entry)) {
 result[key] = addEntry(value)
 }

 return result
 }
}
