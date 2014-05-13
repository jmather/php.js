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
//
// Scopes also have a parent scope. The chain of parents will go down to the root scope,
// where you define your global variables.

exports.PHPScope = function PHPScope(_this, parent) {
    this.locals = {};     // local variables
    this.this = _this;    // value of `this`
    this.parent = parent; // parent scope
    this.root = !parent;  // is it the root/global scope?
};

exports.PHPScope.prototype.hasLocal = function(name) {
  return this.locals.hasOwnProperty(name);
};

// Getting the value in a variable is done by looking first in the current scope,
// then recursively going in the parent until we reach the root scope.
// This is how you get access to variables defined in parent functions,
// also why defining a variable in a function will override the variables of parent
// functions and global variables.

exports.PHPScope.prototype.get = function(name) {
  if (this.hasLocal(name)) return this.locals[name]; // Look in current scope
  if (this.parent) return this.parent.get(name); // Look in parent scope
  throw this.name + " is not defined";
};

// Setting the value of a variables follows the same logic as when getting it's value.
// We search where the variable is defined, and change its value. If the variable
// was not defined in any parent scope, we'll end up in the root scope, which will have
// the effect of declaring it as a global variable.

exports.PHPScope.prototype.set = function(name, value) {
  if (this.root || this.hasLocal(name)) return this.locals[name] = value;
  return this.parent.set(name, value);
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
  var functionScope = new exports.PHPScope(null); // PHP gives each function it's own scope.

  // We assign arguments to local variables. That's how you get access to them.
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

exports.root = new exports.PHPScope();
exports.functions = new exports.PHPScope();

// Here we'd normaly define all the fancy things, like global functions and objects, that you
// have access to inside your PHP programs. We will start with a meager `print`.

exports.functions.set('print', new exports.PHPFunction('print', ['content'], {'eval': function(scope) {
    var val = scope.get('content').value.replace(/\\n/g, "\n");
    process.stdout.write(val);
}}));
