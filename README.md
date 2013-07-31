AST Query
================

Tentative to a simple JavaScript AST modification library.

If you've ever worked with AST trying to edit source code, you've probably had a hard time
as the syntax is somehow terse and you need to loop and use conditionnals a lot. AST Query
try to hide this complexity behind a declarative façade.

Making this choice, AST Query does not try to cover a full AST API, but instead answer
common needs.


Getting Started
================

Install: `npm install --save ast-query`

First, you always need to create a `Tree` which you'll edit

``` javascript
var Tree = require("ast-query");
var tree = new Tree("var a = 'foo'");
```

To get the source code back after modifying the AST, call the `toString` method on the
tree.

``` javascript
// ...
tree.var("a").value("'bar'");

console.log( tree.toString() );
// LOG: var a = 'bar';
```

Reminder you're editing source code. As so, you'll need to add extra quotes when outputting
strings (e.g.: `"'foo'"`).

Also, note that AST Query isn't checking you output valid code; neither does it check for
whitespace consistency. You may want to pass each transformed sources in a beautifier if
this is important.


API
================

Tree
----------------

### `new Tree( sourceCode )`
- **sourceCode**
- type: String
- The source code to edit.

### `tree.var( name )`
- **name**
- type: String
- The variable name
- Returns: A `variable` token. [See object methods](#variable-token)

### `tree.object()`
- Returns: An `object` literal token. [See object methods](#object-literal-token)


Variable token
-----------------

### `.value( value )`
- **value**
- type: String|function
- A string containing the new variable value or a function taking the current value as
a parameter and returning the new variable value

### `.rename( name )`
- **name**
- type: String
- Change the variable name

### `.replaceWith( value )`
- **value**
- type: String
- Replace the current variable declaration string with a new one. Note this method only
replace the string between the var declarations tokens, e.g. `var <value goes here>;`

### `.insertAfter( value )`
- **value**
- type: String
- Insert a string after the variable declaration code blocks. If there's multiple
declaration inside the code block, the string will be inserted after everyone.

### `.insertBefore( value )`
- **value**
- type: String
- Insert a string before the `var` keyword

### `.delete()`
- Delete the variable declaration. If the declaration block contain a single variable,
it'll delete it all, otherwise, it'll only delete the relevant section


Object literal token
--------------------

### `.assignedTo( name )`
- **name**
- type: String
- Only select object assigned to a `var`.

### `.passedTo( name )`
- **name**
- type: String
- Only select object passed as argument to a `function` or a `method`
- Known issue: Currently only work with objects nested two levels down. (PR welcomed)

Example:
```javascript
var tree = new Tree("grunt.init({ key: 'value' })");
tree.object().passedTo("grunt.init").key("key").value("'foo'");
console.log( tree.toString() );
```

### `.key( name )`
- **name**
- type: String
- A key name to select
- Returns: A `Property` token. [See object methods](#property-token)


Property token
------------------

### `.value( value )`
- **value**
- type: String|function
- A string containing the new property value or a function taking the current value as
a parameter and returning the new property value

### `.rename( name )`
- **name**
- type: String
- Change the variable property key

### `.delete()`
- Delete the property from the object.

### `.key( name )`
- **name**
- type: String
- If the property value is an object, key name to select (if value is not an object, this
condition is just ignored).
- Returns: A `Property` token.


Contributing
=====================

**Style Guide**: Please base yourself on [Idiomatic.js](https://github.com/rwldrn/idiomatic.js)
style guide with two space indent  
**Unit test**: Unit test are wrote in Mocha. Please add a unit test for every new feature
or bug fix. `npm test` to run the test suite.  
**Documentation**: Add documentation for every API change. Feel free to send corrections
or better docs!  
**Pull Requests**: Send _fixes_ PR on the `master` branch. Any new features should be send
on the `wip`branch.


License
=====================

Copyright (c) 2013 Simon Boudrias (twitter: @vaxilart)  
Licensed under the MIT license.
