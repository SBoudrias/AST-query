var Tree = require("../lib/tree");
var codeStr = 'var a = "bar", b = "foo";';

// Test code
var ast = new Tree(codeStr);

ast.var("a").value("'a'");
ast.update();

console.log( ast.toString() );