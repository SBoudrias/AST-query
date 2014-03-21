var valueFactory = require('../factory/value.js');

var Arguments = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.length = nodes.length;
};

/**
 * push a new arguments in the call expression
 * @param  {String} arg New argument value as a string
 * @return {this}
 */
Arguments.prototype.push = function (arg) {
  arg = valueFactory.create(arg);
  this.nodes.forEach(function (node) {
    node.push(arg);
  });
  return this;
};

/**
 * unshift a new arguments in the call expression
 * @param  {String} arg New argument value as a string
 * @return {this}
 */
Arguments.prototype.unshift = function (arg) {
  arg = valueFactory.create(arg);
  this.nodes.forEach(function (node) {
    node.unshift(arg);
  });
  return this;
};

/**
 * Return the argument at given index (only target the first node occurence)
 * @param  {Number}  index
 * @return {Literal} Value reference as a literal type
 */
Arguments.prototype.at = function (index) {
  return valueFactory.wrap(this.nodes[0][index]);
};
