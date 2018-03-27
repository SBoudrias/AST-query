'use strict';
var acorn = require('acorn-jsx');
var escodegen = require('escodegen-wallaby');
var traverse = require('traverse');
var _ = require('lodash');
var utils = require('./util/utils');
var Variable = require('./nodes/Variable');
var CallExpression = require('./nodes/CallExpression');
var AssignmentExpression = require('./nodes/AssignmentExpression');
var Body = require('./nodes/Body');

var acornOptionDefaults = {
  ranges: true,
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

var Tree = module.exports = function Tree() {
  this.acornOptions = undefined;
  this.comments = undefined;
  this.tree = undefined;
  this.body = undefined;
  this.escodegenOptions = undefined;
};

Tree.fromSource = function(source, escodegenOptions, acornOptions) {
  var instance = new Tree();
  instance.acornOptions = _.extend({}, acornOptionDefaults, acornOptions);
  instance.comments = [];
  instance.tokens = [];
  instance.acornOptions.onComment = instance.comments;
  instance.acornOptions.onToken = instance.tokens;
  instance.tree = acorn.parse(source.toString(), instance.acornOptions);
  instance.tree = escodegen.attachComments(instance.tree, instance.comments, instance.tokens);
  instance.body = new Body(instance.tree.body, instance.acornOptions);
  instance.escodegenOptions = _.extend({}, escodegenOptionDefaults, escodegenOptions);
  return instance;
};

Tree.fromTree = function(tree, escodegenOptions, acornOptions) {
  var instance = new Tree();
  instance.acornOptions = _.extend({}, acornOptionDefaults, acornOptions);
  instance.comments = [];
  instance.tokens = [];
  instance.acornOptions.onComment = instance.comments;
  instance.acornOptions.onToken = instance.tokens;
  instance.tree = tree;
  instance.body = new Body(instance.tree.body, instance.acornOptions);
  instance.escodegenOptions = _.extend({}, escodegenOptionDefaults, escodegenOptions);
  return instance;
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
  var verbatimId = Body.verbatimId = (Body.verbatimId || 100) + 1; 
  var token = 'tok' + verbatimId.toString();
  Body.verbatims[token] = body;
  return '\'' + token + '\';';
};
