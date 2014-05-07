# Run a .php file both on php.js and php and diff the output.

# Run on tiny.js
node php.js $1 > __phpjs_output.txt

# Run on node and replace some property names.
php $1 > __php_output.txt

echo "$1:"
diff __phpjs_output.txt __php_output.txt && echo "ok"

rm __phpjs_output.txt __php_output.txt