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
 * Concatenate Properties
 *
 * This will take a Mixin, with all it's own mixins and properties.
 *
 *  * Go through each mixin and create a chain of properties. i.e If there
 *    multiples of the same property key, then we'll chain them in order.
 *    Which means, the first mixin will always be the most parent,
 *    and the latest mixin will be the most child.
 *
 *    PropertyChains:
 *    {
 *      "name": [
 *        {
 *          mixin: mixin0
 *          value: function() {}             [1]
 *          parent: null                      |
 *          children: mixin1                  |
 *        },                                  |
 *        {                                   |
 *          mixin: mixin1                     |
 *          value: function() {}              |
 *          parent: mixin0                   [2]
 *          children: mixin2                  |
 *        },                                  |
 *        {                                   |
 *          mixin: mixin2                     |
 *          value: function() {}             [3]
 *          parent: mixin1                    |
 *        }                                   -
 *
 *      ]
 *
 *    }
 *
 *  * Go through the chain and wrap each function to manage
 *    the `_super` function properly.
 *  * Merge primitive values (i.e non-functions) correctly. Right now
 *    we'll just plainly keep the newest values.
 *
 */

function concatenateProperties(mixins) {
  var fnChain = {}, values = {};

  // Go through each super mixin.
  for (var i = 0; i < mixins.length; i++) {
    var superMixin = mixins[i];

    // Loop through each mixin.
    for (var k = 0; k < superMixin.mixins.length; k++) {
      var props = superMixin.mixins[k].properties;

      for (var key in props) {
        var value = props[key];
        if (props.hasOwnProperty(key)) {
          if ('function' === typeof value) {
            console.log(value);
          } else {
            values[key] = value;
            Object.defineProperty(superMixin, key, {
              configurable: true,
              enumerable: true,
              value: value,
              writable: true
            });
          }
        }
      }
    }
  }

  handleSuper(fnChain, values);

  return values;
}

/**
 * Handle super
 */

function handleSuper() {

}

/**
 * Wrap Super
 */

function wrapSuper(func, superFunc) {

}

/**
 * Apply Mixin
 */

function applyMixin(obj, mixins, partial) {
  var keys = [], values = {};

  return concatenateProperties(mixins);

  for (var i = 0; i < mixins.length; i++) {
    var m = mixins[i];

    // Loop through each mixin.
    for (var k = 0; k < m.mixins.length; k++) {
      var props = m.mixins[k].properties;

      for (var key in props) {
        var value = props[key];
        if (props.hasOwnProperty(key)) {
          values[key] = value;
          Object.defineProperty(m, key, {
            configurable: true,
            enumerable: true,
            value: value,
            writable: true
          });
        }
      }
    }
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

MixinPrototype.reopen = exports._reopen = function() {
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