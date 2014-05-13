var assert = require("assert");
var runtime = require('../src/runtime');
var parser = require('../src/parser').parser;
require('../src/interpreter');

describe('Runtime', function () {
    it('creates local when setting undeclared local', function () {
        var global = new runtime.PHPScope()
        var scope = new runtime.PHPScope(runtime.root, global);
        scope.set('x', runtime.true)

        assert.equal(runtime.true, scope.get('x'));
    });

    it('fetches from global when asking for local', function () {
        var global = new runtime.PHPScope()
        var scope = new runtime.PHPScope(runtime.root, global);
        global.set('x', runtime.true)

        assert.equal(runtime.true, scope.get('x'));
    });

    it('call functions', function () {
        var func = new runtime.PHPFunction('test', ['a'], parser.parse('return $a;'));

        assert.equal(runtime.true, func.__call(runtime.root, [runtime.true]));
    });

    describe('new Function', function () {

        it('passes arguments', function () {
            var func = new runtime.PHPFunction('test', ['a'], parser.parse('$b = $a; return $b;'));
            var result = func.__call(runtime.root, [runtime.true]);

            assert.equal(runtime.true, result);
        });

    });

})