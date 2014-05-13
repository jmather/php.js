// # The Tokens
// The tokens are the atomic units of our programs. We tag each one with a type.
// This stream of tokens will then be fed to the parser.
//
// Note that the rules are applied from top to bottom, first one to match.

%%

"//".*                // ignore comment

\n+                   // skip newlines
\s+                   // skip other whitespace

// Literals: the hard-coded values in your programs.
[0-9]+\b              return 'NUMBER';
[0-9]*\.[0-9]+\b      return 'NUMBER';
[0-9]+\.[0-9]*\b      return 'NUMBER';
\"[^"]*\"             return 'STRING';
\'[^']*\'             return 'STRING';
"true"                return 'TRUE';
"false"               return 'FALSE';
"null"                return 'NULL';

// Keywords
"<?php"               return "OPEN_PHP";
"?>"                  return "CLOSE_PHP";
"public"              return 'PUBLIC_ACCESS';
"private"             return 'PRIVATE_ACCESS';
"protected"           return 'PROTECTED_ACCESS';
"function"            return 'FUNCTION';
"return"              return 'RETURN';
"new"                 return 'NEW';

// Identifiers are names: variable and function names.
[a-zA-Z_]\w*          return 'IDENTIFIER';

// Operators
"=="                  return '==';
"!="                  return '!=';
"==="                 return '===';
"!=="                 return '!==';
"&&"                  return '&&';
"||"                  return '||';
"=>"                  return '=>'
"->"                  return '->'
"::"                  return '::'

// We end with a catch all rule. Any one single character that has not been matched
// will be handled here. A few examples: `.`, `+`, `(` and `)`.
.                     return yytext;

<<EOF>>               return 'EOF';
