import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default {
  mode: 'production',

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './bundle.js',
    library: 'LiqueurJS',
    libraryTarget: 'umd',
    globalObject: 'this'
  }
};