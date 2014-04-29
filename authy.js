/*
Name:          authy.js
Description:   Node.js module to access Authy API methods.
Source:        https://github.com/fvdm/nodejs-authy
Feedback:      https://github.com/fvdm/nodejs-authy/issues
License:       Unlicense / Public Domain

Service:       Authy (two-step authentication)
Service URL:   http://authy.com
Service API:   http://docs.authy.com


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
*/

var querystring = require('querystring')
var authy = {
	api: {},
	app: {}
}


// Settings
authy.api.mode = 'sandbox'	// sandbox or production
authy.api.token = ''


// Users
authy.register = function( email, phone, country, callback ) {
	talk( 'POST', 'users/new', {
		'user[email]': email,
		'user[cellphone]': phone,
		'user[country_code]': country
	}, callback )
}

authy.delete = function( id, callback ) {
	talk( 'POST', 'users/delete/'+ id, callback )
}


// Verify token
authy.verify = function( userId, token, force, callback ) {
	if( typeof force === 'function' ) {
		var callback = force
		var fields = null
	} else if( force === true ) {
		var fields = {force: true}
	}
	
	talk( 'GET', 'verify/'+ token +'/'+ userId, fields, callback )
}


// SMS
authy.sms = function( userId, force, callback ) {
	if( typeof force === 'function' ) {
		var callback = force
		var fields = null
	} else if( force === true ) {
		var fields = {force: true}
	}
	
	talk( 'GET', 'sms/'+ userId, fields, callback )
}


// App
authy.app.details = function( callback ) {
	talk( 'GET', 'app/details', callback )
}

authy.app.stats = function( callback ) {
	talk( 'GET', 'app/stats', callback )
}


// Communicate
function talk( method, path, fields, callback ) {
	if( typeof fields === 'function' ) {
		var callback = fields
		fields = {}
	}
	
	// prevent multiple calls
	var complete = false
	var doCallback = function( err, data ) {
		if( !complete ) {
			complete = true
			callback( err, data )
		}
	}
	
	// build request
	var options = {
		host: 'api.authy.com',
		path: '/protected/json/'+ path +'?api_key='+ authy.api.token,
		method: method,
		headers: {
			'Accept': 'application/json',
			'User-Agent': 'authy.js (https://github.com/fvdm/nodejs-authy)'
		}
	}
	
	var params = querystring.stringify( fields )
	
	if( method === 'GET' ) {
		if( params !== '' ) {
			options.path += '&'+ params
		}
	} else {
		options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
		options.headers['Content-Length'] = params.length
	}
	
	if( authy.api.mode === 'production' ) {
		var request = require('https').request( options )
	} else {
		options.host = 'sandbox-'+ options.host
		var request = require('http').request( options )
	}
	
	// response
	request.on( 'response', function( response ) {
		var data = []
		var size = 0
		
		response.on( 'data', function( ch ) {
			data.push( ch )
			size += ch.length
		})
		
		response.on( 'close', function() {
			var err = new Error('request dropped')
			doCallback( err )
		})
		
		response.on( 'end', function() {
			// convert data to string
			var buf = new Buffer( size )
			var pos = 0
			var err = null
			
			for( var d = 0; d < data.length; d++ ) {
				data[d].copy( buf, pos )
				pos += data[d].length
			}
			
			data = buf.toString().trim()
			
			if( ! data.match( /^\{.*\}$/ ) ) {
				err = new Error('not json')
			} else {
				data = JSON.parse( data )
				
				// process HTTP status
				switch( response.statusCode ) {
					case 400:
						err = new Error('bad request')
						err.apiMessage = 'There was an error with the request.'
						break
					
					case 401:
						err = new Error('unauthorized')
						err.apiMessage = 'Token is invalid.'
						break
						
					case 503:
						err = new Error('service unavailable')
						err.apiMessage = 'Many reasons, body will include details.'
						break
						
					case 200:
						if( data.errors !== undefined ) {
							err = new Error('API error')
							err.apiErrors = data.errors
						}
						break
				}
			}
			
			// do callback
			if( err ) {
				err.request = options
				err.code = response.statusCode
				err.headers = response.headers
				err.body = data
				doCallback( err )
			} else {
				doCallback( null, data )
			}
		})
	})
	
	// error
	request.on( 'error', function( error ) {
		var err = new Error('request failed')
		err.requestError = error
		err.request = options
		doCallback( err )
	})
	
	// complete
	if( method === 'GET' || params === '' ) {
		request.end()
	} else {
		request.end( params )
	}
}

// this is a module
module.exports = authy
