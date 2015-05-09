var assert = require("assert");
var runtime = require('../src/runtime');
var parser = require('../src/parser').parser;
require('../src/interpreter');

describe('Runtime', function () {
    it('creates local when setting undeclared local', function () {
        var scope = new runtime.PHPScope();
        scope.set('x', runtime.true);

        assert.equal(runtime.true, scope.get('x'));
    });

    it('call functions', function () {
        var func = new runtime.PHPFunction('test', ['a'], parser.parse('<?php return $a;'));

        assert.equal(runtime.true, func.__call(runtime.root, [runtime.true]));
    });

    describe('new Function', function () {

        it('passes arguments', function () {
            var func = new runtime.PHPFunction('test', ['a'], parser.parse('<?php $b = $a; return $b;'));
            var result = func.__call(runtime.root, [runtime.true]);

            assert.equal(runtime.true, result);
        });

    });

})