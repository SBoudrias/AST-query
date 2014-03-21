var _ = require('lodash');

/**
 * Literal node type wrapper
 * @class
 * @param  {Object} node
 */
var Literal = module.exports = function (node) {
  this.node = node;
};

/**
 * Update or get node value
 *
 * @param  {String} val Value code string
 * @return {mixed}      Value
 *
 * @or
 * @return {mixed}      Value
 */
Literal.prototype.value = function (val) {
  if (_.isString(val)) {
    this.node.value = val;
  }
  return this.node.value;
};
