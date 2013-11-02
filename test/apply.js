var Mixin = require('..');
var assert = require('assert');
var initMixin = Mixin.initMixin;
var equal = assert.equal;

function K() {}

describe('ember test suite', function() {
  it('should apply properties using apply()', function() {
    var MixinA = Mixin.create({
      foo: 'Foo',
      baz: K
    });
    var obj = {};
    MixinA.apply(obj);
    assert.equal('Foo', obj.foo);
    assert.equal(K, obj.baz)
  });

  it('should apply annonymous properties', function() {
    var obj = {};
    Mixin.mixin(obj, {
      foo: 'FOO',
      baz: K
    });

    equal(obj.foo, 'FOO');
    equal(obj.baz, K);
  });

  it('should apply null values', function() {
    assert.throws(function() {
      Mixin.mixin({}, null);
    });
  });

  it('should apply property with an undefined value', function() {
    var obj = {
      tagName: ''
    };
    Mixin.mixin(obj, {
      tagName: undefined
    });

    assert.deepEqual(obj, {
      tagName: undefined
    });
  });

  it('should override inherited objects', function() {

    var cnt = 0;
    var MixinA = Mixin.create({
      foo: function() {
        cnt++;
      }
    });

    var MixinB = Mixin.create({
      foo: function() {
        this._super();
        cnt++;
      }
    });

    var objA = {};
    MixinA.apply(objA);

    var objB = Object.create(objA);
    MixinB.apply(objB);

    cnt = 0;
    objB.foo();
    equal(cnt, 2);

    cnt = 0;
    objA.foo();
    equal(cnt, 1);
  });

  it('should run once if including the same mixin', function() {
    var cnt = 0;
    var MixinA = Mixin.create({
      foo: function() {
        cnt++;
      }
    });

    var MixinB = Mixin.create(MixinA, {
      foo: function() {
        this._super();
      }
    });

    var MixinC = Mixin.create(MixinA, {
      foo: function() {
        this._super();
      }
    });

    var MixinD = Mixin.create(MixinB, MixinC, MixinA, {
      foo: function() {
        this._super();
      }
    });

    var obj = {};
    MixinD.apply(obj);
    MixinA.apply(obj);

    cnt = 0;
    obj.foo();

    equal(cnt, 1);
  });

});