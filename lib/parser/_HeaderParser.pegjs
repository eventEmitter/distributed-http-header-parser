/**
 * New convention: every rule consumes whitespace to its right, except the starting rules (to the left).
 */
{
  var   IR = require('./IntermediateRepresentation');

  function argumentsList(first, more){
    var sg = [first];
    for(var i=0; i<more.length; i++){
      sg.push(more[i][1]);
    }
    return sg;
  };
}

/* --------------------------------------------------------------------------------
 * general starting rule
 * ----------------------------------------------------------------------------- */
start   = select

/* --------------------------------------------------------------------------------
 * punctuation and whitespace
 * ----------------------------------------------------------------------------- */
ws "whitespace" = (blank / "\n")*   { return ""; }
blank           = " " / "\t"

dot             = result:'.' ws   { return result; }
comma           = result:',' ws   { return result; }
star            = result:'*' ws   { return result; }
sq              = "'"
dq              = '"'

bracketLeft         = '(' ws
bracketRight        = ')' ws
squareBracketLeft   = '[' ws
squareBracketRight  = ']' ws

bL              = bracketLeft
bR              = bracketRight
sBL             = squareBracketLeft
sBR             = squareBracketRight

epsilon         = &{ return true; }

/* --------------------------------------------------------------------------------
 * letters and digits (guess its faster to use dedicated scanners than composition)
 * ----------------------------------------------------------------------------- */
letter  "letter"                = [A-Z]i
letter_ "letter or underscore"  = [A-Z_]i
word    "word character"        = [A-Z0-9_]i
digit   "a digit"               = [0-9]

/* --------------------------------------------------------------------------------
 * names and identifiers
 * ----------------------------------------------------------------------------- */

identifier "identifier"     = result:(letter_ word*) ws         { return IR.identifier((result.length == 1) ? result[0] : result[0]+result[1].join("")); }
wildcard   "wildcard"       = result:star                       { return IR.wildcard(result); }
/* --------------------------------------------------------------------------------
 * literals
 * ----------------------------------------------------------------------------- */
literal = result:(
              string
            / number
            / boolean
            / null
          ) ws { return IR.literal(result); }

null                = 'null'                            { return null; }

boolean "boolean"   = boolean_true / boolean_false
boolean_true        = 'true'                            { return true; }
boolean_false       = 'false'                           { return false; }

number "number"     = sign:'-'? integer:(digit+) remainder:(dot digit+)? {
    var intPart     = integer.join('')
        , factor    = (sign) ? -1 : 1;
    return ((remainder) ? parseFloat(intPart+remainder[0]+remainder[1].join(''), 10) : parseInt(intPart, 10)) * factor;
}

string "string"     = str:(string_sq / string_dq)       { return str[1].join(""); }
string_sq           = sq string_sq_char* sq
string_sq_char      = char:(('\\' sq) / (!sq .))        { return char.join(""); }

string_dq           = dq string_dq_char* dq
string_dq_char      = char:(('\\' dq) / (!dq .))        { return char.join(""); }

date "date"         = year:date_year '-' month:date_pair '-' day:date_pair ws time:date_time?
                                                    {
    time = time || [0, 0, 0, 0, 0];

    var   hour  = time[0]
        , min   = time[2]
        , sec   = time[4];

    return IR.date(year, month, day, hour, min, sec);
}

date_pair = result:([0-9][0-9])                                         { return parseInt(result.join(""), 10); }
date_year = result:([1-9][0-9][0-9][0-9])                               { return parseInt(result.join(""), 10); }
date_time = date_pair ':' date_pair ':' date_pair

/* --------------------------------------------------------------------------------
 * selectors (dot access and array access)
 * ----------------------------------------------------------------------------- */
access_array                = sBL nested_select:select_list sBR         { return IR.access_array(nested_select); }
access_dot                  = result:((dot identifier)*)                { return IR.access_dot(result); }
access_wildcard             = result:(dot wildcard)                     { return IR.access_dot([result]); }
access_extended             = result:(access_wildcard / access_array)   { return IR.access_extended(result); }

selector_base      "dot-selector"    = base:(identifier/wildcard) dot_access:access_dot      { return IR.selector_base(base, dot_access); }
selector_extended  "nested-selector" = base:selector_base extended_access:access_extended?   { return IR.selector_extended(base, extended_access); }
selector                             = result:(selector_extended)                            { return IR.selector(result); }

select      = ws comma?  statement:select_list comma? !.                     { return statement; }
select_list = single:select_item more:(comma select_item)*                   { return IR.select(argumentsList(single, more)); }
select_item = alias:selector ws agg:(comp_eq ws function)?                   { return IR.select_item(alias, agg); }

/* --------------------------------------------------------------------------------
 * basic values
 * ----------------------------------------------------------------------------- */
value   =   result:(
              array
            / date
            / literal
            / function
            / selector_base
            ) ws { return result; }

/* --------------------------------------------------------------------------------
 * comma separated values
 * ----------------------------------------------------------------------------- */
values  = first:value more:(comma value)*               { return IR.values(argumentsList(first, more)); }

/* --------------------------------------------------------------------------------
 * array
 * ----------------------------------------------------------------------------- */
array "array"   = sBL items:(array_items?) sBR        { return IR.arr(items); }
array_items     = values

/* --------------------------------------------------------------------------------
 * function
 * ----------------------------------------------------------------------------- */
function            = id:identifier bL params:function_arguments? bR        { return IR.func(id, params); }
function_arguments  = values

/* --------------------------------------------------------------------------------
 * filter header
 * ----------------------------------------------------------------------------- */
filter                   = ws comma? result:filter_and_statement comma? !.          { return IR.filter(result); }
filter_and_statement     = single:filter_item more:(comma filter_item)*             { return IR.and_statement(single, more); }
filter_item              = target:filter_selector comp:comparison?                  { return IR.filter_item(target, comp); }
filter_access_array      = sBL nested_filter:filter_and_statement sBR               { return IR.filter_access_array(nested_filter); }
filter_selector_extended = result:(access_wildcard / filter_access_array)           { return IR.filter_selector_extended(result); }
filter_selector          = base:selector_base extended:filter_selector_extended?    { return IR.filter_selector(base, extended); }

/* --------------------------------------------------------------------------------
 * order header
 * ----------------------------------------------------------------------------- */
order           = ws comma? single:order_item more:(comma order_item)* comma? !.{ return IR.order(argumentsList(single, more)); }
order_item      = base:selector_base direction:order_direction?                 { return IR.order_item(base, direction); }
order_direction = identifier

/* --------------------------------------------------------------------------------
 * comparison and operators
 * ----------------------------------------------------------------------------- */
comparison  = operator:comp_op val:value                                     { return IR.comparison(operator, val); }
comp_op     = op:('!=' / comp_eq / '>=' / '<=' / '>' / '<' / 'like'i ) ws    { return op.toUpperCase(); }
comp_eq     = '='