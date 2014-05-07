// Define all the nodes produced by the parser.

exports.BlockNode = function BlockNode(nodes) {
    this.nodes = nodes;
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
exports.UndefinedNode = function UndefinedNode() {};
exports.ObjectNode = function ObjectNode() {};

exports.GetVariableNode = function GetVariableNode(name) {
    this.name = name;
};

exports.SetVariableNode = function SetVariableNode(name, valueNode) {
    this.name = name;
    this.valueNode = valueNode;
};

exports.CallNode = function CallNode(objectNode, name, argumentNodes) {
    this.objectNode = objectNode;
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

exports.MultiplyNode = function MultiplyNode(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
};
