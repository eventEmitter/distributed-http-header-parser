"use strict";

var   Class = require('ee-class')
    , log   = require('ee-log')

    , RestHeaderError = require('./RestHeaderError');

var OrderHeaderError = {
  inherits: RestHeaderError
};

module.exports = new Class(OrderHeaderError);