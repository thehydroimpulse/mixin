var Mixin = require('..');
var assert = require('assert');
var initMixin = Mixin.initMixin;

describe('mixin test', function() {

  it('should expose a function', function() {
    assert.equal('function', typeof Mixin);
  });

  it('should create a new Mixin', function() {
    var m = Mixin.create({
      hello: 123,
      world: function() {}
    });

    assert.equal('object', typeof m);
    assert(m instanceof Mixin);
  });

  it('should reopen a mixin', function() {
    var m = Mixin.create({
      world: 123
    });

    assert.equal(m.mixins[0].properties.world, 123);

    m.reopen({
      two: 123
    });

    assert.equal(m.mixins.length, 2);
    assert.equal(m.mixins[1].properties.two, 123);
  });

  it('should get a property', function() {
    var person = Mixin.create({
      name: 'Joe'
    });

    assert.equal('Joe', person.get('name'));
  });

  it('should set a property', function() {
    var person = Mixin.create({
      name: 'Joe'
    });

    assert.equal('Joe', person.get('name'));
    person.set('name', 'Two');
    assert.equal('Two', person.get('name'));
  });

  it('should overwrite property', function() {

    var person = Mixin.create({
      name: 'Joe'
    });

    person.reopen({
      name: 'Chang'
    });

    assert.equal('Chang', person.get('name'));
  });

  it('should apply the mixin', function() {

    var person = Mixin.create({
      name: 'John'
    });

    person.reopen({
      name: 'Nick'
    });

    var p = person.apply();

    assert.equal(Object.keys(p).length, 1);
    assert.equal(p.name, 'Nick');
  });

  it('should create an fnChain', function() {
    var obj = Mixin.create({
      name: function() {
        return 123;
      }
    });

    var p = obj.apply();
    assert.equal(p.name(), 123);
  });

  it('should inherit from another Mixin', function() {

    var parent = Mixin.create({
      name: function() {
        return 'John';
      }
    });

    parent.reopen({
      name: function() {
        return this._super() + ' Dave';
      }
    });

    var p = parent.apply();

    assert.equal(p.name(), 'John Dave');
  });

  it('should define the properties on the Mixin instance.', function() {
    var Person = Mixin.create({
      name: 'Dave'
    });

    Person.apply();

    assert.equal(Person.name, 'Dave');
  });

});