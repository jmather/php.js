var assert = require("assert");
var runtime = require('../runtime');
var parser = require('../parser').parser;
require('../interpreter');

describe('Runtime', function() {
  it('creates global when setting undeclared local', function() {
    var global = new runtime.PHPScope()
    var scope = new runtime.PHPScope(runtime.root, global);
    scope.set('x', runtime.true)

    assert.equal(runtime.true, global.get('x'));
  });

  it('call functions', function() {
    var func = new runtime.PHPFunction('test', ['a'], parser.parse('return $a;'));

    assert.equal(runtime.true, func.__call(null, runtime.root, [runtime.true]));
  });

  describe('new Function', function() {

    it('passes arguments', function() {
      var func = new runtime.PHPFunction('test', ['a'], parser.parse('$b = $a; return $b;'));
      var result = func.__call(null, runtime.root, [runtime.true]);

      assert.equal(runtime.true, result);
    });

  });

})