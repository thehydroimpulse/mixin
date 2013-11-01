/**
 * Module dependencies.
 */

var Meta = require('./lib/meta');
var Wrap = require('super-wrap');

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
 * Reopen
 */

Mixin.prototype.reopen = function() {
  this.addMixins(Array.prototype.slice.call(arguments));
  return this;
};

/**
 * Apply
 */

Mixin.prototype.apply = function(obj) {
  if ('object' === typeof obj && !(obj instanceof Array)) {
    return this.applyObject(obj);
  }

  throw new Error("Argument passed to Mixin.apply has to be a mixin instance or an object.");
};

/**
 * Searching
 */

function findNextParent(obj, callback) {

  function nextParent(object) {
    if (object.parent) {
      var ret = callback(object);
      if (ret) {
        return nextParent(object.parent);
      }
    }
  }

  return nextParent(obj);
}

function findChild(obj) {
  if (obj.child) {
    return findChild(obj.child);
  }
  return obj;
}

/**
 * ApplyObject
 */

Mixin.prototype.applyObject = function(object) {
  var source = this;
  var target = object;
  var fns = {};

  for (var i = 0; i < this.mixins.length; i++) {
    var mixin = this.mixins[i];
    for (var key in mixin) {
      var val = mixin[key];
      if ('function' === typeof val) {
        if (!fns[key]) {
          fns[key] = {
            val: val,
            child: null,
            parent: null
          };
        } else {
          var obj = findChild(fns[key]);
          obj.child = {
            val: val,
            child: null,
            parent: obj
          };
        }
      } else {
        target[key] = val;
      }
    }
  }

  this.handleFunctions(fns, target);

  return target;
};

/**
 * HandleFunctions
 *
 * This will setup the _super chain. The smallest indexes will be the latest
 * Mixins. Thus, the smaller indexes will be the children.
 */

Mixin.prototype.handleFunctions = function(fns, target) {

  for (var key in fns) {
    var parent = fns[key];
    var child = findChild(parent);

    function next(object, parent) {
      object.val = Wrap(object.val, parent && parent.val);

      if (object.child) {
        return next(object.child, object);
      }
    }

    next(parent);
    target[key] = child.val;
  }

};