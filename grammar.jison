// # The Parser's Grammar
//
// This grammar will be used to generate the parser (parser.js). It will turn the stream of
// tokens (defined in tokens.jisonlex) into a tree of nodes (defined in nodes.js).

%{
  var nodes = require('./nodes');
%}

// Based on [MDN Operator Precedence table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).
%left  ','
%right '='
%left  '||'
%left  '&&'
%left  '==' '!=' '===' '!=='
%left  '>' '>=' '<' '<='
%left  '+' '-'
%left  '*' '/'
%right '!'
%right NEW
%right '.'

%start program  // Tell which rule to start with.

%%

// A JavaScript program is composed of statements.
program:
  statements EOF              { return $1; }
;

statements:
  statement                        { $$ = new nodes.BlockNode([ $1 ]); }
| statements terminator statement  { $1.push($3); // statements ($1) is a BlockNode
                                     $$ = $1; }
| statements terminator            { $$ = $1; }
|                                  { $$ = new nodes.BlockNode([]); }
;

terminator:
  ";"
;

statement:
  expression
| return
;

// Expressions, as opposed to statements, return a value and can be nested inside
// other expressions or statements.
expression:
  literal
| variable
| call
| operator
| function
| '(' expression ')'           { $$ = $2; }
;

// Literals are the hard-coded values in our program.
literal:
  NUMBER                       { $$ = new nodes.NumberNode(parseInt($1)); }
| STRING                       { $$ = new nodes.StringNode($1.substring(1, $1.length-1)); }
| TRUE                         { $$ = new nodes.TrueNode(); }
| FALSE                        { $$ = new nodes.FalseNode(); }
| NULL                         { $$ = new nodes.NullNode(); }
;

// And on and on we define the rest of our language ...
// Keep in mind this grammar only handles a subset of the PHP and is
// intended to be as simple as possible and easy to understand.

variable:
  VAR IDENTIFIER                { $$ = new nodes.GetVariableNode($2); }
| VAR IDENTIFIER "=" expression     { $$ = new nodes.SetVariableNode($2, $4); }
;

call:
  IDENTIFIER "(" arguments ")"                { $$ = new nodes.CallNode(null, $1, $3); }
;

arguments:
  expression                   { $$ = [ $1 ]; }
| arguments "," expression     { $1.push($3); $$ = $1 }
|                              { $$ = []; }
;

operator:
  expression '+' expression    { $$ = new nodes.AddNode($1, $3) }
| expression '*' expression    { $$ = new nodes.MultiplyNode($1, $3) }
;

function:
  FUNCTION IDENTIFIER "(" parameters ")" "{" statements "}"
                               { $$ = new nodes.FunctionNode($2, $4, $7) }
;

parameters:
  VAR IDENTIFIER                   { $$ = [ $2 ]; }
| parameters "," VAR IDENTIFIER    { $1.push($4); $$ = $1 }
|                                  { $$ = []; }
;

return:
  RETURN                       { $$ = new nodes.ReturnNode() }
| RETURN expression            { $$ = new nodes.ReturnNode($2) }
;
