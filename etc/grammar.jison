// # The Parser's Grammar
//
// This grammar will be used to generate the parser (parser.js). It will turn the stream of
// tokens (defined in tokens.jisonlex) into a tree of nodes (defined in nodes.js).

%{
  var nodes = require('./nodes');
%}

// Based on [PHP Specification](https://github.com/php/php-src/blob/master/Zend/zend_language_parser.y).
%left  ','
%right '='
%left  '||'
%left  '&&'
%nonassoc  '==' '!=' '===' '!=='
%nonassoc  '>' '>=' '<' '<='
%left  '+' '-' '.'
%left  '*' '/'
%right '!'

%start program  // Tell which rule to start with.

%%

// A PHP program is composed of a document starting with <?php and then containing a block of statements.
program:
  OPEN_PHP statements EOF   { return $2; }
| OPEN_PHP statements CLOSE_PHP { return $2; }
;

statements:
  statement              { $$ = new nodes.BlockNode([ $1 ]); }
| statements statement   { $1.push($2); $$ = $1; }
;

statement:
  expression ';'         { $$ = $1 }
| return ';'             { $$ = $1 }
| function
| if_statement
| ';'                    { $$ = new nodes.BlockNode([]); }
;

if_statement:
  IF "(" expression ")" "{" statements "}" { $$ = new nodes.IfNode($3, $6); }
;

// Expressions, as opposed to statements, return a value and can be nested inside
// other expressions or statements.
expression:
  literal
| variable
| call
| operator
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
  "$" IDENTIFIER                { $$ = new nodes.GetVariableNode($2); }
| "$" IDENTIFIER "=" expression     { $$ = new nodes.SetVariableNode($2, $4); }
;

call:
  IDENTIFIER "(" arguments ")"                { $$ = new nodes.CallNode($1, $3); }
;

arguments:
  expression                   { $$ = [ $1 ]; }
| arguments "," expression     { $1.push($3); $$ = $1 }
|                              { $$ = []; }
;

operator:
  expression '+' expression    { $$ = new nodes.AddNode($1, $3) }
| expression '*' expression    { $$ = new nodes.MultiplyNode($1, $3) }
| expression '-' expression    { $$ = new nodes.SubtractNode($1, $3) }
| expression '/' expression    { $$ = new nodes.DivideNode($1, $3) }
| expression '.' expression    { $$ = new nodes.ConcatNode($1, $3) }
| expression '==' expression    { $$ = new nodes.EqualsNode($1, $3) }
;

function:
  FUNCTION IDENTIFIER "(" parameters ")" "{" statements "}"  { $$ = new nodes.FunctionNode($2, $4, $7) }
;

parameters:
  "$" IDENTIFIER                   { $$ = [ $2 ]; }
| parameters "," "$" IDENTIFIER    { $1.push($4); $$ = $1 }
|                                  { $$ = []; }
;

return:
  RETURN                       { $$ = new nodes.ReturnNode() }
| RETURN expression            { $$ = new nodes.ReturnNode($2) }
;
