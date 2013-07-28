var helpers = require("../helpers");
var Property = require("./_property");

/**
 * Create an object token
 * @constructor
 */
function Obj() {
  this.check = function() { return true; };
  this.action = function( node ) {
    console.log(node);
  };
}

module.exports = Obj;

/**
 * Standard run function used when tokens are applied.
 * @param  {AST node} node
 * @return {null}
 */
Obj.prototype.use = function( node ) {
  if ( node.type === "ObjectExpression" && this.check(node) ) {
    this.action( node );
  }
};

/**
 * Scope to select only object assigned to a variable
 * @param  {Stirng} name variable name
 * @return {types.Object}
 */
Obj.prototype.assignedTo = function( name ) {
  this.check = function( node ) {
    return (node.parent.type === "VariableDeclarator" && node.parent.id.name === name);
  };
  return this;
};

/**
 * Scope to select only object passed to a function or a method
 * TODO: Selecting method only work for two level deeps - should be better
 * @param  {Stirng} name variable name
 * @return {types.Object}
 */
Obj.prototype.passedTo = function( name ) {
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
 * Select a specific key in the object
 * @param  {String} name Key name
 * @return {Key}         Key object
 */
Obj.prototype.key = function( name ) {
  var key = new Property( name );
  this.action = function( node ) {
    node.properties.forEach(function( property ) {
      key.use( property );
    });
  };
  return key;
};
