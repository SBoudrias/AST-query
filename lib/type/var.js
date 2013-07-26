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

Var.prototype.use = function( node ) {
	if ( node.type === "VariableDeclarator" && node.id.name === this.name ) {
		this.action( node );
	}
};