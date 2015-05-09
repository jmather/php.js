// # The Runtime
//
// The runtime is the environment in which the language executes. Think of it as a box with which
// we'll interact using a specific API. In this file, we're defining this API to build and interact
// with the runtime.
//
// We need to build representations for everything we'll have access to inside the language.

exports.PHPValue = function PHPValue(value) {
    this.value = value;
};

// ## Scopes
//
// A scope encapsulates the context of execution, the local variables and the value of `this`,
// inside a function or at the root of your program.

exports.PHPScope = function PHPScope() {
    this.locals = {};     // local variables
};

exports.PHPScope.prototype.has = function(name) {
    return (this.locals[name] !== undefined);
};

// Getting the value in a variable is done by looking in the scope,
exports.PHPScope.prototype.get = function(name) {
    if (this.has(name)) // Look in current scope
        return this.locals[name];

    return null; // maybe in the future we will warn people...
};

// Setting the value of a variables follows the same logic as when getting it's value.
// We search where the variable is defined, and change its value. If the variable
// was not defined in any parent scope, we'll end up in the root scope, which will have
// the effect of declaring it as a global variable.

exports.PHPScope.prototype.set = function(name, value) {
    return this.locals[name] = value;
};

// ## Functions
//
// Functions encapsulate a body (block of code) that we can execute (eval), and also parameters:
// `function (parameters) { body }`.

exports.PHPFunction = function PHPFunction(name, parameters, body) {
    this.name = name;
    this.body = body;
    this.parameters = parameters;
};

// When the function is called, a new scope is created so that the function will have its
// own set of local variables and its own value for `this`.
//
// The function's body is a tree of nodes.
// - nodes.js defines those nodes.
// - interpreter.js defines how each node is evaluated.
//
// To execute the function, we `__call` its body.

exports.PHPFunction.prototype.__call = function(scope, args) {
  // PHP gives each function it's own scope.
  var functionScope = new exports.PHPScope();

  // We assign arguments to local variables.
  for (var i = 0; i < this.parameters.length; i++) {
    functionScope.set(this.parameters[i], args[i]);
  }

  return this.body.eval(functionScope);
};

// ## Primitives
//
// We map the primitives to their JavaScript counterparts (in their `value` property).
// Note that `true` and `false` are objects, but `null` and `undefined` are not..

exports.true = new exports.PHPValue(true);
exports.false = new exports.PHPValue(false);
exports.null = new exports.PHPValue(null);


// ## The root object
//
// The only missing piece of the runtime at this point is the root (global) object.
//
// It is the scope of execution at the root of your program and also the `root` or `window`
// object that you get access to.
// 
// Thus, we create it as a scope that also acts as an object (has properties).

exports.rootScope = new exports.PHPScope();
exports.functionScope = new exports.PHPScope();

// Here we'd normaly define all the fancy things, like global functions and objects, that you
// have access to inside your PHP programs. We will start with a meager `print`.

exports.functionScope.set('print', new exports.PHPFunction('print', ['content'], {'eval': function(scope) {
    var val = scope.get('content').value.replace(/\\n/g, "\n");
    process.stdout.write(val);
}}));
