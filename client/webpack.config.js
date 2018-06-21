
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        app: "./src/js/main.js"
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        })
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },

    module: {
        rules: [
            { test: /\.(jpe?g|png|svg|woff2?|eot|ttf|otf|json|mp3|obj|mtl)$/, use: "file-loader?name=[path][name].[ext]" },
            { test: /\.css$/, use: ["style-loader", "css-loader"] }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    devServer: {
        contentBase: "dist"
    }
};
