nodejs-authy
============

Authy.com API wrapper for Node.js


Installation
------------

You can install this module from Github, but can be unstable:

	git clone https://github.com/fvdm/nodejs-authy
	npm install ./nodejs-authy

Or from the NPM registry, which is always the latest stable release:

	npm install authy-node


Setup
-----

You need to signup at [Authy](http://authy.com/) and create an app in your [Dashboard](https://dashboard.authy.com/).
Once done take note of the two *different* app tokens. The one on the left is for real production use, the other on the right is only for safe testing.

```js
var authy = require('authy-node')

authy.api.mode = 'sandbox'
authy.api.token = 'abc123def456'
```

When you switch to *production* make sure to set `api.mode` to `production` and `api.token` to your **production** token!


Callback & errors
-----------------

Each method requires a callback function, like this:

```js
function myCallback( err, res ) {
	if( err ) {
		console.log( err )
		console.log( err.stack )
	} else {
		console.log( res )
	}
}
```

In case of an *error*: `err` is an instance of `Error`, sometimes with additional properties to help with tracing the problem. `res` is `null`.

When everything is *good*: `err` is null and `res` is an `object` with the API's response.


Methods
-------

### .register ( email, phone, country, callback )
	
Register a new user to your app.

	email      user's email address
	phone      user's cellphone number
	country    user's country code for cell

```js
authy.register( 'user@example.net', '0612345789', 31, myCallback )
```


### .delete ( userId, callback )

Delete a user from your app.

	userId     user's Authy ID, from .register()

```js
authy.delete( 123, myCallback )
```


### .verify ( userId, token, [force], callback )

Verify an authentication token your app received from the user.

	userId     user's Authy ID, from .register()
	token      user's token, from Authy or SMS
	force      force verification

**Normal:**

```js
authy.verify( 123, '01234567', myCallback )
```

**With force:**

```js
authy.verify( 123, '01234567', true, myCallback )
```


### .sms ( userId, [force], callback )

Send authentication token by SMS.

	userId     user's Authy ID, from .register()
	force      send SMS even when user has smartphone.

**Normal:**

```js
authy.sms( 123, myCallback )
```

**With force:**

```ja
authy.sms( 123, true, myCallback )
```


### .app.details ( callback )

Get basic information about your API token.

```js
authy.app.details( myCallback )
```


### .app.stats ( callback )

Get monthly statistics about your API token.

```js
authy.app.stats( myCallback )
```


Unlicense
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>
