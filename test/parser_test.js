var assert = require("assert");
var parser = require('../src/parser').parser;
var nodes = require('../src/nodes');

describe('Parser', function() {
  it('parses numbers', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.NumberNode(1)
      ]),
      parser.parse("<?php 1;"));
  });

  it('parses statements', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.NumberNode(1),
        new nodes.NumberNode(2),
      ]),
      parser.parse("<?php 1; 2;"));
  });

  it('parses variable assignment', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.SetVariableNode("a", new nodes.NumberNode(1))
      ]),
      parser.parse("<?php $a = 1;"));
  });

  it('parses call', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.CallNode("thing", [new nodes.NumberNode(1), new nodes.NumberNode(2)])
      ]),
      parser.parse("<?php thing(1, 2);"));
  });

  it('parses operators respecting precedence', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.AddNode(new nodes.NumberNode(1),
                          new nodes.MultiplyNode(new nodes.NumberNode(2), new nodes.NumberNode(3))
                         )
      ]),
      parser.parse("<?php 1 + 2 * 3;"));
  });

  it('parses function', function() {
    assert.deepEqual(
      new nodes.BlockNode([
        new nodes.FunctionNode("thing", ["a", "b"], new nodes.BlockNode([ new nodes.ReturnNode(new nodes.StringNode('hello')) ]))
      ]),
      parser.parse("<?php function thing($a, $b) { return 'hello'; }"));
  });

});