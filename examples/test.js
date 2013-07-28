var Tree = require("../lib/tree");
var codeStr = 'var a = "bar", b = "foo";';

// Test code
var ast = new Tree(codeStr);
console.log( ast.toString() + "\n\n" );

ast.var("a").value("'a'");
console.log( ast.toString() + "\n\n" );

ast.var("a").replaceWith("a = 'foo'");
console.log( ast.toString() + "\n\n" );

ast.var("a").insertBefore("function before() {}\n");
console.log( ast.toString() + "\n\n" );

ast.var("b").insertAfter("\nfunction after() {}");
console.log( ast.toString() + "\n\n" );

ast.var("b").rename("easy");
console.log( ast.toString() + "\n\n" );

ast.var("easy").delete();
console.log( ast.toString() );


