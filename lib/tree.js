'use strict';
var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');
var _ = require('lodash');
var utils = require('./util/utils');
var Variable = require('./nodes/Variable');
var CallExpression = require('./nodes/CallExpression');
var AssignmentExpression = require('./nodes/AssignmentExpression');
var Body = require('./nodes/Body');

var esprimaOptionDefaults = {
  comment: true,
  range: true,
  loc: false,
  tokens: true,
  raw: false
};

var escodegenOptionDefaults = {
  comment: true,
  format: {
    indent: {
      adjustMultilineComment: true
    }
  }
};

function Tree(source, escodegenOptions, esprimaOptions) {
  this.esprimaOptionDefaults = _.merge({}, esprimaOptionDefaults, esprimaOptions);
  this.tree = esprima.parse(source.toString(), this.esprimaOptionDefaults);
  this.tree = escodegen.attachComments(this.tree, this.tree.comments, this.tree.tokens);
  this.body = new Body(this.tree.body, this.esprimaOptionDefaults);
  this.escodegenOptions = _.merge({}, escodegenOptionDefaults, escodegenOptions);
}

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
  return escodegen.generate(tree, this.escodegenOptions);
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
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (!node || node.type !== 'CallExpression') return false;

    // Simple function call
    if (node.callee.type === 'Identifier' && node.callee.name === name) return true;

    // Method call
    if (utils.matchMemberExpression(name, node.callee)) return true;
  });
  return new CallExpression(nodes);
};

/**
 * Select an AssignmentExpression node
 * @param  {String} assignedTo Name of assignement left handside
 * @return {AssignmentExpression} Matched node
 */
Tree.prototype.assignment = function (assignedTo) {
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (!node || node.type !== 'AssignmentExpression') return false;

    // Simple assignement
    if (node.left.type === 'Identifier' && node.left.name === assignedTo) return true;

    // Assignement to an object key
    if (utils.matchMemberExpression(assignedTo, node.left)) return true;
  });
  return new AssignmentExpression(nodes);
};

module.exports = function (source, escodegenOptions, esprimaOptions) {
  return new Tree(source, escodegenOptions, esprimaOptions);
};
