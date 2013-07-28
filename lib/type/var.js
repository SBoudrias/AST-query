var helpers = require("../helpers");

function Var( name ) {
	this.name = name;
	this.action = function() {};
}

module.exports = Var;

Var.prototype.add = function( node ) {
	this.nodes.push( node );
};

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
		node.update("");
		helpers.removeExtraComma( node.parent );
	};
};

Var.prototype.use = function( node ) {
	if ( node.type === "VariableDeclarator" && node.id.name === this.name ) {
		this.action( node );
	}
};