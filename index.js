/**
 * Module dependencies.
 */

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
 * Collection
 */

exports.collection = [];

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
 * Merge Mixins
 */

function mergeMixins(mixins, m, descs, values, base, keys) {
  var mixin, props, key, concats, mergings, meta;

  function removeKeys(keyName) {
    delete descs[keyName];
    delete values[keyName];
  }

  for (var i = 0, n = mixins.length; i < n; i++) {
    mixin = mixins[i];

    props = mixinProperties(m, mixin);
    if (props) {
      concats = concatenatedMixinProperties('concatenatedProperties', props, values, base);
      mergings = concatenatedMixinProperties('mergedProperties', props, values, base);

      for (key in props) {
        if (!props.hasOwnProperty(key)) {
          continue;
        }

        keys.push(key);
      }
    }
  }

  console.log(keys);
}

/**
 * concatenatedMixinProperties
 */

function concatenatedMixinProperties(concatProp, props, values, base) {
  var concats;

  concats = values[concatProp] || base[concatProp];
  if (props[concatProp]) {
    concats = concats ? concats.concat(props[concatProp]) : props[concatProp];
  }

  return concats;
}

/**
 * Mixin Properties
 */

function mixinProperties(mixinsMeta, mixin) {
  var guid;

  if (mixin instanceof Mixin) {
    return mixin.properties;
  } else {
    return mixin;
  }
}

/**
 * Apply Mixin
 */

function applyMixin(obj, mixins, partial) {
  var keys = [], values = {};

  for (var i = 0; i < mixins.length; i++) {
    var m = mixins[i];

    // Loop through each mixin.
    for (var k = 0; k < m.mixins.length; k++) {
      var props = m.mixins[k].properties;

      for (var key in props) {
        var value = props[key];
        if (props.hasOwnProperty(key)) {
          values[key] = value;
        }
      }
    }

    /**for (var j = m.mixins.length; j > 0; i--) {
      var props = m.mixins[j-1].properties;
      console.log(props);
      /**for (var key in props) {
        var value = props[key];
        if (props.hasOwnProperty(key)) {
          //console.log(key,value);
        }
      }
    }**/
  }

  return values;
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