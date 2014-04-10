var esprima = require('esprima');

/**
 * Function body node
 * @constructor
 * @private
 * @param {Object} node
 */
var Body = module.exports = function (node) {
  this.node = node;
};

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
    if (node && node.expression && node.expression.type === 'Literal' && node.expression.value === 'use strict') {
      return 1;
    }
  });

  return this;
};
