/**
 * Module dependencies.
 */

var Mixin = require('..');

/**
 * Create a new Mixin
 */

var Person = Mixin.create({
  name: 'Dave',
  age: 99,
  country: 'Canada'
});

/**
 * Apply the Mixin
 */

console.log(Person.apply());