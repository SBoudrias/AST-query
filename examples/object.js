var Tree = require("../lib/tree");

// Test object with variable
var ast = new Tree("var obj = { a: 'a', b: 'b', c: 'c' }");
console.log( ast.toString() + "\n\n" );

ast.object().assignedTo("obj").key("a").rename("foo");
console.log( ast.toString() + "\n\n" );

ast.object().assignedTo("obj").key("foo").value("'bar'");
console.log( ast.toString() + "\n\n" );

ast.object().assignedTo("obj").key("c").delete();
console.log( ast.toString() + "\n\n" );

// Test object as argument
var tree = new Tree("grunt.init({ key: { sub: 'foo' } })");
console.log( tree.toString() + "\n\n" );

tree.object().passedTo("grunt.init").key("key").key("sub").value("'neat'");
console.log( tree.toString() + "\n\n" );
