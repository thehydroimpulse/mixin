/**
 * Module dependencies.
 */

var _       = require('underscore');
var Meta    = require('./lib/meta');

/**
 * Module exports
 */

exports = module.exports = Mixin;

/**
 * Expose `Meta`
 */

exports.Meta = Meta;

/**
 * Create
 */

exports.create = function() {
  var C = new Mixin();
  C.addMixins(Array.prototype.slice.call(arguments));
  return C;
};

/**
 * Mixin constructor
 */

function Mixin() {
  this.mixins = [];
}

/**
 * AddMixins
 */

Mixin.prototype.addMixins = function(mixins) {
  for (var i = 0; i < mixins.length; i++) {
    this.mixins.push(mixins[i]);
  }
};

/**
 * Apply
 */

Mixin.prototype.apply = function(obj) {
  if (obj instanceof Mixin) {
    return this.applyMixin(obj);
  } else if ('object' === typeof obj && !(obj instanceof Array)){
    return this.applyObject(obj);
  }

  throw new Error("Argument passed to Mixin.apply has to be a mixin instance or an object.");
};

/**
 * ApplyMixin
 */

Mixin.prototype.applyMixin = function(mixin) {

};

/**
 * Concatenate all the mixin properties in one array
 *
 *   [
 *     {
 *       prop1: 123
 *     }
 *   ]
 *
 */

Mixin.prototype.concatMixins = function() {

  for (var i = 0; i < this.mixins.length; i++) {
    console.log(this.mixins[i]);
  }

};

/**
 * ApplyObject
 */

Mixin.prototype.applyObject = function(object) {
  var source = this;
  var target = object;
  var fns    = {};

  for (var i = this.mixins.length; i > 0; i--) {
    var mixin = this.mixins[i-1];
    for (var key in mixin) {
      var val = mixin[key];
      if ('function' === typeof val) {
        if (!fns[key]) {
          fns[key] = [val];
        } else {
          fns[key].push(val);
        }
      } else {
        target[key] = val;
      }
    }
  }

  this.handleFunctions(fns, target);
};

/**
 * HandleFunctions
 *
 * This will setup the _super chain. The smallest indexes will be the latest
 * Mixins. Thus, the smaller indexes will be the children.
 */

Mixin.prototype.handleFunctions = function(fns, target) {

  for (var key in fns) {
    var arr = fns[key];

    // Go in the opposite order
    for (var i = arr.length; i > 0; i--) {
      var fn = arr[i-1];
      console.log(fn);
    }
  }

};