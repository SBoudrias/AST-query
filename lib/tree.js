var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');
var utils = require('./util/utils.js');
var Variable = require('./nodes/variable.js');
var CallExpression = require('./nodes/CallExpression.js');

var Tree = module.exports = function (source) {
  this.tree = esprima.parse(source);
};

/**
 * Return the regenerated code string
 * @return {String} outputted code
 */
Tree.prototype.toString = function () {
  // Filter the three to remove temporary placeholders
  var tree = traverse(this.tree).map(function (node) {
    if (node && node.TEMP === true) {
      this.remove();
    }
  });
  return escodegen.generate(tree);
};

/**
 * Find variables declaration
 * @param  {String} name  Name of the declared variable
 * @return {Variable}
 */
Tree.prototype.var = function (name) {
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (node && node.type === 'VariableDeclarator' && node.id.name === name) {
      return true;
    }
  });
  return new Variable(nodes);
};

/**
 * Select function/method calls
 * @param  {String} name Name of the called function (`foo`, `foo.bar`)
 * @return {CallExpression}
 */
Tree.prototype.callExpression = function (name) {
  var nameParts = name.split('.');
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (!node || node.type !== 'CallExpression') return false;

    // Simple function call
    if (node.callee.type === 'Identifier' && node.callee.name === name) return true;

    // Method call
    if (utils.matchMemberExpression(name, node.callee)) return true;
  });
  return new CallExpression(nodes);
};
