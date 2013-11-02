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
 * Apply
 */

exports._apply = function(obj, mixins) {
  if (('object' === typeof obj || 'function' === typeof obj) && !(obj instanceof Array)) {
    return Mixin.prototype.applyObject(this, obj);
  }

  throw new Error("Argument passed to Mixin.apply has to be a mixin instance or an object.");
};

/**
 * Mixin
 */

exports.mixin = function(obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  Mixin.prototype.applyObject(args, obj);
  return obj;
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
    } else {
      var mixin = new Mixin();
      mixin.properties = arg;
      this.mixins.push(mixin);
    }
  }

};

/**
 * toString
 */

Mixin.toString = function() {
  return '<Mixin>';
}

/**
 * Reopen
 */

Mixin.prototype.reopen = function() {

  /**if (this.properties) {
    var mixin = new Mixin();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  } else if (!this.mixins) {
    this.mixins = [];
  }**/

  this.initMixin(Array.prototype.slice.call(arguments));

  return this;
};

/**
 * Apply
 */

Mixin.prototype.apply = function(obj) {
  if (('object' === typeof obj || 'function' === typeof obj) && !(obj instanceof Array)) {
    return Mixin.prototype.applyObject(this, obj);
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

Mixin.prototype.applyObject = function(obj, target) {
  var fns = {};
  var values = target;

  function applyProperties(props) {
    if (!props) {
      throw new Error("No properties found.");
    }

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

  function applyMixins(mixin) {
    for (var j = 0; j < mixin.mixins.length; j++) {
      var props = mixin.mixins[j].properties;

      applyProperties(props);
    }
  }

  if (obj instanceof Mixin) {
    for (var i = 0; i < obj.mixins.length; i++) {
      var mixin = obj.mixins[i];
      applyMixins(mixin);
      applyProperties(mixin.properties);
    }
  } else if ('object' === typeof obj && !(obj instanceof Array)) {
    applyProperties(target);
  } else if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      applyProperties(obj[i]);
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