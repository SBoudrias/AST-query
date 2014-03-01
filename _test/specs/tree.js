var expect = require("chai").expect;
var Tree = require("../../lib/tree");

describe("root entry/Tree API", function() {

  it("should clear it's task queue after it recompile the source", function() {
    var tree = new Tree();
    tree.var("a");
    expect(tree.tokens.length).to.equal(1);
    tree.toString();
    expect(tree.tokens.length).to.equal(0);
  });

});
