/**
 * Module exports
 */

exports = module.exports = Meta;

/**
 * Last ID
 */

exports._id = 0;

/**
 * Meta
 *
 * Usage:
 *   Meta(obj);
 *
 */

function Meta(obj) {
  if (!obj._meta) {
    Object.defineProperty(obj, '_meta', {
      enumerable: false,
      value: exports._id++,
      writable: true
    });
  } else {
    obj._meta = exports._id++;
  }

  return obj;
}