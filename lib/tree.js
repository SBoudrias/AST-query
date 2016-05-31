'use strict';
var esprima = require('esprima');
var acorn = require('acorn-jsx');
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

var acornOptionDefaults = {
  ranges: true
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

function Tree(source, escodegenOptions, parseOptions) {
  this.esprima = true;
  if (this.esprima) {
    this.parseOptionDefaults = _.extend({}, esprimaOptionDefaults, parseOptions);
    this.tree = esprima.parse(source.toString(), this.parseOptionDefaults);
    this.tree = escodegen.attachComments(this.tree, this.tree.comments, this.tree.tokens);
  } else {
    this.parseOptionDefaults = _.extend({}, acornOptionDefaults, parseOptions);
    this.comments = [];
    this.tokens = [];
    this.parseOptionDefaults.onComment = this.comments;
    this.parseOptionDefaults.onToken = this.tokens;
    this.tree = acorn.parse(source.toString(), this.parseOptionDefaults);
    this.tree = escodegen.attachComments(this.tree, this.comments, this.tokens);
  }
  this.body = new Body(this.tree.body, this.parseOptionDefaults);
  this.escodegenOptions = _.extend({}, escodegenOptionDefaults, escodegenOptions);
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
  Body.verbatims[token] = body;
  return '\'' + token + '\'';
};

module.exports = function (source, escodegenOptions, parseOptions) {
  return new Tree(source, escodegenOptions, parseOptions);
};
