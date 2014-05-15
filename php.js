#!/usr/bin/env node
// # Putting it all together
//
// All the pieces of our language are put together here.
//
// usage: node php.js samples/hello-world.php

var parser = require('./src/parser').parser;
var interpreter = require('./src/interpreter');
var runtime = require('./src/runtime');
var fs = require('fs');

// We first read the file passed as an argument to the process.
var file = process.argv[2];
var code = fs.readFileSync(file, "utf8");

// We then feed the code to the parser. Which will turn our code into
// a tree of nodes.
var node = parser.parse(code);

// Finally, start the evaluation of our program on the top of the tree,
// passing the root (global) object as the scope in which to start its execution.
node.eval(runtime.rootScope);
