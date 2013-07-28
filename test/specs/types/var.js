var expect = require("chai").expect;
var Tree = require("../../../lib/tree");

describe("variable modification api", function() {
  beforeEach(function() {
    this.tree = new Tree("var a = 'foo';");
  });

  it("should update the value", function() {
    this.tree.var("a").value("'bar'");
    expect( this.tree.toString() ).to.equal("var a = 'bar';");
  });

  it("should update the name", function() {
    this.tree.var("a").rename("b");
    expect( this.tree.toString() ).to.equal("var b = 'foo';");
  });

  it("should insert before", function() {
    this.tree.var("a").insertBefore("a string");
    expect( this.tree.toString() ).to.equal("a stringvar a = 'foo';");
  });

  it("should insert after", function() {
    this.tree.var("a").insertAfter("a string");
    expect( this.tree.toString() ).to.equal("var a = 'foo';a string");
  });

  it("should replace", function() {
    this.tree.var("a").replaceWith("foo = 'bar'");
    expect( this.tree.toString() ).to.equal("var foo = 'bar';");
  });

  it("should delete a full variable assignment", function() {
    this.tree.var("a").delete();
    expect( this.tree.toString() ).to.equal("");
  });

  it("should delete a partial variable assignment", function() {
    var src = "var a = 'a', b = 'b';";
    var tree = new Tree( src );
    tree.var("b").delete();
    expect( tree.toString() ).to.equal("var a = 'a';");

    var tree2 = new Tree( src );
    tree2.var("a").delete();
    expect( tree2.toString() ).to.equal("var b = 'b';");
  });
});
