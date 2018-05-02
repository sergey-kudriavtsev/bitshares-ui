require("dotenv").load();
var path = require("path");
var webpack = require("webpack");
var express = require("express");
var devMiddleware = require("webpack-dev-middleware");
var hotMiddleware = require("webpack-hot-middleware");
var fs = require("fs");

var ProgressPlugin = require("webpack/lib/ProgressPlugin");
var config = require("./webpack.config.js")({prod: false});

var app = express();
var compiler = webpack(config);

var https = require("https");
var http = require("http");

compiler.apply(
    new ProgressPlugin(function(percentage, msg) {
        process.stdout.write(
            (percentage * 100).toFixed(2) +
                "% " +
                msg +
                "                 \033[0G"
        );
    })
);

app.use(
    devMiddleware(compiler, {
        publicPath: config.output.publicPath,
        historyApiFallback: true
    })
);

app.use(hotMiddleware(compiler));

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "app/assets/index-dev.html"));
});

var options = {
    key: fs.readFileSync("./ssl/server.key"),
    cert: fs.readFileSync("./ssl/server.crt")
};

process.env.SERVER_APP_PORT = process.env.SERVER_APP_PORT || 8080;
process.env.SERVER_APP_SSL_PORT = process.env.SERVER_APP_SSL_PORT || 8085;
http.createServer(app).listen(process.env.SERVER_APP_PORT);
https.createServer(options, app).listen(process.env.SERVER_APP_SSL_PORT);

console.log(
    `Listening at http://localhost:${process.env.SERVER_APP_PORT}/` +
        ` or https://localhost:${process.env.SERVER_APP_SSL_PORT}/`
);
// new WebpackDevServer(compiler, {
//     publicPath: config.output.publicPath,
//     hot: true,
//     historyApiFallback: true,
//     quiet: false,
//     stats: {colors: true},
//     port: 8080
// }).listen(8080, '0.0.0.0', function (err, result) {
//     if (err) {
//         console.log(err);
//     }
//     console.log('Listening at 0.0.0.0:8080');
// });
