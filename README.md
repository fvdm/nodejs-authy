authy-node
==========

Authy.com API wrapper for Node.js


Installation
------------

`npm install authy-node`


Setup
-----

You need to signup at [Authy](http://authy.com/) and create an app in your [Dashboard](https://dashboard.authy.com/).
Once done take note of the two *different* app tokens. The one on the left is for real production use, the other on the right is only for safe testing.

```js
var authy = require ('authy-node');

authy.api.mode = 'sandbox';
authy.api.token = 'abc123def456';
```

When you switch to *production* make sure to set `api.mode` to `production` and `api.token` to your **production** token!


Callback & errors
-----------------

Each method requires a callback function, like this:

```js
function myCallback (err, res) {
  if (err) {
    console.log (err);
    return;
  }

  console.log (err);
}
```

In case of an *error*: `err` is an instance of `Error`, sometimes with additional properties to help with tracing the problem. `res` is `null`.

When everything is *good*: `err` is null and `res` is an `object` with the API's response.


.register
---------
**( email, phone, country, callback )**
	
Register a new user to your app.


argument | type     | required | description
:--------|:---------|:---------|:-----------
email    | string   | yes      | user's email
phone    | string   | yes      | user's mobile number
country  | number   | yes      | countrycode for mobile
callback | function | yes      | process results


```js
authy.register ('user@example.net', '0612345789', 31, myCallback);
```


.delete
-------
**( userId, callback )

Delete a user from your app.

argument | type     | required | description
:--------|:---------|:---------|:-----------
userId   | number   | yes      | user's Authy ID, from .register()
callback | function | yes      | Process response


```js
authy.delete (123, myCallback);
```


.verify
-------
**( userId, token, [force], callback )**

Verify an authentication token your app received from the user.


argument | type     | required | default | description
:--------|:---------|:---------|:--------|:-----------
userId   | number   | yes      |         | user's Authy ID, from .register()
token    | string   | yes      |         | user's token, from Authy or SMS
force    | boolean  | no       | false   | force verification
callback | function | yes      |         | process response


#### Normal:

```js
authy.verify (123, '01234567', myCallback);
```


#### With force:

```js
authy.verify (123, '01234567', true, myCallback);
```


.sms
----
**( userId, [force], callback )**

Send authentication token by SMS.

argument | type     | required | default | callback
:--------|:---------|:---------|:--------|:--------
userId   | number   | yes      |         | user's Authy ID, from .register()
force    | boolean  | no       | false   | send SMS even when user has smartphone.
callback | function | yes      |         | process response


#### Normal:

```js
authy.sms (123, myCallback);
```


#### With force:

```ja
authy.sms (123, true, myCallback);
```


.app.details
------------
**( callback )**

Get basic information about your API token.

```js
authy.app.details (myCallback);
```


.app.stats
----------
**( callback )**

Get monthly statistics about your API token.

```js
authy.app.stats (myCallback);
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


Author
------

[Franklin van de Meent](https://frankl.in)
