var helpers = require("../helpers");
var Property = require("./_property");

/**
 * Create an array token
 * @constructor
 */
function ArrayObj() {
  this.check = function() { return true; };
  this.action = function() {};
}

module.exports = ArrayObj;

/**
 * Standard run function used when tokens are applied.
 * @param  {AST node} node
 * @return {null}
 */
ArrayObj.prototype.use = function( node ) {
  if ( node.type === "ArrayExpression" && this.check(node) ) {
    this.action( node );
  }
};

/**
 * Scope to select only object assigned to a variable
 * @param  {Stirng} name variable name
 * @return {types.Array}
 */
ArrayObj.prototype.assignedTo = function( name ) {
  this.check = function( node ) {
    return (node.parent.type === "VariableDeclarator" && node.parent.id.name === name);
  };
  return this;
};

/**
 * Scope to select only object passed to a function or a method
 * TODO: Selecting method only work for two level deeps - should be better
 * @param  {String} name variable name
 * @return {types.Array}
 */
ArrayObj.prototype.passedTo = function( name ) {
  this.check = function( node ) {
    var top = node.parent;
    if ( top.type !== "CallExpression" ) return false;
    if ( top.callee.type === "Identifier" && top.callee.name === name ) return true;
    if ( top.callee.type === "MemberExpression" &&
        name === top.callee.object.name + "." + top.callee.property.name ) return true;
    return false;
  };
  return this;
};

/**
 * push an element at the end of the array
 * @param  {String} item - Item to push source
 * @return {types.Array}
 */
ArrayObj.prototype.push = function( item ) {
  this.action = function( node ) {
    var src = node.source().replace(/\]$/, "") + ", " + item + "]";
    node.update( src );
    helpers.removeExtraComma(node);
  };
};

/**
 * unshift an element at the beginning of the array
 * @param  {String} item - Item to unshift source
 * @return {types.Array}
 */
ArrayObj.prototype.unshift = function( item ) {
  this.action = function( node ) {
    var src = "[" + item + ", " + node.source().replace(/^\[/, "");
    node.update( src );
    helpers.removeExtraComma(node);
  };
};

/**
 * unshift an element at the beginning of the array
 * @param  {String} item - Item to unshift source
 * @return {types.Array}
 */
ArrayObj.prototype.pop = function( item ) {
  this.action = function( node ) {
    node.elements.pop();
    node.update(node.source());
  };
};
