// # The Interpreter
// 
// The interpreter part of our language is where we'll evaluate the nodes to execute the program.
// Thus the name `eval` for the function we'll be defining here.
//
// We'll add an `eval` function to each node produced by the parser. Each node will know how to
// evaluate itself. For example, a `StringNode` will know how to turn itself into a real string
// inside our runtime.

var nodes = require('./nodes');
var runtime = require('./runtime');

// The top node of a tree will always be of type `BlockNode`. Its job is to spread the call to
// `eval` to each of its children.

nodes.BlockNode.prototype.eval = function(scope) {
  try {
    // Hoist declarations
    this.nodes.forEach(function(node) { if (node.declare) node.declare(scope) });
    // Eval after
    this.nodes.forEach(function(node) { node.eval(scope) });
  } catch (e) {
    if (e instanceof Return) {
      return e.value;
    } else {
      throw e;
    }
  }
}

function Return(value) { this.value = value; }

nodes.ReturnNode.prototype.eval = function(scope) {
  throw new Return(this.valueNode ? this.valueNode.eval(scope) : runtime.undefined);
}

// Literals are pretty easy to eval. Simply return the runtime value.

nodes.TrueNode.prototype.eval      = function(scope) { return runtime.true; };
nodes.FalseNode.prototype.eval     = function(scope) { return runtime.false; };
nodes.NullNode.prototype.eval      = function(scope) { return runtime.null; };

// Creating various objects is done by instantiating `JsObject`.

nodes.StringNode.prototype.eval = function(scope) { return new runtime.PHPValue(this.value); };
nodes.NumberNode.prototype.eval = function(scope) { return new runtime.PHPValue(this.value); };


// Variables are stored in the current scope. All we need to do to interpret the variable nodes is
// get and set values in the scope.

nodes.GetVariableNode.prototype.eval = function(scope) {
  return scope.get(this.name);
}

nodes.SetVariableNode.prototype.eval = function(scope) {
  return scope.set(this.name, this.valueNode.eval(scope));
}

// Creating a function is just a matter of instantiating `JsFunction`.

nodes.FunctionNode.prototype.eval = function(scope) {
  var func = new runtime.PHPFunction(this.name, this.parameters, this.bodyNode);

  if (this.name !== null) {
    runtime.root.locals[this.name] = func;
  }

  return func;
};

// Calling a function can take two forms:
//
// 1. On an object: `object->name(...)`. `this` will be set to `object`.
// 2. On a variable: `name(...)`. `this` will be set to the `root` object.

nodes.CallNode.prototype.eval = function(scope) {
  if (this.objectNode) { // object.name(...)
    var object = this.objectNode.eval(scope);
    var theFunction = object.get(this.name);
  } else { // name()
    var object = runtime.root;
    var theFunction = scope.get(this.name);
  }

  var args = this.argumentNodes.map(function(arg) { return arg.eval(scope) });

  return theFunction.__call(object, scope, args);
}


// Operators

nodes.AddNode.prototype.eval = function(scope) {
  return new runtime.PHPValue(this.node1.eval(scope).value + this.node2.eval(scope).value);
}
nodes.MultiplyNode.prototype.eval = function(scope) {
  return new runtime.PHPValue(this.node1.eval(scope).value * this.node2.eval(scope).value);
}
