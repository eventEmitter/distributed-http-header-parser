"use strict";
/**
 * The following object contains test cases showing the syntax of the different header types.
 * Feel free to add cases if required.
 */
module.exports = {
      "select" : {
            'select-single'             : 'event'
          , 'select-dotted'             : 'event.venue.address'
          , 'select-wildcard'           : '*'
          , 'select-wildcard-dotted'    : 'event.venue.*'
          , 'select-alias'              : 'event.venue.rating = avg(event.venue.poll.stars)'
          , 'select-alias-arguments'    : 'event.venue.meta = queryMeta(event.meta, true, -100, [1, 2, 100])'
          , 'select-alias-no-arguments' : 'event.meta = resolveMeta( )'
          , 'select-multi'              : 'event , user'
          , 'select-multi2'             : 'event.venue , event.startDate, event.endDate, event.title'
          , 'select-nested'             : 'event[venue, startDate, endDate, title] '
          , 'select-nested-alias'       : 'event[venue, duration = timespan(startDate, endDate), title]'
          , 'select-nested-nested'      : 'event[venue[lat, long, name, address] , title]'
          , 'select-nested-dot'         : 'event[venue.address , title]'
          , 'select-dot-nested'         : 'event.venue[address , title]'
          , 'select-nested-multi'       : 'event.venue[address , title], user.name, promotion[state, title]'
          , 'select-combined'           : 'event[id, name, venueFloor[ id , title, image.*, venue[ name, city.* ]] , venueFloor.schubiduu], event.rating = avg()'
      }

    , "filter" : {
          'filter-single'               : 'event.startDate > 2016-01-01'
        , 'filter-lessthan'             : 'event.startDate < 2016-01-01'
        , 'filter-notequal'             : 'event.startDate != 2016-01-01'
        , 'filter-equal'                : 'event.startDate = 2016-01-01'
        , 'filter-lessequal'            : 'event.startDate <= 2016-01-01'
        , 'filter-moreequal'            : 'event.startDate >= 2016-01-01'
        , 'filter-like'                 : 'event.startDate like "2016-01-%"'
        , 'filter-booleantrue'          : 'event.public = true'
        , 'filter-booleanfalse'         : 'event.public != false'
        , 'filter-null'                 : 'event.deleted = null'
        , 'filter-array'                : 'event.range != [100, 200]'
        , 'filter-string'               : 'event.title = "evento"'
        , 'filter-number'               : 'venue.capacity > 1000'
        , 'filter-date'                 : 'event.startDate > 2016-01-01'
        , 'filter-datetime'             : 'event.startDate > 2016-01-01 20:00:00'
        , 'filter-function'             : 'event.rating > avg(event.rating)'
        , 'filter-selector'             : 'event.rating > stats.basicRating'
        , 'filter-multi'                : 'event.startDate > 2016-01-01 , event.deleted = null'
        , 'filter-nested'               : 'event[startDate > 2016-01-01 , deleted = null ]'
        , 'filter-aggregated'           : 'event[venue.deleted, owner.deleted] = null'
    }
    , "order"  : {}

    , casesFor(key, prefix){
        var   cases         = this[key] || {}
            , casePrefix    = prefix || ''
            , index         = 0
            , values        = Object.keys(cases).map(key=>{ return cases[key]});

        return {
              next(){ return index < values.length ? values[index++] : null; }
            , at(key){ return cases[casePrefix+key]; }
        }
    }
};