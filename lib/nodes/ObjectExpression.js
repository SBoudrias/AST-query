var _ = require('lodash');
var valueFactory = require('../factory/value.js');

/**
 * Object expression token (e.g. `{ a: "foo"}`)
 * @class
 * @param  {Object} node AST ObjectExpression token
 */
var ObjectExpression = module.exports = function (node) {
  this.type = 'ObjectExpression';
  this.node = node;
};

/**
 * Get a key value
 * @param  {String} name key name
 * @return {Object}      value
 */
ObjectExpression.prototype.key = function (name) {
  var node = _.filter(this.node.properties, function (prop) {
    return prop.key.name === name;
  });
  return node[0].value;
};
