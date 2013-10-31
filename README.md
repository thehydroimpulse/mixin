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

## API

**Mixin([object, Mixin...])**

## Test

It's not 100% tested yet, but will be.

```bash
mocha
```

## License

The MIT License (MIT)

Copyright (c) 2013 Daniel Fagnan <dnfagnan@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
