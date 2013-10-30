/**
 * Module dependencies.
 */

var applyMixin = require('./lib/apply');
var _          = require('underscore');

/**
 * Vars
 */

var MixinPrototype;

/**
 * Module exports
 */

exports = module.exports = Mixin;

/**
 * Expose `initMixin`
 */

exports.initMixin = initMixin;

/**
 * Expose `applyMixin`
 */

exports.applyMixin = applyMixin;

/**
 * initMixin
 */

function initMixin(mixin, args) {
  if (args && args.length > 0) {
    mixin.mixins = _.map(args, function(x) {
      if (x instanceof Mixin) {
        return x;
      }

      var mixin = new Mixin();
      mixin.properties = x;
      return mixin;
    });
  }

  return mixin;
}

/**
 * Mixin
 */

function Mixin() {
  return initMixin(this, arguments);
}

/**
 * Prototype
 */

Mixin.prototype = {
  properties: null,
  mixins: null,
  ownerConstructor: null
};

/**
 * Apply
 */

Mixin._apply = applyMixin;

/**
 * Create
 */

Mixin.create = function() {
  var M = this;
  return initMixin(new M(), arguments);
};

/**
 * Prototype
 */

MixinPrototype = Mixin.prototype;

/**
 * Get
 */

MixinPrototype.get = function(key) {
  for (var i = this.mixins.length; i > 0; i--) {
    if (this.mixins[i - 1].properties.hasOwnProperty(key)) {
      return this.mixins[i - 1].properties[key];
    }
  }
};

/**
 * Set
 */

MixinPrototype.set = function(key, value) {
  for (var i = this.mixins.length; i > 0; i--) {
    if (this.mixins[i - 1].properties.hasOwnProperty(key)) {
      return this.mixins[i - 1].properties[key] = value;
    }
  }
};


/**
 * Apply
 */

MixinPrototype.apply = function(obj) {
  return applyMixin(obj, [this], false);
};

/**
 * Reopen
 */

MixinPrototype.reopen = function() {
  var mixin, tmp;

  if (this.properties) {
    mixin = Mixin.create();
    mixin.properties = this.properties;
    delete this.properties;
    this.mixins = [mixin];
  } else if (!this.mixins) {
    this.mixins = [];
  }

  var len = arguments.length, mixins = this.mixins, idx;

  for (idx = 0; idx < len; idx++) {
    mixin = arguments[idx];

    if (typeof mixin === 'object' && mixin !== null && Object.prototype.toString.call(mixin) !== '[object Array]') {
      if (mixin instanceof Mixin) {
        mixins.push(mixin);
      } else {
        tmp = Mixin.create();
        tmp.properties = mixin;
        mixins.push(tmp);
      }
    }

    return this;
  }

};