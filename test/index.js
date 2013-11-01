var Mixin = require('..');
var assert = require('assert');
var initMixin = Mixin.initMixin;

describe('mixin test', function() {

  it('should expose a function', function() {
    assert.equal('function', typeof Mixin);
  });

  it('should create a new instance', function() {
    var C = Mixin.create();
    assert(C instanceof Mixin);
  });

  it('should add mixins when creating instance', function() {
    var C = Mixin.create({});
    assert(C.mixins.length === 1);
  });

  it('should throw error when applying an array', function() {
    var C = Mixin.create();

    // Array
    assert.throws(function() {
      C.apply([]);
    }, Error);

    // Undefined
    assert.throws(function() {
      C.apply();
    }, Error);

    // String
    assert.throws(function() {
      C.apply("");
    }, Error);

    // Number
    assert.throws(function() {
      C.apply(123);
    }, Error);
  });

  it('should have a `applyObject` function', function() {
    var C = Mixin.create();

    assert.equal('function', typeof C.applyObject);
  });

  it('should add a meta property', function() {
    var obj = {};
    Mixin.Meta(obj);
    assert('undefined' !== typeof obj._meta);
  });

  it('should apply an object', function() {
    var obj = { name: 123 };
    var C   = Mixin.create({
      age: function() {
        return 123;
      }
    });

    C.apply(obj);

    assert.equal('function', typeof obj.age);
    assert.equal(obj.age(), 123);
  });

  it('should inherit parent mixin function', function() {
    var Person = Mixin.create({
      name: function() {
        return 'John'
      }
    });

    Person.reopen({
      name: function() {
        return this._super() + ' Dave';
      }
    });

    var obj = {};
    Person.apply(obj);

    assert.equal(Object.keys(obj).length, 1);
    assert.equal(obj.name(), 'John Dave');
  });

  it('should inherit from 2 parents', function() {

    var Person = Mixin.create({
      name: function() {
        return 'Super1';
      }
    });

    Person.reopen({
      name: function() {
        return this._super() + ' Super2';
      }
    });

    Person.reopen({
      name: function() {
        return this._super() + ' Super3';
      }
    });

    var obj = Person.apply({});

    assert.equal(Object.keys(obj).length, 1);
    assert.equal('function', typeof obj.name);
    assert.equal(obj.name(), 'Super1 Super2 Super3');
  });
});