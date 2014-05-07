// # The Runtime
//
// The runtime is the environment in which the language executes. Think of it as a box with which
// we'll interact using a specific API. In this file, we're defining this API to build and interact
// with the runtime.
//
// We need to build representations for everything we'll have access to inside the language.
// The first one being: objects!

var util = require("util");

// ## Object
// Objects have properties. One missing piece here is the prototype. To keep things simple,
// we will not have any form of inheritance. All our objects will be able to do is get and set
// the values stored in its properties.
//
// It will also be able to wrap a real JavaScipt value, like a string or a number. We'll use this
// to represent strings and numbers inside our runtime. Every object living inside our program,
// will be an instance of `JsObject`.
// 
// If we want to create a number in our runtime, we do: `new JsObject(4)`.

function PHPValue(value) {
    this.value = value;
};
exports.PHPValue = PHPValue;

function PHPStdClass() {
  this.properties = {};
}
exports.PHPStdClass = PHPStdClass;

PHPStdClass.prototype.hasProperty = function(name) {
  return this.properties.hasOwnProperty(name);
};

PHPStdClass.prototype.__get = function(name) {
  if (this.hasProperty(name)) return this.properties[name];
};

PHPStdClass.prototype.__set = function(name, value) {
  return this.properties[name] = value;
};


// ## Scopes
//
// The most confusing part of JavaScript is the way it handles the scope of variables.
// When is it defined as a global variable? What's the value of `this`?
// All of this can be implemented in a very simple and straightforward fashion.
//
// A scope encapsulates the context of execution, the local variables and the value of `this`,
// inside a function or at the root of your program.
//
// Scopes also have a parent scope. The chain of parents will go down to the root scope,
// where you define your global variables.

function PHPScope(_this, parent) {
  this.locals = {};     // local variables
  this.this = _this;    // value of `this`
  this.parent = parent; // parent scope
  this.root = !parent;  // is it the root/global scope?
}
exports.PHPScope = PHPScope;

PHPScope.prototype.hasLocal = function(name) {
  return this.locals.hasOwnProperty(name);
};

// Getting the value in a variable is done by looking first in the current scope,
// then recursively going in the parent until we reach the root scope.
// This is how you get access to variables defined in parent functions,
// also why defining a variable in a function will override the variables of parent
// functions and global variables.

PHPScope.prototype.get = function(name) {
  if (this.hasLocal(name)) return this.locals[name]; // Look in current scope
  if (this.parent) return this.parent.get(name); // Look in parent scope
  throw this.name + " is not defined";
};

// Setting the value of a variables follows the same logic as when getting it's value.
// We search where the variable is defined, and change its value. If the variable
// was not defined in any parent scope, we'll end up in the root scope, which will have
// the effect of declaring it as a global variable.
//
// This is why, in JavaScript, if you assign a value to a variable without declaring it first
// (using `var`), it will search in parent scopes until it reaches the root scope and
// declare it there, thus declaring it as a global variable.

PHPScope.prototype.set = function(name, value) {
  if (this.root || this.hasLocal(name)) return this.locals[name] = value;
  return this.parent.set(name, value);
};


// ## Functions
//
// Functions encapsulate a body (block of code) that we can execute (eval), and also parameters:
// `function (parameters) { body }`.

function PHPFunction(name, parameters, body) {
  this.name = name;
  this.body = body;
  this.parameters = parameters;
}
exports.PHPFunction = PHPFunction;

// When the function is called, a new scope is created so that the function will have its
// own set of local variables and its own value for `this`.
//
// The function's body is a tree of nodes.
// - nodes.js defines those nodes.
// - eval.js defines how each node is evaluated.
//
// To execute the function, we `__call` its body.

PHPFunction.prototype.__call = function(object, scope, args) {
  var functionScope = new PHPScope(object, null); // this = object, parent scope = scope

  // We assign arguments to local variables. That's how you get access to them.
  for (var i = 0; i < this.parameters.length; i++) {
    functionScope.locals[this.parameters[i]] = args[i];
  }

    console.log(this.body);
  return this.body.eval(functionScope);
};

// ## Primitives
//
// We map the primitives to their JavaScript counterparts (in their `value` property).
// Note that `true` and `false` are objects, but `null` and `undefined` are not..

exports.true = { value: true };
exports.false = { value: false };
exports.null = { value: null };


// ## The root object
//
// The only missing piece of the runtime at this point is the root (global) object.
//
// It is the scope of execution at the root of your program and also the `root` or `window`
// object that you get access to.
// 
// Thus, we create it as a scope that also acts as an object (has properties).

var root = exports.root = new PHPStdClass();
root.this = root; // this == root when inside the root scope.

// Properties of the root/global scope are also the local variables. That's why when you
// use `var a = 1;` in the root scope, it will also assign the value to `root.a`.

root.locals = {};

// Here we'd normaly define all the fancy things, like global funtions and objects, that you
// have access to inside your JavaScript programs. But we're keeping it simple and only define
// `root`, the `console.log` and `alert` functions.

root.locals['root'] = root;
root.locals['print'] = new PHPFunction(['content'], {'__call': function(scope) {
    console.log(scope.get('content').value);
}});
