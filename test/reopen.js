var Mixin = require('..');
var assert = require('assert');

describe("reopen tests", function() {
  it('should add more properties using reopen()', function() {
    var MixinA = Mixin.create({
      foo: 'FOO', baz: 'BAZ'
    });

    MixinA.reopen({
      bar: 'BAR',
      foo: 'FOO2'
    });

    var obj = {};
    MixinA.apply(obj);

    assert.equal(obj.foo, 'FOO2');
    assert.equal(obj.baz, 'BAZ');
    assert.equal(obj.bar, 'BAR');
  });
});