var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');
var Variable = require('./nodes/variable.js');

var Tree = module.exports = function (source) {
  this.tree = esprima.parse(source);
};

Tree.prototype.toString = function () {
  return escodegen.generate(this.tree);
};

Tree.prototype.var = function (name) {
  var nodes = [];
  traverse(this.tree).forEach(function (node) {
    if (node && node.type === 'VariableDeclarator' && node.id.name === name) {
      nodes.push(node);
    }
  });
  return new Variable(nodes);
};
