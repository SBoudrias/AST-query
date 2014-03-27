var valueFactory = require('../factory/value.js');
var ArrayExpression = require('./ArrayExpression.js');

/**
 * Constructor for a function call/invocation
 * @constructor
 * @param  {Array(Object)} nodes
 */
var CallExpression = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.arguments = new ArrayExpression(this.nodes.map(function (node) { return node.arguments; }));
  this.length = nodes.length;
  this.type = 'CallExpression';
};

CallExpression.prototype.filter = function (iterator) {
	return new CallExpression(this.nodes.filter(iterator));
};
