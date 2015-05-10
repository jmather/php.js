// Define all the nodes produced by the parser.

exports.BlockNode = function BlockNode(nodes) {
    this.nodes = nodes || [];
};

exports.BlockNode.prototype.push = function (node) {
    this.nodes.push(node);
};

exports.NumberNode = function NumberNode(value) {
    this.value = value;
};
exports.StringNode = function StringNode(value) {
    this.value = value;
};

exports.TrueNode = function TrueNode() {};
exports.FalseNode = function FalseNode() {};
exports.NullNode = function NullNode() {};

exports.GetVariableNode = function GetVariableNode(name) {
    this.name = name;
};

exports.SetVariableNode = function SetVariableNode(name, valueNode) {
    this.name = name;
    this.valueNode = valueNode;
};

exports.CallNode = function CallNode(name, argumentNodes) {
    this.name = name;
    this.argumentNodes = argumentNodes;
};

exports.FunctionNode = function FunctionNode(name, parameters, bodyNode) {
    this.name = name;
    this.parameters = parameters;
    this.bodyNode = bodyNode;
};

exports.ReturnNode = function ReturnNode(valueNode) {
    this.valueNode = valueNode;
};

exports.AddNode = function AddNode(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
};

exports.SubtractNode = function SubtractNode(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
};

exports.MultiplyNode = function MultiplyNode(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
};

exports.DivideNode = function DivideNode(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
};

exports.ConcatNode = function ConcatNode(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
};

exports.IfNode = function IfNode(expresion, body) {
    this.expresion = expresion;
    this.body = body;
};

exports.EqualsNode = function EqualsNode(argument1, argument2) {
    this.arg1 = argument1;
    this.arg2 = argument2;
};