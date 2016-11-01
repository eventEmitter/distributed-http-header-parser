var   log     = require('ee-log')
    , assert  = require('assert')
    , parser  = require('../lib/parser/HeaderParser')
    , pAssert = require('./ParserAssertion').forParser(parser);

describe('Syntax-Structures', function(){

    describe('date', function() {

        it('should handle dates without time', function(){
            var value_node = parser.parse('2013-12-24', 'date');
            var node = value_node.getValue();

            assert(node instanceof Date);
            assert.equal(2013, node.getFullYear());
            assert.equal(11, node.getMonth());
            assert.equal(24, node.getDate());
            assert.equal(0, node.getHours());
            assert.equal(0, node.getMinutes());
            assert.equal(0, node.getSeconds());
            assert.equal(0, node.getMilliseconds());
        });

        it('should handle dates with time', function(){
            var value_node = parser.parse('2000-01-04 10:15:03', 'date');
            var node = value_node.getValue();

            assert(node instanceof Date);
            assert.equal(2000, node.getFullYear());
            assert.equal(0, node.getMonth());
            assert.equal(4, node.getDate());
            assert.equal(10, node.getHours());
            assert.equal(15, node.getMinutes());
            assert.equal(3, node.getSeconds());
            assert.equal(0, node.getMilliseconds());
        });
    });

    describe('array', function() {
        var arr = pAssert.forRule('array');
        it('should parse an empty array', function () {
            assert.equal(arr.parse('[]').length , 0);
        });

        it('should parse an array with arbitrary literals', function () {
            var   result    = arr.parse('[ true, false, 100, -100.1 , "yay"]')
                , children  = result.getChildren();

            assert.equal(result.length , 5);
            assert.strictEqual(children[0].getValue(), true);
            assert.strictEqual(children[3].getValue(), -100.1);
        });

        it('should parse nested arrays', function () {
            var   result    = arr.parse('[ "range", [10, 400]]')
                , children  = result.getChildren();

            assert.equal(result.length , 2);
            assert.equal(children[0].getValue(), "range");
            assert.strictEqual(children[1].length, 2);
        });

        it('should parse an array with structural contents', function(){
            var result = arr.parse('[ abs(-100),  post.title, []]')
                , children = result.getChildren();
            assert.equal(result.length, 3);
            assert.equal(children[0].getChildren()[0].value, -100);
        });
    });

    describe('function', function(){
        var fnc = pAssert.forRule('function');
        it('should parse a function call without arguments', function(){
            var result = fnc.parse('avg()');
            assert.equal(result.getName(), 'avg');
            assert.equal(result.getChildren().length, 0);
        });

        it('should parse a function call with an arbitrary amount of arguments', function(){
            var result = fnc.parse('fork(post.ratings, post.comments, 100)');;
            assert.equal(result.getName(), 'fork');
            assert.equal(result.getChildren().length, 3);
        });
    });

    describe('selector', function(){
        var sel = pAssert.forRule('selector');
        it('should parse the wildcard', function(){
            var result = sel.parse('*');
            assert.equal(result.name, '*' );
        });
        it('should fail on accesses on wildcard', function(){
            sel.fail('*.halo');
        });

        it('should parse variables', function(){
            var result = sel.parse('event');
            assert.equal(result.name, 'event' );
            assert.equal(result.hasChildren(), false);
        });

        it('should parse wildcard acceses on variables', function(){
            var result = sel.parse('event.*');
            assert.equal(result.name, 'event' );
            assert(result.hasChildren());
            assert.equal(result.getChildren()[0].name, '*');
        });

        it('should parse an arbitrary amount of accesses on variables', function(){
            var result = sel.parse('event.address.city.postalcode');
            assert.equal(result.name, 'event' );
            assert(result.hasChildren());
            assert.equal(result.getChildren()[0].name, 'address');
            assert.equal(result.getChildren()[0].getChildren()[0].name, 'city');
            assert.equal(result.getChildren()[0].getChildren()[0].getChildren()[0].name, 'postalcode');
        });

    });

    describe('nested-selector', function(){
        var sel = pAssert.forRule('selector');
        it('should parse nested selectors', function(){
            var result = sel.parse('event[venue , date]');
            assert(result.hasChildren());
            assert.equal(result.getChildren().length, 2);
            assert.equal(result.getChildAt(0).name, 'venue');
            assert.equal(result.getChildAt(1).name, 'date');
        });

        it('should parse selectors with an arbitrary amount of nesting', function(){
            var   result = sel.parse('event[venue[name, address] , date]')
                , venueAccess
                , dateAccess;

            assert(result.hasChildren());
            assert.equal(result.getChildren().length, 2);

            venueAccess = result.getChildAt(0);
            dateAccess = result.getChildAt(1);

            assert(venueAccess.hasChildren());

            assert(!dateAccess.hasChildren());
        });

        it('should allow aliases within the nesting', function(){
            var   result = sel.parse('event[venue[name, address = location(100, -200.30)]]')
                , address = result.getChildren()[0].getChildren()[1];

            assert(address.isAlias());
        });
    });

    describe('filters', function(){
        var fil = pAssert.forRule('filter');

        it('should parse the old filter syntax', function(){
            var   result = fil.parse('event.date > 2016-10-03')
                , first = result.getChildAt(0);

            assert(first.hasChildren());
        });
    });
});