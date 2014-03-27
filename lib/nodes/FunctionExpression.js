var _ = require('lodash');
var esprima = require('esprima');
var valueFactory = require('../factory/value.js');
var Base = require('./Base');

/**
 * Constructor for an FunctionExpression
 * @constructor
 * @param  {Object} node
 */
var FunctionExpression = module.exports = Base.extend({
  constructor: function (node) {
    this.node = node;
    this.type = 'FunctionExpression';
    this.body = new Body(this.node.body.body);
  }
});

/**
 * Function body node
 * @constructor
 * @private
 * @param {Object} node
 */
function Body(node) {
  this.node = node;
}

/**
 * Append code to the function body
 * @param  {String} code
 * @return {this}
 */
Body.prototype.append = function (code) {
  var values = esprima.parse(code).body;
  Array.prototype.push.apply(this.node, values);
  return this;
};

/**
 * Prepend code to the function body
 * @param  {String} code
 * @return {this}
 */
Body.prototype.prepend = function (code) {
  var values = esprima.parse(code).body;
  Array.prototype.unshift.apply(this.node, values);

  // Ensure "use strict" declaration is kept on top
  this.node.sort(function (prev, node) {
    if (node && node.expression.type === 'Literal' && node.expression.value === 'use strict') {
      return 1;
    }
  });

  return this;
};
