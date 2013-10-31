/**
 * Module dependencies.
 */

var Mixin     = require('..');
var assert    = require('assert');

/**
 * Base Mixin
 */

var Person = Mixin.create({
  name: 'Dave'
});

/**
 * Reopen it.
 */

Person.reopen({
  getName: function() {
    return this.name;
  }
});

/**
 * Assert
 */

assert(Person.apply().getName() === 'Dave');