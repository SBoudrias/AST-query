var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');

var Tree = module.exports = function (source) {
  this.tree = esprima.parse(source);
};

Tree.prototype.toString = function () {
  return escodegen.generate(this.tree);
};

Tree.prototype.var = function (name) {
  traverse(this.tree).forEach(function (node) {
    console.log(node);
  });
};
