function Var() {
	this.nodes = [];
}

module.exports = Var;

Var.prototype.add = function( node ) {
	this.nodes.push( node );
};

Var.prototype.value = function( value ) {
	this.nodes.forEach(function( node ) {
		node.hook(function() {
			this.init.update(value);
		});
	});
};