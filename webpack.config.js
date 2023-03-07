const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = 'style-loader';

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [],
    module: {
        rules: [
            {test: /\.(ts|tsx)$/i, loader: 'ts-loader', exclude: ['/node_modules/']},
            {test: /\.css$/i, use: [stylesHandler,'css-loader']},
            {test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i, type: 'asset'},
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
    devtool: 'eval-cheap-source-map',
};

module.exports = () => {
    config.mode = isProduction ? 'production' : 'development';
    return config;
};
