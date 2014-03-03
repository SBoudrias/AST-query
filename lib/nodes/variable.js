var valueFactory = require('../factory/value.js');

var Variable = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.length = nodes.length;
};

/**
 * Change the variable value
 * @param  {String} value  New value string
 * @return {this}
 */
Variable.prototype.value = function (val) {
  this.nodes.forEach(function (node) {
    node.init = valueFactory.create(val);
  });
  return this;
};

/**
 * Rename the variable
 * @param  {string} name  New variable name
 * @return {null}
 */
Variable.prototype.rename = function (name) {
  this.nodes.forEach(function (node) {
    node.id.name = name;
  });
  return this;
};
