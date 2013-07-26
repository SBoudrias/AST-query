var falafel = require("falafel");
var helpers = require("./helpers");

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
	var output = falafel( this.src, helpers.unbox(this.tokens, "use"));
	this.src = output.toString();
};