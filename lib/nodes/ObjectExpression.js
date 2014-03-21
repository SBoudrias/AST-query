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
  return valueFactory.wrap(node[0].value);
};

/**
 * Replace node with new value
 * @param  {String} value
 * @return {Object} New value object
 */
ObjectExpression.prototype.value = function (value) {
  var val = valueFactory.create(value);

  // As we don't keep reference to the parent, just update properties so the object stay
  // the same reference.
  delete this.node.property;
  delete this.node.type;
  _.extend(this.node, val);

  return valueFactory.wrap(this.node);
};
