/**
 * Module dependencies.
 */

var Mixin = require('..');

/**
 * New Mixin
 */

var Person = Mixin.create({
  name: 'Dave',
  getName: function() {
    return this.name;
  }
}).apply();

/**
 * Print
 */

console.log(Person.getName() === 'Dave');