var valueFactory = require('../factory/value.js');

var Variable = module.exports = function (nodes) {
  this.nodes = Array.isArray(nodes) ? nodes : [nodes];
  this.length = nodes.length;
};

Variable.prototype.value = function (val) {
  this.nodes.forEach(function (node) {
    node.init = valueFactory.create(val);
  });
};
