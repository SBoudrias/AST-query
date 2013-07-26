var falafel = require("falafel");

var types = {};
types.Var = require("./type/var");


module.exports = Tree;

function Tree( src ) {
	this.src = src;
	this.tokens = [];
}

Tree.prototype.var = function( name ) {
	var token = new types.Var(name);
	this.tokens.push( token );
	return token;
};

Tree.prototype.toString = function() {
	return this.src;
};

Tree.prototype.update = function( target, method ) {
	var self = this;
	var output = falafel( this.src, function( node ) {
		self.tokens.forEach(function( token ) {
			token.use( node );
		});
	});
	this.src = output.toString();
};