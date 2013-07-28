var helpers = require("../helpers");

function Var( name ) {
  this.name = name;
  this.action = function() {};
}

module.exports = Var;

Var.prototype.value = function( value ) {
  this.action = function( node ) {
    node.init.update( value );
  };
};

Var.prototype.replaceWith = function( str ) {
  this.action = function( node ) {
    node.update( str );
  };
};

Var.prototype.insertAfter = function( str ) {
  this.action = function( node ) {
    node.parent.update( node.parent.source() + str );
  };
};

Var.prototype.insertBefore = function( str ) {
  this.action = function( node ) {
    node.parent.update( str + node.parent.source() );
  };
};

Var.prototype.rename = function( name ) {
  this.action = function( node ) {
    node.id.update( name );
  };
};

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

Var.prototype.use = function( node ) {
  if ( node.type === "VariableDeclarator" && node.id.name === this.name ) {
    this.action( node );
  }
};
