const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

/**
 * @type {import("webpack").Configuration}
 */
const config = {
    entry: "./src/index.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        alias: {
            '@': path.resolve('src')
        },
        extensions: [".js", ".jsx", ".ts", ".tsx", ".docx", '.less'],
    },
    // mode: "development",
    mode: process.env.MODE || "production",
    module: {
        rules: [
            {
                test: /\.(pdf|svg|docx|doc)$/,
                use: "file-loader?name=[path][name].[ext]",
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.less$/i,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
    devServer: {
        port: 9100,
        hot: true,
        open: true,
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:9000",
                // target: "https://loveyoupro.top/api",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            "/imgs": {
                target: "http://localhost:9000/imgs",
                // target: "https://loveyoupro.top/imgs",
                changeOrigin: true,
                pathRewrite: {
                    '^/imgs': ''
                }
            },
            "/docs": {
                target: "http://localhost:9000/docs",
                // target: "https://loveyoupro.top/docs",
                changeOrigin: true,
                pathRewrite: {
                    '^/docs': ''
                }
            },
        },
    },
};

module.exports = config;
