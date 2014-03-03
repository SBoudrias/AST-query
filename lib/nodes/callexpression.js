var valueFactory = require('../factory/value.js');

/**
 * Constructor for a function call/invocation
 * @constructor
 * @param  {Array(Object)} nodes
 */
var CallExpression = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.length = nodes.length;
};

CallExpression.prototype.pushArgument = function (arg) {
  arg = valueFactory.create(arg);
  this.nodes.forEach(function (node) {
    node.arguments.push(arg);
  });
};

CallExpression.prototype.unshiftArgument = function (arg) {
  arg = valueFactory.create(arg);
  this.nodes.forEach(function (node) {
    node.arguments.unshift(arg);
  });
};