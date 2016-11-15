var   log     = require('ee-log')
    , assert  = require('assert')
    , parser  = require('../lib/parser/HeaderParser')
    , pAssert = require('./ParserAssertion').forParser(parser)
    , allCases= require('./Cases');

/**
 * The following tests only test the ability of the parser to recognize certain syntactical structures which can also
 * be read as a documentation.
 *
 * We don't do any assumptions on the generated AST.
 */

describe('Syntax-Header', function(){

    var   order  = pAssert.forRule('order');

    describe('select (used to query entities and properties)', () => {

        var   select = pAssert.forRule('select')
            , cases  = allCases.casesFor('select', 'select-');

        it( 'single selectors'
            , () => { select.parse(cases.at('single')); });

        it( 'subselectors with dotted accessors'
            , () => { select.parse(cases.at('dotted')); });

        it('all available fields can be queried with the wildcard "*"'
            , () => { select.parse(cases.at('wildcard')); });

        it('the wildcard can be used like any regular selector, but only at the end'
            , () => { select.parse(cases.at('wildcard-dotted')); });

        it('a wildcard can not be queried anymore (has to be at the end of the selector)'
            , () => { select.fail('event.act.*.name'); });

        it(  'selectors with an alias (virtual fields) expressed as a function'
            , () => { select.parse(cases.at('alias')); });

        it( 'functions assigned to an alias can take an arbitrary amount of arguments'
            , () => { select.parse(cases.at('alias-arguments')); });

        it(  'functions assigned to an alias do not have to take parameters'
            , () => { select.parse(cases.at('alias-no-arguments')); });

        it( 'multiple fields to select are divided by a comma'
            , () => { select.parse(cases.at('multi')); });

        it( 'multiple fields of sub entities can be queried using the dotted syntax'
            , () => { select.parse(cases.at('multi2')); });

        it( 'to avoid repetitive selects the parser accepts a nested selector syntax'
            , () => { select.parse(cases.at('nested')); });

        it( 'nested selects can have an alias too'
            , () => { select.parse(cases.at('nested-alias')); });

        it('nested selects can have an arbitrary amount of nesting'
            , () => { select.parse(cases.at('nested-nested')); });

        it('dotted syntax and nested selects can be combined I'
            , () => { select.parse(cases.at('nested-dot')); });

        it('dotted syntax and nested selects can be combined II'
            , () => { select.parse(cases.at('dot-nested')); });

        it('dotted syntax is not allowed to access the nested queries'
            , () => { select.fail('event[venue, act].id'); });

        it('dotted syntax and nested selects can be combined in a multi-field query'
            , () => { select.parse(cases.at('nested-multi')); });

        it('all concepts can be arbitrarily nested and combined'
            , () =>{ select.parse(cases.at('combined')); });

    });

    describe('filter (used to set constraints on queries)', function(){

        var   filter    = pAssert.forRule('filter')
            , cases     = allCases.casesFor('filter', 'filter-');

        it('supports select syntax with an additional comparison', ()=>{
            filter.parse(cases.at('single'));
        });

        it('the comparison supports various operators', ()=>{
            filter.parse(cases.at('lessthan'));
            filter.parse(cases.at('notequal'));
            filter.parse(cases.at('equal'));
            filter.parse(cases.at('lessequal'));
            filter.parse(cases.at('moreequal'));
            filter.parse(cases.at('like'));
        });

        it('the comparison supports booleans for comparison', ()=>{
            filter.parse(cases.at('booleantrue'));
            filter.parse(cases.at('booleanfalse'));
        });

        it('the comparison supports null values', ()=>{
            filter.parse(cases.at('null'));
        });

        it('the comparsion supports arrays', ()=>{
            filter.parse(cases.at('array'));
        });

        it('the comparsion supports strings', ()=>{
            filter.parse(cases.at('string'));
        });

        it('the comparsion supports numbers', ()=>{
            filter.parse(cases.at('number'));
        });

        it('the comparsion supports dates', ()=>{
            filter.parse(cases.at('date'));
        });

        it('the comparsion supports dates with time', ()=>{
            filter.parse(cases.at('datetime'));
        });

        it('the comparison supports functions', ()=>{
            filter.parse(cases.at('function'));
        });

        it('the comparison supports basic selectors', ()=>{
            filter.parse(cases.at('selector'));
        });

        it('filters can be and connected using the "," (analogous to selects)', ()=>{
            filter.parse(cases.at('multi'));
        });

        it('filters can use the nested syntax (analogous to selects)', ()=>{
            filter.parse(cases.at('nested'));
        });

        it('filters can be aggregated using the nested syntax', ()=>{
            filter.parse(cases.at('aggregated'));
        });

    });

    describe('order (used to set an ordering direction on queries)', function() {

        var order  = pAssert.forRule('order')
            , cases = allCases.casesFor('order', 'order-');

        it('supports basic selectors with an arbitrary direction', ()=> {
            order.parse(cases.at('field'));
        });

        it('supports dot access with an arbitrary direction', ()=> {
            order.parse(cases.at('selector'));
        });

        it('does not support nested access', ()=> {
            order.fail('event[startDate, endDate] ASC');
        });

        it('supports multiple orderings', ()=> {
            order.parse(cases.at('multiple'));
        });

        it('supports multiple orderings with dot access', ()=> {
            var result = order.parse(cases.at('multiple-selector'));
        });
    });
});