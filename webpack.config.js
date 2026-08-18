const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./', 'dist'), // output directory for bundle
  },
  mode: 'production', // use 'development' for debugging
};