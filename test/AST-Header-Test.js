var   log     = require('ee-log')
    , assert  = require('assert')
    , parser  = require('../lib/parser/HeaderParser')
    , pAssert = require('./ParserAssertion').forParser(parser)
    , allCases= require('./Cases');

/**
 * These tests should ensure some structural assumptions on the generated AST.
 *
 * @todo: implement more of them.
 */
// simplified iterator
function caseRunner(parser, cases){
    return {
        at(key){
            return parser.parse(cases.at(key));
        }
    };
}

describe('AST-Header', function(){

    var   order  = pAssert.forRule('order');

    describe('select (used to query entities and properties)', function() {

        var   select = pAssert.forRule('select')
            , runner = caseRunner(select, allCases.casesFor('select', 'select-'));

        it( 'single selectors', function() {

            var result = runner.at('single');
            assert(result.hasChildren());
            assert.equal(result.length, 1);
            assert(!result.getChildren()[0].hasChildren());
            assert.equal(result.getChildren()[0].getName(), 'event');

        });

        it( 'subselectors with dotted accessors', function() {

                var   result   = runner.at('dotted')
                    , children = result.getChildren();

                assert(result.hasChildren());
                assert.equal(children.length, 1);
                assert(children[0].hasChildren());
                assert.equal(children[0].getChildren()[0].getName(), 'venue');
        });

        it('all available fields can be queried with the wildcard "*"' , function() {

            var   result    = runner.at('wildcard')
                , children  = result.getChildren();

            assert(result.hasChildren());
            assert.equal(children.length, 1);
            assert.equal(children[0].getName(), '*');
        });

        it('the wildcard can be used like any regular selector, but only at the end', function() {
            var   result    = runner.at('wildcard-dotted')
                , children  = result.getChildren();

            assert.equal(children[0].getChildren()[0].getChildren()[0].getName(), '*');
        });

        it(  'selectors with an alias (virtual fields) expressed as a function', function() {
            var result = runner.at('alias')
                , leafs = result.getLeafNodes();

            assert(leafs[0].hasAlias());
        });

        it( 'functions assigned to an alias can take an arbitrary amount of arguments'
            , function() { runner.at('alias-arguments'); });

        it(  'functions assigned to an alias do not have to take parameters'
            , function() { runner.at('alias-no-arguments'); });

        it( 'multiple fields to select are divided by a comma'
            , function() { runner.at('multi'); });

        it( 'multiple fields of sub entities can be queried using the dotted syntax'
            , function() { runner.at('multi2'); });

        it( 'to avoid repetitive selects the parser accepts a nested selector syntax'
            , function() { runner.at('nested'); });

        it( 'nested selects can have an alias too'
            , function() { runner.at('nested-alias'); });

        it('nested selects can have an arbitrary amount of nesting'
            , function() { runner.at('nested-nested'); });

        it('dotted syntax and nested selects can be combined I'
            , function() { runner.at('nested-dot'); });

        it('dotted syntax and nested selects can be combined II'
            , function() { runner.at('dot-nested'); });

        it('dotted syntax is not allowed to access the nested queries'
            , function() { select.fail('event[venue, act].id'); });

        it('dotted syntax and nested selects can be combined in a multi-field query'
            , function() { runner.at('nested-multi'); });

        it('all concepts can be arbitrarily nested and combined', function(){

            var result = runner.at('combined');
                assert(result.hasChildren());
                assert(result.getChildAt(0).hasChildren());
                assert.equal(result.getChildAt(0).getChildren().length, 4);

        });

    });
});