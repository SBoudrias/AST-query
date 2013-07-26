var falafel = require("falafel");

var types = {};
types.Var = require("./type/var");


module.exports = Tree;

function Tree( src ) {
	this.src = src;
}

Tree.prototype.var = function( name ) {
	var self = this;
	var variable = new types.Var();

	falafel( this.src, function( node ) {
		if ( node.type === "VariableDeclarator" && node.id.name === name ) {
			variable.add( self.wrapNode(node) );
		}
	});

	return variable;
};

Tree.prototype.toString = function() {
	return this.src;
};

Tree.prototype.update = function( target, method ) {
	var output = falafel( this.src, function( node ) {
		if ( node === target ) {
			console.log("they're the same!");
			method.call( node );
		}
	});
	this.src = output.toString();
};

Tree.prototype.wrapNode = function( node ) {
	var self = this;
	node.hook = function( method ) {
		self.update( this, method );
	};
	return node;
};