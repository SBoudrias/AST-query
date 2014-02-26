var falafel = require("falafel");
var helpers = require("./helpers");
var types = require("./types");

module.exports = Tree;

/**
 * Queriable AST Tree constructor
 * @param {String} src Source code string
 */
function Tree( src ) {
  this.src = src;
  this.tokens = [];
}

/**
 * Get the compiled source string
 * @return {String} source code
 */
Tree.prototype.toString = function() {
  return this._process().src;
};

/**
 * Compile the source by passing control to registered tokens
 * @return {Self} Tree
 */
Tree.prototype._process = function() {
  var self = this;
  var output = falafel( this.src, helpers.unbox(this.tokens, "use"));
  this.src = output.toString();
  this.tokens.length = 0;
  return this;
};


// ---
// Token types

/**
 * Add a variable token to the queue
 * @param  {string} name  Variable name
 * @return {Var token}    Selected variable token
 */
Tree.prototype.var = function( name ) {
  var token = new types.Var(name);
  this.tokens.push( token );
  return token;
};

/**
 * Add an object token to the queue
 * @return {Var token}    Selected variable token
 */
Tree.prototype.object = function() {
  var token = new types.Object();
  this.tokens.push( token );
  return token;
};

/**
 * Add an array token to the queue
 * @return {Var token}    Selected variable token
 */
Tree.prototype.array = function() {
  var token = new types.Array();
  this.tokens.push( token );
  return token;
};
