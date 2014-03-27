var valueFactory = require('../factory/value.js');

var ArrayExpression = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.length = nodes.length;
};

/**
 * push a new value in the array
 * @param  {String} arg New value as a string
 * @return {this}
 */
ArrayExpression.prototype.push = function (arg) {
  arg = valueFactory.create(arg);
  this.nodes.forEach(function (node) {
    node.push(arg);
  });
  return this;
};

/**
 * unshift a new value in the array
 * @param  {String} arg New value as a string
 * @return {this}
 */
ArrayExpression.prototype.unshift = function (arg) {
  arg = valueFactory.create(arg);
  this.nodes.forEach(function (node) {
    node.unshift(arg);
  });
  return this;
};

/**
 * Return the value at given index (only target the first node occurence)
 * @param  {Number}  index
 * @return {Literal} Value reference as a literal type
 */
ArrayExpression.prototype.at = function (index) {
  return valueFactory.wrap(this.nodes[0][index]);
};
