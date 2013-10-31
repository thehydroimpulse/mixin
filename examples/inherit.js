/**
 * Module dependencies.
 */

var Mixin     = require('..');
var assert    = require('assert');

/**
 * Base
 */

var Person = Mixin.create({
  name: function() {
    return 'John';
  }
});

/**
 * Reopen
 */

Person.reopen({
  name: function() {
    return this._super() + ' Dave';
  }
})

/**
 * Assert
 */

assert.equal(Person.apply().name(), 'John Dave');