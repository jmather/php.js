var assert = require("assert");
var runtime = require('../src/runtime');
var parser = require('../src/parser').parser;
require('../src/interpreter');

describe('Interpreter', function () {
    it('returns', function () {
        var nodes = parser.parse('return true; return false;');

        assert.equal(runtime.true, nodes.eval(runtime.root));
    });

    it('set properties', function () {
        var nodes = parser.parse('$x = true; return $x;');

        assert.equal(runtime.true, nodes.eval(runtime.root));
    });

    it('define function', function () {
        var nodes = parser.parse('function thing() { return true; }; return thing();');

        assert.equal(runtime.true, nodes.eval(runtime.root));
    });

    it('call function', function () {
        parser.parse('$a = true; function test($x) { return $x };').eval(runtime.root);

        var nodes = parser.parse('return test($a);');

        assert.equal(runtime.true, nodes.eval(runtime.root));
    });

    describe('Arithmetic', function() {
        it('can add', function() {
            var nodes = parser.parse('return 1 + 1;');
            assert.equal(nodes.eval(runtime.root).value, 2);
        });
        it('can subtract', function() {
            var nodes = parser.parse('return 2 - 1;');
            assert.equal(nodes.eval(runtime.root).value, 1);
        });
        it('can multiply', function() {
            var nodes = parser.parse('return 2 * 2;');
            assert.equal(nodes.eval(runtime.root).value, 4);
        });
        it('can divide', function() {
            var nodes = parser.parse('return 4 / 2;');
            assert.equal(nodes.eval(runtime.root).value, 2);
        });
    });
});