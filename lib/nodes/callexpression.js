var valueFactory = require('../factory/value.js');
var Arguments = require('./arguments.js');

/**
 * Constructor for a function call/invocation
 * @constructor
 * @param  {Array(Object)} nodes
 */
var CallExpression = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.arguments = new Arguments(this.nodes.map(function (node) { return node.arguments; }));
  this.length = nodes.length;
};
