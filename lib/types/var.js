var helpers = require("../helpers");

/**
 * Create a variable token
 * @param {String} name Variable name
 */
function Var( name ) {
  this.name = name;
  this.action = function() {};
}

module.exports = Var;


/**
 * Standard run function used when tokens are applied.
 * @param  {AST node} node
 * @return {null}
 */
Var.prototype.use = function( node ) {
  if ( node.type === "VariableDeclarator" && node.id.name === this.name ) {
    this.action( node );
  }
};

/**
 * Change the variable value
 * @param  {String} value  New value string
 * @return {null}
 */
Var.prototype.value = function( value ) {
  this.action = function( node ) {
    if ( typeof value === "function" ) {
      value = value( node.init ? node.init.source() : undefined );
    }
    if ( node.init ) {
      node.init.update( value );
    } else {
      node.update( node.id.source() + " = " + value );
    }
  };
};

/**
 * Rename the variable
 * @param  {string} name  New variable name
 * @return {null}
 */
Var.prototype.rename = function( name ) {
  this.action = function( node ) {
    node.id.update( name );
  };
};

/**
 * Replace the variable declaration with a string. This will replace the content inside
 * the var keyword block: `var <content goes here>;`
 * @param  {String} str Code string
 * @return {null}
 */
Var.prototype.replaceWith = function( str ) {
  this.action = function( node ) {
    node.update( str );
  };
};

/**
 * Insert a string after the variable declaration code blocks. If there's multiple
 * declaration inside the code block, the string will be inserted after everyone.
 * @param  {String} str code string
 * @return {null}
 */
Var.prototype.insertAfter = function( str ) {
  this.action = function( node ) {
    node.parent.update( node.parent.source() + str );
  };
};

/**
 * Insert a string before the `var` keyword
 * @param  {String} str code string
 * @return {null}
 */
Var.prototype.insertBefore = function( str ) {
  this.action = function( node ) {
    node.parent.update( str + node.parent.source() );
  };
};

/**
 * Delete the variable declaration. If the declaration block contain a single variable,
 * it'll delete it all, otherwise, it'll only delete the relevant section
 * @return {null}
 */
Var.prototype.delete = function() {
  this.action = function( node ) {
    if ( node.parent.declarations.length > 1 ) {
      node.update("");
      helpers.removeExtraComma( node.parent );
    } else {
      node.parent.update("");
    }
  };
};
