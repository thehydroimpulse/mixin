# Mixin



## Install

NPM:

```bash
npm install hydro-mixin
```

## Usage

Require the module:

```js
/**
 * Module dependencies.
 */

var Mixin = require('hydro-mixin');
```

Create a new Mixin instance:

```js
/**
 * Create a new Mixin instance:
 */

var Person = Mixin.create({
  name: 'Dave',
  age: 99,
  country: 'Canada'
});
```

To fetch the properties, simply call `instance.apply()`:

```js
var person = Person.apply();
console.log(person); // { name: 'Dave', age: 99, country: 'Canada' }
```

This will merge the mixins, and handle parent - child functions.

### Inherit

**Simple Inheritance:**

```js
var Body = Mixin.create({
  shape: 'square'
});

var Item = Mixin.create(Body, {
  colour: 'Red'
});

Item.apply(); // { shape: 'square', colour: 'Red' }
```

**Parent Method:**

```js

var Person = Mixin.create({
  name: function() {
    return 'John';
  }
});

Person.reopen({
  name: function() {
    return this._super() + ' Smith';
  }
});

var person = Person.apply();
person.name(); // "John Smith"
```


### Reopen

**Reopen the Mixin:**

```js
var Person = Mixin.create({
  name: 'Dave'
});

// Later on...
Person.reopen({
  age: 56
});

Person.apply(); // { age: 56, name: 'Dave' }
```
