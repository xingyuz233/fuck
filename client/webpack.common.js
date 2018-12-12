const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: "./src/js/main.js"
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{
            from: './static',
            to: './static'
        }]),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
            { test: /\.(jpe?g|png|svg|woff2?|eot|ttf|otf|json|mp3|obj|mtl)$/, use: "file-loader?name=[path][name].[ext]" },
            { test: /\.css$/, use: ["style-loader", "css-loader"] }
        ]
    },

    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
}