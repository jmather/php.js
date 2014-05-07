var assert = require("assert");
var lexer = require('../lexer');

describe('Lexer', function () {
    it('lex new lines', function () {
        assert.deepEqual([
            ["EOF", ""]
        ], lexer.lex("\n"));
    });

    it('discards comments', function () {
        assert.deepEqual([
            ["EOF", ""]
        ], lexer.lex("// hi"));
    });

    it('lex numbers', function () {
        assert.deepEqual([
            ["NUMBER", "1"],
            ["EOF", ""]
        ],lexer.lex('1'));
    });

    it('lex strings', function () {
        assert.deepEqual([
            ["STRING", '"hi"'],
            ["EOF", ""]
        ], lexer.lex('"hi"'));
    });

    it('lex true', function () {
        assert.deepEqual([
            ["TRUE", 'true'],
            ["EOF", ""]
        ], lexer.lex('true'));
    });

    it('catch all one character', function () {
        assert.deepEqual([
            ["+", '+'],
            [".", '.'],
            ["(", '('],
            ["EOF", ""]
        ], lexer.lex('+ . ('));
    });
});
