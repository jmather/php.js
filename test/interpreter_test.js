var assert = require("assert");
var runtime = require('../runtime');
var parser = require('../parser').parser;
require('../interpreter');

describe('Interpreter', function() {
  it('returns', function() {
    var nodes = parser.parse('return true; return false;');

    assert.equal(runtime.true, nodes.eval(runtime.root));
  });

  it('set properties', function() {
    var nodes = parser.parse('$x = true; return $x;');

    assert.equal(runtime.true, nodes.eval(runtime.root));
  });

  it('define function', function() {
    var nodes = parser.parse('function thing() { return true; }; return thing();');

    assert.equal(runtime.true, nodes.eval(runtime.root));
  });

  it('call function', function() {
    parser.parse('$a = true; function test($x) { return $x };').eval(runtime.root);

    var nodes = parser.parse('return test($a);');

    assert.equal(runtime.true, nodes.eval(runtime.root));
  });
});