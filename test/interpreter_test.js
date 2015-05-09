var assert = require("assert");
var runtime = require('../src/runtime');
var parser = require('../src/parser').parser;
require('../src/interpreter');

describe('Interpreter', function () {
    it('returns', function () {
        var nodes = parser.parse('<?php return true; return false;');

        assert.equal(runtime.true, nodes.eval(runtime.rootScope));
    });

    it('set properties', function () {
        var nodes = parser.parse('<?php $x = true; return $x;');

        assert.equal(runtime.true, nodes.eval(runtime.rootScope));
    });

    it('define function', function () {
        var nodes = parser.parse('<?php function thing() { return true; } return thing();');

        assert.equal(runtime.true, nodes.eval(runtime.rootScope));
    });

    it('call function', function () {
        parser.parse('<?php $a = true; function test($x) { return $x; };').eval(runtime.rootScope);

        var nodes = parser.parse('<?php return test($a);');

        assert.equal(runtime.true, nodes.eval(runtime.rootScope));
    });

    describe('Arithmetic', function() {
        it('can add', function() {
            var nodes = parser.parse('<?php return 1 + 1;');
            assert.equal(nodes.eval(runtime.rootScope).value, 2);
        });
        it('can subtract', function() {
            var nodes = parser.parse('<?php return 2 - 1;');
            assert.equal(nodes.eval(runtime.rootScope).value, 1);
        });
        it('can multiply', function() {
            var nodes = parser.parse('<?php return 2 * 2;');
            assert.equal(nodes.eval(runtime.rootScope).value, 4);
        });
        it('can divide', function() {
            var nodes = parser.parse('<?php return 4 / 2;');
            assert.equal(nodes.eval(runtime.rootScope).value, 2);
        });
    });
});