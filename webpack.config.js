const path = require("path");

module.exports = {
    entry: "./src/js/main.js",
    output: {
        filename: "super_puper_widget.js",
        path: path.resolve(__dirname,"./dist"),
        publicPath: "dist/"
    },
    mode: "none",
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: [
                    'file-loader'
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ]
    }
}