var Mixin = require('..');
var assert = require('assert');
var initMixin = Mixin.initMixin;
var equal = assert.equal;
function K() {}

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

  it('should prioritize the base class when applying the mixin', function() {

    var Part = Mixin.create({
      name: function() {
        return 'First';
      }
    });

    Part.reopen({
      name: function() {
        return 'Second';
      }
    });

    var Machine = {
      name: function() {
        return 'Third';
      }
    };

    Part.apply(Machine);

    assert.equal('function', typeof Machine.name);
    assert.equal(Machine.name(), 'Second');
  });

  it('should prioritize the reopen mixin', function() {

    var Part = Mixin.create({
      name: function() {
        return 'Part';
      }
    });

    Part.reopen({
      name: function() {
        return 'PartReopen';
      }
    });

    var obj = Part.apply({});

    assert.equal('function', typeof obj.name);
    assert.equal(obj.name(), 'PartReopen');
  });

  it('should add a mixin instance.', function() {

    var Engine = Mixin.create({
      engineSize: 8,
      engineType: 'awesome'
    });

    var Car = Mixin.create({
      carWeight: 200
    });

    Car.reopen(Engine);

    var car = Car.apply({});

    assert.equal(Object.keys(car).length, 3);
  });

  it('should mixin multiple Mixins', function() {

    var Mix1 = Mixin.create({
      mixin1: true
    });

    var Mix2 = Mixin.create({
      mixin2: true
    });

    var Mix3 = Mixin.create({
      mixin3: true
    });

    Mix3.reopen(Mix2, Mix1);

    var obj = Mix3.apply({});

    assert.equal(Object.keys(obj).length, 3);
    assert.equal(obj.mixin3, true);
    assert.equal(obj.mixin2, true);
    assert.equal(obj.mixin1, true);
  });

  describe('ember test suite', function() {
    it('should apply properties using apply()', function() {
      var MixinA = Mixin.create({
        foo: 'Foo', baz: K
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
      var obj = { tagName: '' };
      Mixin.mixin(obj, { tagName: undefined });

      assert.deepEqual(obj, { tagName: undefined });
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
          this._super(); cnt++;
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

});