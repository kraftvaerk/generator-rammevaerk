'use strict';

require('babel-core/register')({
  "plugins": ["babel-plugin-add-module-exports"],
  "presets": ["es2015"]
});

exports = module.exports = require('./generator');
