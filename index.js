var falafel = require("falafel");

var types = {};
types.Var = require("./type/var");

var codeStr = 'var a = "bar", b = "foo";';

function Tree( src ) {
	this.src = src;
}

Tree.prototype.var = function( name ) {
	var variable = new types.Var();

	falafel( this.src, function( node ) {
		if ( node.type === "VariableDeclarator" && node.id.name === name ) {
			variable.add( node );
		}
	});

	return variable;
};

Tree.prototype.toString = function() {
	return this.src;
};

// Test code
var ast = new Tree(codeStr);

console.log( ast.var("a").value("a") );

// ast.var("b", function( node ) {
// 	node.update("'b'");
// });

console.log( ast.toString() );