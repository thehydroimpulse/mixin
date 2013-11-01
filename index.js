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
  C.initMixin(Array.prototype.slice.call(arguments));
  return C;
};

/**
 * Mixin Class.
 *
 * Each mixin will hold it's mixins, and it's properties.
 *
 */

function Mixin() {
  this.mixins = [];
  this.properties = {};
}

/**
 * Init Mixins
 */

Mixin.prototype.initMixin = function(args) {

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];

    if (arg instanceof Mixin) {
      this.mixins.push(arg);
      continue;
    }

    var mixin = new Mixin();
    mixin.properties = arg;
    this.mixins.push(mixin);
  }

  return this;
};

/**
 * toString
 */

Mixin.toString = function() {
  return '<Mixin>';
}

/**
 * AddMixins
 */

Mixin.prototype.addMixins = function(mixins) {
  for (var i = 0; i < mixins.length; i++) {
    var mixin = mixins[i];
    if (mixin instanceof Mixin) {
      this.mixins.push(mixin);
    } else if ('object' === typeof mixin && !(mixin instanceof Array)) {
      var M = new Mixin();
      M.properties = mixin;
      this.mixins.push(M);
    }
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
  if (('object' === typeof obj || 'function' === typeof obj) && !(obj instanceof Array)) {
    return this.applyObject(obj);
  }

  throw new Error("Argument passed to Mixin.apply has to be a mixin instance or an object.");
};

/**
 * Expose `apply`
 */

exports.apply = Mixin.prototype.apply;

/**
 * Expose `reopen`
 */

exports.reopen = Mixin.prototype.reopen;

/**
 * findNextParent
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

/**
 * findChild
 */

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
  var target = object;
  var fns = {};
  var values = {};

  for (var i = 0; i < this.mixins.length; i++) {
    var mixin = this.mixins[i];
    var props = mixin.properties;

    for (var key in props) {
      var val = props[key];

      if ('function' === typeof val) {

        if (values[key]) {
          // The object already has the key. We'll need to setup a
          // prototype around it.
          var parent = values[key];
          values[key] = Wrap(val, parent);

        } else {
          // If the target (base class/object) doesn't have the key
          // then we'll just take it.
          values[key] = val;
        }

      } else {
        values[key] = val;
      }

    }

  }

  for (var key in values) {
    var val = values[key];
    if (target[key] && 'function' === typeof target[key]
        && 'function' === typeof val) {
      target[key] = Wrap(target[key], val);
    } else {
      target[key] = val;
    }
  }

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