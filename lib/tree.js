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
  verbatim: 'x-verbatim',
  comment: true,
  format: {
    indent: {
      adjustMultilineComment: true
    }
  }
};

function Tree(source, escodegenOptions, esprimaOptions) {
  this.esprimaOptionDefaults = _.extend({}, esprimaOptionDefaults, esprimaOptions);
  this.tree = this.postParse(esprima.parse(source.toString(), this.esprimaOptionDefaults));
  this.tree = escodegen.attachComments(this.tree, this.tree.comments, this.tree.tokens);
  this.body = new Body(this, this.tree.body, this.esprimaOptionDefaults);
  this.escodegenOptions = _.extend({}, escodegenOptionDefaults, escodegenOptions);
  this.verbatims = {};
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
 * @param  {String|RegExp} name  Name of the declared variable
 * @return {Variable}
 */
Tree.prototype.var = function (name) {
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (node && node.type === 'VariableDeclarator' && utils.match(name, node.id.name)) {
      return true;
    }
  });
  return new Variable(nodes);
};

/**
 * Select function/method calls
 * @param  {String|RegExp} name Name of the called function (`foo`, `foo.bar`)
 * @return {CallExpression}
 */
Tree.prototype.callExpression = function callExpression(name) {
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (!node || node.type !== 'CallExpression') return false;

    // Simple function call
    if (node.callee.type === 'Identifier' && utils.match(name, node.callee.name)) return true;

    // Method call
    if (utils.matchMemberExpression(name, node.callee)) return true;
  });
  return new CallExpression(nodes);
};

/**
 * Select an AssignmentExpression node
 * @param  {String|RegExp} assignedTo Name of assignment left handside
 * @return {AssignmentExpression} Matched node
 */
Tree.prototype.assignment = function (assignedTo) {
  var nodes = traverse(this.tree).nodes().filter(function (node) {
    if (!node || node.type !== 'AssignmentExpression') return false;

    // Simple assignment
    if (node.left.type === 'Identifier' && utils.match(assignedTo, node.left.name)) return true;

    // Assignment to an object key
    if (utils.matchMemberExpression(assignedTo, node.left)) return true;
  });
  return new AssignmentExpression(nodes);
};

/**
 * Create a verbatim replacment token
 * @param  {String} body to insert
 * @return replacement token
 */
Tree.prototype.verbatim = function (body) {
  var token = 'tok' + new Date().getTime().toString();
  this.verbatims[token] = body;
  return "{'" + token + "'}";
};

Tree.prototype.postParse = function (tree) {
  var nodeValue;
  var tree = traverse(tree).map(function (node) {
    if (node && node.type === 'Literal' && (nodeValue = node.value)[0] === 't' && nodeValue[1] === 'o' && nodeValue[2] === 'k') {
      if (this.verbatims.hasOwnProperty(nodeValue)) {
        node['x-verbatim'] = this.verbatims[nodeValue];
        this.verbatims[nodeValue] = undefined; 
      }
    }
  }.bind(this));
  return tree;
};

module.exports = function (source, escodegenOptions, esprimaOptions) {
  return new Tree(source, escodegenOptions, esprimaOptions);
};
