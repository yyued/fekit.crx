var path = require('path')
var webpack = require('webpack')
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js')

module.exports = {
    entry: {
        fekit: [ './src/react/fekit.js' ],
        main: [ './src/react/main.js' ]
    },
    output: {
        path: path.join(__dirname, 'src/js'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    context: __dirname,
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude:/(node_modules|bower_components)/, query:{optional:['runtime']} }, 
            // { test: /src\/react.*\.js$/, loader: 'transform?brfs!babel?optional=runtime', exclude:/(bower_components)/ }, 
            // { test: /node_modules.*\.js$/, loader: 'transform?brfs'}, 
        	{ test: /\.json$/, loader: 'json'},
            { test: /\.css$/, loader: 'style!css'}, 
            { test: /\.scss$/, loader: 'style!css!sass'}, 
            { test: /\.(jpg|png)$/, loader: 'url?limit=8192'}, 
            { test: /\.jsx$/, loader: 'babel!jsx?harmony'}
        ]
    },
    externals:{"cleanCss":"window.cleanCss", "uglifyJs":"window.uglifyJs"}
}