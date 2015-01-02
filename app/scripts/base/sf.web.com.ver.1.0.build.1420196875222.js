/*!
 * jQuery JavaScript Library v1.11.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:42Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.11.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !(--remaining) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};


var strundefined = typeof undefined;



// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery(function() {
	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
});




(function() {
	var div = document.createElement( "div" );

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute("classid") === noData;
};


var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,
		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};



// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[0], key ) : emptyGet;
};
var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	// Minified: var a,b,c
	var input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		fragment = document.createDocumentFragment();

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}
})();


(function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!support.noCloneEvent || !support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = (rtagName.exec( elem ) || [ "", "" ])[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ (rtagName.exec( value ) || [ "", "" ])[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}


(function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== strundefined ) {
			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

})();
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );



var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	// Minified: var b,c,d,e,f,g, h,i
	var div, style, a, pixelPositionVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal;

	// Setup
	div = document.createElement( "div" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];
	style = a && a.style;

	// Finish early in limited (non-browser) environments
	if ( !style ) {
		return;
	}

	style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" ||
		style.WebkitBoxSizing === "";

	jQuery.extend(support, {
		reliableHiddenOffsets: function() {
			if ( reliableHiddenOffsetsVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		// Support: Android 2.3
		reliableMarginRight: function() {
			if ( reliableMarginRightVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		}
	});

	function computeStyleTests() {
		// Minified: var b,c,d,j
		var div, body, container, contents;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = false;
		reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			pixelPositionVal = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			boxSizingReliableVal =
				( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents, null ) || {} ).marginRight );
		}

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		contents = div.getElementsByTagName( "td" );
		contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
		reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		if ( reliableHiddenOffsetsVal ) {
			contents[ 0 ].style.display = "";
			contents[ 1 ].style.display = "none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		}

		body.removeChild( container );
	}

})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,

	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	// Minified: var a,b,c,d,e
	var input, div, select, a, opt;

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];

	// First batch of tests.
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
})();


var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) >= 0 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// Retrieve booleans specially
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		} :
		function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

// Support: Safari, IE9+
// mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		return !this.isLocal &&

			// Support: IE7-8
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			/^(get|post|head|put|delete|options)$/i.test( this.type ) &&

			createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	});
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( options ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch( e ) {
									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;
								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					if ( !options.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};





var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray("auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/can',[],function () {
	/* global GLOBALCAN */
	var can = window.can || {};
	if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
		window.can = can;
	}

	// An empty function useful for where you need a dummy callback.
	can.k = function(){};

	can.isDeferred = function (obj) {
		// Returns `true` if something looks like a deferred.
		return obj && typeof obj.then === "function" && typeof obj.pipe === "function";
	};

	var cid = 0;
	can.cid = function (object, name) {
		if (!object._cid) {
			cid++;
			object._cid = (name || '') + cid;
		}
		return object._cid;
	};
	can.VERSION = '2.1.3';

	can.simpleExtend = function (d, s) {
		for (var prop in s) {
			d[prop] = s[prop];
		}
		return d;
	};


	can.frag = function(item){
		var frag;
		if(!item || typeof item === "string"){
			frag = can.buildFragment(item == null ? "" : ""+item, document.body);
			// If we have an empty frag...
			if (!frag.childNodes.length) {
				frag.appendChild(document.createTextNode(''));
			}
			return frag;
		} else if(item.nodeType === 11) {
			return item;
		} else if(typeof item.nodeType === "number") {
			frag = document.createDocumentFragment();
			frag.appendChild(item);
			return frag;
		} else if(typeof item.length === "number") {
			frag = document.createDocumentFragment();
			can.each(item, function(item){
				frag.appendChild( can.frag(item) );
			});
			return frag;
		} else {
			frag = can.buildFragment( ""+item, document.body);
			// If we have an empty frag...
			if (!frag.childNodes.length) {
				frag.appendChild(document.createTextNode(''));
			}
			return frag;
		}
	};
	
	// this is here in case can.compute hasn't loaded
	can.__reading = function () {};



	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/attr',["can/util/can"], function (can) {

	// Acts as a polyfill for setImmediate which only works in IE 10+. Needed to make
	// the triggering of `attributes` event async.
	var setImmediate = window.setImmediate || function (cb) {
			return setTimeout(cb, 0);
		},
		attr = {
			// This property lets us know if the browser supports mutation observers.
			// If they are supported then that will be setup in can/util/jquery and those native events will be used to inform observers of attribute changes.
			// Otherwise this module handles triggering an `attributes` event on the element.
			MutationObserver: window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,

			/**
			 * @property {Object.<String,(String|Boolean|function)>} can.view.attr.map
			 * @parent can.view.elements
			 * @hide
			 *
			 *
			 * A mapping of
			 * special attributes to their JS property. For example:
			 *
			 *     "class" : "className"
			 *
			 * means get or set `element.className`. And:
			 *
			 *      "checked" : true
			 *
			 * means set `element.checked = true`.
			 *
			 *
			 * If the attribute name is not found, it's assumed to use
			 * `element.getAttribute` and `element.setAttribute`.
			 */
			map: {
				"class": "className",
				"value": "value",
				"innerText": "innerText",
				"textContent": "textContent",
				"checked": true,
				"disabled": true,
				"readonly": true,
				"required": true,
				// For the `src` attribute we are using a setter function to prevent values such as an empty string or null from being set.
				// An `img` tag attempts to fetch the `src` when it is set, so we need to prevent that from happening by removing the attribute instead.
				src: function (el, val) {
					if (val == null || val === "") {
						el.removeAttribute("src");
						return null;
					} else {
						el.setAttribute("src", val);
						return val;
					}
				},
				style: function (el, val) {
					return el.style.cssText = val || "";
				}
			},
			// These are elements whos default value we should set.
			defaultValue: ["input", "textarea"],
			// ## attr.set
			// Set the value an attribute on an element.
			set: function (el, attrName, val) {
				var oldValue;
				// In order to later trigger an event we need to compare the new value to the old value, so here we go ahead and retrieve the old value for browsers that don't have native MutationObservers.
				if (!attr.MutationObserver) {
					oldValue = attr.get(el, attrName);
				}

				var tagName = el.nodeName.toString()
					.toLowerCase(),
					prop = attr.map[attrName],
					newValue;
				
				// Using the property of `attr.map`, go through and check if the property is a function, and if so call it. Then check if the property is `true`, and if so set the value to `true`, also making sure to set `defaultChecked` to `true` for elements of `attr.defaultValue`. We always set the value to true because for these boolean properties, setting them to false would be the same as removing the attribute.
				//
				// For all other attributes use `setAttribute` to set the new value.
				if (typeof prop === "function") {
					newValue = prop(el, val);
				} else if (prop === true) {
					newValue = el[attrName] = true;

					if (attrName === "checked" && el.type === "radio") {
						if (can.inArray(tagName, attr.defaultValue) >= 0) {
							el.defaultChecked = true;
						}
					}

				} else if (prop) {
					newValue = el[prop] = val;
					if (prop === "value" && can.inArray(tagName, attr.defaultValue) >= 0) {
						el.defaultValue = val;
					}
				} else {
					el.setAttribute(attrName, val);
					newValue = val;
				}

				// Now that the value has been set, for browsers without MutationObservers, check to see that value has changed and if so trigger the "attributes" event on the element.
				if (!attr.MutationObserver && newValue !== oldValue) {
					attr.trigger(el, attrName, oldValue);
				}
			},
			// ## attr.trigger
			// Used to trigger an "attributes" event on an element. Checks to make sure that someone is listening for the event and then queues a function to be called asynchronously using `setImmediate.
			trigger: function (el, attrName, oldValue) {
				if (can.data(can.$(el), "canHasAttributesBindings")) {
					return setImmediate(function () {
						can.trigger(el, {
							type: "attributes",
							attributeName: attrName,
							target: el,
							oldValue: oldValue,
							bubbles: false
						}, []);
					});
				}
			},
			// ## attr.get
			// Gets the value of an attribute. First checks to see if the property is a string on `attr.map` and if so returns the value from the element's property. Otherwise uses `getAttribute` to retrieve the value.
			get: function (el, attrName) {
				var prop = attr.map[attrName];
				if(typeof prop === "string" && el[prop]) {
					return el[prop];
				}
				
				return el.getAttribute(attrName);
			},
			// ## attr.remove
			// Removes an attribute from an element. Works by using the `attr.map` to see if the attribute is a special type of property. If the property is a function then the fuction is called with `undefined` as the value. If the property is `true` then the attribute is set to false. If the property is a string then the attribute is set to an empty string. Otherwise `removeAttribute` is used.
			//
			// If the attribute previously had a value and the browser doesn't support MutationObservers we then trigger an "attributes" event.
			remove: function (el, attrName) {
				var oldValue;
				if (!attr.MutationObserver) {
					oldValue = attr.get(el, attrName);
				}

				var setter = attr.map[attrName];
				if (typeof setter === "function") {
					setter(el, undefined);
				}
				if (setter === true) {
					el[attrName] = false;
				} else if (typeof setter === "string") {
					el[setter] = "";
				} else {
					el.removeAttribute(attrName);
				}
				if (!attr.MutationObserver && oldValue != null) {
					attr.trigger(el, attrName, oldValue);
				}

			},
			// ## attr.has
			// Checks if an element contains an attribute.
			// For browsers that support `hasAttribute`, creates a function that calls hasAttribute, otherwise creates a function that uses `getAttribute` to check that the attribute is not null.
			has: (function () {
				var el = document.createElement('div');
				if (el.hasAttribute) {
					return function (el, name) {
						return el.hasAttribute(name);
					};
				} else {
					return function (el, name) {
						return el.getAttribute(name) !== null;
					};
				}
			})()
		};

	return attr;

});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/event',["can/util/can"], function (can) {
	// ## can.event.addEvent
	//
	// Adds a basic event listener to an object.
	// This consists of storing a cache of event listeners on each object,
	// that are iterated through later when events are dispatched.
	/**
	 * @function can.event.addEvent
	 * @parent can.event.static
	 * @signature `obj.addEvent( event, handler )`
	 *
	 * Add a basic event listener to an object.
	 *
	 * @param {String} event The name of the event to listen for.
	 * @param {Function} handler The handler that will be executed to handle the event.
	 * @return {Object} this
	 *
	 * @signature `can.event.addEvent.call( obj, event, handler )`
	 *
	 * This syntax can be used for objects that don't include the `can.event` mixin.
	 */
	can.addEvent = function (event, handler) {
		// Initialize event cache.
		var allEvents = this.__bindEvents || (this.__bindEvents = {}),
			eventList = allEvents[event] || (allEvents[event] = []);

		// Add the event
		eventList.push({
			handler: handler,
			name: event
		});
		return this;
	};

	// ## can.event.listenTo
	//
	// Listens to an event without know how bind is implemented.
	// The primary use for this is to listen to another's objects event while 
	// tracking events on the local object (similar to namespacing).
	//
	// The API was heavily influenced by BackboneJS: http://backbonejs.org/
	/**
	 * @function can.event.listenTo
	 * @parent can.event.static
	 * @signature `obj.listenTo( other, event, handler )`
	 *
	 * Listens for an event on another object.
	 * This is similar to concepts like event namespacing, except that the namespace 
	 * is the scope of the calling object.
	 *
	 * @param {Object} other The object to listen for events on.
	 * @param {String} event The name of the event to listen for.
	 * @param {Function} handler The handler that will be executed to handle the event.
	 * @return {Object} this
	 *
	 * @signature `can.event.listenTo.call( obj, other, event, handler )`
	 *
	 * This syntax can be used for objects that don't include the `can.event` mixin.
	 */
	can.listenTo = function (other, event, handler) {
		// Initialize event cache
		var idedEvents = this.__listenToEvents;
		if (!idedEvents) {
			idedEvents = this.__listenToEvents = {};
		}

		// Identify the other object
		var otherId = can.cid(other);
		var othersEvents = idedEvents[otherId];
		
		// Create a local event cache
		if (!othersEvents) {
			othersEvents = idedEvents[otherId] = {
				obj: other,
				events: {}
			};
		}
		var eventsEvents = othersEvents.events[event];
		if (!eventsEvents) {
			eventsEvents = othersEvents.events[event] = [];
		}

		// Add the event, both locally and to the other object
		eventsEvents.push(handler);
		can.bind.call(other, event, handler);
	};

	// ## can.event.stopListening
	// 
	// Stops listening for events on other objects
	/**
	 * @function can.event.stopListening
	 * @parent can.event.static
	 * @signature `obj.stopListening( other, event, handler )`
	 *
	 * Stops listening for an event on another object.
	 *
	 * @param {Object} other The object to listen for events on.
	 * @param {String} event The name of the event to listen for.
	 * @param {Function} handler The handler that will be executed to handle the event.
	 * @return {Object} this
	 *
	 * @signature `can.event.stopListening.call( obj, other, event, handler )`
	 *
	 * This syntax can be used for objects that don't include the `can.event` mixin.
	 */
	can.stopListening = function (other, event, handler) {
		var idedEvents = this.__listenToEvents,
			iterIdedEvents = idedEvents,
			i = 0;
		if (!idedEvents) {
			return this;
		}
		if (other) {
			var othercid = can.cid(other);
			(iterIdedEvents = {})[othercid] = idedEvents[othercid];
			// you might be trying to listen to something that is not there
			if (!idedEvents[othercid]) {
				return this;
			}
		}

		// Clean up events on the other object
		for (var cid in iterIdedEvents) {
			var othersEvents = iterIdedEvents[cid],
				eventsEvents;
			other = idedEvents[cid].obj;

			// Find the cache of events
			if (!event) {
				eventsEvents = othersEvents.events;
			} else {
				(eventsEvents = {})[event] = othersEvents.events[event];
			}

			// Unbind event handlers, both locally and on the other object
			for (var eventName in eventsEvents) {
				var handlers = eventsEvents[eventName] || [];
				i = 0;
				while (i < handlers.length) {
					if (handler && handler === handlers[i] || !handler) {
						can.unbind.call(other, eventName, handlers[i]);
						handlers.splice(i, 1);
					} else {
						i++;
					}
				}
				// no more handlers?
				if (!handlers.length) {
					delete othersEvents.events[eventName];
				}
			}
			if (can.isEmptyObject(othersEvents.events)) {
				delete idedEvents[cid];
			}
		}
		return this;
	};

	// ## can.event.removeEvent
	//
	// Removes a basic event listener from an object.
	// This removes event handlers from the cache of listened events.
	/**
	 * @function can.event.removeEvent
	 * @parent can.event.static
	 * @signature `obj.removeEvent( event, handler )`
	 *
	 * Removes a basic event listener from an object.
	 *
	 * @param {String} event The name of the event to listen for.
	 * @param {Function} handler The handler that will be executed to handle the event.
	 * @param {Function} [__validate] An extra function that can validate an event handler 
	 *                                as a match. This is an internal parameter and only used 
	 *                                for `can/event` plugins.
	 * @return {Object} this
	 *
	 * @signature `can.event.removeEvent.call( obj, event, handler )`
	 *
	 * This syntax can be used for objects that don't include the `can.event` mixin.
	 */
	can.removeEvent = function (event, fn, __validate) {
		if (!this.__bindEvents) {
			return this;
		}
		var events = this.__bindEvents[event] || [],
			i = 0,
			ev, isFunction = typeof fn === 'function';
		while (i < events.length) {
			ev = events[i];
			// Determine whether this event handler is "equivalent" to the one requested
			// Generally this requires the same event/function, but a validation function 
			// can be included for extra conditions. This is used in some plugins like `can/event/namespace`.
			if (__validate ? __validate(ev, event, fn) : isFunction && ev.handler === fn || !isFunction && (ev.cid === fn || !fn)) {
				events.splice(i, 1);
			} else {
				i++;
			}
		}
		return this;
	};

	// ## can.event.dispatch
	//
	// Dispatches/triggers a basic event on an object.
	/**
	 * @function can.event.dispatch
	 * @parent can.event.static
	 * @signature `obj.dispatch( event, args )`
	 *
	 * Dispatches/triggers a basic event on an object.
	 *
	 * @param {String|Object} event The event to dispatch
	 * @param {Array} [args] Additional arguments to pass to event handlers
	 * @return {Object} event The resulting event object
	 *
	 * @signature `can.event.dispatch.call( obj, event, args )`
	 *
	 * This syntax can be used for objects that don't include the `can.event` mixin.
	 */
	can.dispatch = function (event, args) {
		var events = this.__bindEvents;
		if (!events) {
			return;
		}

		// Initialize the event object
		if (typeof event === 'string') {
			event = {
				type: event
			};
		}

		// Grab event listeners
		var eventName = event.type,
			handlers = (events[eventName] || []).slice(0),
			passed = [event];
		
		// Execute handlers listening for this event.
		if(args) {
			passed.push.apply(passed, args);
		}

		for (var i = 0, len = handlers.length; i < len; i++) {
			handlers[i].handler.apply(this, passed);
		}

		return event;
	};
	
	// ## can.event.one
	//
	// Adds a basic event listener that listens to an event once and only once.
	/**
	 * @function can.event.one
	 * @parent can.event.static
	 * @signature `obj.one( event, handler )`
	 *
	 * Adds a basic event listener that listens to an event once and only once.
	 *
	 * @param {String} event The name of the event to listen for.
	 * @param {Function} handler The handler that will be executed to handle the event.
	 * @return {Object} this
	 */
	can.one = function(event, handler) {
		// Unbind the listener after it has been executed
		var one = function() {
			can.unbind.call(this, event, one);
			return handler.apply(this, arguments);
		};

		// Bind the altered listener
		can.bind.call(this, event, one);
		return this;
	};

	// ## can.event
	// Create and export the `can.event` mixin
	can.event = {
		// Event method aliases
		/**
		 * @function can.event.on
		 * @parent can.event.static
		 * @signature `obj.on( event, handler )`
		 *
		 * Add a basic event listener to an object.
		 *
		 * This is an alias of [can.event.addEvent addEvent].
		 *
		 * @signature `can.event.on.call( obj, event, handler )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		on: function() {
			if (arguments.length === 0 && can.Control && this instanceof can.Control) {
				return can.Control.prototype.on.call(this);
			}
			else {
				return can.addEvent.apply(this, arguments);
			}
		},

		/**
		 * @function can.event.off
		 * @parent can.event.static
		 * @signature `obj.off( event, handler )`
		 *
		 * Removes a basic event listener from an object.
		 *
		 * This is an alias of [can.event.removeEvent removeEvent].
		 *
		 * @signature `can.event.off.call( obj, event, handler )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		off: function() {
			if (arguments.length === 0 && can.Control && this instanceof can.Control) {
				return can.Control.prototype.off.call(this);
			}
			else {
				return can.removeEvent.apply(this, arguments);
			}
		},

		/**
		 * @function can.event.bind
		 * @parent can.event.static
		 * @signature `obj.bind( event, handler )`
		 *
		 * Add a basic event listener to an object.
		 *
		 * This is an alias of [can.event.addEvent addEvent].
		 *
		 * @signature `can.event.bind.call( obj, event, handler )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		bind: can.addEvent,
		/**
		 * @function can.event.unbind
		 * @parent can.event.static
		 * @signature `obj.unbind( event, handler )`
		 *
		 * Removes a basic event listener from an object.
		 *
		 * This is an alias of [can.event.removeEvent removeEvent].
		 *
		 * @signature `can.event.unbind.call( obj, event, handler )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		unbind: can.removeEvent,
		/**
		 * @function can.event.delegate
		 * @parent can.event.static
		 * @signature `obj.delegate( selector, event, handler )`
		 *
		 * Provides a compatibility layer for adding delegate event listeners.
		 * This doesn't actually implement delegates, but rather allows 
		 * logic that assumes a delegate to still function.
		 *
		 * Therefore, this is essentially an alias of [can.event.addEvent addEvent] with the selector ignored.
		 *
		 * @param {String} selector The **ignored** selector to use for the delegate.
		 * @param {String} event The name of the event to listen for.
		 * @param {Function} handler The handler that will be executed to handle the event.
		 * @return {Object} this
		 *
		 * @signature `can.event.delegate.call( obj, selector, event, handler )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		delegate: function(selector, event, handler) {
			return can.addEvent.call(this, event, handler);
		},
		/**
		 * @function can.event.undelegate
		 * @parent can.event.static
		 * @signature `obj.undelegate( selector, event, handler )`
		 *
		 * Provides a compatibility layer for removing delegate event listeners.
		 * This doesn't actually implement delegates, but rather allows 
		 * logic that assumes a delegate to still function.
		 *
		 * Therefore, this is essentially an alias of [can.event.removeEvent removeEvent] with the selector ignored.
		 *
		 * @param {String} selector The **ignored** selector to use for the delegate.
		 * @param {String} event The name of the event to listen for.
		 * @param {Function} handler The handler that will be executed to handle the event.
		 * @return {Object} this
		 *
		 * @signature `can.event.undelegate.call( obj, selector, event, handler )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		undelegate: function(selector, event, handler) {
			return can.removeEvent.call(this, event, handler);
		},
		/**
		 * @function can.event.trigger
		 * @parent can.event.static
		 * @signature `obj.trigger( event, args )`
		 *
		 * Dispatches/triggers a basic event on an object.
		 * This is an alias of [can.event.dispatch dispatch].
		 *
		 * @signature `can.event.trigger.call( obj, event, args )`
		 *
		 * This syntax can be used for objects that don't include the `can.event` mixin.
		 */
		trigger: can.dispatch,

		// Normal can/event methods
		one: can.one,
		addEvent: can.addEvent,
		removeEvent: can.removeEvent,
		listenTo: can.listenTo,
		stopListening: can.stopListening,
		dispatch: can.dispatch
	};

	return can.event;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/array/each',["can/util/can"], function (can) {
	
	// The following is from jQuery
	var isArrayLike = function(obj){
		var length = obj.length;
		return typeof arr !== "function" &&
			( length === 0 || typeof length === "number" && length > 0 && ( length - 1 ) in obj );
	};
	
	can.each = function (elements, callback, context) {
		var i = 0,
			key,
			len,
			item;
		if (elements) {
			if ( isArrayLike(elements) ) {
				if(can.List && elements instanceof can.List ) {
					for (len = elements.attr("length"); i < len; i++) {
						item = elements.attr(i);
						if (callback.call(context || item, item, i, elements) === false) {
							break;
						}
					}
				} else {
					for (len = elements.length; i < len; i++) {
						item = elements[i];
						if (callback.call(context || item, item, i, elements) === false) {
							break;
						}
					}
				}
				
			} else if (typeof elements === "object") {
				
				if (can.Map && elements instanceof can.Map || elements === can.route) {
					var keys = can.Map.keys(elements);
					for(i =0, len = keys.length; i < len; i++) {
						key = keys[i];
						item = elements.attr(key);
						if (callback.call(context || item, item, key, elements) === false) {
							break;
						}
					}
				} else {
					for (key in elements) {
						if (elements.hasOwnProperty(key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
							break;
						}
					}
				}
				
			}
		}
		return elements;
	};
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/inserted',["can/util/can"], function (can) {
	can.inserted = function (elems) {
		// Turn the `elems` property into an array to prevent mutations from changing the looping.
		elems = can.makeArray(elems);
		var inDocument = false,
			// Gets the `doc` to use as a reference for finding out whether the element is in the document.
			doc = can.$(document.contains ? document : document.body),
			children;
		// Go through `elems` and trigger the `inserted` event.
		// If the first element is not in the document (a Document Fragment) it will exit the function. If it is in the document it sets the `inDocument` flag to true. This means that we only check for the first element and either exit the function or start triggering "inserted" for child elements.
		for (var i = 0, elem;
			(elem = elems[i]) !== undefined; i++) {
			if (!inDocument) {
				if (elem.getElementsByTagName) {
					if (can.has(doc, elem)
						.length) {
						inDocument = true;
					} else {
						return;
					}
				} else {
					continue;
				}
			}

			// If we've found an element in the document then we can now trigger **"inserted"** for `elem` and all of its children. We are using `getElementsByTagName("*")` so that we grab all of the descendant nodes.
			if (inDocument && elem.getElementsByTagName) {
				children = can.makeArray(elem.getElementsByTagName("*"));
				can.trigger(elem, "inserted", [], false);
				for (var j = 0, child;
					(child = children[j]) !== undefined; j++) {
					can.trigger(child, "inserted", [], false);
				}
			}
		}
	};

	// ## can.appendChild
	// Used to append a node to an element and trigger the "inserted" event on all of the newly inserted children. Since `can.inserted` takes an array we convert the child to an array, or in the case of a DocumentFragment we first convert the childNodes to an array and call inserted on those.
	can.appendChild = function (el, child) {
		var children;
		if (child.nodeType === 11) {
			children = can.makeArray(child.childNodes);
		} else {
			children = [child];
		}
		el.appendChild(child);
		can.inserted(children);
	};

	// ## can.insertBefore
	// Like can.appendChild, used to insert a node to an element before a reference node and then trigger the "inserted" event.
	can.insertBefore = function (el, child, ref) {
		var children;
		if (child.nodeType === 11) {
			children = can.makeArray(child.childNodes);
		} else {
			children = [child];
		}
		el.insertBefore(child, ref);
		can.inserted(children);
	};
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/jquery',["jquery", "can/util/can", "can/util/attr", "can/event", "can/util/array/each", "can/util/inserted"], function ($, can, attr, event) {
	var isBindableElement = function (node) {
		// In IE8 window.window !== window.window, so we allow == here.
		/*jshint eqeqeq:false*/
		return ( node.nodeName && (node.nodeType === 1 || node.nodeType === 9) )|| node == window;
	};
	// _jQuery node list._
	$.extend(can, $, {
		trigger: function (obj, event, args, bubbles) {
			if (isBindableElement( obj ) ) {
				$.event.trigger(event, args, obj, !bubbles);
			} else if (obj.trigger) {
				obj.trigger(event, args);
			} else {
				if (typeof event === 'string') {
					event = {
						type: event
					};
				}
				event.target = event.target || obj;
				if(args){
					if( args.length && typeof args === "string") {
						args = [args];
					} else if(! args.length ) {
						args = [args];
					}
				}
				if(!args){
					args = [];
				}
				can.dispatch.call(obj, event, args);
			}
		},
		event: can.event,
		addEvent: can.addEvent,
		removeEvent: can.removeEvent,
		buildFragment: function (elems, context) {
			// Check if this has any html nodes on our own.
			var ret;
			elems = [elems];
			// Set context per 1.8 logic
			context = context || document;
			context = !context.nodeType && context[0] || context;
			context = context.ownerDocument || context;
			ret = $.buildFragment(elems, context);
			return ret.cacheable ? $.clone(ret.fragment) : ret.fragment || ret;
		},
		$: $,
		each: can.each,
		bind: function (ev, cb) {
			// If we can bind to it...
			if (this.bind && this.bind !== can.bind) {
				this.bind(ev, cb);
			} else if (isBindableElement(this)) {
				$.event.add(this, ev, cb);
			} else {
				// Make it bind-able...
				can.addEvent.call(this, ev, cb);
			}
			return this;
		},
		unbind: function (ev, cb) {
			// If we can bind to it...
			if (this.unbind && this.unbind !== can.unbind) {
				this.unbind(ev, cb);
			} else if (isBindableElement(this)) {
				$.event.remove(this, ev, cb);
			} else {
				// Make it bind-able...
				can.removeEvent.call(this, ev, cb);
			}
			return this;
		},
		delegate: function (selector, ev, cb) {
			if (this.delegate) {
				this.delegate(selector, ev, cb);
			} else if (isBindableElement(this)) {
				$(this)
					.delegate(selector, ev, cb);
			} else {
				// make it bind-able ...
				can.bind.call(this, ev, cb);
			}
			return this;
		},
		undelegate: function (selector, ev, cb) {
			if (this.undelegate) {
				this.undelegate(selector, ev, cb);
			} else if (isBindableElement(this)) {
				$(this)
					.undelegate(selector, ev, cb);
			} else {
				can.unbind.call(this, ev, cb);
			}
			return this;
		},
		proxy: function (fn, context) {
			return function () {
				return fn.apply(context, arguments);
			};
		},
		attr: attr
	});
	// Wrap binding functions.
	/*$.each(['bind','unbind','undelegate','delegate'],function(i,func){
		can[func] = function(){
			var t = this[func] ? this : $([this]);
			t[func].apply(t, arguments);
			return this;
		};
	});*/
	// Aliases
	can.on = can.bind;
	can.off = can.unbind;
	// Wrap modifier functions.
	$.each([
		'append',
		'filter',
		'addClass',
		'remove',
		'data',
		'get',
		'has'
	], function (i, name) {
		can[name] = function (wrapped) {
			return wrapped[name].apply(wrapped, can.makeArray(arguments)
				.slice(1));
		};
	});
	// Memory safe destruction.
	var oldClean = $.cleanData;
	$.cleanData = function (elems) {
		$.each(elems, function (i, elem) {
			if (elem) {
				can.trigger(elem, 'removed', [], false);
			}
		});
		oldClean(elems);
	};
	var oldDomManip = $.fn.domManip,
		cbIndex;
	// feature detect which domManip we are using
	$.fn.domManip = function (args, cb1, cb2) {
		for (var i = 1; i < arguments.length; i++) {
			if (typeof arguments[i] === 'function') {
				cbIndex = i;
				break;
			}
		}
		return oldDomManip.apply(this, arguments);
	};
	$(document.createElement("div"))
		.append(document.createElement("div"));

	$.fn.domManip = (cbIndex === 2 ?
		function (args, table, callback) {
			return oldDomManip.call(this, args, table, function (elem) {
				var elems;
				if (elem.nodeType === 11) {
					elems = can.makeArray(elem.childNodes);
				}
				var ret = callback.apply(this, arguments);
				can.inserted(elems ? elems : [elem]);
				return ret;
			});
		} :
		function (args, callback) {
			return oldDomManip.call(this, args, function (elem) {
				var elems;
				if (elem.nodeType === 11) {
					elems = can.makeArray(elem.childNodes);
				}
				var ret = callback.apply(this, arguments);
				can.inserted(elems ? elems : [elem]);
				return ret;
			});
		});

	if (!can.attr.MutationObserver) {
		// handle via calls to attr
		var oldAttr = $.attr;
		$.attr = function (el, attrName) {
			var oldValue, newValue;
			if (arguments.length >= 3) {
				oldValue = oldAttr.call(this, el, attrName);
			}
			var res = oldAttr.apply(this, arguments);
			if (arguments.length >= 3) {
				newValue = oldAttr.call(this, el, attrName);
			}
			if (newValue !== oldValue) {
				can.attr.trigger(el, attrName, oldValue);
			}
			return res;
		};
		var oldRemove = $.removeAttr;
		$.removeAttr = function (el, attrName) {
			var oldValue = oldAttr.call(this, el, attrName),
				res = oldRemove.apply(this, arguments);

			if (oldValue != null) {
				can.attr.trigger(el, attrName, oldValue);
			}
			return res;
		};
		$.event.special.attributes = {
			setup: function () {
				can.data(can.$(this), "canHasAttributesBindings", true);
			},
			teardown: function () {
				$.removeData(this, "canHasAttributesBindings");
			}
		};
	} else {
		// setup a special events
		$.event.special.attributes = {
			setup: function () {
				var self = this;
				var observer = new can.attr.MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						var copy = can.simpleExtend({}, mutation);
						can.trigger(self, copy, []);
					});

				});
				observer.observe(this, {
					attributes: true,
					attributeOldValue: true
				});
				can.data(can.$(this), "canAttributesObserver", observer);
			},
			teardown: function () {
				can.data(can.$(this), "canAttributesObserver")
					.disconnect();
				$.removeData(this, "canAttributesObserver");

			}
		};
	}
	
	// ## Fix build fragment.
	// In IE8, we can pass jQuery a fragment and it removes newlines.
	// This checks for that and replaces can.buildFragment with something
	// that if only a single text node is returned, returns a fragment with
	// a text node that is set to the content.
	(function(){
		
		var text = "<-\n>",
			frag = can.buildFragment(text, document);
		if(text !== frag.childNodes[0].nodeValue) {
			
			var oldBuildFragment  = can.buildFragment;
			can.buildFragment = function(content, context){
				var res = oldBuildFragment(content, context);
				if(res.childNodes.length === 1 && res.childNodes[0].nodeType === 3) {
					res.childNodes[0].nodeValue = content;
				}
				return res;
			};
			
		}
		
		
		
	})();

	$.event.special.inserted = {};
	$.event.special.removed = {};
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/library',["can/util/jquery"], function (can) {
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/bind',["can/util/library"], function (can) {
	/**
	 * @typedef {{bind:function():*,unbind:function():*}} can.util.bind
	 *
	 * Provides mixin-able bind and unbind methods. `bind()` calls `this._bindsetup`
	 * when the first bind happens and.  `unbind()` calls `this._bindteardown` when there
	 * are no more event handlers.
	 *
	 */
	// ## Bind helpers
	can.bindAndSetup = function () {
		// Add the event to this object
		can.addEvent.apply(this, arguments);
		// If not initializing, and the first binding
		// call bindsetup if the function exists.
		if (!this._init) {
			if (!this._bindings) {
				this._bindings = 1;
				// setup live-binding
				if (this._bindsetup) {
					this._bindsetup();
				}
			} else {
				this._bindings++;
			}
		}
		return this;
	};
	can.unbindAndTeardown = function (ev, handler) {
		// Remove the event handler
		can.removeEvent.apply(this, arguments);
		if (this._bindings === null) {
			this._bindings = 0;
		} else {
			this._bindings--;
		}
		// If there are no longer any bindings and
		// there is a bindteardown method, call it.
		if (!this._bindings && this._bindteardown) {
			this._bindteardown();
		}
		return this;
	};
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/map/bubble',["can/util/library"], function(can){



	var bubble = can.bubble = {
			// Given a binding, returns a string event name used to set up bubbline.
			// If no binding should be done, undefined or null should be returned
			event: function(map, eventName) {
				return map.constructor._bubbleRule(eventName, map);
			},
			childrenOf: function (parentMap, eventName) {

				parentMap._each(function (child, prop) {
					if (child && child.bind) {
						bubble.toParent(child, parentMap, prop, eventName);
					}
				});

			},
			teardownChildrenFrom: function(parentMap, eventName){
				parentMap._each(function (child) {

					bubble.teardownFromParent(parentMap, child, eventName);

				});
			},
			toParent: function(child, parent, prop, eventName) {
				can.listenTo.call(parent, child, eventName, function ( /* ev, attr */ ) {
					// `batchTrigger` the type on this...
					var args = can.makeArray(arguments),
						ev = args.shift();

					args[0] =
						(can.List && parent instanceof can.List ?
							parent.indexOf(child) :
							prop ) + (args[0] ? "."+args[0] : "");

					// track objects dispatched on this map
					ev.triggeredNS = ev.triggeredNS || {};

					// if it has already been dispatched exit
					if (ev.triggeredNS[parent._cid]) {
						return;
					}

					ev.triggeredNS[parent._cid] = true;
					// send change event with modified attr to parent
					can.trigger(parent, ev, args);
				});
			},
			teardownFromParent: function (parent, child, eventName ) {
				if(child && child.unbind ) {
					can.stopListening.call(parent, child, eventName);
				}
			},
			isBubbling: function(parent, eventName){
				return parent._bubbleBindings && parent._bubbleBindings[eventName];
			},
			bind: function(parent, eventName) {
				if (!parent._init ) {
					var bubbleEvent = bubble.event(parent, eventName);
					if(bubbleEvent) {
						if(!parent._bubbleBindings) {
							parent._bubbleBindings = {};
						}
						if (!parent._bubbleBindings[bubbleEvent]) {
							parent._bubbleBindings[bubbleEvent] = 1;
							// setup live-binding
							bubble.childrenOf(parent, bubbleEvent);
						} else {
							parent._bubbleBindings[bubbleEvent]++;
						}

					}
				}
			},
			unbind: function(parent, eventName) {
				var bubbleEvent = bubble.event(parent, eventName);
				if(bubbleEvent) {
					if (parent._bubbleBindings ) {
						parent._bubbleBindings[bubbleEvent]--;
					}
					if (parent._bubbleBindings && !parent._bubbleBindings[bubbleEvent] ) {
						delete parent._bubbleBindings[bubbleEvent];
						bubble.teardownChildrenFrom(parent, bubbleEvent);
						if(can.isEmptyObject(parent._bubbleBindings)) {
							delete parent._bubbleBindings;
						}
					}
				}
			},
			add: function(parent, child, prop){
				if(child instanceof can.Map && parent._bubbleBindings) {
					for(var eventName in parent._bubbleBindings) {
						if( parent._bubbleBindings[eventName] ) {
							bubble.teardownFromParent(parent, child, eventName);
							bubble.toParent(child, parent, prop, eventName);
						}
					}
				}
			},
			removeMany: function(parent, children){
				for(var i = 0, len = children.length; i < len; i++) {
					bubble.remove(parent, children[i]);
				}
			},
			remove: function(parent, child){
				if(child instanceof can.Map && parent._bubbleBindings) {
					for(var eventName in parent._bubbleBindings) {
						if( parent._bubbleBindings[eventName] ) {
							bubble.teardownFromParent(parent, child, eventName);
						}
					}
				}
			},
			set: function(parent, prop, value, current){

				//var res = parent.__type(value, prop);
				if( can.Map.helpers.isObservable(value) ) {
					bubble.add(parent, value, prop);
				}
				// bubble.add will remove, so only remove if we are replacing another object
				if( can.Map.helpers.isObservable(current) ) {
					bubble.remove(parent, current);
				}
				return value;
			}
		};

	return bubble;

});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/string',["can/util/library"], function (can) {
	// ##string.js
	// _Miscellaneous string utility functions._  
	// Several of the methods in this plugin use code adapated from Prototype
	// Prototype JavaScript framework, version 1.6.0.1.
	// © 2005-2007 Sam Stephenson
	var strUndHash = /_|-/,
		strColons = /\=\=/,
		strWords = /([A-Z]+)([A-Z][a-z])/g,
		strLowUp = /([a-z\d])([A-Z])/g,
		strDash = /([a-z\d])([A-Z])/g,
		strReplacer = /\{([^\}]+)\}/g,
		strQuote = /"/g,
		strSingleQuote = /'/g,
		strHyphenMatch = /-+(.)?/g,
		strCamelMatch = /[a-z][A-Z]/g,
		// Returns the `prop` property from `obj`.
		// If `add` is true and `prop` doesn't exist in `obj`, create it as an
		// empty object.
		getNext = function (obj, prop, add) {
			var result = obj[prop];
			if (result === undefined && add === true) {
				result = obj[prop] = {};
			}
			return result;
		},
		// Returns `true` if the object can have properties (no `null`s).
		isContainer = function (current) {
			return /^f|^o/.test(typeof current);
		}, convertBadValues = function (content) {
			// Convert bad values into empty strings
			var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
			return '' + (isInvalid ? '' : content);
		};
	can.extend(can, {
		esc: function (content) {
			return convertBadValues(content)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(strQuote, '&#34;')
				.replace(strSingleQuote, '&#39;');
		},
		getObject: function (name, roots, add) {
			// The parts of the name we are looking up
			// `['App','Models','Recipe']`
			var parts = name ? name.split('.') : [],
				length = parts.length,
				current, r = 0,
				i, container, rootsLength;
			// Make sure roots is an `array`.
			roots = can.isArray(roots) ? roots : [roots || window];
			rootsLength = roots.length;
			if (!length) {
				return roots[0];
			}
			// For each root, mark it as current.
			for (r; r < rootsLength; r++) {
				current = roots[r];
				container = undefined;
				// Walk current to the 2nd to last object or until there
				// is not a container.
				for (i = 0; i < length && isContainer(current); i++) {
					container = current;
					current = getNext(container, parts[i]);
				}
				// If we found property break cycle
				if (container !== undefined && current !== undefined) {
					break;
				}
			}
			// Remove property from found container
			if (add === false && current !== undefined) {
				delete container[parts[i - 1]];
			}
			// When adding property add it to the first root
			if (add === true && current === undefined) {
				current = roots[0];
				for (i = 0; i < length && isContainer(current); i++) {
					current = getNext(current, parts[i], true);
				}
			}
			return current;
		},
		capitalize: function (s, cache) {
			// Used to make newId.
			return s.charAt(0)
				.toUpperCase() + s.slice(1);
		},
		camelize: function (str) {
			return convertBadValues(str)
				.replace(strHyphenMatch, function (match, chr) {
					return chr ? chr.toUpperCase() : '';
				});
		},
		hyphenate: function (str) {
			return convertBadValues(str)
				.replace(strCamelMatch, function (str, offset) {
					return str.charAt(0) + '-' + str.charAt(1)
						.toLowerCase();
				});
		},
		underscore: function (s) {
			return s.replace(strColons, '/')
				.replace(strWords, '$1_$2')
				.replace(strLowUp, '$1_$2')
				.replace(strDash, '_')
				.toLowerCase();
		},
		sub: function (str, data, remove) {
			var obs = [];
			str = str || '';
			obs.push(str.replace(strReplacer, function (whole, inside) {
				// Convert inside to type.
				var ob = can.getObject(inside, data, remove === true ? false : undefined);
				if (ob === undefined || ob === null) {
					obs = null;
					return '';
				}
				// If a container, push into objs (which will return objects found).
				if (isContainer(ob) && obs) {
					obs.push(ob);
					return '';
				}
				return '' + ob;
			}));
			return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
		},
		replacer: strReplacer,
		undHash: strUndHash
	});
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/construct',["can/util/string"], function (can) {
	// ## construct.js
	// `can.Construct`  
	// _This is a modified version of
	// [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/).  
	// It provides class level inheritance and callbacks._
	// A private flag used to initialize a new class instance without
	// initializing it's bindings.
	var initializing = 0;
	/**
	 * @add can.Construct
	 */
	can.Construct = function () {
		if (arguments.length) {
			return can.Construct.extend.apply(can.Construct, arguments);
		}
	};
	/**
	 * @static
	 */
	can.extend(can.Construct, {
		/**
		 * @property {Boolean} can.Construct.constructorExtends constructorExtends
		 * @parent can.Construct.static
		 *
		 * @description
		 *
		 * Toggles the behavior of a constructor function called
		 * without `new` to extend the constructor function or
		 * create a new instance.
		 *
		 * @body
		 *
		 * If `constructorExtends` is:
		 *
		 *  - `true` - the constructor extends
		 *  - `false` - a new instance of the constructor is created
		 *
		 * For 1.1, `constructorExtends` defaults to true. For
		 * 1.2, `constructorExtends` will default to false.
		 */
		constructorExtends: true,
		/**
		 * @function can.Construct.newInstance newInstance
		 * @parent can.Construct.static
		 *
		 * @description Returns an instance of `can.Construct`. This method
		 * can be overridden to return a cached instance.
		 *
		 * @signature `can.Construct.newInstance([...args])`
		 *
		 * @param {*} [args] arguments that get passed to [can.Construct::setup] and [can.Construct::init]. Note
		 * that if [can.Construct::setup] returns an array, those arguments will be passed to [can.Construct::init]
		 * instead.
		 * @return {class} instance of the class
		 *
		 * @body
		 * Creates a new instance of the constructor function. This method is useful for creating new instances
		 * with arbitrary parameters. Typically, however, you will simply want to call the constructor with the
		 * __new__ operator.
		 *
		 * ## Example
		 *
		 * The following creates a `Person` Construct and then creates a new instance of Person,
		 * using `apply` on newInstance to pass arbitrary parameters.
		 *
		 * @codestart
		 * var Person = can.Construct.extend({
		 *   init : function(first, middle, last) {
		 *     this.first = first;
		 *     this.middle = middle;
		 *     this.last = last;
		 *   }
		 * });
		 *
		 * var args = ["Justin","Barry","Meyer"],
		 *     justin = new Person.newInstance.apply(null, args);
		 * @codeend
		 */
		newInstance: function () {
			// Get a raw instance object (`init` is not called).
			var inst = this.instance(),
				args;
			// Call `setup` if there is a `setup`
			if (inst.setup) {
				args = inst.setup.apply(inst, arguments);
			}
			// Call `init` if there is an `init`  
			// If `setup` returned `args`, use those as the arguments
			if (inst.init) {
				inst.init.apply(inst, args || arguments);
			}
			return inst;
		},
		// Overwrites an object with methods. Used in the `super` plugin.
		// `newProps` - New properties to add.
		// `oldProps` - Where the old properties might be (used with `super`).
		// `addTo` - What we are adding to.
		_inherit: function (newProps, oldProps, addTo) {
			can.extend(addTo || newProps, newProps || {});
		},
		// used for overwriting a single property.
		// this should be used for patching other objects
		// the super plugin overwrites this
		_overwrite: function (what, oldProps, propName, val) {
			what[propName] = val;
		},
		// Set `defaults` as the merger of the parent `defaults` and this
		// object's `defaults`. If you overwrite this method, make sure to
		// include option merging logic.
		/**
		 * @function can.Construct.setup setup
		 * @parent can.Construct.static
		 *
		 * @description Perform initialization logic for a constructor function.
		 *
		 * @signature `can.Construct.setup(base, fullName, staticProps, protoProps)`
		 *
		 * A static `setup` method provides inheritable setup functionality
		 * for a Constructor function. The following example
		 * creates a Group constructor function.  Any constructor
		 * functions that inherit from Group will be added to
		 * `Group.childGroups`.
		 *
		 *
		 *     Group = can.Construct.extend({
		 *       setup: function(Construct, fullName, staticProps, protoProps){
		 *         this.childGroups = [];
		 *         if(Construct !== can.Construct){
		 *           this.childGroups(Construct)
		 *         }
		 *         Construct.setup.apply(this, arguments)
		 *       }
		 *     },{})
		 *     var Flock = Group.extend(...)
		 *     Group.childGroups[0] //-> Flock
		 *
		 * @param {constructor} base The base constructor that is being inherited from.
		 * @param {String} fullName The name of the new constructor.
		 * @param {Object} staticProps The static properties of the new constructor.
		 * @param {Object} protoProps The prototype properties of the new constructor.
		 *
		 * @body
		 * The static `setup` method is called immediately after a constructor
		 * function is created and
		 * set to inherit from its base constructor. It is useful for setting up
		 * additional inheritance work.
		 * Do not confuse this with the prototype `[can.Construct::setup]` method.
		 *
		 * ## Setup Extends Defaults
		 *
		 * Setup deeply extends the static `defaults` property of the base constructor with
		 * properties of the inheriting constructor.  For example:
		 *
		 * @codestart
		 * Parent = can.Construct.extend({
		 *   defaults : {
		 *     parentProp: 'foo'
		 *   }
		 * },{})
		 *
		 * Child = Parent.extend({
		 *   defaults : {
		 *     childProp : 'bar'
		 *   }
		 * },{}
		 *
		 * Child.defaults // {parentProp: 'foo', 'childProp': 'bar'}
		 * @codeend
		 *
		 * ## Example
		 *
		 * This `Parent` class adds a reference to its base class to itself, and
		 * so do all the classes that inherit from it.
		 *
		 * @codestart
		 * Parent = can.Construct.extend({
		 *   setup : function(base, fullName, staticProps, protoProps){
		 *     this.base = base;
		 *
		 *     // call base functionality
		 *     can.Construct.setup.apply(this, arguments)
		 *   }
		 * },{});
		 *
		 * Parent.base; // can.Construct
		 *
		 * Child = Parent({});
		 *
		 * Child.base; // Parent
		 * @codeend
		 */
		setup: function (base, fullName) {
			this.defaults = can.extend(true, {}, base.defaults, this.defaults);
		},
		// Create's a new `class` instance without initializing by setting the
		// `initializing` flag.
		instance: function () {
			// Prevents running `init`.
			initializing = 1;
			var inst = new this();
			// Allow running `init`.
			initializing = 0;
			return inst;
		},
		// Extends classes.
		/**
		 * @function can.Construct.extend extend
		 * @parent can.Construct.static
		 *
		 * @signature `can.Construct.extend([name,] [staticProperties,] instanceProperties)`
		 *
		 * Extends `can.Construct`, or constructor functions derived from `can.Construct`,
		 * to create a new constructor function. Example:
		 *
		 *     Animal = can.Construct.extend({
		 *       sayHi: function(){
		 *         console.log("hi")
		 *       }
		 *     })
		 *     var animal = new Animal()
		 *     animal.sayHi();
		 *
		 * @param {String} [name] Creates the necessary properties and
		 * objects that point from the `window` to the created constructor function. The following:
		 *
		 *     can.Construct.extend("company.project.Constructor",{})
		 *
		 * creates a `company` object on window if it does not find one, a
		 * `project` object on `company` if it does not find one, and it will set the
		 * `Constructor` property on the `project` object to point to the constructor function.
		 *
		 * Finally, it sets "company.project.Constructor" as [can.Construct.fullName fullName]
		 * and "Constructor" as [can.Construct.shortName shortName].
		 *
		 * @param {Object} [staticProperties] Properties that are added the constructor
		 * function directly. For example:
		 *
		 *     Animal = can.Construct.extend({
		 *       findAll: function(){
		 *         return can.ajax({url: "/animals"})
		 *       }
		 *     },{});
		 *
		 *     Animal.findAll().then(function(json){ ... })
		 *
		 * The [can.Construct.setup static setup] method can be used to
		 * specify inheritable behavior when a Constructor function is created.
		 *
		 * @param {Object} instanceProperties Properties that belong to
		 * instances made with the constructor. These properties are added to the
		 * constructor's `prototype` object. Example:
		 *
		 *     Animal = can.Construct.extend({
		 *       init: function(name){
		 *         this.name = name;
		 *       },
		 *       sayHi: function(){
		 *         console.log(this.name,"says hi")
		 *       }
		 *     })
		 *     var animal = new Animal()
		 *     animal.sayHi();
		 *
		 * The [can.Construct::init init] and [can.Construct::setup setup] properties
		 * are used for initialization.
		 *
		 * @return {function} The constructor function.
		 *
		 */
		extend: function (name, staticProperties, instanceProperties) {
			var fullName = name,
				klass = staticProperties,
				proto = instanceProperties;

			// Figure out what was passed and normalize it.
			if (typeof fullName !== 'string') {
				proto = klass;
				klass = fullName;
				fullName = null;
			}
			if (!proto) {
				proto = klass;
				klass = null;
			}
			proto = proto || {};
			var _super_class = this,
				_super = this.prototype,
				parts, current, _fullName, _shortName, propName, shortName, namespace, prototype;
			// Instantiate a base class (but only create the instance,
			// don't run the init constructor).
			prototype = this.instance();
			// Copy the properties over onto the new prototype.
			can.Construct._inherit(proto, _super, prototype);
			// The dummy class constructor.
			function Constructor() {
				// All construction is actually done in the init method.
				if (!initializing) {
				
					
					return this.constructor !== Constructor &&
					// We are being called without `new` or we are extending.
					arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) :
					// We are being called with `new`.
					Constructor.newInstance.apply(Constructor, arguments);
				}
			}
			// Copy old stuff onto class (can probably be merged w/ inherit)
			for (propName in _super_class) {
				if (_super_class.hasOwnProperty(propName)) {
					Constructor[propName] = _super_class[propName];
				}
			}
			// Copy new static properties on class.
			can.Construct._inherit(klass, _super_class, Constructor);
			// Setup namespaces.
			if (fullName) {

				parts = fullName.split('.');
				shortName = parts.pop();
				current = can.getObject(parts.join('.'), window, true);
				namespace = current;
				_fullName = can.underscore(fullName.replace(/\./g, "_"));
				_shortName = can.underscore(shortName);

			

				current[shortName] = Constructor;
			}
			// Set things that shouldn't be overwritten.
			can.extend(Constructor, {
				constructor: Constructor,
				prototype: prototype,
				/**
				 * @property {String} can.Construct.namespace namespace
				 * @parent can.Construct.static
				 *
				 * The `namespace` property returns the namespace your constructor is in.
				 * This provides a way organize code and ensure globally unique types. The
				 * `namespace` is the [can.Construct.fullName fullName] you passed without the [can.Construct.shortName shortName].
				 *
				 * @codestart
				 * can.Construct("MyApplication.MyConstructor",{},{});
				 * MyApplication.MyConstructor.namespace // "MyApplication"
				 * MyApplication.MyConstructor.shortName // "MyConstructor"
				 * MyApplication.MyConstructor.fullName  // "MyApplication.MyConstructor"
				 * @codeend
				 */
				namespace: namespace,
				/**
				 * @property {String} can.Construct.shortName shortName
				 * @parent can.Construct.static
				 *
				 * If you pass a name when creating a Construct, the `shortName` property will be set to the
				 * name you passed without the [can.Construct.namespace namespace].
				 *
				 * @codestart
				 * can.Construct("MyApplication.MyConstructor",{},{});
				 * MyApplication.MyConstructor.namespace // "MyApplication"
				 * MyApplication.MyConstructor.shortName // "MyConstructor"
				 * MyApplication.MyConstructor.fullName  // "MyApplication.MyConstructor"
				 * @codeend
				 */
				_shortName: _shortName,
				/**
				 * @property {String} can.Construct.fullName fullName
				 * @parent can.Construct.static
				 *
				 * If you pass a name when creating a Construct, the `fullName` property will be set to
				 * the name you passed. The `fullName` consists of the [can.Construct.namespace namespace] and
				 * the [can.Construct.shortName shortName].
				 *
				 * @codestart
				 * can.Construct("MyApplication.MyConstructor",{},{});
				 * MyApplication.MyConstructor.namespace // "MyApplication"
				 * MyApplication.MyConstructor.shortName // "MyConstructor"
				 * MyApplication.MyConstructor.fullName  // "MyApplication.MyConstructor"
				 * @codeend
				 */
				fullName: fullName,
				_fullName: _fullName
			});
			// Dojo and YUI extend undefined
			if (shortName !== undefined) {
				Constructor.shortName = shortName;
			}
			// Make sure our prototype looks nice.
			Constructor.prototype.constructor = Constructor;
			// Call the class `setup` and `init`
			var t = [_super_class].concat(can.makeArray(arguments)),
				args = Constructor.setup.apply(Constructor, t);
			if (Constructor.init) {
				Constructor.init.apply(Constructor, args || t);
			}
			/**
			 * @prototype
			 */
			return Constructor; //  
			/**
			 * @property {Object} can.Construct.prototype.constructor constructor
			 * @parent can.Construct.prototype
			 *
			 * A reference to the constructor function that created the instance. This allows you to access
			 * the constructor's static properties from an instance.
			 *
			 * ## Example
			 *
			 * This can.Construct has a static counter that counts how many instances have been created:
			 *
			 * @codestart
			 * can.Construct.extend("Counter", {
			 *     count: 0
			 * }, {
			 *     init: function() {
			 *         this.constructor.count++;
			 *     }
			 * });
			 *
			 * new Counter();
			 * Counter.count; // 1
			 * @codeend
			 */
		}
	});
	/**
	 * @function can.Construct.prototype.setup setup
	 * @parent can.Construct.prototype
	 *
	 * @signature `construct.setup(...args)`
	 *
	 * A setup function for the instantiation of a constructor function.
	 *
	 * @param {*} args The arguments passed to the constructor.
	 *
	 * @return {Array|undefined} If an array is returned, the array's items are passed as
	 * arguments to [can.Construct::init init]. The following example always makes
	 * sure that init is called with a jQuery wrapped element:
	 *
	 *     WidgetFactory = can.Construct.extend({
	 *         setup: function(element){
	 *             return [$(element)]
	 *         }
	 *     })
	 *
	 *     MyWidget = WidgetFactory.extend({
	 *         init: function($el){
	 *             $el.html("My Widget!!")
	 *         }
	 *     })
	 *
	 * Otherwise, the arguments to the
	 * constructor are passed to [can.Construct::init] and the return value of `setup` is discarded.
	 *
	 * @body
	 *
	 * ## Deciding between `setup` and `init`
	 *
	 *
	 * Usually, you should use [can.Construct::init init] to do your constructor function's initialization.
	 * Use `setup` instead for:
	 *
	 *   - initialization code that you want to run before the inheriting constructor's
	 *     `init` method is called.
	 *   - initialization code that should run whether or not inheriting constructors
	 *     call their base's `init` methods.
	 *   - modifying the arguments that will get passed to `init`.
	 *
	 * ## Example
	 *
	 * This code is a simplified version of the code in [can.Control]'s setup
	 * method. It converts the first argument to a jQuery collection and
	 * extends the controller's defaults with the options that were passed.
	 *
	 *
	 *     can.Control = can.Construct.extend({
	 *         setup: function(domElement, rawOptions) {
	 *             // set up this.element
	 *             this.element = $(domElement);
	 *
	 *             // set up this.options
	 *             this.options = can.extend({},
	 *                                   this.constructor.defaults,
	 *                                   rawOptions
	 *                                  );
	 *
	 *             // pass this.element and this.options to init.
	 *             return [this.element, this.options];
	 *         }
	 *     });
	 *
	 */
	can.Construct.prototype.setup = function () {};
	/**
	 * @function can.Construct.prototype.init init
	 * @parent can.Construct.prototype
	 *
	 * @description Called when a new instance of a can.Construct is created.
	 *
	 * @signature `construct.init(...args)`
	 * @param {*} args the arguments passed to the constructor (or the items of the array returned from [can.Construct::setup])
	 *
	 * @body
	 * If a prototype `init` method is provided, it is called when a new Construct is created,
	 * after [can.Construct::setup]. The `init` method is where the bulk of your initialization code
	 * should go, and a common thing to do in `init` is to save the arguments passed into the constructor.
	 *
	 * ## Examples
	 *
	 * First, we'll make a Person constructor that has a first and last name:
	 *
	 * @codestart
	 * var Person = can.Construct.extend({
	 *     init: function(first, last) {
	 *         this.first = first;
	 *         this.last  = last;
	 *     }
	 * });
	 *
	 * var justin = new Person("Justin", "Meyer");
	 * justin.first; // "Justin"
	 * justin.last; // "Meyer"
	 * @codeend
	 *
	 * Then we'll extend Person into Programmer and add a favorite language:
	 *
	 * @codestart
	 * var Programmer = Person.extend({
	 *     init: function(first, last, language) {
	 *         // call base's init
	 *         Person.prototype.init.apply(this, arguments);
	 *
	 *         // other initialization code
	 *         this.language = language;
	 *     },
	 *     bio: function() {
	 *         return "Hi! I'm "" + this.first + " " + this.last +
	 *             " and I write " + this.language + ".";
	 *     }
	 * });
	 *
	 * var brian = new Programmer("Brian", "Moschel", 'ECMAScript');
	 * brian.bio(); // "Hi! I'm Brian Moschel and I write ECMAScript.";
	 * @codeend
	 *
	 * ## Modified Arguments
	 *
	 * [can.Construct::setup] is able to modify the arguments passed to `init`.
	 * If you aren't receiving the exact arguments as those passed to `new Construct(args)`,
	 * check to make sure that they aren't being changed by `setup` somewhere along
	 * the inheritance chain.
	 */
	can.Construct.prototype.init = function () {};
	return can.Construct;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/batch',["can/util/can"], function (can) {
	// Which batch of events this is for -- might not want to send multiple
	// messages on the same batch.  This is mostly for event delegation.
	var batchNum = 1,
		// how many times has start been called without a stop
		transactions = 0,
		// an array of events within a transaction
		batchEvents = [],
		stopCallbacks = [];
	can.batch = {
		/**
		 * @function can.batch.start
		 * @parent can.batch
		 * @description Begin an event batch.
		 *
		 * @signature `can.batch.start([batchStopHandler])`
		 *
		 * @param {Function} [batchStopHandler] a callback that gets called after all batched events have been called
		 *
		 * @body
		 * `can.batch.start` causes can.Map to begin an event batch. Until `[can.batch.stop]` is called, any
		 * events that would result from calls to `[can.Map::attr attr]` are held back from firing. If you have
		 * lots of changes to make to can.Maps, batching them together can help performance &emdash; especially if
		 * those can.Maps are live-bound to the DOM.
		 *
		 * In this example, you can see how the _first_ and _change_ events are not fired (and their handlers
		 * are not called) until `can.batch.stop` is called.
		 *
		 * @codestart
		 * var person = new can.Map({
		 *     first: 'Alexis',
		 *     last: 'Abril'
		 * });
		 *
		 * person.bind('first', function() {
		 *     console.log("First name changed."");
		 * }).bind('change', function() {
		 *     console.log("Something changed.");
		 * });
		 *
		 * can.batch.start();
		 * person.attr('first', 'Alex');
		 * console.log('Still in the batch.');
		 * can.batch.stop();
		 *
		 * // the log has:
		 * // Still in the batch.
		 * // First name changed.
		 * // Something changed.
		 * @codeend
		 *
		 * You can also pass a callback to `can.batch.start` which will be called after all the events have
		 * been fired:
		 * @codestart
		 * can.batch.start(function() {
		 *     console.log('The batch is over.');
		 * });
		 * person.attr('first', 'Izzy');
		 * console.log('Still in the batch.');
		 * can.batch.stop();
		 *
		 * // The console has:
		 * // Still in the batch.
		 * // First name changed.
		 * // Something changed.
		 * // The batch is over.
		 * @codeend
		 *
		 * ## Calling `can.batch.start` multiple times
		 *
		 * If you call `can.batch.start` more than once, `can.batch.stop` needs to be called
		 * the same number of times before any batched events will fire. For ways
		 * to circumvent this process, see [can.batch.stop].
		 *
		 * Here is an example that demonstrates how events are affected by calling
		 * `can.batch.start` multiple times.
		 *
		 * @codestart
		 * var addPeople = function(observable) {
		 *     can.batch.start();
		 *     observable.attr('a', 'Alice');
		 *     observable.attr('b', 'Bob');
		 *     observable.attr('e', 'Eve');
		 *     can.batch.stop();
		 * };
		 *
		 * // In a completely different place:
		 * var list = new can.Map();
		 * list.bind('change', function() {
		 *     console.log('The list changed.');
		 * });
		 *
		 * can.batch.start();
		 * addPeople(list);
		 * console.log('Still in the batch.');
		 *
		 * // Here, the console has:
		 * // Still in the batch.
		 *
		 * can.batch.stop();
		 *
		 * // Here, the console has:
		 * // Still in the batch.
		 * // The list changed.
		 * // The list changed.
		 * // The list changed.
		 * @codeend
		 */
		start: function (batchStopHandler) {
			transactions++;
			if (batchStopHandler) {
				stopCallbacks.push(batchStopHandler);
			}
		},
		/**
		 * @function can.batch.stop
		 * @parent can.batch
		 * @description End an event batch.
		 * @signature `can.batch.stop([force[, callStart]])`
		 * @param {bool} [force=false] whether to stop batching events immediately
		 * @param {bool} [callStart=false] whether to call `[can.batch.start can.batch.start]` after firing batched events
		 *
		 * @body
		 * `can.batch.stop` matches an earlier `[can.batch.start]` call. If `can.batch.stop` has been
		 * called as many times as `can.batch.start` (or if _force_ is true), all batched events will be
		 * fired and any callbacks passed to `can.batch.start` since the beginning of the batch will be
		 * called. If _force and _callStart_ are both true, a new batch will be started when all
		 * the events and callbacks have been fired.
		 *
		 * See `[can.batch.start]` for examples of `can.batch.start` and `can.batch.stop` in normal use.
		 *
		 * In this example, the batch is forceably ended in the `addPeople` function.
		 * @codestart
		 * var addPeople = function(observable) {
		 *     can.batch.start();
		 *     observable.attr('a', 'Alice');
		 *     observable.attr('b', 'Bob');
		 *     observable.attr('e', 'Eve');
		 *     can.batch.stop(true);
		 * };
		 *
		 * // In a completely different place:
		 * var list = new can.Map();
		 * list.bind('change', function() {
		 *     console.log('The list changed.');
		 * });
		 *
		 * can.batch.start();
		 * addPeople(list);
		 * console.log('Still in the batch.');
		 *
		 * // Here, the console has:
		 * // Still in the batch.
		 *
		 * can.batch.stop();
		 *
		 * // Here, the console has:
		 * // The list changed.
		 * // The list changed.
		 * // The list changed.
		 * // Still in the batch.
		 * @codeend
		 */
		stop: function (force, callStart) {
			if (force) {
				transactions = 0;
			} else {
				transactions--;
			}
			if (transactions === 0) {
				var items = batchEvents.slice(0),
					callbacks = stopCallbacks.slice(0),
					i, len;
				batchEvents = [];
				stopCallbacks = [];
				batchNum++;
				if (callStart) {
					can.batch.start();
				}
				for(i = 0, len = items.length; i < len; i++) {
					can.dispatch.apply(items[i][0],items[i][1]);
				}
				for(i = 0, len = callbacks.length; i < callbacks.length; i++) {
					callbacks[i]();
				}
			}
		},
		/**
		 * @function can.batch.trigger
		 * @parent can.batch
		 * @description Trigger an event to be added to the current batch.
		 * @signature `can.batch.trigger(item, event [, args])`
		 * @param {can.Map} item the target of the event
		 * @param {String|{type: String}} event the type of event, or an event object with a type given
		 * @param {Array} [args] the parameters to trigger the event with.
		 *
		 * @body
		 * If events are currently being batched, calling `can.batch.trigger` adds an event
		 * to the batch. If events are not currently being batched, the event is triggered
		 * immediately.
		 */
		trigger: function (item, event, args) {
			// Don't send events if initalizing.
			if (!item._init) {
				if (transactions === 0) {
					return can.dispatch.call(item, event, args);
				} else {
					event = typeof event === 'string' ? {
						type: event
					} : event;
					event.batchNum = batchNum;
					batchEvents.push([
						item,
						[event, args]
					]);
				}
			}
		}
	};
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/map',["can/util/library", "can/util/bind", "can/map/bubble", "can/construct", "can/util/batch"], function (can, bind, bubble) {
	// ## Helpers

	// A temporary map of Maps that have been made from plain JS objects.
	var madeMap = null;
	// Clears out map of converted objects.
	var teardownMap = function () {
		for (var cid in madeMap) {
			if (madeMap[cid].added) {
				delete madeMap[cid].obj._cid;
			}
		}
		madeMap = null;
	};
	// Retrieves a Map instance from an Object.
	var getMapFromObject = function (obj) {
		return madeMap && madeMap[obj._cid] && madeMap[obj._cid].instance;
	};
	// A temporary map of Maps
	var serializeMap = null;


	/**
	 * @add can.Map
	 */
	//
	var Map = can.Map = can.Construct.extend({
			/**
			 * @static
			 */
			setup: function () {

				can.Construct.setup.apply(this, arguments);

				// Do not run if we are defining can.Map.
				if (can.Map) {
					if (!this.defaults) {
						this.defaults = {};
					}
					// Builds a list of compute and non-compute properties in this Object's prototype.
					this._computes = [];
				
					for (var prop in this.prototype) {
						// Non-functions are regular defaults.
						if (prop !== "define" && typeof this.prototype[prop] !== "function") {
							this.defaults[prop] = this.prototype[prop];
						// Functions with an `isComputed` property are computes.
						} else if (this.prototype[prop].isComputed) {
							this._computes.push(prop);
						}
					}
					if(this.helpers.define) {
						this.helpers.define(this);
					}
				}
				// If we inherit from can.Map, but not can.List, make sure any lists are the correct type.
				if (can.List && !(this.prototype instanceof can.List)) {
					this.List = Map.List.extend({
						Map: this
					}, {});
				}

			},
			// Reference to bubbling helpers.
			_bubble: bubble,
			// Given an eventName, determine if bubbling should be setup.
			_bubbleRule: function(eventName) {
				return (eventName === "change" || eventName.indexOf(".") >= 0 ) && "change";
			},
			// List of computes on the Map's prototype.
			_computes: [],
			// Adds an event to this Map.
			bind: can.bindAndSetup,
			on: can.bindAndSetup,
			// Removes an event from this Map.
			unbind: can.unbindAndTeardown,
			off: can.unbindAndTeardown,
			// Name of the id field. Used in can.Model.
			id: "id",
			// ## Internal helpers
			helpers: {
				// ### can.Map.helpers.define
				// Stub function for the define plugin.
				define: null,
				/**
				 * @hide
				 * Parses attribute name into its parts
				 * @param {String|Array} attr attribute name
				 * @param {Boolean} keepKey whether to keep the key intact
				 * @return {Array} attribute parts
				 */
				// ### can.Map.helpers.attrParts
				// Parses attribute name into its parts.
				attrParts: function (attr, keepKey) {
					//Keep key intact
					
					if (keepKey ) {
						return [attr];
					}
					// Split key on '.'
					return typeof attr === "object" ? attr : ("" + attr)
						.split(".");
				},
				/**
				 * @hide
				 * Tracks Map instances created from JS Objects
				 * @param {Object} obj original Object
				 * @param {can.Map} instance the can.Map instance
				 * @return {Function} function to clear out object mapping
				 */
				// ### can.Map.helpers.addToMap
				// Tracks Map instances created from JS Objects
				addToMap: function (obj, instance) {
					var teardown;
					// Setup a fresh mapping if `madeMap` is missing.
					if (!madeMap) {
						teardown = teardownMap;
						madeMap = {};
					}
					// Record if Object has a `_cid` before adding one.
					var hasCid = obj._cid;
					var cid = can.cid(obj);

					// Only update if there already isn't one already.
					if (!madeMap[cid]) {

						madeMap[cid] = {
							obj: obj,
							instance: instance,
							added: !hasCid
						};
					}
					return teardown;
				},
				/**
				 * @hide
				 * Determines if `obj` is observable
				 * @param {Object} obj Object to check
				 * @return {Boolean} whether `obj` is an observable
				 */
				// ### can.Map.helpers.isObservable
				// Determines if `obj` is observable.
				isObservable: function(obj){
					return obj instanceof can.Map || (obj && obj === can.route);
				},
				/**
				 * @hide
				 * Determines if `obj` can be made into an observable
				 * @param {Object} obj Object to check
				 * @return {Boolean} whether `obj` can be made into an observable
				 */
				// ### can.Map.helpers.canMakeObserve
				// Determines if an object can be made into an observable.
				canMakeObserve: function (obj) {
					return obj && !can.isDeferred(obj) && (can.isArray(obj) || can.isPlainObject(obj) );
				},
				/**
				 * @hide
				 * Serializes a Map or Map.List
				 * @param {can.Map|can.List} map The observable.
				 * @param {String} how To serialize using `attr` or `serialize`.
				 * @param {String} where Object or Array to put properties in.
				 * @return {Object|Array} serialized Map or List data.
				 */
				// ### can.Map.helpers.serialize
				// Serializes a Map or Map.List
				serialize: function (map, how, where) {
					var cid = can.cid(map),
						firstSerialize = false;
					if(!serializeMap) {
						firstSerialize = true;
						// Serialize might call .attr() so we need to keep different map 
						serializeMap = {
							attr: {},
							serialize: {}
						};
					}
					serializeMap[how][cid] = where;
					// Go through each property.
					map.each(function (val, name) {
						// If the value is an `object`, and has an `attrs` or `serialize` function.
						var result,
							isObservable =  Map.helpers.isObservable(val),
							serialized = isObservable && serializeMap[how][can.cid(val)];
						if( serialized ) {
							result = serialized;
						} else {
							if(how === "serialize") {
								result = Map.helpers._serialize(map, name, val);
							} else {
								result = Map.helpers._getValue(map, name, val, how);
							}
						}
						// this is probably removable
						if(result !== undefined){
							where[name] = result;
						}
					});

					can.__reading(map, '__keys');
					if(firstSerialize) {
						serializeMap = null;
					}
					return where;
				},
				_serialize: function(map, name, val){
					return Map.helpers._getValue(map, name, val, "serialize");
				},
				_getValue: function(map, name, val, how){
					if( Map.helpers.isObservable(val) ) {
						return val[how]();
					} else {
						return val;
					}
				}
			},
			/**
			 * @hide
			 * Returns list of keys in a Map
			 * @param {can.Map} map
			 * @returns {Array}
			 */
			keys: function (map) {
				var keys = [];
				can.__reading(map, '__keys');
				for (var keyName in map._data) {
					keys.push(keyName);
				}
				return keys;
			}
		},
		/**
		 * @prototype
		 */
		{
			setup: function (obj) {
				if(obj instanceof can.Map){
					obj = obj.serialize();
				}
				
				// `_data` is where we keep the properties.
				this._data = {};
				/**
				 * @property {String} can.Map.prototype._cid
				 * @hide
				 *
				 * A globally unique ID for this `can.Map` instance.
				 */
				// The namespace this `object` uses to listen to events.
				can.cid(this, ".map");
				// Sets all `attrs`.
				this._init = 1;
				// It's handy if we pass this to comptues, because computes can have a default value.
				var defaultValues = this._setupDefaults();
				this._setupComputes(defaultValues);
				var teardownMapping = obj && can.Map.helpers.addToMap(obj, this);

				var data = can.extend(can.extend(true, {}, defaultValues), obj);

				this.attr(data);

				if (teardownMapping) {
					teardownMapping();
				}

				// `batchTrigger` change events.
				this.bind('change', can.proxy(this._changes, this));

				delete this._init;
			},
			// Sets up computed properties on a Map.
			_setupComputes: function () {
				var computes = this.constructor._computes;
				this._computedBindings = {};

				for (var i = 0, len = computes.length, prop; i < len; i++) {
					prop = computes[i];
					// Make the context of the compute the current Map
					this[prop] = this[prop].clone(this);
					// Keep track of computed properties
					this._computedBindings[prop] = {
						count: 0
					};
				}
			},
			_setupDefaults: function(){
				return this.constructor.defaults || {};
			},
			// Setup child bindings.
			_bindsetup: function(){},
			// Teardown child bindings.
			_bindteardown: function(){},
			// `change`event handler.
			_changes: function (ev, attr, how, newVal, oldVal) {
				// when a change happens, create the named event.
				can.batch.trigger(this, {
					type: attr,
					batchNum: ev.batchNum,
					target: ev.target
				}, [newVal, oldVal]);

				
			},
			// Trigger a change event.
			_triggerChange: function (attr, how, newVal, oldVal) {
				// so this change can bubble ... a bubbling change triggers the 
				// _changes trigger
				if(bubble.isBubbling(this, "change")) {
					can.batch.trigger(this, {
						type: "change",
						target: this
					}, [attr, how, newVal, oldVal]);
				} else {
					can.batch.trigger(this, attr, [newVal, oldVal]);
				}
				
				if(how === "remove" || how === "add") {
					can.batch.trigger(this, {
						type: "__keys",
						target: this
					});
				}
			},
			// Iterator that does not trigger live binding.
			_each: function (callback) {
				var data = this.__get();
				for (var prop in data) {
					if (data.hasOwnProperty(prop)) {
						callback(data[prop], prop);
					}
				}
			},

			attr: function (attr, val) {
				// This is super obfuscated for space -- basically, we're checking
				// if the type of the attribute is not a `number` or a `string`.
				var type = typeof attr;
				if (type !== "string" && type !== "number") {
					return this._attrs(attr, val);
				// If we are getting a value.
				} else if (arguments.length === 1) {
					can.__reading(this, attr);
					return this._get(attr);
				} else {
					// Otherwise we are setting.
					this._set(attr, val);
					return this;
				}
			},

			each: function () {
				return can.each.apply(undefined, [this].concat(can.makeArray(arguments)));
			},

			removeAttr: function (attr) {
				// If this is List.
				var isList = can.List && this instanceof can.List,
					// Convert the `attr` into parts (if nested).
					parts = can.Map.helpers.attrParts(attr),
					// The actual property to remove.
					prop = parts.shift(),
					// The current value.
					current = isList ? this[prop] : this._data[prop];

				// If we have more parts, call `removeAttr` on that part.
				if (parts.length && current) {
					return current.removeAttr(parts);
				} else {

					// If attr does not have a `.`
					if (typeof attr === 'string' && !!~attr.indexOf('.')) {
						prop = attr;
					}

					this._remove(prop, current);
					return current;
				}
			},
			// Remove a property.
			_remove: function(prop, current){
				if (prop in this._data) {
					// Delete the property from `_data` and the Map
					// as long as it isn't part of the Map's prototype.
					delete this._data[prop];
					if (!(prop in this.constructor.prototype)) {
						delete this[prop];
					}
					// Let others now this property has been removed.
					this._triggerChange(prop, "remove", undefined, current);

				}
			},
			// Reads a property from the `object`.
			_get: function (attr) {
				attr = ""+attr;
				var dotIndex = attr.indexOf('.');
				
				
				// Handles the case of a key having a `.` in its name
				// Otherwise we have to dig deeper into the Map to get the value.
				if( dotIndex >= 0 ) {
					// Attempt to get the value
					var value = this.__get(attr);
					// For keys with a `.` in them, value will be defined
					if (value !== undefined) {
						return value;
					}
					var first = attr.substr(0, dotIndex),
						second = attr.substr(dotIndex+1),
						current = this.__get( first );
					return current && current._get ?  current._get(second) : undefined;
				} else {
					return this.__get( attr );
				}
			},
			// Reads a property directly if an `attr` is provided, otherwise
			// returns the "real" data object itself.
			__get: function (attr) {
				if (attr) {
					// If property is a compute return the result, otherwise get the value directly
					if (this._computedBindings[attr]) {
						return this[attr]();
					} else {
						return this._data[attr];
					}
				// If not property is provided, return entire `_data` object
				} else {
					return this._data;
				}
			},
			// converts the value into an observable if needed
			__type: function(value, prop){
				// If we are getting an object.
				if (!( value instanceof can.Map) && can.Map.helpers.canMakeObserve(value)  ) {

					var cached = getMapFromObject(value);
					if(cached) {
						return cached;
					}
					if( can.isArray(value) ) {
						var List = can.List;
						return new List(value);
					} else {
						var Map = this.constructor.Map || can.Map;
						return new Map(value);
					}
				}
				return value;
			},
			// Sets `attr` prop as value on this object where.
			// `attr` - Is a string of properties or an array  of property values.
			// `value` - The raw value to set.
			_set: function (attr, value, keepKey) {
				attr = ""+attr;
				var dotIndex = attr.indexOf('.'),
					current;
				if(!keepKey && dotIndex >= 0){
					var first = attr.substr(0, dotIndex),
						second = attr.substr(dotIndex+1);
						
					current =  this._init ? undefined : this.__get( first );
					
					if( Map.helpers.isObservable(current) ) {
						current._set(second, value);
					} else {
						throw "can.Map: Object does not exist";
					}
				} else {
					if (this.__convert) {
						//Convert if there is a converter
						value = this.__convert(attr, value);
					}
					current = this._init ? undefined : this.__get( attr );
					this.__set(attr, this.__type(value, attr), current);
				}
			},
			__set: function (prop, value, current) {
				// TODO: Check if value is object and transform.
				// Don't do anything if the value isn't changing.
				if (value !== current) {
					// Check if we are adding this for the first time --
					// if we are, we need to create an `add` event.
					var changeType = current !== undefined || this.__get()
						.hasOwnProperty(prop) ? "set" : "add";

					// Set the value on `_data` and hook it up to send event.
					this.___set(prop, this.constructor._bubble.set(this, prop, value, current) );

					// `batchTrigger` the change event.
					this._triggerChange(prop, changeType, value, current);

					// If we can stop listening to our old value, do it.
					if (current) {
						this.constructor._bubble.teardownFromParent(this, current);
					}
				}

			},
			// Directly sets a property on this `object`.
			___set: function (prop, val) {
				if ( this._computedBindings[prop] ) {
					this[prop](val);
				} else {
					this._data[prop] = val;
				}
				// Add property directly for easy writing.
				// Check if its on the `prototype` so we don't overwrite methods like `attrs`.
				if ( typeof this.constructor.prototype[prop] !== 'function' && !this._computedBindings[prop] ) {
					this[prop] = val;
				}
			},

			bind: function (eventName, handler) {
				var computedBinding = this._computedBindings && this._computedBindings[eventName];
				if (computedBinding) {
					// The first time we bind to this computed property we
					// initialize `count` and `batchTrigger` the change event.
					if (!computedBinding.count) {
						computedBinding.count = 1;
						var self = this;
						computedBinding.handler = function (ev, newVal, oldVal) {
							can.batch.trigger(self, {
								type: eventName,
								batchNum: ev.batchNum,
								target: self
							}, [newVal, oldVal]);
						};
						this[eventName].bind("change", computedBinding.handler);
					} else {
						// Increment number of things listening to this computed property.
						computedBinding.count++;
					}

				}
				// The first time we bind to this Map, `_bindsetup` will
				// be called to setup child event bubbling.
				this.constructor._bubble.bind(this, eventName);
				return can.bindAndSetup.apply(this, arguments);

			},

			unbind: function (eventName, handler) {
				var computedBinding = this._computedBindings && this._computedBindings[eventName];
				if (computedBinding) {
					// If there is only one listener, we unbind the change event handler
					// and clean it up since no one is listening to this property any more.
					if (computedBinding.count === 1) {
						computedBinding.count = 0;
						this[eventName].unbind("change", computedBinding.handler);
						delete computedBinding.handler;
					} else {
						// Decrement number of things listening to this computed property
						computedBinding.count--;
					}

				}
				this.constructor._bubble.unbind(this, eventName);
				return can.unbindAndTeardown.apply(this, arguments);

			},

			serialize: function () {
				return can.Map.helpers.serialize(this, 'serialize', {});
			},
			/**
			 * @hide
			 * Set multiple properties on the observable
			 * @param {Object} props
			 * @param {Boolean} remove true if you should remove properties that are not in props
			 */
			_attrs: function (props, remove) {
				if (props === undefined) {
					return Map.helpers.serialize(this, 'attr', {});
				}

				props = can.simpleExtend({}, props);
				var prop,
					self = this,
					newVal;

				// Batch all of the change events until we are done.
				can.batch.start();
				// Merge current properties with the new ones.
				this.each(function (curVal, prop) {
					// You can not have a _cid property; abort.
					if (prop === "_cid") {
						return;
					}
					newVal = props[prop];

					// If we are merging, remove the property if it has no value.
					if (newVal === undefined) {
						if (remove) {
							self.removeAttr(prop);
						}
						return;
					}

					// Run converter if there is one
					if (self.__convert) {
						newVal = self.__convert(prop, newVal);
					}

					// If we're dealing with models, we want to call _set to let converters run.
					if ( Map.helpers.isObservable( newVal ) ) {

						self.__set(prop, self.__type(newVal, prop), curVal);
						// If its an object, let attr merge.
					} else if (Map.helpers.isObservable(curVal) && Map.helpers.canMakeObserve(newVal) ) {
						curVal.attr(newVal, remove);
						// Otherwise just set.
					} else if (curVal !== newVal) {
						self.__set(prop, self.__type(newVal, prop), curVal);
					}

					delete props[prop];
				});
				// Add remaining props.
				for (prop in props) {
					// Ignore _cid.
					if (prop !== "_cid") {
						newVal = props[prop];
						this._set(prop, newVal, true);
					}

				}
				can.batch.stop();
				return this;
			},

			compute: function (prop) {
				// If the property is a function, use it as the getter/setter
				// otherwise, create a new compute that returns the value of a property on `this`
				if (can.isFunction(this.constructor.prototype[prop])) {
					return can.compute(this[prop], this);
				} else {
					var reads = prop.split("."),
						last = reads.length - 1,
						options = {
							args: []
						};
					return can.compute(function (newVal) {
						if (arguments.length) {
							can.compute.read(this, reads.slice(0, last))
								.value.attr(reads[last], newVal);
						} else {
							return can.compute.read(this, reads, options)
								.value;
						}
					}, this);
				}

			}
		});

	// Setup on/off aliases
	Map.prototype.on = Map.prototype.bind;
	Map.prototype.off = Map.prototype.unbind;

	return Map;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/list',["can/util/library", "can/map", "can/map/bubble"], function (can, Map, bubble) {

	// Helpers for `observable` lists.
	var splice = [].splice,
		// test if splice works correctly
		spliceRemovesProps = (function () {
			// IE's splice doesn't remove properties
			var obj = {
				0: "a",
				length: 1
			};
			splice.call(obj, 0, 1);
			return !obj[0];
		})();

	/**
	 * @add can.List
	 */
	var list = Map.extend(
		/**
		 * @static
		 */
		{
			/**
			 * @property {can.Map} can.List.Map
			 *
			 * @description Specify the Map type used to make objects added to this list observable.
			 *
			 * @option {can.Map} When objects are added to a can.List, those objects are
			 * converted into can.Map instances.  For example:
			 *
			 *     var list = new can.List();
			 *     list.push({name: "Justin"});
			 *
			 *     var map = list.attr(0);
			 *     map.attr("name") //-> "Justin"
			 *
			 * By changing [can.List.Map], you can specify a different type of Map instance to
			 * create. For example:
			 *
			 *     var User = can.Map.extend({
			 *       fullName: function(){
			 *         return this.attr("first")+" "+this.attr("last")
			 *       }
			 *     });
			 *
			 *     User.List = can.List.extend({
			 *       Map: User
			 *     }, {});
			 *
			 *     var list = new User.List();
			 *     list.push({first: "Justin", last: "Meyer"});
			 *
			 *     var user = list.attr(0);
			 *     user.fullName() //-> "Justin Meyer"
			 *
			 *
			 *
			 */
			Map: Map
			/**
			 * @function can.Map.extend
			 *
			 * @signature `can.List.extend([name,] [staticProperties,] instanceProperties)`
			 *
			 * Creates a new extended constructor function. Learn more at [can.Construct.extend].
			 *
			 * @param {String} [name] If provided, adds the extened List constructor function
			 * to the window at the given name.
			 *
			 * @param {Object} [staticProperties] Properties and methods
			 * directly on the constructor function. The most common property to set is [can.List.Map].
			 *
			 * @param {Object} [instanceProperties] Properties and methods on instances of this list type.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 *
			 */
		},
		/**
		 * @prototype
		 */
		{
			setup: function (instances, options) {
				this.length = 0;
				can.cid(this, ".map");
				this._init = 1;
				this._setupComputes();
				instances = instances || [];
				var teardownMapping;

				if (can.isDeferred(instances)) {
					this.replace(instances);
				} else {
					teardownMapping = instances.length && can.Map.helpers.addToMap(instances, this);
					this.push.apply(this, can.makeArray(instances || []));
				}

				if (teardownMapping) {
					teardownMapping();
				}

				// this change needs to be ignored
				this.bind('change', can.proxy(this._changes, this));
				can.simpleExtend(this, options);
				delete this._init;
			},
			_triggerChange: function (attr, how, newVal, oldVal) {

				Map.prototype._triggerChange.apply(this, arguments);
				// `batchTrigger` direct add and remove events...
				var index = +attr;
				// Make sure this is not nested and not an expando
				if (!~attr.indexOf('.') && !isNaN(index)) {

					if (how === 'add') {
						can.batch.trigger(this, how, [newVal, index]);
						can.batch.trigger(this, 'length', [this.length]);
					} else if (how === 'remove') {
						can.batch.trigger(this, how, [oldVal, index]);
						can.batch.trigger(this, 'length', [this.length]);
					} else {
						can.batch.trigger(this, how, [newVal, index]);
					}

				}

			},
			__get: function (attr) {
				if (attr) {
					if (this[attr] && this[attr].isComputed && can.isFunction(this.constructor.prototype[attr])) {
						return this[attr]();
					} else {
						return this[attr];
					}
				} else {
					return this;
				}
			},
			___set: function (attr, val) {
				this[attr] = val;
				if (+attr >= this.length) {
					this.length = (+attr + 1);
				}
			},
			_remove: function(prop, current) {
				// if removing an expando property
				if(isNaN(+prop)) {
					delete this[prop];
					this._triggerChange(prop, "remove", undefined, current);
				} else {
					this.splice(prop, 1);
				}
			},
			_each: function (callback) {
				var data = this.__get();
				for (var i = 0; i < data.length; i++) {
					callback(data[i], i);
				}
			},
			// Returns the serialized form of this list.
			/**
			 * @hide
			 * Returns the serialized form of this list.
			 */
			serialize: function () {
				return Map.helpers.serialize(this, 'serialize', []);
			},
			/**
			 * @function can.List.prototype.each each
			 * @description Call a function on each element of a List.
			 * @signature `list.each( callback(item, index) )`
			 *
			 * `each` iterates through the Map, calling a function
			 * for each element.
			 *
			 * @param {function(*, Number)} callback the function to call for each element
			 * The value and index of each element will be passed as the first and second
			 * arguments, respectively, to the callback. If the callback returns false,
			 * the loop will stop.
			 *
			 * @return {can.List} this List, for chaining
			 *
			 * @body
			 * @codestart
			 * var i = 0;
			 * new can.Map([1, 10, 100]).each(function(element, index) {
			 *     i += element;
			 * });
			 *
			 * i; // 111
			 *
			 * i = 0;
			 * new can.Map([1, 10, 100]).each(function(element, index) {
			 *     i += element;
			 *     if(index >= 1) {
			 *         return false;
			 *     }
			 * });
			 *
			 * i; // 11
			 * @codeend
			 */
			//
			/**
			 * @function can.List.prototype.splice splice
			 * @description Insert and remove elements from a List.
			 * @signature `list.splice(index[, howMany[, ...newElements]])`
			 * @param {Number} index where to start removing or inserting elements
			 *
			 * @param {Number} [howMany] the number of elements to remove
			 * If _howMany_ is not provided, `splice` will all elements from `index` to the end of the List.
			 *
			 * @param {*} newElements elements to insert into the List
			 *
			 * @return {Array} the elements removed by `splice`
			 *
			 * @body
			 * `splice` lets you remove elements from and insert elements into a List.
			 *
			 * This example demonstrates how to do surgery on a list of numbers:
			 *
			 * @codestart
			 * var list = new can.List([0, 1, 2, 3]);
			 *
			 * // starting at index 2, remove one element and insert 'Alice' and 'Bob':
			 * list.splice(2, 1, 'Alice', 'Bob');
			 * list.attr(); // [0, 1, 'Alice', 'Bob', 3]
			 * @codeend
			 *
			 * ## Events
			 *
			 * `splice` causes the List it's called on to emit _change_ events,
			 * _add_ events, _remove_ events, and _length_ events. If there are
			 * any elements to remove, a _change_ event, a _remove_ event, and a
			 * _length_ event will be fired. If there are any elements to insert, a
			 * separate _change_ event, an _add_ event, and a separate _length_ event
			 * will be fired.
			 *
			 * This slightly-modified version of the above example should help
			 * make it clear how `splice` causes events to be emitted:
			 *
			 * @codestart
			 * var list = new can.List(['a', 'b', 'c', 'd']);
			 * list.bind('change', function(ev, attr, how, newVals, oldVals) {
			 *     console.log('change: ' + attr + ', ' + how + ', ' + newVals + ', ' + oldVals);
			 * });
			 * list.bind('add', function(ev, newVals, where) {
			 *     console.log('add: ' + newVals + ', ' + where);
			 * });
			 * list.bind('remove', function(ev, oldVals, where) {
			 *     console.log('remove: ' + oldVals + ', ' + where);
			 * });
			 * list.bind('length', function(ev, length) {
			 *     console.log('length: ' + length + ', ' + this.attr());
			 * });
			 *
			 * // starting at index 2, remove one element and insert 'Alice' and 'Bob':
			 * list.splice(2, 1, 'Alice', 'Bob'); // change: 2, 'remove', undefined, ['c']
			 *                                    // remove: ['c'], 2
			 *                                    // length: 5, ['a', 'b', 'Alice', 'Bob', 'd']
			 *                                    // change: 2, 'add', ['Alice', 'Bob'], ['c']
			 *                                    // add: ['Alice', 'Bob'], 2
			 *                                    // length: 5, ['a', 'b', 'Alice', 'Bob', 'd']
			 * @codeend
			 *
			 * More information about binding to these events can be found under [can.List.attr attr].
			 */
			splice: function (index, howMany) {
				var args = can.makeArray(arguments),
					added =[],
					i, j;
				for (i = 2; i < args.length; i++) {
					args[i] = bubble.set(this, i, this.__type(args[i], i) );
					added.push(args[i]);
				}
				if (howMany === undefined) {
					howMany = args[1] = this.length - index;
				}
				var removed = splice.apply(this, args),
					cleanRemoved = removed;

				// remove any items that were just added from the removed array
				if(added.length && removed.length){
					for (j = 0; j < removed.length; j++) {
						if(can.inArray(removed[j], added) >= 0) {
							cleanRemoved.splice(j, 1);
						}
					}
				}

				if (!spliceRemovesProps) {
					for (i = this.length; i < removed.length + this.length; i++) {
						delete this[i];
					}
				}

				can.batch.start();
				if (howMany > 0) {
					this._triggerChange("" + index, "remove", undefined, removed);
					bubble.removeMany(this, removed);
				}
				if (args.length > 2) {
					this._triggerChange("" + index, "add", args.slice(2), removed);
				}
				can.batch.stop();
				return removed;
			},
			/**
			 * @description Get or set elements in a List.
			 * @function can.List.prototype.attr attr
			 *
			 * @signature `list.attr()`
			 *
			 * Gets an array of all the elements in this `can.List`.
			 *
			 * @return {Array} An array with all the elements in this List.
			 *
			 * @signature `list.attr(index)`
			 *
			 * Reads an element from this `can.List`.
			 *
			 * @param {Number} index The element to read.
			 * @return {*} The value at _index_.
			 *
			 * @signature `list.attr(index, value)`
			 *
			 * Assigns _value_ to the index _index_ on this `can.List`, expanding the list if necessary.
			 *
			 * @param {Number} index The element to set.
			 * @param {*} value The value to assign at _index_.
			 * @return {can.List} This list, for chaining.
			 *
			 * @signature `list.attr(elements[, replaceCompletely])`
			 *
			 * Merges the members of _elements_ into this List, replacing each from the beginning in order. If
			 * _elements_ is longer than the current List, the current List will be expanded. If _elements_
			 * is shorter than the current List, the extra existing members are not affected (unless
			 * _replaceCompletely_ is `true`). To remove elements without replacing them, use `[can.Map::removeAttr removeAttr]`.
			 *
			 * @param {Array} elements An array of elements to merge in.
			 *
			 * @param {bool} [replaceCompletely=false] whether to completely replace the elements of List
			 * If _replaceCompletely_ is `true` and _elements_ is shorter than the List, the existing
			 * extra members of the List will be removed.
			 *
			 * @return {can.List} This list, for chaining.
			 *
			 * @body
			 *
			 *
			 * ## Use
			 *
			 * `attr` gets or sets elements on the `can.List` it's called on. Here's a tour through
			 * how all of its forms work:
			 *
			 *     var people = new can.List(['Alex', 'Bill']);
			 *
			 *     // set an element:
			 *     people.attr(0, 'Adam');
			 *
			 *     // get an element:
			 *     people.attr(0); // 'Adam'
			 *     people[0]; // 'Adam'
			 *
			 *     // get all elements:
			 *     people.attr(); // ['Adam', 'Bill']
			 *
			 *     // extend the array:
			 *     people.attr(4, 'Charlie');
			 *     people.attr(); // ['Adam', 'Bill', undefined, undefined, 'Charlie']
			 *
			 *     // merge the elements:
			 *     people.attr(['Alice', 'Bob', 'Eve']);
			 *     people.attr(); // ['Alice', 'Bob', 'Eve', undefined, 'Charlie']
			 *
			 * ## Deep properties
			 *
			 * `attr` can also set and read deep properties. All you have to do is specify
			 * the property name as you normally would if you weren't using `attr`.
			 *
			 * @codestart
			 * var people = new can.List([{name: 'Alex'}, {name: 'Bob'}]);
			 *
			 * // set a property:
			 * people.attr('0.name', 'Alice');
			 *
			 * // get a property:
			 * people.attr('0.name');  // 'Alice'
			 * people[0].attr('name'); // 'Alice'
			 *
			 * // get all properties:
			 * people.attr(); // [{name: 'Alice'}, {name: 'Bob'}]
			 * @codeend
			 *
			 * The discussion of deep properties under `[can.Map.prototype.attr]` may also
			 * be enlightening.
			 *
			 * ## Events
			 *
			 * `can.List`s emit five types of events in response to changes. They are:
			 *
			 * - the _change_ event fires on every change to a List.
			 * - the _set_ event is fired when an element is set.
			 * - the _add_ event is fired when an element is added to the List.
			 * - the _remove_ event is fired when an element is removed from the List.
			 * - the _length_ event is fired when the length of the List changes.
			 *
			 * ### The _change_ event
			 *
			 * The first event that is fired is the _change_ event. The _change_ event is useful
			 * if you want to react to all changes on an List.
			 *
			 * @codestart
			 * var list = new can.List([]);
			 * list.bind('change', function(ev, index, how, newVal, oldVal) {
			 *     console.log('Something changed.');
			 * });
			 * @codeend
			 *
			 * The parameters of the event handler for the _change_ event are:
			 *
			 * - _ev_ The event object.
			 * - _index_ Where the change took place.
			 * - _how_ Whether elements were added, removed, or set.
			 * Possible values are `'add'`, `'remove'`, or `'set'`.
			 * - _newVal_ The elements affected after the change
			 *  _newVal_ will be a single value when an index is set, an Array when elements
			 * were added, and `undefined` if elements were removed.
			 * - _oldVal_ The elements affected before the change.
			 * _newVal_ will be a single value when an index is set, an Array when elements
			 * were removed, and `undefined` if elements were added.
			 *
			 * Here is a concrete tour through the _change_ event handler's arguments:
			 *
			 * @codestart
			 * var list = new can.List();
			 * list.bind('change', function(ev, index, how, newVal, oldVal) {
			 *     console.log(ev + ', ' + index + ', ' + how + ', ' + newVal + ', ' + oldVal);
			 * });
			 *
			 * list.attr(['Alexis', 'Bill']); // [object Object], 0, add, ['Alexis', 'Bill'], undefined
			 * list.attr(2, 'Eve');           // [object Object], 2, add, Eve, undefined
			 * list.attr(0, 'Adam');          // [object Object], 0, set, Adam, Alexis
			 * list.attr(['Alice', 'Bob']);   // [object Object], 0, set, Alice, Adam
			 *                                // [object Object], 1, set, Bob, Bill
			 * list.removeAttr(1);            // [object Object], 1, remove, undefined, Bob
			 * @codeend
			 *
			 * ### The _set_ event
			 *
			 * _set_ events are fired when an element at an index that already exists in the List is
			 * modified. Actions can cause _set_ events to fire never also cause _length_ events
			 * to fire (although some functions, such as `[can.List.prototype.splice splice]`
			 * may cause unrelated sets of events to fire after being batched).
			 *
			 * The parameters of the event handler for the _set_ event are:
			 *
			 * - _ev_ The event object.
			 * - _newVal_ The new value of the element.
			 * - _index_ where the set took place.
			 *
			 * Here is a concrete tour through the _set_ event handler's arguments:
			 *
			 * @codestart
			 * var list = new can.List();
			 * list.bind('set', function(ev, newVal, index) {
			 *     console.log(newVal + ', ' + index);
			 * });
			 *
			 * list.attr(['Alexis', 'Bill']);
			 * list.attr(2, 'Eve');
			 * list.attr(0, 'Adam');          // Adam, 0
			 * list.attr(['Alice', 'Bob']);   // Alice, 0
			 *                                // Bob, 1
			 * list.removeAttr(1);
			 * @codeend
			 *
			 * ### The _add_ event
			 *
			 * _add_ events are fired when elements are added or inserted
			 * into the List.
			 *
			 * The parameters of the event handler for the _add_ event are:
			 *
			 * - _ev_ The event object.
			 * - _newElements_ The new elements.
			 * If more than one element is added, _newElements_ will be an array.
			 * Otherwise, it is simply the new element itself.
			 * - _index_ Where the add or insert took place.
			 *
			 * Here is a concrete tour through the _add_ event handler's arguments:
			 *
			 * @codestart
			 * var list = new can.List();
			 * list.bind('add', function(ev, newElements, index) {
			 *     console.log(newElements + ', ' + index);
			 * });
			 *
			 * list.attr(['Alexis', 'Bill']); // ['Alexis', 'Bill'], 0
			 * list.attr(2, 'Eve');           // Eve, 2
			 * list.attr(0, 'Adam');
			 * list.attr(['Alice', 'Bob']);
			 *
			 * list.removeAttr(1);
			 * @codeend
			 *
			 * ### The _remove_ event
			 *
			 * _remove_ events are fired when elements are removed from the list.
			 *
			 * The parameters of the event handler for the _remove_ event are:
			 *
			 * - _ev_ The event object.
			 * - _removedElements_ The removed elements.
			 * If more than one element was removed, _removedElements_ will be an array.
			 * Otherwise, it is simply the element itself.
			 * - _index_ Where the removal took place.
			 *
			 * Here is a concrete tour through the _remove_ event handler's arguments:
			 *
			 * @codestart
			 * var list = new can.List();
			 * list.bind('remove', function(ev, removedElements, index) {
			 *     console.log(removedElements + ', ' + index);
			 * });
			 *
			 * list.attr(['Alexis', 'Bill']);
			 * list.attr(2, 'Eve');
			 * list.attr(0, 'Adam');
			 * list.attr(['Alice', 'Bob']);
			 *
			 * list.removeAttr(1);            // Bob, 1
			 * @codeend
			 *
			 * ### The _length_ event
			 *
			 * _length_ events are fired whenever the list changes.
			 *
			 * The parameters of the event handler for the _length_ event are:
			 *
			 * - _ev_ The event object.
			 * - _length_ The current length of the list.
			 * If events were batched when the _length_ event was triggered, _length_
			 * will have the length of the list when `stopBatch` was called. Because
			 * of this, you may recieve multiple _length_ events with the same
			 * _length_ parameter.
			 *
			 * Here is a concrete tour through the _length_ event handler's arguments:
			 *
			 * @codestart
			 * var list = new can.List();
			 * list.bind('length', function(ev, length) {
			 *     console.log(length);
			 * });
			 *
			 * list.attr(['Alexis', 'Bill']); // 2
			 * list.attr(2, 'Eve');           // 3
			 * list.attr(0, 'Adam');
			 * list.attr(['Alice', 'Bob']);
			 *
			 * list.removeAttr(1);            // 2
			 * @codeend
			 */
			_attrs: function (items, remove) {
				if (items === undefined) {
					return Map.helpers.serialize(this, 'attr', []);
				}

				// Create a copy.
				items = can.makeArray(items);

				can.batch.start();
				this._updateAttrs(items, remove);
				can.batch.stop();
			},

			_updateAttrs: function (items, remove) {
				var len = Math.min(items.length, this.length);

				for (var prop = 0; prop < len; prop++) {
					var curVal = this[prop],
						newVal = items[prop];

					if (Map.helpers.isObservable(curVal) && Map.helpers.canMakeObserve(newVal)) {
						curVal.attr(newVal, remove);
						//changed from a coercion to an explicit
					} else if (curVal !== newVal) {
						this._set(prop, newVal);
					} else {

					}
				}
				if (items.length > this.length) {
					// Add in the remaining props.
					this.push.apply(this, items.slice(this.length));
				} else if (items.length < this.length && remove) {
					this.splice(items.length);
				}
			}
		}),

		// Converts to an `array` of arguments.
		getArgs = function (args) {
			return args[0] && can.isArray(args[0]) ?
				args[0] :
				can.makeArray(args);
		};
	// Create `push`, `pop`, `shift`, and `unshift`
	can.each({
			/**
			 * @function can.List.prototype.push push
			 * @description Add elements to the end of a list.
			 * @signature `list.push(...elements)`
			 *
			 * `push` adds elements onto the end of a List.]
			 *
			 * @param {*} elements the elements to add to the List
			 *
			 * @return {Number} the new length of the List
			 *
			 * @body
			 * `push` is fairly straightforward:
			 *
			 * @codestart
			 * var list = new can.List(['Alice']);
			 *
			 * list.push('Bob', 'Eve');
			 * list.attr(); // ['Alice', 'Bob', 'Eve']
			 * @codeend
			 *
			 * If you have an array you want to concatenate to the end
			 * of the List, you can use `apply`:
			 *
			 * @codestart
			 * var names = ['Bob', 'Eve'],
			 *     list = new can.List(['Alice']);
			 *
			 * list.push.apply(list, names);
			 * list.attr(); // ['Alice', 'Bob', 'Eve']
			 * @codeend
			 *
			 * ## Events
			 *
			 * `push` causes _change_, _add_, and _length_ events to be fired.
			 *
			 * ## See also
			 *
			 * `push` has a counterpart in [can.List::pop pop], or you may be
			 * looking for [can.List::unshift unshift] and its counterpart [can.List::shift shift].
			 */
			push: "length",
			/**
			 * @function can.List.prototype.unshift unshift
			 * @description Add elements to the beginning of a List.
			 * @signature `list.unshift(...elements)`
			 *
			 * `unshift` adds elements onto the beginning of a List.
			 *
			 * @param {*} elements the elements to add to the List
			 *
			 * @return {Number} the new length of the List
			 *
			 * @body
			 * `unshift` adds elements to the front of the list in bulk in the order specified:
			 *
			 * @codestart
			 * var list = new can.List(['Alice']);
			 *
			 * list.unshift('Bob', 'Eve');
			 * list.attr(); // ['Bob', 'Eve', 'Alice']
			 * @codeend
			 *
			 * If you have an array you want to concatenate to the beginning
			 * of the List, you can use `apply`:
			 *
			 * @codestart
			 * var names = ['Bob', 'Eve'],
			 *     list = new can.List(['Alice']);
			 *
			 * list.push.apply(list, names);
			 * list.attr(); // ['Bob', 'Eve', 'Alice']
			 * @codeend
			 *
			 * ## Events
			 *
			 * `unshift` causes _change_, _add_, and _length_ events to be fired.
			 *
			 * ## See also
			 *
			 * `unshift` has a counterpart in [can.List::shift shift], or you may be
			 * looking for [can.List::push push] and its counterpart [can.List::pop pop].
			 */
			unshift: 0
		},
		// Adds a method
		// `name` - The method name.
		// `where` - Where items in the `array` should be added.
		function (where, name) {
			var orig = [][name];
			list.prototype[name] = function () {
				// Get the items being added.
				var args = [],
					// Where we are going to add items.
					len = where ? this.length : 0,
					i = arguments.length,
					res, val;

				// Go through and convert anything to an `map` that needs to be converted.
				while (i--) {
					val = arguments[i];
					args[i] = bubble.set(this, i, this.__type(val, i) );
				}

				// Call the original method.
				res = orig.apply(this, args);

				if (!this.comparator || args.length) {

					this._triggerChange("" + len, "add", args, undefined);
				}

				return res;
			};
		});

	can.each({
			/**
			 * @function can.List.prototype.pop pop
			 * @description Remove an element from the end of a List.
			 * @signature `list.pop()`
			 *
			 * `push` removes an element from the end of a List.
			 *
			 * @return {*} the element just popped off the List, or `undefined` if the List was empty
			 *
			 * @body
			 * `pop` is the opposite action from `[can.List.push push]`:
			 *
			 * @codestart
			 * var list = new can.List(['Alice']);
			 *
			 * list.push('Bob', 'Eve');
			 * list.attr(); // ['Alice', 'Bob', 'Eve']
			 *
			 * list.pop(); // 'Eve'
			 * list.pop(); // 'Bob'
			 * list.pop(); // 'Alice'
			 * list.pop(); // undefined
			 * @codeend
			 *
			 * ## Events
			 *
			 * `pop` causes _change_, _remove_, and _length_ events to be fired if the List is not empty
			 * when it is called.
			 *
			 * ## See also
			 *
			 * `pop` has its counterpart in [can.List::push push], or you may be
			 * looking for [can.List::unshift unshift] and its counterpart [can.List::shift shift].
			 */
			pop: "length",
			/**
			 * @function can.List.prototype.shift shift
			 * @description Remove en element from the front of a list.
			 * @signature `list.shift()`
			 *
			 * `shift` removes an element from the beginning of a List.
			 *
			 * @return {*} the element just shifted off the List, or `undefined` if the List is empty
			 *
			 * @body
			 * `shift` is the opposite action from `[can.List::unshift unshift]`:
			 *
			 * @codestart
			 * var list = new can.List(['Alice']);
			 *
			 * list.unshift('Bob', 'Eve');
			 * list.attr(); // ['Bob', 'Eve', 'Alice']
			 *
			 * list.shift(); // 'Bob'
			 * list.shift(); // 'Eve'
			 * list.shift(); // 'Alice'
			 * list.shift(); // undefined
			 * @codeend
			 *
			 * ## Events
			 *
			 * `pop` causes _change_, _remove_, and _length_ events to be fired if the List is not empty
			 * when it is called.
			 *
			 * ## See also
			 *
			 * `shift` has a counterpart in [can.List::unshift unshift], or you may be
			 * looking for [can.List::push push] and its counterpart [can.List::pop pop].
			 */
			shift: 0
		},
		// Creates a `remove` type method
		function (where, name) {
			list.prototype[name] = function () {

				var args = getArgs(arguments),
					len = where && this.length ? this.length - 1 : 0;

				var res = [][name].apply(this, args);

				// Create a change where the args are
				// `len` - Where these items were removed.
				// `remove` - Items removed.
				// `undefined` - The new values (there are none).
				// `res` - The old, removed values (should these be unbound).
				this._triggerChange("" + len, "remove", undefined, [res]);

				if (res && res.unbind) {
					bubble.remove(this, res);
				}
				
				return res;
			};
		});

	can.extend(list.prototype, {
		/**
		 * @function can.List.prototype.indexOf indexOf
		 * @description Look for an item in a List.
		 * @signature `list.indexOf(item)`
		 *
		 * `indexOf` finds the position of a given item in the List.
		 *
		 * @param {*} item the item to find
		 *
		 * @return {Number} the position of the item in the List, or -1 if the item is not found.
		 *
		 * @body
		 * @codestart
		 * var list = new can.List(['Alice', 'Bob', 'Eve']);
		 * list.indexOf('Alice');   // 0
		 * list.indexOf('Charlie'); // -1
		 * @codeend
		 *
		 * It is trivial to make a `contains`-type function using `indexOf`:
		 *
		 * @codestart
		 * function(list, item) {
		 *     return list.indexOf(item) >= 0;
		 * }
		 * @codeend
		 */
		indexOf: function (item, fromIndex) {
			this.attr('length');
			return can.inArray(item, this, fromIndex);
		},

		/**
		 * @function can.List.prototype.join join
		 * @description Join a List's elements into a string.
		 * @signature `list.join(separator)`
		 *
		 * `join` turns a List into a string by inserting _separator_ between the string representations
		 * of all the elements of the List.
		 *
		 * @param {String} separator the string to seperate elements with
		 *
		 * @return {String} the joined string
		 *
		 * @body
		 * @codestart
		 * var list = new can.List(['Alice', 'Bob', 'Eve']);
		 * list.join(', '); // 'Alice, Bob, Eve'
		 *
		 * var beatles = new can.List(['John', 'Paul', 'Ringo', 'George']);
		 * beatles.join('&'); // 'John&Paul&Ringo&George'
		 * @codeend
		 */
		join: function () {
			return [].join.apply(this.attr(), arguments);
		},

		/**
		 * @function can.List.prototype.reverse reverse
		 * @description Reverse the order of a List.
		 * @signature `list.reverse()`
		 *
		 * `reverse` reverses the elements of the List in place.
		 *
		 * @return {can.List} the List, for chaining
		 *
		 * @body
		 * @codestart
		 * var list = new can.List(['Alice', 'Bob', 'Eve']);
		 * var reversedList = list.reverse();
		 *
		 * reversedList.attr(); // ['Eve', 'Bob', 'Alice'];
		 * list === reversedList; // true
		 * @codeend
		 */
		reverse: function() {
			var list = can.makeArray([].reverse.call(this));
			this.replace(list);
		},

		/**
		 * @function can.List.prototype.slice slice
		 * @description Make a copy of a part of a List.
		 * @signature `list.slice([start[, end]])`
		 *
		 * `slice` creates a copy of a portion of the List.
		 *
		 * @param {Number} [start=0] the index to start copying from
		 *
		 * @param {Number} [end] the first index not to include in the copy
		 * If _end_ is not supplied, `slice` will copy until the end of the list.
		 *
		 * @return {can.List} a new `can.List` with the extracted elements
		 *
		 * @body
		 * @codestart
		 * var list = new can.List(['Alice', 'Bob', 'Charlie', 'Daniel', 'Eve']);
		 * var newList = list.slice(1, 4);
		 * newList.attr(); // ['Bob', 'Charlie', 'Daniel']
		 * @codeend
		 *
		 * `slice` is the simplest way to copy a List:
		 *
		 * @codestart
		 * var list = new can.List(['Alice', 'Bob', 'Eve']);
		 * var copy = list.slice();
		 *
		 * copy.attr();   // ['Alice', 'Bob', 'Eve']
		 * list === copy; // false
		 * @codeend
		 */
		slice: function () {
			var temp = Array.prototype.slice.apply(this, arguments);
			return new this.constructor(temp);
		},

		/**
		 * @function can.List.prototype.concat concat
		 * @description Merge many collections together into a List.
		 * @signature `list.concat(...args)`
		 * @param {Array|can.List|*} args Any number of arrays, Lists, or values to add in
		 * For each parameter given, if it is an Array or a List, each of its elements will be added to
		 * the end of the concatenated List. Otherwise, the parameter itself will be added.
		 *
		 * @body
		 * `concat` makes a new List with the elements of the List followed by the elements of the parameters.
		 *
		 * @codestart
		 * var list = new can.List();
		 * var newList = list.concat(
		 *     'Alice',
		 *     ['Bob', 'Charlie']),
		 *     new can.List(['Daniel', 'Eve']),
		 *     {f: 'Francis'}
		 * );
		 * newList.attr(); // ['Alice', 'Bob', 'Charlie', 'Daniel', 'Eve', {f: 'Francis'}]
		 * @codeend
		 */
		concat: function () {
			var args = [];
			can.each(can.makeArray(arguments), function (arg, i) {
				args[i] = arg instanceof can.List ? arg.serialize() : arg;
			});
			return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
		},

		/**
		 * @function can.List.prototype.forEach forEach
		 * @description Call a function for each element of a List.
		 * @signature `list.forEach(callback[, thisArg])`
		 * @param {function(element, index, list)} callback a function to call with each element of the List
		 * The three parameters that _callback_ gets passed are _element_, the element at _index_, _index_ the
		 * current element of the list, and _list_ the List the elements are coming from.
		 * @param {Object} [thisArg] the object to use as `this` inside the callback
		 *
		 * @body
		 * `forEach` calls a callback for each element in the List.
		 *
		 * @codestart
		 * var list = new can.List([1, 2, 3]);
		 * list.forEach(function(element, index, list) {
		 *     list.attr(index, element * element);
		 * });
		 * list.attr(); // [1, 4, 9]
		 * @codeend
		 */
		forEach: function (cb, thisarg) {
			return can.each(this, cb, thisarg || this);
		},

		/**
		 * @function can.List.prototype.replace replace
		 * @description Replace all the elements of a List.
		 * @signature `list.replace(collection)`
		 * @param {Array|can.List|can.Deferred} collection the collection of new elements to use
		 * If a [can.Deferred] is passed, it must resolve to an `Array` or `can.List`.
		 * The elements of the list are not actually removed until the Deferred resolves.
		 *
		 * @body
		 * `replace` replaces all the elements of this List with new ones.
		 *
		 * `replace` is especially useful when `can.List`s are live-bound into `[can.Control]`s,
		 * and you intend to populate them with the results of a `[can.Model]` call:
		 *
		 * @codestart
		 * can.Control({
		 *     init: function() {
		 *         this.list = new Todo.List();
		 *         // live-bind the list into the DOM
		 *         this.element.html(can.view('list.mustache', this.list));
		 *         // when this AJAX call returns, the live-bound DOM will be updated
		 *         this.list.replace(Todo.findAll());
		 *     }
		 * });
		 * @codeend
		 *
		 * Learn more about [can.Model.List making Lists of models].
		 *
		 * ## Events
		 *
		 * A major difference between `replace` and `attr(newElements, true)` is that `replace` always emits
		 * an _add_ event and a _remove_ event, whereas `attr` will cause _set_ events along with an _add_ or _remove_
		 * event if needed. Corresponding _change_ and _length_ events will be fired as well.
		 *
		 * The differences in the events fired by `attr` and `replace` are demonstrated concretely by this example:
		 * @codestart
		 * var attrList = new can.List(['Alexis', 'Bill']);
		 * attrList.bind('change', function(ev, index, how, newVals, oldVals) {
		 *     console.log(index + ', ' + how + ', ' + newVals + ', ' + oldVals);
		 * });
		 *
		 * var replaceList = new can.List(['Alexis', 'Bill']);
		 * replaceList.bind('change', function(ev, index, how, newVals, oldVals) {
		 *     console.log(index + ', ' + how + ', ' + newVals + ', ' + oldVals);
		 * });
		 *
		 * attrList.attr(['Adam', 'Ben'], true);         // 0, set, Adam, Alexis
		 *                                               // 1, set, Ben, Bill
		 * replaceList.replace(['Adam', 'Ben']);         // 0, remove, undefined, ['Alexis', 'Bill']
		 *                                               // 0, add, undefined, ['Adam', 'Ben']
		 *
		 * attrList.attr(['Amber'], true);               // 0, set, Amber, Adam
		 *                                               // 1, remove, undefined, Ben
		 * replaceList.replace(['Amber']);               // 0, remove, undefined, ['Adam', 'Ben']
		 *                                               // 0, add, Amber, ['Adam', 'Ben']
		 *
		 * attrList.attr(['Alice', 'Bob', 'Eve'], true); // 0, set, Alice, Amber
		 *                                               // 1, add, ['Bob', 'Eve'], undefined
		 * replaceList.replace(['Alice', 'Bob', 'Eve']); // 0, remove, undefined, Amber
		 *                                               // 0, add, ['Alice', 'Bob', 'Eve'], Amber
		 * @codeend
		 */
		replace: function (newList) {
			if (can.isDeferred(newList)) {
				newList.then(can.proxy(this.replace, this));
			} else {
				this.splice.apply(this, [0, this.length].concat(can.makeArray(newList || [])));
			}

			return this;
		},
		filter: function (callback, thisArg) {
			var filteredList = new can.List(),
				self = this,
				filtered;
			this.each(function(item, index, list){
				filtered = callback.call( thisArg | self, item, index, self);
				if(filtered){
					filteredList.push(item);
				}
			});
			return filteredList;
		}
	});
	can.List = Map.List = list;
	return can.List;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/util/string/deparam',["can/util/library", "can/util/string"], function (can) {
	// ## deparam.js  
	// `can.deparam`  
	// _Takes a string of name value pairs and returns a Object literal that represents those params._
	var digitTest = /^\d+$/,
		keyBreaker = /([^\[\]]+)|(\[\])/g,
		paramTest = /([^?#]*)(#.*)?$/,
		prep = function (str) {
			return decodeURIComponent(str.replace(/\+/g, ' '));
		};
	can.extend(can, {
		deparam: function (params) {
			var data = {}, pairs, lastPart;
			if (params && paramTest.test(params)) {
				pairs = params.split('&');
				can.each(pairs, function (pair) {
					var parts = pair.split('='),
						key = prep(parts.shift()),
						value = prep(parts.join('=')),
						current = data;
					if (key) {
						parts = key.match(keyBreaker);
						for (var j = 0, l = parts.length - 1; j < l; j++) {
							if (!current[parts[j]]) {
								// If what we are pointing to looks like an `array`
								current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] === '[]' ? [] : {};
							}
							current = current[parts[j]];
						}
						lastPart = parts.pop();
						if (lastPart === '[]') {
							current.push(value);
						} else {
							current[lastPart] = value;
						}
					}
				});
			}
			return data;
		}
	});
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/route',["can/util/library", "can/map", "can/list", "can/util/string/deparam"], function (can) {

	// ## route.js
	// `can.route`
	// _Helps manage browser history (and client state) by synchronizing the
	// `window.location.hash` with a `can.Map`._
	//
	// Helper methods used for matching routes.
	var
	// `RegExp` used to match route variables of the type ':name'.
	// Any word character or a period is matched.
	matcher = /\:([\w\.]+)/g,
		// Regular expression for identifying &amp;key=value lists.
		paramsMatcher = /^(?:&[^=]+=[^&]*)+/,
		// Converts a JS Object into a list of parameters that can be
		// inserted into an html element tag.
		makeProps = function (props) {
			var tags = [];
			can.each(props, function (val, name) {
				tags.push((name === 'className' ? 'class' : name) + '="' +
					(name === "href" ? val : can.esc(val)) + '"');
			});
			return tags.join(" ");
		},
		// Checks if a route matches the data provided. If any route variable
		// is not present in the data, the route does not match. If all route
		// variables are present in the data, the number of matches is returned
		// to allow discerning between general and more specific routes.
		matchesData = function (route, data) {
			var count = 0,
				i = 0,
				defaults = {};
			// look at default values, if they match ...
			for (var name in route.defaults) {
				if (route.defaults[name] === data[name]) {
					// mark as matched
					defaults[name] = 1;
					count++;
				}
			}
			for (; i < route.names.length; i++) {
				if (!data.hasOwnProperty(route.names[i])) {
					return -1;
				}
				if (!defaults[route.names[i]]) {
					count++;
				}

			}

			return count;
		},
		location = window.location,
		wrapQuote = function (str) {
			return (str + '')
				.replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
		},
		each = can.each,
		extend = can.extend,
		// Helper for convert any object (or value) to stringified object (or value)
		stringify = function (obj) {
			// Object is array, plain object, Map or List
			if (obj && typeof obj === "object") {
				// Get native object or array from Map or List
				if (obj instanceof can.Map) {
					obj = obj.attr();
					// Clone object to prevent change original values
				} else {
					obj = can.isFunction(obj.slice) ? obj.slice() : can.extend({}, obj);
				}
				// Convert each object property or array item into stringified new
				can.each(obj, function (val, prop) {
					obj[prop] = stringify(val);
				});
				// Object supports toString function
			} else if (obj !== undefined && obj !== null && can.isFunction(obj.toString)) {
				obj = obj.toString();
			}

			return obj;
		},
		removeBackslash = function (str) {
			return str.replace(/\\/g, "");
		},
		// A ~~throttled~~ debounced function called multiple times will only fire once the
		// timer runs down. Each call resets the timer.
		timer,
		// Intermediate storage for `can.route.data`.
		curParams,
		// The last hash caused by a data change
		lastHash,
		// Are data changes pending that haven't yet updated the hash
		changingData,
		// If the `can.route.data` changes, update the hash.
		// Using `.serialize()` retrieves the raw data contained in the `observable`.
		// This function is ~~throttled~~ debounced so it only updates once even if multiple values changed.
		// This might be able to use batchNum and avoid this.
		onRouteDataChange = function (ev, attr, how, newval) {
			// indicate that data is changing
			changingData = 1;
			clearTimeout(timer);
			timer = setTimeout(function () {
				// indicate that the hash is set to look like the data
				changingData = 0;
				var serialized = can.route.data.serialize(),
					path = can.route.param(serialized, true);
				can.route._call("setURL", path);
				// trigger a url change so its possible to live-bind on url-based changes
				can.batch.trigger(eventsObject,"__url",[path, lastHash]);
				lastHash = path;
			}, 10);
		},
		// A dummy events object used to dispatch url change events on.
		eventsObject = can.extend({}, can.event);

	can.route = function (url, defaults) {
		// if route ends with a / and url starts with a /, remove the leading / of the url
		var root = can.route._call("root");

		if (root.lastIndexOf("/") === root.length - 1 &&
			url.indexOf("/") === 0) {
			url = url.substr(1);
		}

		defaults = defaults || {};
		// Extract the variable names and replace with `RegExp` that will match
		// an atual URL with values.
		var names = [],
			res,
			test = "",
			lastIndex = matcher.lastIndex = 0,
			next,
			querySeparator = can.route._call("querySeparator"),
			matchSlashes = can.route._call("matchSlashes");

		// res will be something like [":foo","foo"]
		while (res = matcher.exec(url)) {
			names.push(res[1]);
			test += removeBackslash(url.substring(lastIndex, matcher.lastIndex - res[0].length));
			// if matchSlashes is false (the default) don't greedily match any slash in the string, assume its part of the URL
			next = "\\" + (removeBackslash(url.substr(matcher.lastIndex, 1)) || querySeparator+(matchSlashes? "": "|/"));
			// a name without a default value HAS to have a value
			// a name that has a default value can be empty
			// The `\\` is for string-escaping giving single `\` for `RegExp` escaping.
			test += "([^" + next + "]" + (defaults[res[1]] ? "*" : "+") + ")";
			lastIndex = matcher.lastIndex;
		}
		test += url.substr(lastIndex)
			.replace("\\", "");
		// Add route in a form that can be easily figured out.
		can.route.routes[url] = {
			// A regular expression that will match the route when variable values
			// are present; i.e. for `:page/:type` the `RegExp` is `/([\w\.]*)/([\w\.]*)/` which
			// will match for any value of `:page` and `:type` (word chars or period).
			test: new RegExp("^" + test + "($|" + wrapQuote(querySeparator) + ")"),
			// The original URL, same as the index for this entry in routes.
			route: url,
			// An `array` of all the variable names in this route.
			names: names,
			// Default values provided for the variables.
			defaults: defaults,
			// The number of parts in the URL separated by `/`.
			length: url.split('/')
				.length
		};
		return can.route;
	};

	/**
	 * @static
	 */
	extend(can.route, {

		/**
		 * @function can.route.param param
		 * @parent can.route.static
		 * @description Get a route path from given data.
		 * @signature `can.route.param( data )`
		 * @param {data} object The data to populate the route with.
		 * @return {String} The route, with the data populated in it.
		 *
		 * @body
		 * Parameterizes the raw JS object representation provided in data.
		 *
		 *     can.route.param( { type: "video", id: 5 } )
		 *          // -> "type=video&id=5"
		 *
		 * If a route matching the provided data is found, that URL is built
		 * from the data. Any remaining data is added at the end of the
		 * URL as &amp; separated key/value parameters.
		 *
		 *     can.route(":type/:id")
		 *
		 *     can.route.param( { type: "video", id: 5 } ) // -> "video/5"
		 *     can.route.param( { type: "video", id: 5, isNew: false } )
		 *          // -> "video/5&isNew=false"
		 */
		param: function (data, _setRoute) {
			// Check if the provided data keys match the names in any routes;
			// Get the one with the most matches.
			var route,
				// Need to have at least 1 match.
				matches = 0,
				matchCount,
				routeName = data.route,
				propCount = 0;

			delete data.route;

			each(data, function () {
				propCount++;
			});
			// Otherwise find route.
			each(can.route.routes, function (temp, name) {
				// best route is the first with all defaults matching

				matchCount = matchesData(temp, data);
				if (matchCount > matches) {
					route = temp;
					matches = matchCount;
				}
				if (matchCount >= propCount) {
					return false;
				}
			});
			// If we have a route name in our `can.route` data, and it's
			// just as good as what currently matches, use that
			if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
				route = can.route.routes[routeName];
			}
			// If this is match...
			if (route) {
				var cpy = extend({}, data),
					// Create the url by replacing the var names with the provided data.
					// If the default value is found an empty string is inserted.
					res = route.route.replace(matcher, function (whole, name) {
						delete cpy[name];
						return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
					})
						.replace("\\", ""),
					after;
				// Remove matching default values
				each(route.defaults, function (val, name) {
					if (cpy[name] === val) {
						delete cpy[name];
					}
				});

				// The remaining elements of data are added as
				// `&amp;` separated parameters to the url.
				after = can.param(cpy);
				// if we are paraming for setting the hash
				// we also want to make sure the route value is updated
				if (_setRoute) {
					can.route.attr('route', route.route);
				}
				return res + (after ? can.route._call("querySeparator") + after : "");
			}
			// If no route was found, there is no hash URL, only paramters.
			return can.isEmptyObject(data) ? "" : can.route._call("querySeparator") + can.param(data);
		},
		/**
		 * @function can.route.deparam deparam
		 * @parent can.route.static
		 * @description Extract data from a route path.
		 * @signature `can.route.deparam( url )`
		 * @param {String} url A route fragment to extract data from.
		 * @return {Object} An object containing the extracted data.
		 *
		 * @body
		 * Creates a data object based on the query string passed into it. This is
		 * useful to create an object based on the `location.hash`.
		 *
		 *     can.route.deparam("id=5&type=videos")
		 *          // -> { id: 5, type: "videos" }
		 *
		 *
		 * It's important to make sure the hash or exclamantion point is not passed
		 * to `can.route.deparam` otherwise it will be included in the first property's
		 * name.
		 *
		 *     can.route.attr("id", 5) // location.hash -> #!id=5
		 *     can.route.attr("type", "videos")
		 *          // location.hash -> #!id=5&type=videos
		 *     can.route.deparam(location.hash)
		 *          // -> { #!id: 5, type: "videos" }
		 *
		 * `can.route.deparam` will try and find a matching route and, if it does,
		 * will deconstruct the URL and parse our the key/value parameters into the data object.
		 *
		 *     can.route(":type/:id")
		 *
		 *     can.route.deparam("videos/5");
		 *          // -> { id: 5, route: ":type/:id", type: "videos" }
		 */
		deparam: function (url) {

			// remove the url
			var root = can.route._call("root");
			if (root.lastIndexOf("/") === root.length - 1 &&
				url.indexOf("/") === 0) {
				url = url.substr(1);
			}

			// See if the url matches any routes by testing it against the `route.test` `RegExp`.
			// By comparing the URL length the most specialized route that matches is used.
			var route = {
				length: -1
			},
				querySeparator = can.route._call("querySeparator"),
				paramsMatcher = can.route._call("paramsMatcher");

			each(can.route.routes, function (temp, name) {
				if (temp.test.test(url) && temp.length > route.length) {
					route = temp;
				}
			});
			// If a route was matched.
			if (route.length > -1) {

				var // Since `RegExp` backreferences are used in `route.test` (parens)
				// the parts will contain the full matched string and each variable (back-referenced) value.
				parts = url.match(route.test),
					// Start will contain the full matched string; parts contain the variable values.
					start = parts.shift(),
					// The remainder will be the `&amp;key=value` list at the end of the URL.
					remainder = url.substr(start.length - (parts[parts.length - 1] === querySeparator ? 1 : 0)),
					// If there is a remainder and it contains a `&amp;key=value` list deparam it.
					obj = (remainder && paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};

				// Add the default values for this route.
				obj = extend(true, {}, route.defaults, obj);
				// Overwrite each of the default values in `obj` with those in
				// parts if that part is not empty.
				each(parts, function (part, i) {
					if (part && part !== querySeparator) {
						obj[route.names[i]] = decodeURIComponent(part);
					}
				});
				obj.route = route.route;
				return obj;
			}
			// If no route was matched, it is parsed as a `&amp;key=value` list.
			if (url.charAt(0) !== querySeparator) {
				url = querySeparator + url;
			}
			return paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
		},
		/**
		 * @hide
		 * A can.Map that represents the state of the history.
		 */
		data: new can.Map({}),
		map: function(data){
			var appState;
			// appState is a can.Map constructor function
			if(data.prototype instanceof can.Map){
				appState = new data();
			}
			// appState is an instance of can.Map
			else {
				appState = data;
			}
			can.route.data = appState;
		},
		/**
		 * @property {Object} routes
		 * @hide
		 *
		 * A list of routes recognized by the router indixed by the url used to add it.
		 * Each route is an object with these members:
		 *
		 *  - test - A regular expression that will match the route when variable values
		 *    are present; i.e. for :page/:type the `RegExp` is /([\w\.]*)/([\w\.]*)/ which
		 *    will match for any value of :page and :type (word chars or period).
		 *
		 *  - route - The original URL, same as the index for this entry in routes.
		 *
		 *  - names - An array of all the variable names in this route
		 *
		 *  - defaults - Default values provided for the variables or an empty object.
		 *
		 *  - length - The number of parts in the URL separated by '/'.
		 */
		routes: {},
		/**
		 * @function can.route.ready ready
		 * @parent can.route.static
		 *
		 * Initialize can.route.
		 *
		 * @signature `can.route.ready()`
		 *
		 * Sets up the two-way binding between the hash and the can.route observable map and
		 * sets the can.route map to its initial values.
		 *
		 * @return {can.route} The `can.route` object.
		 *
		 * @body
		 *
		 * ## Use
		 *
		 * After setting all your routes, call can.route.ready().
		 *
		 *     can.route("overview/:dateStart-:dateEnd");
		 *     can.route(":type/:id")
		 *     can.route.ready()
		 */
		ready: function (val) {
			if (val !== true) {
				can.route._setup();
				can.route.setState();
			}
			return can.route;
		},
		/**
		 * @function can.route.url url
		 * @parent can.route.static
		 * @signature `can.route.url( data [, merge] )`
		 *
		 * Make a URL fragment that when set to window.location.hash will update can.route's properties
		 * to match those in `data`.
		 *
		 * @param {Object} data The data to populate the route with.
		 * @param {Boolean} [merge] Whether the given options should be merged into the current state of the route.
		 * @return {String} The route URL and query string.
		 *
		 * @body
		 * Similar to [can.route.link], but instead of creating an anchor tag, `can.route.url` creates
		 * only the URL based on the route options passed into it.
		 *
		 *     can.route.url( { type: "videos", id: 5 } )
		 *          // -> "#!type=videos&id=5"
		 *
		 * If a route matching the provided data is found the URL is built from the data. Any remaining
		 * data is added at the end of the URL as & separated key/value parameters.
		 *
		 *     can.route(":type/:id")
		 *
		 *     can.route.url( { type: "videos", id: 5 } ) // -> "#!videos/5"
		 *     can.route.url( { type: "video", id: 5, isNew: false } )
		 *          // -> "#!video/5&isNew=false"
		 */
		url: function (options, merge) {

			if (merge) {
				options = can.extend({}, can.route.deparam(can.route._call("matchingPartOfURL")), options);
			}
			return can.route._call("root") + can.route.param(options);
		},
		/**
		 * @function can.route.link link
		 * @parent can.route.static
		 * @signature `can.route.link( innerText, data, props [, merge] )`
		 *
		 * Make an anchor tag (`<A>`) that when clicked on will update can.route's properties
		 * to match those in `data`.
		 *
		 * @param {Object} innerText The text inside the link.
		 * @param {Object} data The data to populate the route with.
		 * @param {Object} props Properties for the anchor other than `href`.
		 * @param {Boolean} [merge] Whether the given options should be merged into the current state of the route.
		 * @return {String} A string with an anchor tag that points to the populated route.
		 *
		 * @body
		 * Creates and returns an anchor tag with an href of the route
		 * attributes passed into it, as well as any properies desired
		 * for the tag.
		 *
		 *     can.route.link( "My videos", { type: "videos" }, {}, false )
		 *          // -> <a href="#!type=videos">My videos</a>
		 *
		 * Other attributes besides href can be added to the anchor tag
		 * by passing in a data object with the attributes desired.
		 *
		 *     can.route.link( "My videos", { type: "videos" },
		 *       { className: "new" }, false )
		 *          // -> <a href="#!type=videos" class="new">My Videos</a>
		 *
		 * It is possible to utilize the current route options when making anchor
		 * tags in order to make your code more reusable. If merge is set to true,
		 * the route options passed into `can.route.link` will be passed into the
		 * current ones.
		 *
		 *     location.hash = "#!type=videos"
		 *     can.route.link( "The zoo", { id: 5 }, true )
		 *          // -> <a href="#!type=videos&id=5">The zoo</true>
		 *
		 *     location.hash = "#!type=pictures"
		 *     can.route.link( "The zoo", { id: 5 }, true )
		 *          // -> <a href="#!type=pictures&id=5">The zoo</true>
		 *
		 *
		 */
		link: function (name, options, props, merge) {
			return "<a " + makeProps(
				extend({
					href: can.route.url(options, merge)
				}, props)) + ">" + name + "</a>";
		},
		/**
		 * @function can.route.current current
		 * @parent can.route.static
		 * @signature `can.route.current( data )`
		 *
		 * Check if data represents the current route.
		 *
		 * @param {Object} data Data to check agains the current route.
		 * @return {Boolean} Whether the data matches the current URL.
		 *
		 * @body
		 * Checks the page's current URL to see if the route represents the options passed
		 * into the function.
		 *
		 * Returns true if the options respresent the current URL.
		 *
		 *     can.route.attr('id', 5) // location.hash -> "#!id=5"
		 *     can.route.current({ id: 5 }) // -> true
		 *     can.route.current({ id: 5, type: 'videos' }) // -> false
		 *
		 *     can.route.attr('type', 'videos')
		 *            // location.hash -> #!id=5&type=videos
		 *     can.route.current({ id: 5, type: 'videos' }) // -> true
		 */
		current: function (options) {
			// "reads" the url so the url is live-bindable.
			can.__reading(eventsObject,"__url");
			return this._call("matchingPartOfURL") === can.route.param(options);
		},
		bindings: {
			hashchange: {
				paramsMatcher: paramsMatcher,
				querySeparator: "&",
				// don't greedily match slashes in routing rules
				matchSlashes: false,
				bind: function () {
					can.bind.call(window, 'hashchange', setState);
				},
				unbind: function () {
					can.unbind.call(window, 'hashchange', setState);
				},
				// Gets the part of the url we are determinging the route from.
				// For hashbased routing, it's everything after the #, for
				// pushState it's configurable
				matchingPartOfURL: function () {
					return location.href.split(/#!?/)[1] || "";
				},
				// gets called with the serialized can.route data after a route has changed
				// returns what the url has been updated to (for matching purposes)
				setURL: function (path) {
					location.hash = "#!" + path;
					return path;
				},
				root: "#!"
			}
		},
		defaultBinding: "hashchange",
		currentBinding: null,
		// ready calls setup
		// setup binds and listens to data changes
		// bind listens to whatever you should be listening to
		// data changes tries to set the path

		// we need to be able to
		// easily kick off calling setState
		// 	teardown whatever is there
		//  turn on a particular binding

		// called when the route is ready
		_setup: function () {
			if (!can.route.currentBinding) {
				can.route._call("bind");
				can.route.bind("change", onRouteDataChange);
				can.route.currentBinding = can.route.defaultBinding;
			}
		},
		_teardown: function () {
			if (can.route.currentBinding) {
				can.route._call("unbind");
				can.route.unbind("change", onRouteDataChange);
				can.route.currentBinding = null;
			}
			clearTimeout(timer);
			changingData = 0;
		},
		// a helper to get stuff from the current or default bindings
		_call: function () {
			var args = can.makeArray(arguments),
				prop = args.shift(),
				binding = can.route.bindings[can.route.currentBinding || can.route.defaultBinding],
				method = binding[prop];
			if (method.apply) {
				return method.apply(binding, args);
			} else {
				return method;
			}
		}
	});

	// The functions in the following list applied to `can.route` (e.g. `can.route.attr('...')`) will
	// instead act on the `can.route.data` observe.
	each(['bind', 'unbind', 'on', 'off', 'delegate', 'undelegate', 'removeAttr', 'compute', '_get', '__get','each'], function (name) {
		can.route[name] = function () {
			// `delegate` and `undelegate` require
			// the `can/map/delegate` plugin
			if (!can.route.data[name]) {
				return;
			}

			return can.route.data[name].apply(can.route.data, arguments);
		};
	});

	// Because everything in hashbang is in fact a string this will automaticaly convert new values to string. Works with single value, or deep hashes.
	// Main motivation for this is to prevent double route event call for same value.
	// Example (the problem):
	// When you load page with hashbang like #!&some_number=2 and bind 'some_number' on routes.
	// It will fire event with adding of "2" (string) to 'some_number' property
	// But when you after this set can.route.attr({some_number: 2}) or can.route.attr('some_number', 2). it fires another event with change of 'some_number' from "2" (string) to 2 (integer)
	// This wont happen again with this normalization
	can.route.attr = function (attr, val) {
		var type = typeof attr,
			newArguments;

		// Reading
		if (val === undefined) {
			newArguments = arguments;
			// Sets object
		} else if (type !== "string" && type !== "number") {
			newArguments = [stringify(attr), val];
			// Sets key - value
		} else {
			newArguments = [attr, stringify(val)];
		}

		return can.route.data.attr.apply(can.route.data, newArguments);
	};

	var // Deparameterizes the portion of the hash of interest and assign the
	// values to the `can.route.data` removing existing values no longer in the hash.
	// setState is called typically by hashchange which fires asynchronously
	// So it's possible that someone started changing the data before the
	// hashchange event fired.  For this reason, it will not set the route data
	// if the data is changing or the hash already matches the hash that was set.
	setState = can.route.setState = function () {
		var hash = can.route._call("matchingPartOfURL");
		var oldParams = curParams;
		curParams = can.route.deparam(hash);

		// if the hash data is currently changing, or
		// the hash is what we set it to anyway, do NOT change the hash
		if (!changingData || hash !== lastHash) {
			can.batch.start();
			for(var attr in oldParams){
				if(!curParams[attr]){
					can.route.removeAttr(attr);
				}
			}
			can.route.attr(curParams);
			// trigger a url change so its possible to live-bind on url-based changes
			can.batch.trigger(eventsObject,"__url",[hash, lastHash]);
			can.batch.stop();
		}
	};

	return can.route;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/control',["can/util/library", "can/construct"], function (can) {
	// 
	// ### bind
	// this helper binds to one element and returns a function that unbinds from that element.
	var bind = function (el, ev, callback) {

		can.bind.call(el, ev, callback);

		return function () {
			can.unbind.call(el, ev, callback);
		};
	},
		isFunction = can.isFunction,
		extend = can.extend,
		each = can.each,
		slice = [].slice,
		paramReplacer = /\{([^\}]+)\}/g,
		special = can.getObject("$.event.special", [can]) || {},

		// ### delegate
		// 
		// this helper binds to elements based on a selector and returns a 
		// function that unbinds.
		delegate = function (el, selector, ev, callback) {
			can.delegate.call(el, selector, ev, callback);
			return function () {
				can.undelegate.call(el, selector, ev, callback);
			};
		},

		// ### binder
		// 
		// Calls bind or unbind depending if there is a selector.
		binder = function (el, ev, callback, selector) {
			return selector ?
				delegate(el, can.trim(selector), ev, callback) :
				bind(el, ev, callback);
		},

		basicProcessor;

	var Control = can.Control = can.Construct(
		/**
		 * @add can.Control
		 */
		// ## *static functions*
		/** 
		 * @static
		 */
		{
			// ## can.Control.setup
			// 
			// This function pre-processes which methods are event listeners and which are methods of
			// the control. It has a mechanism to allow controllers to inherit default values from super
			// classes, like `can.Construct`, and will cache functions that are action functions (see `_isAction`)
			// or functions with an underscored name.
			setup: function () {
				can.Construct.setup.apply(this, arguments);

				if (can.Control) {
					var control = this,
						funcName;

					control.actions = {};
					for (funcName in control.prototype) {
						if (control._isAction(funcName)) {
							control.actions[funcName] = control._action(funcName);
						}
					}
				}
			},
			// ## can.Control._shifter
			// 
			// Moves `this` to the first argument, wraps it with `jQuery` if it's 
			// an element.
			_shifter: function (context, name) {

				var method = typeof name === "string" ? context[name] : name;

				if (!isFunction(method)) {
					method = context[method];
				}

				return function () {
					context.called = name;
					return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
				};
			},

			// ## can.Control._isAction
			// 
			// Return `true` if `methodName` refers to an action. An action is a `methodName` value that
			// is not the constructor, and is either a function or string that refers to a function, or is
			// defined in `special`, `processors`. Detects whether `methodName` is also a valid method name.
			_isAction: function (methodName) {
				var val = this.prototype[methodName],
					type = typeof val;

				return (methodName !== 'constructor') &&
				(type === "function" || (type === "string" && isFunction(this.prototype[val]))) &&
				!! (special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
			},
			// ## can.Control._action
			// 
			// Takes a method name and the options passed to a control and tries to return the data 
			// necessary to pass to a processor (something that binds things).
			// 
			// For performance reasons, `_action` is called twice: 
			// * It's called when the Control class is created. for templated method names (e.g., `{window} foo`), it returns null. For non-templated method names it returns the event binding data. That data is added to `this.actions`.
			// * It is called wehn a control instance is created, but only for templated actions.
			_action: function (methodName, options) {

				// If we don't have options (a `control` instance), we'll run this later. If we have
				// options, run `can.sub` to replace the action template `{}` with values from the `options`
				// or `window`. If a `{}` template resolves to an object, `convertedName` will be an array.
				// In that case, the event name we want will be the last item in that array.
				paramReplacer.lastIndex = 0;
				if (options || !paramReplacer.test(methodName)) {
					var convertedName = options ? can.sub(methodName, this._lookup(options)) : methodName;
					if (!convertedName) {
					
						return null;
					}
					var arr = can.isArray(convertedName),
						name = arr ? convertedName[1] : convertedName,
						parts = name.split(/\s+/g),
						event = parts.pop();

					return {
						processor: processors[event] || basicProcessor,
						parts: [name, parts.join(" "), event],
						delegate: arr ? convertedName[0] : undefined
					};
				}
			},
			_lookup: function (options) {
				return [options, window];
			},
			// ## can.Control.processors
			// 
			// An object of `{eventName : function}` pairs that Control uses to 
			// hook up events automatically.
			processors: {},
			// ## can.Control.defaults
			// A object of name-value pairs that act as default values for a control instance
			defaults: {}
		}, {
			// ## *prototype functions*
			/**
			 * @prototype
			 */
			// ## setup
			// 
			// Setup is where most of the Control's magic happens. It performs several pre-initialization steps:
			// - Sets `this.element`
			// - Adds the Control's name to the element's className
			// - Saves the Control in `$.data`
			// - Merges Options
			// - Binds event handlers using `delegate`
			// The final step is to return pass the element and prepareed options, to be used in `init`.
			setup: function (element, options) {

				var cls = this.constructor,
					pluginname = cls.pluginName || cls._fullName,
					arr;

				// Retrieve the raw element, then set the plugin name as a class there.
				this.element = can.$(element);

				if (pluginname && pluginname !== 'can_control') {
					this.element.addClass(pluginname);
				}

				// Set up the 'controls' data on the element. If it does not exist, initialize
				// it to an empty array.
				arr = can.data(this.element, 'controls');
				if (!arr) {
					arr = [];
					can.data(this.element, 'controls', arr);
				}
				arr.push(this);

				// The `this.options` property is an Object that contains configuration data
				// passed to a control when it is created (`new can.Control(element, options)`)
				// 
				// The `options` argument passed when creating the control is merged with `can.Control.defaults` 
				// in [can.Control.prototype.setup setup].
				// 
				// If no `options` value is used during creation, the value in `defaults` is used instead
				this.options = extend({}, cls.defaults, options);

				this.on();

				return [this.element, this.options];
			},
			// ## on
			// 
			// This binds an event handler for an event to a selector under the scope of `this.element`
			// If no options are specified, all events are rebound to their respective elements. The actions,
			// which were cached in `setup`, are used and all elements are bound using `delegate` from `this.element`.
			on: function (el, selector, eventName, func) {
				if (!el) {
					this.off();

					var cls = this.constructor,
						bindings = this._bindings,
						actions = cls.actions,
						element = this.element,
						destroyCB = can.Control._shifter(this, "destroy"),
						funcName, ready;

					for (funcName in actions) {
						// Only push if we have the action and no option is `undefined`
						if ( actions.hasOwnProperty(funcName) ) {
							ready = actions[funcName] || cls._action(funcName, this.options, this);
							if( ready ) {
								bindings.control[funcName]  = ready.processor(ready.delegate || element,
									ready.parts[2], ready.parts[1], funcName, this);
							}
						}
					}

					// Set up the ability to `destroy` the control later.
					can.bind.call(element, "removed", destroyCB);
					bindings.user.push(function (el) {
						can.unbind.call(el, "removed", destroyCB);
					});
					return bindings.user.length;
				}

				// if `el` is a string, use that as `selector` and re-set it to this control's element...
				if (typeof el === 'string') {
					func = eventName;
					eventName = selector;
					selector = el;
					el = this.element;
				}

				// ...otherwise, set `selector` to null
				if (func === undefined) {
					func = eventName;
					eventName = selector;
					selector = null;
				}

				if (typeof func === 'string') {
					func = can.Control._shifter(this, func);
				}

				this._bindings.user.push(binder(el, eventName, func, selector));

				return this._bindings.user.length;
			},
			// ## off
			// 
			// Unbinds all event handlers on the controller.
			// This should _only_ be called in combination with .on()
			off: function () {
				var el = this.element[0],
					bindings = this._bindings;
				if( bindings ) {
					each(bindings.user || [], function (value) {
						value(el);
					});
					each(bindings.control || {}, function (value) {
						value(el);
					});
				}
				// Adds bindings.
				this._bindings = {user: [], control: {}};
			},
			// ## destroy
			// 
			// Prepares a `control` for garbage collection.
			// First checks if it has already been removed. Then, removes all the bindings, data, and 
			// the element from the Control instance.
			destroy: function () {
				if (this.element === null) {
				
					return;
				}
				var Class = this.constructor,
					pluginName = Class.pluginName || Class._fullName,
					controls;

				this.off();

				if (pluginName && pluginName !== 'can_control') {
					this.element.removeClass(pluginName);
				}

				controls = can.data(this.element, "controls");
				controls.splice(can.inArray(this, controls), 1);

				can.trigger(this, "destroyed");

				this.element = null;
			}
		});

	// ## Processors
	// 
	// Processors do the binding. This basic processor binds events. Each returns a function that unbinds 
	// when called.
	var processors = can.Control.processors;
	basicProcessor = function (el, event, selector, methodName, control) {
		return binder(el, event, can.Control._shifter(control, methodName), selector);
	};

	// Set common events to be processed as a `basicProcessor`
	each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup",
		"keypress", "mousedown", "mousemove", "mouseout", "mouseover",
		"mouseup", "reset", "resize", "scroll", "select", "submit", "focusin",
		"focusout", "mouseenter", "mouseleave",
		"touchstart", "touchmove", "touchcancel", "touchend", "touchleave",
		"inserted","removed"
	], function (v) {
		processors[v] = basicProcessor;
	});

	return Control;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/control/route',["can/util/library", "can/route", "can/control"], function (can) {

	// ## control/route.js
	// _Controller route integration._

	can.Control.processors.route = function (el, event, selector, funcName, controller) {
		selector = selector || "";
		if (!can.route.routes[selector]) {
			if (selector[0] === '/') {
				selector = selector.substring(1);
			}
			can.route(selector);
		}
		var batchNum,
			check = function (ev, attr, how) {
				if (can.route.attr('route') === (selector) &&
					(ev.batchNum === undefined || ev.batchNum !== batchNum)) {

					batchNum = ev.batchNum;

					var d = can.route.attr();
					delete d.route;
					if (can.isFunction(controller[funcName])) {
						controller[funcName](d);
					} else {
						controller[controller[funcName]](d);
					}

				}
			};
		can.route.bind('change', check);
		return function () {
			can.route.unbind('change', check);
		};
	};

	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/model',["can/util/library", "can/map", "can/list"], function (can) {

	// ## model.js
	// (Don't steal this file directly in your code.)

	// ## pipe
	// `pipe` lets you pipe the results of a successful deferred
	// through a function before resolving the deferred.
	/**
	 * @add can.Model
	 */
	var pipe = function (def, thisArg, func) {
		// The piped result will be available through a new Deferred.
		var d = new can.Deferred();
		def.then(function () {
			var args = can.makeArray(arguments),
				success = true;

			try {
				// Pipe the results through the function.
				args[0] = func.apply(thisArg, args);
			} catch (e) {
				success = false;
				// The function threw an error, so reject the Deferred.
				d.rejectWith(d, [e].concat(args));
			}
			if (success) {
				// Resolve the new Deferred with the piped value.
				d.resolveWith(d, args);
			}
		}, function () {
			// Pass on the rejection if the original Deferred never resolved.
			d.rejectWith(this, arguments);
		});

		// `can.ajax` returns a Deferred with an abort method to halt the AJAX call.
		if (typeof def.abort === 'function') {
			d.abort = function () {
				return def.abort();
			};
		}

		// Return the new (piped) Deferred.
		return d;
	},

		// ## modelNum
		// When new model constructors are set up without a full name,
		// `modelNum` lets us name them uniquely (to keep track of them).
		modelNum = 0,

		// ## getId
		getId = function (inst) {
			// `can.__reading` makes a note that `id` was just read.
			can.__reading(inst, inst.constructor.id);
			// Use `__get` instead of `attr` for performance. (But that means we have to remember to call `can.__reading`.)
			return inst.__get(inst.constructor.id);
		},

		// ## ajax
		// This helper method makes it easier to make an AJAX call from the configuration of the Model.
		ajax = function (ajaxOb, data, type, dataType, success, error) {

			var params = {};

			// A string here would be something like `"GET /endpoint"`.
			if (typeof ajaxOb === 'string') {
				// Split on spaces to separate the HTTP method and the URL.
				var parts = ajaxOb.split(/\s+/);
				params.url = parts.pop();
				if (parts.length) {
					params.type = parts.pop();
				}
			} else {
				// If the first argument is an object, just load it into `params`.
				can.extend(params, ajaxOb);
			}

			// If the `data` argument is a plain object, copy it into `params`.
			params.data = typeof data === "object" && !can.isArray(data) ?
				can.extend(params.data || {}, data) : data;

			// Substitute in data for any templated parts of the URL.
			params.url = can.sub(params.url, params.data, true);

			return can.ajax(can.extend({
				type: type || 'post',
				dataType: dataType || 'json',
				success: success,
				error: error
			}, params));
		},

		// ## makeRequest
		// This function abstracts making the actual AJAX request away from the Model.
		makeRequest = function (modelObj, type, success, error, method) {
			var args;

			// If `modelObj` is an Array, it it means we are coming from
			// the queued request, and we're passing already-serialized data.
			if (can.isArray(modelObj)) {
				// In that case, modelObj's signature will be `[modelObj, serializedData]`, so we need to unpack it.
				args = modelObj[1];
				modelObj = modelObj[0];
			} else {
				// If we aren't supplied with serialized data, we'll make our own.
				args = modelObj.serialize();
			}
			args = [args];

			var deferred,
				model = modelObj.constructor,
				jqXHR;

			// When calling `update` and `destroy`, the current ID needs to be the first parameter in the AJAX call.
			if (type === 'update' || type === 'destroy') {
				args.unshift(getId(modelObj));
			}
			jqXHR = model[type].apply(model, args);

			// Make sure that can.Model can react to the request before anything else does.
			deferred = pipe(jqXHR, modelObj, function (data) {
				// `method` is here because `"destroyed" !== "destroy" + "d"`.
				// TODO: Do something smarter/more consistent here?
				modelObj[method || type + "d"](data, jqXHR);
				return modelObj;
			});

			// Hook up `abort`
			if (jqXHR.abort) {
				deferred.abort = function () {
					jqXHR.abort();
				};
			}

			deferred.then(success, error);
			return deferred;
		},

		initializers = {
			// ## models
			// Returns a function that, when handed a list of objects, makes them into models and returns a model list of them.
			// `prop` is the property on `instancesRawData` that has the array of objects in it (if it's not `data`).
			models: function (prop) {
				return function (instancesRawData, oldList) {
					// Increment reqs counter so new instances will be added to the store.
					// (This is cleaned up at the end of the method.)
					can.Model._reqs++;

					// If there is no data, we can't really do anything with it.
					if (!instancesRawData) {
						return;
					}

					// If the "raw" data is already a List, it's not raw.
					if (instancesRawData instanceof this.List) {
						return instancesRawData;
					}

					var self = this,
						// `tmp` will hold the models before we push them onto `modelList`.
						tmp = [],
						// `ML` (see way below) is just `can.Model.List`.
						ListClass = self.List || ML,
						modelList = oldList instanceof can.List ? oldList : new ListClass(),

						// Check if we were handed an Array or a model list.
						rawDataIsArray = can.isArray(instancesRawData),
						rawDataIsList = instancesRawData instanceof ML,

						// Get the "plain" objects from the models from the list/array.
						raw = rawDataIsArray ? instancesRawData : (
							rawDataIsList ? instancesRawData.serialize() : can.getObject(prop || "data", instancesRawData)
						);

					if (typeof raw === 'undefined') {
						throw new Error('Could not get any raw data while converting using .models');
					}

				

					// If there was anything left in the list we were given, get rid of it.
					if (modelList.length) {
						modelList.splice(0);
					}

					// If we pushed these directly onto the list, it would cause a change event for each model.
					// So, we push them onto `tmp` first and then push everything at once, causing one atomic change event that contains all the models at once.
					can.each(raw, function (rawPart) {
						tmp.push(self.model(rawPart));
					});
					modelList.push.apply(modelList, tmp);

					// If there was other stuff on `instancesRawData`, let's transfer that onto `modelList` too.
					if (!rawDataIsArray) {
						can.each(instancesRawData, function (val, prop) {
							if (prop !== 'data') {
								modelList.attr(prop, val);
							}
						});
					}
					// Clean up the store on the next turn of the event loop. (`this` is a model constructor.)
					setTimeout(can.proxy(this._clean, this), 1);
					return modelList;
				};
			},
			// ## model
			// Returns a function that, when handed a plain object, turns it into a model.
			// `prop` is the property on `attributes` that has the properties for the model in it.
			model: function (prop) {
				return function (attributes) {
					// If there're no properties, there can be no model.
					if (!attributes) {
						return;
					}
					// If this object knows how to serialize, parse, or access itself, we'll use that instead.
					if (typeof attributes.serialize === 'function') {
						attributes = attributes.serialize();
					}
					if (this.parseModel) {
						attributes = this.parseModel.apply(this, arguments);
					} else if (prop) {
						attributes = can.getObject(prop || "data", attributes);
					}

					var id = attributes[this.id],
						// 0 is a valid ID.
						model = (id || id === 0) && this.store[id] ?
							// If this model is in the store already, just update it.
							this.store[id].attr(attributes, this.removeAttr || false) :
							// Otherwise, we need a new model.
							new this(attributes);

					return model;
				};
			}
		},

		/**
		 * @static
		 */
		//
		parserMaker = function (prop) {
			return function (attributes) {
				return prop ? can.getObject(prop || "data", attributes) : attributes;
			};
		},

		// ## parsers
		// This object describes how to take the data from an AJAX request and prepare it for `models` and `model`.
		// These functions are meant to be overwritten (if necessary) in an extended model constructor.
		parsers = {
			/**
			 * @function can.Model.parseModel parseModel
			 * @parent can.Model.static
			 * @description Convert raw data into an object that can be used to
			 * create a [can.Model] instance.
			 *
			 * @signature `can.Model.parseModel( data, xhr )`
			 * @release 2.1
			 *
			 *
			 * @param {Object} data The data to convert to a can.Model instance.
			 * @param {XMLHTTPRequest} xhr The XMLHTTPRequest object used to make the request.
			 * @return {Object} An object of properties to set at the [can.Model::attr attributes]
			 * of a model instance.
			 *
			 * @signature `parseModel: "PROPERTY"`
			 *
			 * Creates a `parseModel` function that looks for the attributes object in the PROPERTY
			 * property of raw instance data.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `can.Model.parseModel(data, xhr)` is used to
			 * convert the raw response of a [can.Model.findOne findOne],
			 * [can.Model.update update], and [can.Model.create create] request
			 * into an object that [can.Model.model] can use to create
			 * a model instances.
			 *
			 * This method is never called directly. Instead the deferred returned
			 * by `findOne`, `update`, and `create` is piped into `parseModel`. If `findOne` was called,
			 * the result of that is sent to [can.Model.model].
			 *
			 * If your server is returning data in non-standard way,
			 * overwriting `can.Model.parseModel` is the best way to normalize it.
			 *
			 * ## Expected data format
			 *
			 * By default, [can.Model.model] expects data to be a name-value pair
			 * object like:
			 *
			 *     {id: 1, name : "dishes"}
			 *
			 * If your data does not look like this, you probably want to overwrite `parseModel`.
			 *
			 * ## Overwriting parseModel
			 *
			 * If your service returns data like:
			 *
			 *     { thingsToDo: {name: "dishes", id: 5} }
			 *
			 * You will want to overwrite `parseModel` to pass the model what it expects like:
			 *
			 *     Task = can.Model.extend({
			 *       parseModel: function(data){
			 *         return data.thingsToDo;
			 *       }
			 *     },{});
			 *
			 * You could also do this like:
			 *
			 *     Task = can.Model.extend({
			 *       parseModel: "thingsToDo"
			 *     },{});
			 *
			 */
			parseModel: parserMaker,
			/**
			 * @function can.Model.parseModels parseModels
			 * @parent can.Model.static
			 * @description Convert raw xhr data into an array or object that can be used to
			 * create a [can.Model.List].
			 * @release 2.1
			 *
			 * @signature `can.Model.parseModels(data, xhr)`
			 *
			 * @param {*} data The raw data from a `[can.Model.findAll findAll()]` request.
			 *
			 * @param {XMLHTTPRequest} [xhr] The XMLHTTPRequest object used to make the request.
			 *
			 * @return {Array|Object} A JavaScript Object or Array that [can.Model.models]
			 * can convert into the Model's List.
			 *
			 * @signature `parseModels: "PROPERTY"`
			 *
			 * Creates a `parseModels` function that looks for the array of instance data in the PROPERTY
			 * property of the raw response data of [can.Model.findAll].
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `can.Model.parseModels(data, xhr)` is used to
			 * convert the raw response of a [can.Model.findAll] request
			 * into an object or Array that [can.Model.models] can use to create
			 * a [can.Model.List] of model instances.
			 *
			 * This method is never called directly. Instead the deferred returned
			 * by findAll is piped into `parseModels` and the result of that
			 * is sent to [can.Model.models].
			 *
			 * If your server is returning data in non-standard way,
			 * overwriting `can.Model.parseModels` is the best way to normalize it.
			 *
			 * ## Expected data format
			 *
			 * By default, [can.Model.models] expects data to be an array of name-value pair
			 * objects like:
			 *
			 *     [{id: 1, name : "dishes"},{id:2, name: "laundry"}, ...]
			 *
			 * It can also take an object with additional data about the array like:
			 *
			 *     {
			 *       count: 15000 //how many total items there might be
			 *       data: [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
			 *     }
			 *
			 * In this case, models will return a [can.Model.List] of instances found in
			 * data, but with additional properties as expandos on the list:
			 *
			 *     var tasks = Task.models({
			 *       count : 1500,
			 *       data : [{id: 1, name: 'dishes'}, ...]
			 *     })
			 *     tasks.attr("name") // -> 'dishes'
			 *     tasks.count // -> 1500
			 *
			 * If your data does not look like one of these formats, overwrite `parseModels`.
			 *
			 * ## Overwriting parseModels
			 *
			 * If your service returns data like:
			 *
			 *     {thingsToDo: [{name: "dishes", id: 5}]}
			 *
			 * You will want to overwrite `parseModels` to pass the models what it expects like:
			 *
			 *     Task = can.Model.extend({
			 *       parseModels: function(data){
			 *         return data.thingsToDo;
			 *       }
			 *     },{});
			 *
			 * You could also do this like:
			 *
			 *     Task = can.Model.extend({
			 *       parseModels: "thingsToDo"
			 *     },{});
			 *
			 * `can.Model.models` passes each instance's data to `can.Model.model` to
			 * create the individual instances.
			 */
			parseModels: parserMaker
		},

		// ## ajaxMethods
		// This object describes how to make an AJAX request for each ajax method (`create`, `update`, etc.)
		// Each AJAX method is an object in `ajaxMethods` and can have the following properties:
		//
		// - `url`: Which property on the model contains the default URL for this method.
		// - `type`: The default HTTP request method.
		// - `data`: A method that takes the arguments from `makeRequest` (see above) and returns a data object for use in the AJAX call.

		/**
		 * @function can.Model.bind bind
		 * @parent can.Model.static
		 * @description Listen for events on a Model class.
		 *
		 * @signature `can.Model.bind(eventType, handler)`
		 * @param {String} eventType The type of event.  It must be
		 * `"created"`, `"updated"`, `"destroyed"`.
		 * @param {function} handler A callback function
		 * that gets called with the event and instance that was
		 * created, destroyed, or updated.
		 * @return {can.Model} The model constructor function.
		 *
		 * @body
		 * `bind(eventType, handler(event, instance))` listens to
		 * __created__, __updated__, __destroyed__ events on all
		 * instances of the model.
		 *
		 *     Task.bind("created", function(ev, createdTask){
		 *      this //-> Task
		 *       createdTask.attr("name") //-> "Dishes"
		 *     })
		 *
		 *     new Task({name: "Dishes"}).save();
		 */
		//
		/**
		 * @function can.Model.unbind unbind
		 * @parent can.Model.static
		 * @description Stop listening for events on a Model class.
		 *
		 * @signature `can.Model.unbind(eventType, handler)`
		 * @param {String} eventType The type of event. It must be
		 * `"created"`, `"updated"`, `"destroyed"`.
		 * @param {function} handler A callback function
		 * that was passed to `bind`.
		 * @return {can.Model} The model constructor function.
		 *
		 * @body
		 * `unbind(eventType, handler)` removes a listener
		 * attached with [can.Model.bind].
		 *
		 *     var handler = function(ev, createdTask){
		 *
		 *     }
		 *     Task.bind("created", handler)
		 *     Task.unbind("created", handler)
		 *
		 * You have to pass the same function to `unbind` that you
		 * passed to `bind`.
		 */
		//
		/**
		 * @property {String} can.Model.id id
		 * @parent can.Model.static
		 * The name of the id field.  Defaults to `'id'`. Change this if it is something different.
		 *
		 * For example, it's common in .NET to use `'Id'`.  Your model might look like:
		 *
		 *     Friend = can.Model.extend({
		 *       id: "Id"
		 *     },{});
		 */
		/**
		 * @property {Boolean} can.Model.removeAttr removeAttr
		 * @parent can.Model.static
		 * Sets whether model conversion should remove non existing attributes or merge with
		 * the existing attributes. The default is `false`.
		 * For example, if `Task.findOne({ id: 1 })` returns
		 *
		 *      { id: 1, name: 'Do dishes', index: 1, color: ['red', 'blue'] }
		 *
		 * for the first request and
		 *
		 *      { id: 1, name: 'Really do dishes', color: ['green'] }
		 *
		 *  for the next request, the actual model attributes would look like:
		 *
		 *      { id: 1, name: 'Really do dishes', index: 1, color: ['green', 'blue'] }
		 *
		 *  Because the attributes of the original model and the updated model will
		 *  be merged. Setting `removeAttr` to `true` will result in model attributes like
		 *
		 *      { id: 1, name: 'Really do dishes', color: ['green'] }
		 *
		 */
		ajaxMethods = {
			/**
			 * @description Specifies how to create a new resource on the server. `create(serialized)` is called
			 * by [can.Model.prototype.save save] if the model instance [can.Model.prototype.isNew is new].
			 * @function can.Model.create create
			 * @parent can.Model.static
			 *
			 *
			 * @signature `can.Model.create: function(serialized) -> deferred`
			 *
			 * Specify a function to create persistent instances. The function will
			 * typically perform an AJAX request to a service that results in
			 * creating a record in a database.
			 *
			 * @param {Object} serialized The [can.Map::serialize serialized] properties of
			 * the model to create.
			 * @return {can.Deferred} A Deferred that resolves to an object of attributes
			 * that will be added to the created model instance.  The object __MUST__ contain
			 * an [can.Model.id id] property so that future calls to [can.Model.prototype.save save]
			 * will call [can.Model.update].
			 *
			 *
			 * @signature `can.Model.create: "[METHOD] /path/to/resource"`
			 *
			 * Specify a HTTP method and url to create persistent instances.
			 *
			 * If you provide a URL, the Model will send a request to that URL using
			 * the method specified (or POST if none is specified) when saving a
			 * new instance on the server. (See below for more details.)
			 *
			 * @param {HttpMethod} METHOD An HTTP method. Defaults to `"POST"`.
			 * @param {STRING} url The URL of the service to retrieve JSON data.
			 *
			 *
			 * @signature `can.Model.create: {ajaxSettings}`
			 *
			 * Specify an options object that is used to make a HTTP request to create
			 * persistent instances.
			 *
			 * @param {can.AjaxSettings} ajaxSettings A settings object that
			 * specifies the options available to pass to [can.ajax].
			 *
			 * @body
			 *
			 * `create(attributes) -> Deferred` is used by [can.Model::save save] to create a
			 * model instance on the server.
			 *
			 * ## Implement with a URL
			 *
			 * The easiest way to implement create is to give it the url
			 * to post data to:
			 *
			 *     var Recipe = can.Model.extend({
			 *       create: "/recipes"
			 *     },{})
			 *
			 * This lets you create a recipe like:
			 *
			 *     new Recipe({name: "hot dog"}).save();
			 *
			 *
			 * ## Implement with a Function
			 *
			 * You can also implement create by yourself. Create gets called
			 * with `attrs`, which are the [can.Map::serialize serialized] model
			 * attributes.  Create returns a `Deferred`
			 * that contains the id of the new instance and any other
			 * properties that should be set on the instance.
			 *
			 * For example, the following code makes a request
			 * to `POST /recipes.json {'name': 'hot+dog'}` and gets back
			 * something that looks like:
			 *
			 *     {
			 *       "id": 5,
			 *       "createdAt": 2234234329
			 *     }
			 *
			 * The code looks like:
			 *
			 *     can.Model.extend("Recipe", {
			 *       create : function( attrs ){
			 *         return $.post("/recipes.json",attrs, undefined ,"json");
			 *       }
			 *     },{})
			 */
			create: {
				url: "_shortName",
				type: "post"
			},
			/**
			 * @description Update a resource on the server.
			 * @function can.Model.update update
			 * @parent can.Model.static
			 * @signature `can.Model.update: "[METHOD] /path/to/resource"`
			 * If you provide a URL, the Model will send a request to that URL using
			 * the method specified (or PUT if none is specified) when updating an
			 * instance on the server. (See below for more details.)
			 * @return {can.Deferred} A Deferred that resolves to the updated model.
			 *
			 * @signature `can.Model.update: function(id, serialized) -> can.Deffered`
			 * If you provide a function, the Model will expect you to do your own AJAX requests.
			 * @param {*} id The ID of the model to update.
			 * @param {Object} serialized The [can.Map::serialize serialized] properties of
			 * the model to update.
			 * @return {can.Deferred} A Deferred that resolves to the updated model.
			 *
			 * @body
			 * `update( id, attrs ) -> Deferred` is used by [can.Model::save save] to
			 * update a model instance on the server.
			 *
			 * ## Implement with a URL
			 *
			 * The easist way to implement update is to just give it the url to `PUT` data to:
			 *
			 *     Recipe = can.Model.extend({
			 *       update: "/recipes/{id}"
			 *     },{});
			 *
			 * This lets you update a recipe like:
			 *
			 *     Recipe.findOne({id: 1}, function(recipe){
			 *       recipe.attr('name','salad');
			 *       recipe.save();
			 *     })
			 *
			 * This will make an XHR request like:
			 *
			 *     PUT /recipes/1
			 *     name=salad
			 *
			 * If your server doesn't use PUT, you can change it to post like:
			 *
			 *     Recipe = can.Model.extend({
			 *       update: "POST /recipes/{id}"
			 *     },{});
			 *
			 * The server should send back an object with any new attributes the model
			 * should have.  For example if your server updates the "updatedAt" property, it
			 * should send back something like:
			 *
			 *     // PUT /recipes/4 {name: "Food"} ->
			 *     {
			 *       updatedAt : "10-20-2011"
			 *     }
			 *
			 * ## Implement with a Function
			 *
			 * You can also implement update by yourself.  Update takes the `id` and
			 * `attributes` of the instance to be updated.  Update must return
			 * a [can.Deferred Deferred] that resolves to an object that contains any
			 * properties that should be set on the instance.
			 *
			 * For example, the following code makes a request
			 * to '/recipes/5.json?name=hot+dog' and gets back
			 * something that looks like:
			 *
			 *     {
			 *       updatedAt: "10-20-2011"
			 *     }
			 *
			 * The code looks like:
			 *
			 *     Recipe = can.Model.extend({
			 *       update : function(id, attrs ) {
			 *         return $.post("/recipes/"+id+".json",attrs, null,"json");
			 *       }
			 *     },{});
			 */
			update: {
				// ## update.data
				data: function (id, attrs) {
					attrs = attrs || {};

					// `this.id` is the property that represents the ID (and is usually `"id"`).
					var identity = this.id;

					// If the value of the property being used as the ID changed,
					// indicate that in the request and replace the current ID property.
					if (attrs[identity] && attrs[identity] !== id) {
						attrs["new" + can.capitalize(id)] = attrs[identity];
						delete attrs[identity];
					}
					attrs[identity] = id;

					return attrs;
				},
				type: "put"
			},
			/**
			 * @description Destroy a resource on the server.
			 * @function can.Model.destroy destroy
			 * @parent can.Model.static
			 *
			 * @signature `can.Model.destroy: function(id) -> deferred`
			 *
			 *
			 *
			 * If you provide a function, the Model will expect you to do your own AJAX requests.
			 * @param {*} id The ID of the resource to destroy.
			 * @return {can.Deferred} A Deferred that resolves to the destroyed model.
			 *
			 *
			 * @signature `can.Model.destroy: "[METHOD] /path/to/resource"`
			 *
			 * If you provide a URL, the Model will send a request to that URL using
			 * the method specified (or DELETE if none is specified) when deleting an
			 * instance on the server. (See below for more details.)
			 *
			 * @return {can.Deferred} A Deferred that resolves to the destroyed model.
			 *
			 *
			 *
			 * @body
			 * `destroy(id) -> Deferred` is used by [can.Model::destroy] remove a model
			 * instance from the server.
			 *
			 * ## Implement with a URL
			 *
			 * You can implement destroy with a string like:
			 *
			 *     Recipe = can.Model.extend({
			 *       destroy : "/recipe/{id}"
			 *     },{})
			 *
			 * And use [can.Model::destroy] to destroy it like:
			 *
			 *     Recipe.findOne({id: 1}, function(recipe){
			 *          recipe.destroy();
			 *     });
			 *
			 * This sends a `DELETE` request to `/thing/destroy/1`.
			 *
			 * If your server does not support `DELETE` you can override it like:
			 *
			 *     Recipe = can.Model.extend({
			 *       destroy : "POST /recipe/destroy/{id}"
			 *     },{})
			 *
			 * ## Implement with a function
			 *
			 * Implement destroy with a function like:
			 *
			 *     Recipe = can.Model.extend({
			 *       destroy : function(id){
			 *         return $.post("/recipe/destroy/"+id,{});
			 *       }
			 *     },{})
			 *
			 * Destroy just needs to return a deferred that resolves.
			 */
			destroy: {
				type: 'delete',
				// ## destroy.data
				data: function (id, attrs) {
					attrs = attrs || {};
					// `this.id` is the property that represents the ID (and is usually `"id"`).
					attrs.id = attrs[this.id] = id;
					return attrs;
				}
			},
			/**
			 * @description Retrieve multiple resources from a server.
			 * @function can.Model.findAll findAll
			 * @parent can.Model.static
			 *
			 * @signature `can.Model.findAll( params[, success[, error]] )`
			 *
			 * Retrieve multiple resources from a server.
			 *
			 * @param {Object} params Values to filter the request or results with.
			 * @param {function(can.Model.List)} [success(list)] A callback to call on successful retrieval. The callback recieves
			 * a can.Model.List of the retrieved resources.
			 * @param {function(can.AjaxSettings)} [error(xhr)] A callback to call when an error occurs. The callback receives the
			 * XmlHttpRequest object.
			 * @return {can.Deferred} A deferred that resolves to a [can.Model.List] of retrieved models.
			 *
			 *
			 * @signature `can.Model.findAll: findAllData( params ) -> deferred`
			 *
			 * Implements `findAll` with a [can.Model.findAllData function]. This function
			 * is passed to [can.Model.makeFindAll makeFindAll] to create the external
			 * `findAll` method.
			 *
			 *     findAll: function(params){
			 *       return $.get("/tasks",params)
			 *     }
			 *
			 * @param {can.Model.findAllData} findAllData A function that accepts parameters
			 * specifying a list of instance data to retrieve and returns a [can.Deferred]
			 * that resolves to an array of those instances.
			 *
			 * @signature `can.Model.findAll: "[METHOD] /path/to/resource"`
			 *
			 * Implements `findAll` with a HTTP method and url to retrieve instance data.
			 *
			 *     findAll: "GET /tasks"
			 *
			 * If `findAll` is implemented with a string, this gets converted to
			 * a [can.Model.findAllData findAllData function]
			 * which is passed to [can.Model.makeFindAll makeFindAll] to create the external
			 * `findAll` method.
			 *
			 * @param {HttpMethod} METHOD An HTTP method. Defaults to `"GET"`.
			 *
			 * @param {STRING} url The URL of the service to retrieve JSON data.
			 *
			 * @return {JSON} The service should return a JSON object like:
			 *
			 *     {
			 *       "data": [
			 *         { "id" : 1, "name" : "do the dishes" },
			 *         { "id" : 2, "name" : "mow the lawn" },
			 *         { "id" : 3, "name" : "iron my shirts" }
			 *       ]
			 *     }
			 *
			 * This object is passed to [can.Model.models] to turn it into instances.
			 *
			 * _Note: .findAll can also accept an array, but you
			 * probably [should not be doing that](http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx)._
			 *
			 *
			 * @signature `can.Model.findAll: {ajaxSettings}`
			 *
			 * Implements `findAll` with a [can.AjaxSettings ajax settings object].
			 *
			 *     findAll: {url: "/tasks", dataType: "json"}
			 *
			 * If `findAll` is implemented with an object, it gets converted to
			 * a [can.Model.findAllData findAllData function]
			 * which is passed to [can.Model.makeFindAll makeFindAll] to create the external
			 * `findAll` method.
			 *
			 * @param {can.AjaxSettings} ajaxSettings A settings object that
			 * specifies the options available to pass to [can.ajax].
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `findAll( params, success(instances), error(xhr) ) -> Deferred` is used to retrieve model
			 * instances from the server. After implementing `findAll`, use it to retrieve instances of the model
			 * like:
			 *
			 *     Recipe.findAll({favorite: true}, function(recipes){
			 *       recipes[0].attr('name') //-> "Ice Water"
			 *     }, function( xhr ){
			 *       // called if an error
			 *     }) //-> Deferred
			 *
			 *
			 * Before you can use `findAll`, you must implement it.
			 *
			 * ## Implement with a URL
			 *
			 * Implement findAll with a url like:
			 *
			 *     Recipe = can.Model.extend({
			 *       findAll : "/recipes.json"
			 *     },{});
			 *
			 * The server should return data that looks like:
			 *
			 *     [
			 *       {"id" : 57, "name": "Ice Water"},
			 *       {"id" : 58, "name": "Toast"}
			 *     ]
			 *
			 * ## Implement with an Object
			 *
			 * Implement findAll with an object that specifies the parameters to
			 * `can.ajax` (jQuery.ajax) like:
			 *
			 *     Recipe = can.Model.extend({
			 *       findAll : {
			 *         url: "/recipes.xml",
			 *         dataType: "xml"
			 *       }
			 *     },{})
			 *
			 * ## Implement with a Function
			 *
			 * To implement with a function, `findAll` is passed __params__ to filter
			 * the instances retrieved from the server and it should return a
			 * deferred that resolves to an array of model data. For example:
			 *
			 *     Recipe = can.Model.extend({
			 *       findAll : function(params){
			 *         return $.ajax({
			 *           url: '/recipes.json',
			 *           type: 'get',
			 *           dataType: 'json'})
			 *       }
			 *     },{})
			 *
			 */
			findAll: {
				url: "_shortName"
			},
			/**
			 * @description Retrieve a resource from a server.
			 * @function can.Model.findOne findOne
			 * @parent can.Model.static
			 *
			 * @signature `can.Model.findOne( params[, success[, error]] )`
			 *
			 * Retrieve a single instance from the server.
			 *
			 * @param {Object} params Values to filter the request or results with.
			 * @param {function(can.Model)} [success(model)] A callback to call on successful retrieval. The callback recieves
			 * the retrieved resource as a can.Model.
			 * @param {function(can.AjaxSettings)} [error(xhr)] A callback to call when an error occurs. The callback receives the
			 * XmlHttpRequest object.
			 * @return {can.Deferred} A deferred that resolves to a [can.Model.List] of retrieved models.
			 *
			 * @signature `can.Model.findOne: findOneData( params ) -> deferred`
			 *
			 * Implements `findOne` with a [can.Model.findOneData function]. This function
			 * is passed to [can.Model.makeFindOne makeFindOne] to create the external
			 * `findOne` method.
			 *
			 *     findOne: function(params){
			 *       return $.get("/task/"+params.id)
			 *     }
			 *
			 * @param {can.Model.findOneData} findOneData A function that accepts parameters
			 * specifying an instance to retreive and returns a [can.Deferred]
			 * that resolves to that instance.
			 *
			 * @signature `can.Model.findOne: "[METHOD] /path/to/resource"`
			 *
			 * Implements `findOne` with a HTTP method and url to retrieve an instance's data.
			 *
			 *     findOne: "GET /tasks/{id}"
			 *
			 * If `findOne` is implemented with a string, this gets converted to
			 * a [can.Model.makeFindOne makeFindOne function]
			 * which is passed to [can.Model.makeFindOne makeFindOne] to create the external
			 * `findOne` method.
			 *
			 * @param {HttpMethod} METHOD An HTTP method. Defaults to `"GET"`.
			 *
			 * @param {STRING} url The URL of the service to retrieve JSON data.
			 *
			 * @signature `can.Model.findOne: {ajaxSettings}`
			 *
			 * Implements `findOne` with a [can.AjaxSettings ajax settings object].
			 *
			 *     findOne: {url: "/tasks/{id}", dataType: "json"}
			 *
			 * If `findOne` is implemented with an object, it gets converted to
			 * a [can.Model.makeFindOne makeFindOne function]
			 * which is passed to [can.Model.makeFindOne makeFindOne] to create the external
			 * `findOne` method.
			 *
			 * @param {can.AjaxSettings} ajaxSettings A settings object that
			 * specifies the options available to pass to [can.ajax].
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `findOne( params, success(instance), error(xhr) ) -> Deferred` is used to retrieve a model
			 * instance from the server.
			 *
			 * Use `findOne` like:
			 *
			 *     Recipe.findOne({id: 57}, function(recipe){
			 *      recipe.attr('name') //-> "Ice Water"
			 *     }, function( xhr ){
			 *      // called if an error
			 *     }) //-> Deferred
			 *
			 * Before you can use `findOne`, you must implement it.
			 *
			 * ## Implement with a URL
			 *
			 * Implement findAll with a url like:
			 *
			 *     Recipe = can.Model.extend({
			 *       findOne : "/recipes/{id}.json"
			 *     },{});
			 *
			 * If `findOne` is called like:
			 *
			 *     Recipe.findOne({id: 57});
			 *
			 * The server should return data that looks like:
			 *
			 *     {"id" : 57, "name": "Ice Water"}
			 *
			 * ## Implement with an Object
			 *
			 * Implement `findOne` with an object that specifies the parameters to
			 * `can.ajax` (jQuery.ajax) like:
			 *
			 *     Recipe = can.Model.extend({
			 *       findOne : {
			 *         url: "/recipes/{id}.xml",
			 *         dataType: "xml"
			 *       }
			 *     },{})
			 *
			 * ## Implement with a Function
			 *
			 * To implement with a function, `findOne` is passed __params__ to specify
			 * the instance retrieved from the server and it should return a
			 * deferred that resolves to the model data.  Also notice that you now need to
			 * build the URL manually. For example:
			 *
			 *     Recipe = can.Model.extend({
			 *       findOne : function(params){
			 *         return $.ajax({
			 *           url: '/recipes/' + params.id,
			 *           type: 'get',
			 *           dataType: 'json'})
			 *       }
			 *     },{})
			 *
			 *
			 */
			findOne: {}
		},
		// ## ajaxMaker
		// Takes a method defined just above and a string that describes how to call that method
		// and makes a function that calls that method with the given data.
		//
		// - `ajaxMethod`: The object defined above in `ajaxMethods`.
		// - `str`: The string the configuration provided (such as `"/recipes.json"` for a `findAll` call).
		ajaxMaker = function (ajaxMethod, str) {
			return function (data) {
				data = ajaxMethod.data ?
					// If the AJAX method mentioned above has its own way of getting `data`, use that.
					ajaxMethod.data.apply(this, arguments) :
					// Otherwise, just use the data passed in.
					data;

				// Make the AJAX call with the URL, data, and type indicated by the proper `ajaxMethod` above.
				return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get");
			};
		},
		// ## createURLFromResource
		// For each of the names (create, update, destroy, findOne, and findAll) use the 
		// URL provided by the `resource` property. For example:
		// 		
		// 		ToDo = can.Model.extend({
		// 			resource: "/todos"
		// 		}, {});
		// 	
		// 	Will create a can.Model that is identical to:
		// 	
		// 		ToDo = can.Model.extend({
		// 			findAll: "GET /todos",
		// 			findOne: "GET /todos/{id}",
		// 			create:  "POST /todos",
		// 			update:  "PUT /todos/{id}",
		// 			destroy: "DELETE /todos/{id}"
		// 		},{});
		// 
		// - `model`: the can.Model that has the resource property
		// - `method`: a property from the ajaxMethod object
		createURLFromResource = function(model, name) {
			if (!model.resource) { return; }

			var resource = model.resource.replace(/\/+$/, "");
			if (name === "findAll" || name === "create") {
				return resource;
			} else {
				return resource + "/{" + model.id + "}";
			}
		};

	// # can.Model
	// A can.Map that connects to a RESTful interface.
	can.Model = can.Map.extend({
			// `fullName` identifies the model type in debugging.
			fullName: "can.Model",
			_reqs: 0,
			// ## can.Model.setup
			/**
			 * @hide
			 * @function can.Model.setup
			 * @parent can.Model.static
			 *
			 * Configures
			 *
			 */
			setup: function (base, fullName, staticProps, protoProps) {
				// Assume `fullName` wasn't passed. (`can.Model.extend({ ... }, { ... })`)
				// This is pretty usual.
				if (typeof fullName !== "string") {
					protoProps = staticProps;
					staticProps = fullName;
				}
				// Assume no static properties were passed. (`can.Model.extend({ ... })`)
				// This is really unusual for a model though, since there's so much configuration.
				if (!protoProps) {
				
					protoProps = staticProps;
				}

				// Create the model store here, in case someone wants to use can.Model without inheriting from it.
				this.store = {};

				can.Map.setup.apply(this, arguments);
				if (!can.Model) {
					return;
				}

				// `List` is just a regular can.Model.List that knows what kind of Model it's hooked up to.
				/**
				 * @property {can.Model.List} can.Model.static.List List
				 * @parent can.Model.static
				 *
				 * @description Specifies the type of List that [can.Model.findAll findAll]
				 * should return.
				 *
				 * @option {can.Model.List} A can.Model's List property is the
				 * type of [can.List List] returned
				 * from [can.Model.findAll findAll]. For example:
				 *
				 *     Task = can.Model.extend({
				 *       findAll: "/tasks"
				 *     },{})
				 *
				 *     Task.findAll({}, function(tasks){
				 *       tasks instanceof Task.List //-> true
				 *     })
				 *
				 * Overwrite a Model's `List` property to add custom
				 * behavior to the lists provided to `findAll` like:
				 *
				 *     Task = can.Model.extend({
				 *       findAll: "/tasks"
				 *     },{})
				 *     Task.List = Task.List.extend({
				 *       completed: function(){
				 *         var count = 0;
				 *         this.each(function(task){
				 *           if( task.attr("completed") ) count++;
				 *         })
				 *         return count;
				 *       }
				 *     })
				 *
				 *     Task.findAll({}, function(tasks){
				 *       tasks.completed() //-> 3
				 *     })
				 *
				 * When [can.Model] is extended,
				 * [can.Model.List] is extended and set as the extended Model's
				 * `List` property. The extended list's [can.List.Map Map] property
				 * is set to the extended Model.  For example:
				 *
				 *     Task = can.Model.extend({
				 *       findAll: "/tasks"
				 *     },{})
				 *     Task.List.Map //-> Task
				 *
				 */
				if(staticProps && staticProps.List) {
					this.List = staticProps.List;
					this.List.Map = this;
				}
				else {
					this.List = base.List.extend({
						Map: this
					}, {});
				}

				var self = this,
					clean = can.proxy(this._clean, self);

				// Go through `ajaxMethods` and set up static methods according to their configurations.
				can.each(ajaxMethods, function (method, name) {
					// Check the configuration for this ajaxMethod.
					// If the configuration isn't a function, it should be a string (like `"GET /endpoint"`)
					// or an object like `{url: "/endpoint", type: 'GET'}`.

					//if we have a string(like `"GET /endpoint"`) or an object(ajaxSettings) set in the static definition(not inherited),
					//convert it to a function.
					if(staticProps && staticProps[name] && (typeof staticProps[name] === 'string' || typeof staticProps[name] === 'object')) {
						self[name] = ajaxMaker(method, staticProps[name]);
					}
					//if we have a resource property set in the static definition
					else if(staticProps && staticProps.resource) {
						self[name] = ajaxMaker(method, createURLFromResource(self, name));
					}

					// There may also be a "maker" function (like `makeFindAll`) that alters the behavior of acting upon models
					// by changing when and how the function we just made with `ajaxMaker` gets called.
					// For example, you might cache responses and only make a call when you don't have a cached response.
					if (self["make" + can.capitalize(name)]) {
						// Use the "maker" function to make the new "ajaxMethod" function.
						var newMethod = self["make" + can.capitalize(name)](self[name]);
						// Replace the "ajaxMethod" function in the configuration with the new one.
						// (`_overwrite` just overwrites a property in a given Construct.)
						can.Construct._overwrite(self, base, name, function () {
							// Increment the numer of requests...
							can.Model._reqs++;
							// ...make the AJAX call (and whatever else you're doing)...
							var def = newMethod.apply(this, arguments);
							// ...and clean up the store.
							var then = def.then(clean, clean);
							// Pass along `abort` so you can still abort the AJAX call.
							then.abort = def.abort;

							return then;
						});
					}
				});

				// Set up the methods that will set up `models` and `model`.
				can.each(initializers, function (makeInitializer, name) {
					var parseName = "parse" + can.capitalize(name),
						dataProperty = self[name];

					// If there was a different property to find the model's data in than `data`,
					// make `parseModel` and `parseModels` functions that look that up instead.
					if (typeof dataProperty === "string") {
						can.Construct._overwrite(self, base, parseName, parsers[parseName](dataProperty));
						can.Construct._overwrite(self, base, name, makeInitializer(dataProperty));
					}

					// If there was no prototype, or no `model` and no `parseModel`,
					// we'll have to create a `parseModel`.
					else if (!staticProps || (!staticProps[name] && !staticProps[parseName])) {
						can.Construct._overwrite(self, base, parseName, parsers[parseName]());
					}
				});

				// With the overridden parse methods, set up `models` and `model`.
				can.each(parsers, function (makeParser, name) {
					// If there was a different property to find the model's data in than `data`,
					// make `model` and `models` functions that look that up instead.
					if (typeof self[name] === "string") {
						can.Construct._overwrite(self, base, name, makeParser(self[name]));
					}
				});

				// Make sure we have a unique name for this Model.
				if (self.fullName === "can.Model" || !self.fullName) {
					self.fullName = "Model" + (++modelNum);
				}

				can.Model._reqs = 0;
				this._url = this._shortName + "/{" + this.id + "}";
			},
			_ajax: ajaxMaker,
			_makeRequest: makeRequest,
			// ## can.Model._clean
			// `_clean` cleans up the model store after a request happens.
			_clean: function () {
				can.Model._reqs--;
				// Don't clean up unless we have no pending requests.
				if (!can.Model._reqs) {
					for (var id in this.store) {
						// Delete all items in the store without any event bindings.
						if (!this.store[id]._bindings) {
							delete this.store[id];
						}
					}
				}
				return arguments[0];
			},
			/**
			 * @function can.Model.models models
			 * @parent can.Model.static
			 *
			 * @deprecated {2.1} Prior to 2.1, `.models` was used to convert the ajax
			 * responses into a data format useful for converting them into an observable
			 * list AND for converting them into that list. In 2.1, [can.Model.parseModels] should
			 * be used to convert the ajax responses into a data format useful to [can.Model.models].
			 *
			 * @description Convert raw data into can.Model instances. Merge data with items in
			 * the store if matches are found.
			 *
			 * @signature `can.Model.models(data[, oldList])`
			 * @param {Array<Object>} data The raw data from a `[can.Model.findAll findAll()]` request.
			 * @param {can.Model.List} [oldList] If supplied, this List will be updated with the data from
			 * __data__.
			 * @return {can.Model.List} A List of Models made from the raw data.
			 *
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `.models(data)` is used to create a [can.Model.List] of [can.Model] instances
			 * with the data provided. If an item in data matches an instance in the [can.Model.store],
			 * that instance will be merged with the item's data and inserted in the list.
			 *
			 * For example
			 *
			 *     Task = can.Model.extend({},{})
			 *
			 *     var t1 = new Task({id: 1, name: "dishes"});
			 *
			 *     // Binding on a model puts it in the store.
			 *     t1.bind("change", function(){})
			 *
			 *     var tasks = Task.models([
			 *       {id: 1, name : "dishes", complete : false},
			 *       {id: 2, name: "laundry", complete: true}
			 *     ])
			 *
			 *     t1 === tasks.attr(0) //-> true
			 *     t1.attr("complete")  //-> false
			 *
			 */
			models: initializers.models("data"),
			/**
			 * @function can.Model.model model
			 * @parent can.Model.static
			 *
			 * @deprecated {2.1} Prior to 2.1, `.model` was used to convert ajax
			 * responses into a data format useful for converting them into a can.Model instance
			 * AND for converting them into that instance. In 2.1, [can.Model.parseModel] should
			 * be used to convert the ajax response into a data format useful to [can.Model.model].
			 *
			 * @description Convert raw data into a can.Model instance. If data's [can.Model.id id]
			 * matches a item in the store's `id`, `data` is merged with the instance and the
			 * instance is returned.
			 *
			 *
			 * @signature `can.Model.model(data)`
			 * @param {Object} data The data to convert to a can.Model instance.
			 * @return {can.Model} An instance of can.Model made with the given data.
			 *
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `.models(data)` is used to create or retrieve a [can.Model] instance
			 * with the data provided. If data matches an instance in the [can.Model.store],
			 * that instance will be merged with the item's data and returneds
			 *
			 * For example
			 *
			 *     Task = can.Model.extend({},{})
			 *
			 *     var t1 = new Task({id: 1, name: "dishes"})
			 *
			 *     // Binding on a model puts it in the store
			 *     t1.bind("change", function(){})
			 *
			 *     var task = Task.model({id: 1, name : "dishes", complete : false})
			 *
			 *     t1 === task //-> true
			 *     t1.attr("complete")  //-> false
			 *
			 */
			model: initializers.model()
		},

		/**
		 * @prototype
		 */
		{
			// ## can.Model#setup
			setup: function (attrs) {
				// Try to add things as early as possible to the store (#457).
				// This is the earliest possible moment, even before any properties are set.
				var id = attrs && attrs[this.constructor.id];
				if (can.Model._reqs && id != null) {
					this.constructor.store[id] = this;
				}
				can.Map.prototype.setup.apply(this, arguments);
			},
			// ## can.Model#isNew
			// Something is new if its ID is `null` or `undefined`.
			/**
			 * @function can.Model.prototype.isNew isNew
			 * @description Check if a Model has yet to be saved on the server.
			 * @signature `model.isNew()`
			 * @return {Boolean} Whether an instance has been saved on the server.
			 * (This is determined by whether `id` has a value set yet.)
			 *
			 * @body
			 * `isNew()` returns if the instance is has been created
			 * on the server. This is essentially if the [can.Model.id]
			 * property is null or undefined.
			 *
			 *     new Recipe({id: 1}).isNew() //-> false
			 */
			isNew: function () {
				var id = getId(this);
				// 0 is a valid ID.
				// TODO: Why not `return id === null || id === undefined;`?
				return !(id || id === 0); // If `null` or `undefined`
			},
			// ## can.Model#save
			// `save` calls `create` or `update` as necessary, based on whether a model is new.
			/**
			 * @function can.Model.prototype.save save
			 * @description Save a model back to the server.
			 * @signature `model.save([success[, error]])`
			 * @param {function} [success] A callback to call on successful save. The callback recieves
			 * the can.Model after saving.
			 * @param {function} [error] A callback to call when an error occurs. The callback receives the
			 * XmlHttpRequest object.
			 * @return {can.Deferred} A Deferred that resolves to the Model after it has been saved.
			 *
			 * @body
			 * `model.save([success(model)],[error(xhr)])` creates or updates
			 * the model instance using [can.Model.create] or
			 * [can.Model.update] depending if the instance
			 * [can.Model::isNew has an id or not].
			 *
			 * ## Using `save` to create an instance.
			 *
			 * If `save` is called on an instance that does not have
			 * an [can.Model.id id] property, it calls [can.Model.create]
			 * with the instance's properties.  It also [can.trigger triggers]
			 * a "created" event on the instance and the model.
			 *
			 *     // create a model instance
			 *     var todo = new Todo({name: "dishes"});
			 *
			 *     // listen when the instance is created
			 *     todo.bind("created", function(ev){
			 *       this //-> todo
			 *     });
			 *
			 *     // save it on the server
			 *     todo.save(function(todo){
			 *       console.log("todo", todo, "created");
			 *     });
			 *
			 * ## Using `save` to update an instance.
			 *
			 * If save is called on an instance that has
			 * an [can.Model.id id] property, it calls [can.Model.create]
			 * with the instance's properties.  When the save is complete,
			 * it triggers an "updated" event on the instance and the instance's model.
			 *
			 * Instances with an
			 * __id__ are typically retrieved with [can.Model.findAll] or
			 * [can.Model.findOne].
			 *
			 *
			 *     // get a created model instance
			 *     Todo.findOne({id: 5},function(todo){
			 *
			 *       // listen when the instance is updated
			 *       todo.bind("updated", function(ev){
			 *         this //-> todo
			 *       })
			 *
			 *       // update the instance's property
			 *       todo.attr("complete", true)
			 *
			 *       // save it on the server
			 *       todo.save(function(todo){
			 *         console.log("todo", todo, "updated")
			 *       });
			 *
			 *     });
			 *
			 */
			save: function (success, error) {
				return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
			},
			// ## can.Model#destroy
			// Acts like can.Map.destroy but it also makes an AJAX call.
			/**
			 * @function can.Model.prototype.destroy destroy
			 * @description Destroy a Model on the server.
			 * @signature `model.destroy([success[, error]])`
			 * @param {function} [success] A callback to call on successful destruction. The callback recieves
			 * the can.Model as it was just prior to destruction.
			 * @param {function} [error] A callback to call when an error occurs. The callback receives the
			 * XmlHttpRequest object.
			 * @return {can.Deferred} A Deferred that resolves to the Model as it was before destruction.
			 *
			 * @body
			 * Destroys the instance by calling
			 * [Can.Model.destroy] with the id of the instance.
			 *
			 *     recipe.destroy(success, error);
			 *
			 * This triggers "destroyed" events on the instance and the
			 * Model constructor function which can be listened to with
			 * [can.Model::bind] and [can.Model.bind].
			 *
			 *     Recipe = can.Model.extend({
			 *       destroy : "DELETE /services/recipes/{id}",
			 *       findOne : "/services/recipes/{id}"
			 *     },{})
			 *
			 *     Recipe.bind("destroyed", function(){
			 *       console.log("a recipe destroyed");
			 *     });
			 *
			 *     // get a recipe
			 *     Recipe.findOne({id: 5}, function(recipe){
			 *       recipe.bind("destroyed", function(){
			 *         console.log("this recipe destroyed")
			 *       })
			 *       recipe.destroy();
			 *     })
			 */
			destroy: function (success, error) {
				// If this model is new, don't make an AJAX call.
				// Instead, we have to construct the Deferred ourselves and return it.
				if (this.isNew()) {
					var self = this;
					var def = can.Deferred();
					def.then(success, error);

					return def.done(function (data) {
						self.destroyed(data);
					}).resolve(self);
				}

				// If it isn't new, though, go ahead and make a request.
				return makeRequest(this, 'destroy', success, error, 'destroyed');
			},
			// ## can.Model#bind and can.Model#unbind
			// These aren't actually implemented here, but their setup needs to be changed to account for the store.
			/**
			 * @description Listen to events on this Model.
			 * @function can.Model.prototype.bind bind
			 * @signature `model.bind(eventName, handler)`
			 * @param {String} eventName The event to bind to.
			 * @param {function} handler The function to call when the
			 * event occurs. __handler__ is passed the event and the
			 * Model instance.
			 * @return {can.Model} The Model, for chaining.
			 *
			 * @body
			 * `bind(eventName, handler(ev, args...) )` is used to listen
			 * to events on this model instance.  Example:
			 *
			 *     Task = can.Model.extend()
			 *     var task = new Task({name : "dishes"})
			 *     task.bind("name", function(ev, newVal, oldVal){})
			 *
			 * Use `bind` the
			 * same as [can.Map::bind] which should be used as
			 * a reference for listening to property changes.
			 *
			 * Bind on model can be used to listen to when
			 * an instance is:
			 *
			 *  - created
			 *  - updated
			 *  - destroyed
			 *
			 * like:
			 *
			 *     Task = can.Model.extend()
			 *     var task = new Task({name : "dishes"})
			 *
			 *     task.bind("created", function(ev, newTask){
			 *       console.log("created", newTask)
			 *     })
			 *     .bind("updated", function(ev, updatedTask){
			 *       console.log("updated", updatedTask)
			 *     })
			 *     .bind("destroyed", function(ev, destroyedTask){
			 *       console.log("destroyed", destroyedTask)
			 *     })
			 *
			 *     // create, update, and destroy
			 *     task.save(function(){
			 *       task.attr('name', "do dishes")
			 *           .save(function(){
			 *             task.destroy()
			 *           })
			 *     });
			 *
			 *
			 * `bind` also extends the inherited
			 * behavior of [can.Map::bind] to track the number
			 * of event bindings on this object which is used to store
			 * the model instance.  When there are no bindings, the
			 * model instance is removed from the store, freeing memory.
			 */
			_bindsetup: function () {
				this.constructor.store[this.__get(this.constructor.id)] = this;
				return can.Map.prototype._bindsetup.apply(this, arguments);
			},
			/**
			 * @function can.Model.prototype.unbind unbind
			 * @description Stop listening to events on this Model.
			 * @signature `model.unbind(eventName[, handler])`
			 * @param {String} eventName The event to unbind from.
			 * @param {function} [handler] A handler previously bound with `bind`.
			 * If __handler__ is not passed, `unbind` will remove all handlers
			 * for the given event.
			 * @return {can.Model} The Model, for chaining.
			 *
			 * @body
			 * `unbind(eventName, handler)` removes a listener
			 * attached with [can.Model::bind].
			 *
			 *     var handler = function(ev, createdTask){
			 *
			 *     }
			 *     task.bind("created", handler)
			 *     task.unbind("created", handler)
			 *
			 * You have to pass the same function to `unbind` that you
			 * passed to `bind`.
			 *
			 * Unbind will also remove the instance from the store
			 * if there are no other listeners.
			 */
			_bindteardown: function () {
				delete this.constructor.store[getId(this)];
				return can.Map.prototype._bindteardown.apply(this, arguments);
			},
			// Change the behavior of `___set` to account for the store.
			___set: function (prop, val) {
				can.Map.prototype.___set.call(this, prop, val);
				// If we add or change the ID, update the store accordingly.
				// TODO: shouldn't this also delete the record from the old ID in the store?
				if (prop === this.constructor.id && this._bindings) {
					this.constructor.store[getId(this)] = this;
				}
			}
		});

	// Returns a function that knows how to prepare data from `findAll` or `findOne` calls.
	// `name` should be either `model` or `models`.
	var makeGetterHandler = function (name) {
		var parseName = "parse" + can.capitalize(name);
		return function (data) {
			// If there's a `parse...` function, use its output.
			if (this[parseName]) {
				data = this[parseName].apply(this, arguments);
			}
			// Run our maybe-parsed data through `model` or `models`.
			return this[name](data);
		};
	},
		// Handle data returned from `create`, `update`, and `destroy` calls.
		createUpdateDestroyHandler = function (data) {
			if (this.parseModel) {
				return this.parseModel.apply(this, arguments);
			} else {
				return this.model(data);
			}
		};

	var responseHandlers = {
		/**
		 * @function can.Model.makeFindAll
		 * @parent can.Model.static
		 *
		 * @signature `can.Model.makeFindAll: function(findAllData) -> findAll`
		 *
		 * Returns the external `findAll` method given the implemented [can.Model.findAllData findAllData] function.
		 *
		 * @params {can.Model.findAllData}
		 *
		 * [can.Model.findAll] is implemented with a `String`, [can.AjaxSettings ajax settings object], or
		 * [can.Model.findAllData findAllData] function. If it is implemented as
		 * a `String` or [can.AjaxSettings ajax settings object], those values are used
		 * to create a [can.Model.findAllData findAllData] function.
		 *
		 * The [can.Model.findAllData findAllData] function is passed to `makeFindAll`. `makeFindAll`
		 * should use `findAllData` internally to get the raw data for the request.
		 *
		 * @return {function(params,success,error):can.Deferred}
		 *
		 * Returns function that implements the external API of `findAll`.
		 *
		 * @body
		 *
		 * ## Use
		 *
		 * `makeFindAll` can be used to implement base models that perform special
		 * behavior. `makeFindAll` is passed a [can.Model.findAllData findAllData] function that retrieves raw
		 * data. It should return a function that when called, uses
		 * the findAllData function to get the raw data, convert them to model instances with
		 * [can.Model.models models].
		 *
		 * ## Caching
		 *
		 * The following uses `makeFindAll` to create a base `CachedModel`:
		 *
		 *     CachedModel = can.Model.extend({
		 *       makeFindAll: function(findAllData){
		 *         // A place to store requests
		 *         var cachedRequests = {};
		 *
		 *         return function(params, success, error){
		 *           // is this not cached?
		 *           if(! cachedRequests[JSON.stringify(params)] ) {
		 *             var self = this;
		 *             // make the request for data, save deferred
		 *             cachedRequests[JSON.stringify(params)] =
		 *               findAllData(params).then(function(data){
		 *                 // convert the raw data into instances
		 *                 return self.models(data)
		 *               })
		 *           }
		 *           // get the saved request
		 *           var def = cachedRequests[JSON.stringify(params)]
		 *           // hookup success and error
		 *           def.then(success,error)
		 *           return def;
		 *         }
		 *       }
		 *     },{})
		 *
		 * The following Todo model will never request the same list of todo's twice:
		 *
		 *     Todo = CachedModel({
		 *       findAll: "/todos"
		 *     },{})
		 *
		 *     // widget 1
		 *     Todo.findAll({})
		 *
		 *     // widget 2
		 *     Todo.findAll({})
		 */
		makeFindAll: makeGetterHandler("models"),
		/**
		 * @function can.Model.makeFindOne
		 * @parent can.Model.static
		 *
		 * @signature `can.Model.makeFindOne: function(findOneData) -> findOne`
		 *
		 * Returns the external `findOne` method given the implemented [can.Model.findOneData findOneData] function.
		 *
		 * @params {can.Model.findOneData}
		 *
		 * [can.Model.findOne] is implemented with a `String`, [can.AjaxSettings ajax settings object], or
		 * [can.Model.findOneData findOneData] function. If it is implemented as
		 * a `String` or [can.AjaxSettings ajax settings object], those values are used
		 * to create a [can.Model.findOneData findOneData] function.
		 *
		 * The [can.Model.findOneData findOneData] function is passed to `makeFindOne`. `makeFindOne`
		 * should use `findOneData` internally to get the raw data for the request.
		 *
		 * @return {function(params,success,error):can.Deferred}
		 *
		 * Returns function that implements the external API of `findOne`.
		 *
		 * @body
		 *
		 * ## Use
		 *
		 * `makeFindOne` can be used to implement base models that perform special
		 * behavior. `makeFindOne` is passed a [can.Model.findOneData findOneData] function that retrieves raw
		 * data. It should return a function that when called, uses
		 * the findOneData function to get the raw data, convert them to model instances with
		 * [can.Model.models models].
		 *
		 * ## Caching
		 *
		 * The following uses `makeFindOne` to create a base `CachedModel`:
		 *
		 *     CachedModel = can.Model.extend({
		 *       makeFindOne: function(findOneData){
		 *         // A place to store requests
		 *         var cachedRequests = {};
		 *
		 *         return function(params, success, error){
		 *           // is this not cached?
		 *           if(! cachedRequests[JSON.stringify(params)] ) {
		 *             var self = this;
		 *             // make the request for data, save deferred
		 *             cachedRequests[JSON.stringify(params)] =
		 *               findOneData(params).then(function(data){
		 *                 // convert the raw data into instances
		 *                 return self.model(data)
		 *               })
		 *           }
		 *           // get the saved request
		 *           var def = cachedRequests[JSON.stringify(params)]
		 *           // hookup success and error
		 *           def.then(success,error)
		 *           return def;
		 *         }
		 *       }
		 *     },{})
		 *
		 * The following Todo model will never request the same todo twice:
		 *
		 *     Todo = CachedModel({
		 *       findOne: "/todos/{id}"
		 *     },{})
		 *
		 *     // widget 1
		 *     Todo.findOne({id: 5})
		 *
		 *     // widget 2
		 *     Todo.findOne({id: 5})
		 */
		makeFindOne: makeGetterHandler("model"),
		makeCreate: createUpdateDestroyHandler,
		makeUpdate: createUpdateDestroyHandler
	};

	// Go through the response handlers and make the actual "make" methods.
	can.each(responseHandlers, function (method, name) {
		can.Model[name] = function (oldMethod) {
			return function () {
				var args = can.makeArray(arguments),
					// If args[1] is a function, we were only passed one argument before success and failure callbacks.
					oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2),
					// Call the AJAX method (`findAll` or `update`, etc.) and pipe it through the response handler from above.
					def = pipe(oldMethod.apply(this, oldArgs), this, method);

				def.then(args[0], args[1]);
				return def;
			};
		};
	});

	// ## can.Model.created, can.Model.updated, and can.Model.destroyed
	// Livecycle methods for models.
	can.each([
		/**
		 * @function can.Model.prototype.created created
		 * @hide
		 * Called by save after a new instance is created.  Publishes 'created'.
		 * @param {Object} attrs
		 */
		"created",
		/**
		 * @function can.Model.prototype.updated updated
		 * @hide
		 * Called by save after an instance is updated.  Publishes 'updated'.
		 * @param {Object} attrs
		 */
		"updated",
		/**
		 * @function can.Model.prototype.destroyed destroyed
		 * @hide
		 * Called after an instance is destroyed.
		 *   - Publishes "shortName.destroyed".
		 *   - Triggers a "destroyed" event on this model.
		 *   - Removes the model from the global list if its used.
		 *
		 */
		"destroyed"
	], function (funcName) {
		// Each of these is pretty much the same, except for the events they trigger.
		can.Model.prototype[funcName] = function (attrs) {
			var stub,
				constructor = this.constructor;

			// Update attributes if attributes have been passed
			stub = attrs && typeof attrs === 'object' && this.attr(attrs.attr ? attrs.attr() : attrs);

			// triggers change event that bubble's like
			// handler( 'change','1.destroyed' ). This is used
			// to remove items on destroyed from Model Lists.
			// but there should be a better way.
			can.dispatch.call(this, {type:"change", target: this}, [funcName]);

		

			// Call event on the instance's Class
			can.dispatch.call(constructor, funcName, [this]);
		};
	});
	

	// # can.Model.List
	// Model Lists are just like `Map.List`s except that when their items are
	// destroyed, they automatically get removed from the List.
	var ML = can.Model.List = can.List.extend({
		// ## can.Model.List.setup
		// On change or a nested named event, setup change bubbling.
		// On any other type of event, setup "destroyed" bubbling.
		_bubbleRule: function(eventName, list) {
			return can.List._bubbleRule(eventName, list) || "destroyed";
		}
	},{
		setup: function (params) {
			// If there was a plain object passed to the List constructor,
			// we use those as parameters for an initial findAll.
			if (can.isPlainObject(params) && !can.isArray(params)) {
				can.List.prototype.setup.apply(this);
				this.replace(can.isDeferred(params) ? params : this.constructor.Map.findAll(params));
			} else {
				// Otherwise, set up the list like normal.
				can.List.prototype.setup.apply(this, arguments);
			}
			this._init = 1;
			this.bind('destroyed', can.proxy(this._destroyed, this));
			delete this._init;
		},
		_destroyed: function (ev, attr) {
			if (/\w+/.test(attr)) {
				var index;
				while((index = this.indexOf(ev.target)) > -1) {
					this.splice(index, 1);
				}
			}
		}
	});

	return can.Model;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view',["can/util/library"], function (can) {

	var isFunction = can.isFunction,
		makeArray = can.makeArray,
		// Used for hookup `id`s.
		hookupId = 1;

	// internal utility methods
	// ------------------------

	// ##### makeRenderer
	/**
	 * @hide
	 * Rendering function factory method
	 * @param textRenderer
	 * @returns {renderer}
	 */
	var makeRenderer = function(textRenderer) {
		var renderer = function() {
			return $view.frag(textRenderer.apply(this, arguments));
		};
		renderer.render = function() {
			return textRenderer.apply(textRenderer, arguments);
		};
		return renderer;
	};

	// ##### checkText
	// Makes sure there's a template, if not, have `steal` provide a warning.
	var checkText = function (text, url) {
		if (!text.length) {

			// _removed if not used as a steal module_

		

			throw "can.view: No template or empty template:" + url;
		}
	};

	// ##### get
	// get a deferred renderer for provided url
	/**
	 * @hide
	 * @function get
	 * @param {String | Object} obj url string or object with url property
	 * @param {Boolean} async If the ajax request should be asynchronous.
	 * @returns {can.Deferred} a `view` renderer deferred.
	 */
	var	get = function (obj, async) {
		var url = typeof obj === 'string' ? obj : obj.url,
			suffix = (obj.engine && '.' + obj.engine) || url.match(/\.[\w\d]+$/),
			type,
		// If we are reading a script element for the content of the template,
		// `el` will be set to that script element.
			el,
		// A unique identifier for the view (used for caching).
		// This is typically derived from the element id or
		// the url for the template.
			id;

		//If the url has a #, we assume we want to use an inline template
		//from a script element and not current page's HTML
		if (url.match(/^#/)) {
			url = url.substr(1);
		}
		// If we have an inline template, derive the suffix from the `text/???` part.
		// This only supports `<script>` tags.
		if (el = document.getElementById(url)) {
			suffix = '.' + el.type.match(/\/(x\-)?(.+)/)[2];
		}

		// If there is no suffix, add one.
		if (!suffix && !$view.cached[url]) {
			url += suffix = $view.ext;
		}

		// if the suffix was derived from the .match() operation, pluck out the first value
		if (can.isArray(suffix)) {
			suffix = suffix[0];
		}

		// Convert to a unique and valid id.
		id = $view.toId(url);

		// If an absolute path, use `steal`/`require` to get it.
		// You should only be using `//` if you are using an AMD loader like `steal` or `require` (not almond).
		if (url.match(/^\/\//)) {
			url = url.substr(2);
			url = !window.steal ?
				url :
				steal.config()
					.root.mapJoin("" + steal.id(url));
		}

		// Localize for `require` (not almond)
		if (window.require) {
			if (require.toUrl) {
				url = require.toUrl(url);
			}
		}

		// Set the template engine type.
		type = $view.types[suffix];

		// If it is cached,
		if ($view.cached[id]) {
			// Return the cached deferred renderer.
			return $view.cached[id];

			// Otherwise if we are getting this from a `<script>` element.
		} else if (el) {
			// Resolve immediately with the element's `innerHTML`.
			return $view.registerView(id, el.innerHTML, type);
		} else {
			// Make an ajax request for text.
			var d = new can.Deferred();
			can.ajax({
				async: async,
				url: url,
				dataType: 'text',
				error: function (jqXHR) {
					checkText('', url);
					d.reject(jqXHR);
				},
				success: function (text) {
					// Make sure we got some text back.
					checkText(text, url);
					$view.registerView(id, text, type, d);
				}
			});
			return d;
		}
	};
	// ##### getDeferreds
	// Gets an `array` of deferreds from an `object`.
	// This only goes one level deep.
	/**
	 * @hide
	 * @param {Object|can.Deferred} data
	 * @returns {Array} deferred objects
	 */
	var getDeferreds = function (data) {
		var deferreds = [];

		// pull out deferreds
		if (can.isDeferred(data)) {
			return [data];
		} else {
			for (var prop in data) {
				if (can.isDeferred(data[prop])) {
					deferreds.push(data[prop]);
				}
			}
		}
		return deferreds;
	};

	// ##### usefulPart
	// Gets the useful part of a resolved deferred.
	// When a jQuery.when is resolved, it returns an array to each argument.
	// Reference ($.when)[https://api.jquery.com/jQuery.when/]
	// This is for `model`s and `can.ajax` that resolve to an `array`.
	/**
	 * @hide
	 * @function usefulPart
	 * @param {Array|*} resolved
	 * @returns {*}
	 */
	var usefulPart = function (resolved) {
		return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved;
	};

	// #### can.view
	//defines $view for internal use, can.template for backwards compatibility
	/**
	 * @add can.view
	 */
	var $view = can.view = can.template = function (view, data, helpers, callback) {
		// If helpers is a `function`, it is actually a callback.
		if (isFunction(helpers)) {
			callback = helpers;
			helpers = undefined;
		}
		var result;
		// Get the result, if a renderer function is passed in, then we just use that to render the data
		if( isFunction(view) ) {
			result = view(data, helpers, callback);
		} else {
			result = $view.renderAs("fragment",view, data, helpers, callback);
		}

		return result;
	};

	// can.view methods
	// --------------------------
	can.extend($view, {
		// ##### frag
		// creates a fragment and hooks it up all at once
		/**
		 * @function can.view.frag frag
		 * @parent can.view.static
		 */
		frag: function (result, parentNode) {
			return $view.hookup($view.fragment(result), parentNode);
		},

		// #### fragment
		// this is used internally to create a document fragment, insert it,then hook it up
		fragment: function (result) {
			if(typeof result !== "string" && result.nodeType === 11) {
				return result;
			}
			var frag = can.buildFragment(result, document.body);
			// If we have an empty frag...
			if (!frag.childNodes.length) {
				frag.appendChild(document.createTextNode(''));
			}
			return frag;
		},

		// ##### toId
		// Convert a path like string into something that's ok for an `element` ID.
		toId: function (src) {
			return can.map(src.toString()
				.split(/\/|\./g), function (part) {
					// Dont include empty strings in toId functions
					if (part) {
						return part;
					}
				})
				.join('_');
		},
		// ##### toStr
        // convert argument to a string
		toStr: function(txt){
			return txt == null ? "" : ""+txt;
		},

		// ##### hookup
		// attach the provided `fragment` to `parentNode`
		/**
		 * @hide
		 * hook up a fragment to its parent node
		 * @param fragment
		 * @param parentNode
		 * @returns {*}
		 */
		hookup: function (fragment, parentNode) {
			var hookupEls = [],
				id,
				func;

			// Get all `childNodes`.
			can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function (node) {
				if (node.nodeType === 1) {
					hookupEls.push(node);
					hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
				}
			});

			// Filter by `data-view-id` attribute.
			can.each(hookupEls, function (el) {
				if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
					func(el, parentNode, id);
					delete $view.hookups[id];
					el.removeAttribute('data-view-id');
				}
			});

			return fragment;
		},

		// `hookups` keeps list of pending hookups, ie fragments to attach to a parent node
		/**
		 * @property hookups
		 * @hide
		 * A list of pending 'hookups'
		 */
		hookups: {},

		// `hook` factory method for hookup function inserted into templates
		// hookup functions are called after the html is rendered to the page
		// only implemented by EJS templates.
		/**
		 * @description Create a hookup to insert into templates.
		 * @function can.view.hook hook
		 * @parent can.view.static
		 * @signature `can.view.hook(callback)`
		 * @param {Function} callback A callback function to be called with the element.
		 *
		 * @body
		 * Registers a hookup function that can be called back after the html is
		 * put on the page.  Typically this is handled by the template engine.  Currently
		 * only EJS supports this functionality.
		 *
		 *     var id = can.view.hook(function(el){
		 *            //do something with el
		 *         }),
		 *         html = "<div data-view-id='"+id+"'>"
		 *     $('.foo').html(html);
		 */
		hook: function (cb) {
			$view.hookups[++hookupId] = cb;
			return ' data-view-id=\'' + hookupId + '\'';
		},

		/**
		 * @hide
		 * @property {Object} can.view.cached view
		 * @parent can.view
		 * Cached are put in this object
		 */
		cached: {},
		cachedRenderers: {},

		// cache view templates resolved via XHR on the client
		/**
		 * @property {Boolean} can.view.cache cache
		 * @parent can.view.static
		 * By default, views are cached on the client.  If you'd like the
		 * the views to reload from the server, you can set the `cache` attribute to `false`.
		 *
		 *	//- Forces loads from server
		 *	can.view.cache = false;
		 *
		 */
		cache: true,

		// ##### register
		// given an info object, register a template type
		// different templating solutions produce strings or document fragments via their renderer function
		/**
		 * @function can.view.register register
		 * @parent can.view.static
		 * @description Register a templating language.
		 * @signature `can.view.register(info)`
		 * @param {{}} info Information about the templating language.
		 * @option {String} plugin The location of the templating language's plugin.
		 * @option {String} suffix Files with this suffix will use this templating language's plugin by default.
		 * @option {function} renderer A function that returns a function that, given data, will render the template with that data.
		 * The __renderer__ function receives the id of the template and the text of the template.
		 * @option {function} script A function that returns the string form of the processed template.
		 *
		 * @body
		 * Registers a template engine to be used with
		 * view helpers and compression.
		 *
		 * ## Example
		 *
		 * @codestart
		 * can.View.register({
		 *	suffix : "tmpl",
		 *  plugin : "jquery/view/tmpl",
		 *	renderer: function( id, text ) {
		 *	return function(data){
		 *		return jQuery.render( text, data );
		 *		}
		 *	},
		 *	script: function( id, text ) {
		 *	var tmpl = can.tmpl(text).toString();
		 *	return "function(data){return ("+
		 *			tmpl+
		 *			").call(jQuery, jQuery, data); }";
		 *	}
		 * })
		 * @codeend
		 */
		register: function (info) {
			this.types['.' + info.suffix] = info;

			// _removed if not used as a steal module_

		

			can[info.suffix] = $view[info.suffix] = function (id, text) {
				var renderer,
					renderFunc;
				// If there is no text, assume id is the template text, so return a nameless renderer.
				if (!text) {
					renderFunc = function(){
						if(!renderer){
							// if the template has a fragRenderer already, just return that.
							if(info.fragRenderer) {
								renderer = info.fragRenderer(null, id);
							} else {
								renderer = makeRenderer(info.renderer(null, id));
							}
						}
						return renderer.apply(this, arguments);
					};
					renderFunc.render = function() {
						var textRenderer = info.renderer(null, id);
						return textRenderer.apply(textRenderer, arguments);
					};
					return renderFunc;
				}
				var registeredRenderer = function(){
					if(!renderer){
						if(info.fragRenderer) {
							renderer = info.fragRenderer(id, text);
						} else {
							renderer = info.renderer(id, text);
						}
					}
					return renderer.apply(this, arguments);
				};
				if(info.fragRenderer) {
					return $view.preload( id, registeredRenderer );
				} else {
					return $view.preloadStringRenderer(id, registeredRenderer);
				}

			};

		},

		//registered view types
		types: {},

		/**
		 * @property {String} can.view.ext ext
		 * @parent can.view.static
		 * The default suffix to use if none is provided in the view's url.
		 * This is set to `.ejs` by default.
		 *
		 *	// Changes view ext to 'txt'
		 *	can.view.ext = 'txt';
		 *
		 */
		ext: ".ejs",

		/**
		 * Returns the text from a script tag
		 * @hide
		 * @param {Object} type
		 * @param {Object} id
		 * @param {Object} src
		 */
		registerScript: function (type, id, src) {
			return 'can.view.preloadStringRenderer(\'' + id + '\',' + $view.types['.' + type].script(id, src) + ');';
		},

		/**
		 * @hide
		 * Called by a production script to pre-load a fragment renderer function
		 * into the view cache.
		 * @param {String} id
		 * @param {Function} renderer
		 */
		preload: function (id, renderer) {
			var def = $view.cached[id] = new can.Deferred()
				.resolve(function (data, helpers) {
					return renderer.call(data, data, helpers);
				});

			// set cache references (otherwise preloaded recursive views won't recurse properly)
			def.__view_id = id;
			$view.cachedRenderers[id] = renderer;

			return renderer;
		},

		/**
		 * @hide
		 * Called by a production script to pre-load a string renderer function
		 * into the view cache.
		 * @param id
		 * @param stringRenderer
		 * @returns {*}
		 */
		preloadStringRenderer: function(id, stringRenderer) {
			return this.preload(id, makeRenderer(stringRenderer) );
		},

		// #### renderers
		// ---------------
		// can.view's primary purpose is to load templates (from strings or filesystem) and render them
		//
		// can.view supports two different forms of rendering systems
		//
		// mustache templates return a string based rendering function

		// stache (or other fragment based templating systems) return a document fragment, so 'hookup' steps are not required
		//
		// ##### render
		//
		/**
		 * @function can.view.render render
		 * @parent can.view.static
		 * @description Render a template.
		 * @signature `can.view.render(template[, callback])`
		 * @param {String|Object} view The path of the view template or a view object.
		 * @param {Function} [callback] A function executed after the template has been processed.
		 * @return {Function|can.Deferred} A renderer function to be called with data and helpers
		 * or a Deferred that resolves to a renderer function.
		 *
		 * @signature `can.view.render(template, data[, [helpers,] callback])`
		 * @param {String|Object} view The path of the view template or a view object.
		 * @param {Object} [data] The data to populate the template with.
		 * @param {Object.<String, function>} [helpers] Helper methods referenced in the template.
		 * @param {Function} [callback] A function executed after the template has been processed.
		 * @return {String|can.Deferred} The template with interpolated data in string form
		 * or a Deferred that resolves to the template with interpolated data.
		 *
		 * @body
		 * `can.view.render(view, [data], [helpers], callback)` returns the rendered markup produced by the corresponding template
		 * engine as String. If you pass a deferred object in as data, render returns
		 * a deferred resolving to the rendered markup.
		 *
		 * `can.view.render` is commonly used for sub-templates.
		 *
		 * ## Example
		 *
		 * _welcome.ejs_ looks like:
		 *
		 *     <h1>Hello <%= hello %></h1>
		 *
		 * Render it to a string like:
		 *
		 *     can.view.render("welcome.ejs",{hello: "world"})
		 *       //-> <h1>Hello world</h1>
		 *
		 * ## Use as a Subtemplate
		 *
		 * If you have a template like:
		 *
		 *     <ul>
		 *       <% list(items, function(item){ %>
		 *         <%== can.view.render("item.ejs",item) %>
		 *       <% }) %>
		 *     </ul>
		 *
		 * ## Using renderer functions
		 *
		 * If you only pass the view path, `can.view will return a renderer function that can be called with
		 * the data to render:
		 *
		 *     var renderer = can.view.render("welcome.ejs");
		 *     // Do some more things
		 *     renderer({hello: "world"}) // -> Document Fragment
		 *
		 */
		//call `renderAs` with a hardcoded string, as view.render
		// always operates against resolved template files or hardcoded strings
		render: function (view, data, helpers, callback) {
			return can.view.renderAs("string",view, data, helpers, callback);
		},

		// ##### renderTo
		//
		/**
		 * @hide
		 * @function renderTo
		 * @param {String} format
		 * @param {Function} renderer
		 * @param data
		 * @param {Object} helpers helper methods for this template
		 * @returns {*}
		 */
		renderTo: function(format, renderer, data, helpers){
			return (format === "string" && renderer.render ? renderer.render : renderer)(data, helpers);
		},

		/**
		 * @hide
		 *
		 * @param format
		 * @param view
		 * @param data
		 * @param helpers
		 * @param callback
		 * @returns {*}
		 */
		renderAs: function (format, view, data, helpers, callback) {
			// If helpers is a `function`, it is actually a callback.
			if (isFunction(helpers)) {
				callback = helpers;
				helpers = undefined;
			}

			// See if we got passed any deferreds.
			var deferreds = getDeferreds(data);
			var reading, deferred, dataCopy, async, response;
			if (deferreds.length) {
				// Does data contain any deferreds?
				// The deferred that resolves into the rendered content...
				deferred = new can.Deferred();
				dataCopy = can.extend({}, data);

				// Add the view request to the list of deferreds.
				deferreds.push(get(view, true));
				// Wait for the view and all deferreds to finish...
				can.when.apply(can, deferreds)
					.then(function (resolved) {
						// Get all the resolved deferreds.
						var objs = makeArray(arguments),
							// Renderer is the last index of the data.
							renderer = objs.pop(),
							// The result of the template rendering with data.
							result;

						// Make data look like the resolved deferreds.
						if (can.isDeferred(data)) {
							dataCopy = usefulPart(resolved);
						} else {
							// Go through each prop in data again and
							// replace the defferreds with what they resolved to.
							for (var prop in data) {
								if (can.isDeferred(data[prop])) {
									dataCopy[prop] = usefulPart(objs.shift());
								}
							}
						}

						// Get the rendered result.
						result = can.view.renderTo(format, renderer, dataCopy, helpers);

						// Resolve with the rendered view.
						deferred.resolve(result, dataCopy);

						// If there's a `callback`, call it back with the result.
						if (callback) {
							callback(result, dataCopy);
						}
					}, function () {
						deferred.reject.apply(deferred, arguments);
					});
				// Return the deferred...
				return deferred;
			} else {
				// get is called async but in 
				// ff will be async so we need to temporarily reset
				reading = can.__clearReading();

				// If there's a `callback` function
				async = isFunction(callback);
				// Get the `view` type
				deferred = get(view, async);

				if (reading) {
					can.__setReading(reading);
				}

				// If we are `async`...
				if (async) {
					// Return the deferred
					response = deferred;
					// And fire callback with the rendered result.
					deferred.then(function (renderer) {
						callback(data ? can.view.renderTo(format, renderer, data, helpers) : renderer);
					});
				} else {
					// if the deferred is resolved, call the cached renderer instead
					// this is because it's possible, with recursive deferreds to
					// need to render a view while its deferred is _resolving_.  A _resolving_ deferred
					// is a deferred that was just resolved and is calling back it's success callbacks.
					// If a new success handler is called while resoliving, it does not get fired by
					// jQuery's deferred system.  So instead of adding a new callback
					// we use the cached renderer.
					// We also add __view_id on the deferred so we can look up it's cached renderer.
					// In the future, we might simply store either a deferred or the cached result.
					if (deferred.state() === 'resolved' && deferred.__view_id) {
						var currentRenderer = $view.cachedRenderers[deferred.__view_id];
						return data ? can.view.renderTo(format, currentRenderer, data, helpers) : currentRenderer;
					} else {
						// Otherwise, the deferred is complete, so
						// set response to the result of the rendering.
						deferred.then(function (renderer) {
							response = data ? can.view.renderTo(format, renderer, data, helpers) : renderer;
						});
					}
				}

				return response;
			}
		},
		
		/**
		 * @hide
		 * Registers a view with `cached` object.  This is used
		 * internally by this class and Mustache to hookup views.
		 * @param  {String} id
		 * @param  {String} text
		 * @param  {String} type
		 * @param  {can.Deferred} def
		 */
		registerView: function (id, text, type, def) {
			// Get the renderer function.
			var info = (typeof type === "object" ? type :  $view.types[type || $view.ext]),
				renderer;
			if(info.fragRenderer) {
				renderer = info.fragRenderer(id, text);
			} else {
				renderer = makeRenderer( info.renderer(id, text) );
			}
			
			def = def || new can.Deferred();

			// Cache if we are caching.
			if ($view.cache) {
				$view.cached[id] = def;
				def.__view_id = id;
				$view.cachedRenderers[id] = renderer;
			}

			// Return the objects for the response's `dataTypes`
			// (in this case view).
			return def.resolve(renderer);
		}
	});

	// _removed if not used as a steal module_



	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/compute',["can/util/library", "can/util/bind", "can/util/batch"], function (can, bind) {

	// ## Reading Helpers
	//
	// The following methods are used to call a function that relies on
	// observable data and to track the observable events which should 
	// be listened to when changes occur.
	// To do this, [`can.__reading(observable, event)`](#can-__reading) is called to
	// "broadcast" the corresponding event on each read.
	// 
	// ### Observed
	//
	// An "Observed" is an object of observable objects and events that
	// a function relies on. These objects and events must be listened to
	// in order to determine when to check a function for updates.
	// This looks like the following:
	//
	//     { 
	//       "map1|first": {obj: map, event: "first"},
	//       "map1|last" : {obj: map, event: "last"}
	//     }
	// 
	// Each object-event pair is mapped so no duplicates will be listed.

	// ### State
	// 
	// `can.__read` may call a function that calls `can.__read` again. For
	// example, a compute can read another compute. To track each compute's
	// `Observed` object (containing observable objects and events), we maintain
	// a stack of Observed values for each call to `__read`.
	var stack = [];

	// ### can.__read
	//
	// With a given function and context, calls the function
	// and returns the resulting value of the function as well
	// as the observable properties and events that were read.
	can.__read = function (func, self) {

		// Add an object that `can.__read` will write to.
		stack.push({});

		var value = func.call(self);

		// Example return value:
		// `{value: 100, observed: Observed}`
		return {
			value: value,
			observed: stack.pop()
		};
	};

	// ### can.__reading
	//
	// When an observable value is read, it must call `can.__reading` to 
	// broadcast which object and event should be listened to.
	can.__reading = function (obj, event) {
		// Add the observable object and the event
		// that was read to the `Observed` object on
		// the stack.
		if (stack.length) {
			stack[stack.length-1][obj._cid + '|' + event] = {
				obj: obj,
				event: event + ""
			};
		}

	};

	// ### can.__clearReading
	//
	// Clears and returns the current observables.
	// This can be used to access a value without 
	// it being handled as a regular `read`.
	can.__clearReading = function () {
		if (stack.length) {
			var ret = stack[stack.length-1];
			stack[stack.length-1] = {};
			return ret;
		}
	};
	// Specifies current observables.
	can.__setReading = function (o) {
		if (stack.length) {
			stack[stack.length-1] = o;
		}
	};
	can.__addReading = function(o){
		if (stack.length) {
			can.simpleExtend(stack[stack.length-1], o);
		}
	};

	// ## Section Name

	// ### getValueAndBind
	//
	// Calls a function and sets up bindings to call `onchanged`
	// when events from its "Observed" object are triggered.
	// Removes bindings from `oldObserved` that are no longer needed.
	// - func - the function to call.
	// - context - the `this` of the function.
	// - oldObserved - an object that contains what has already been bound to
	// - onchanged - the function to call when any change occurs
	var getValueAndBind = function (func, context, oldObserved, onchanged) {
		// Call the function, get the value as well as the observed objects and events
		var info = can.__read(func, context),
			// The objects-event pairs that must be bound to
			newObserveSet = info.observed;
		// Go through what needs to be observed.
		bindNewSet(oldObserved, newObserveSet, onchanged);
		unbindOldSet(oldObserved, onchanged);
		
		return info;
	};
	// This will not be optimized.
	var bindNewSet = function(oldObserved, newObserveSet, onchanged){
		for(var name in newObserveSet ) {
			bindOrPreventUnbinding(oldObserved, newObserveSet, name, onchanged);
		}
	};
	// This will be optimized.
	var bindOrPreventUnbinding = function(oldObserved, newObserveSet, name, onchanged){
		if( oldObserved[name] ) {
			// After binding is set up, values
			// in `oldObserved` will be unbound. So if a name
			// has already be observed, remove from `oldObserved`
			// to prevent this.
			delete oldObserved[name];
		} else {
			// If current name has not been observed, listen to it.
			var obEv = newObserveSet[name];
			obEv.obj.bind(obEv.event, onchanged);
		}
	};
	// Iterate through oldObserved, looking for observe/attributes
	// that are no longer being bound and unbind them.
	var unbindOldSet = function(oldObserved, onchanged){
		for (var name in oldObserved) {
			var obEv = oldObserved[name];
			obEv.obj.unbind(obEv.event, onchanged);
		}
	};
	
	// ### updateOnChange
	//
	// Fires a change event when a compute's value changes
	var updateOnChange = function(compute, newValue, oldValue, batchNum){
		// Only trigger event when value has changed
		if (newValue !== oldValue) {
			can.batch.trigger(compute, batchNum ? {type: "change", batchNum: batchNum} : 'change', [
				newValue,
				oldValue
			]);
		}
	};
	
	// ###setupComputeHandlers
	//
	// Sets up handlers for a compute.
	// - compute - the compute to set up handlers for
	// - func - the getter/setter function for the compute
	// - context - the `this` for the compute
	// - setCachedValue - function for setting cached value
	//
	// Returns an object with `on` and `off` functions.
	var setupComputeHandlers = function(compute, func, context, setCachedValue) {
		var readInfo,
			onchanged,
			batchNum;
		
		return {
			// Set up handler for when the compute changes
			on: function(updater){
				if(!onchanged) {
					onchanged = function(ev){
						if (compute.bound && (ev.batchNum === undefined || ev.batchNum !== batchNum) ) {
							// Keep the old value
							var oldValue = readInfo.value;
								
							// Get the new value
							readInfo = getValueAndBind(func, context, readInfo.observed, onchanged);

							// Call the updater with old and new values
							updater(readInfo.value, oldValue, ev.batchNum);
						
							batchNum = batchNum = ev.batchNum;
						}
					};
				}
				
				readInfo = getValueAndBind(func, context, {}, onchanged);
				
				setCachedValue(readInfo.value);
				
				compute.hasDependencies = !can.isEmptyObject(readInfo.observed);
			},
			// Remove handler for the compute
			off: function(updater){
				for (var name in readInfo.observed) {
					var ob = readInfo.observed[name];
					ob.obj.unbind(ob.event, onchanged);
				}
			}
		};
	};
	var setupSingleBindComputeHandlers = function(compute, func, context, setCachedValue) {
		var readInfo,
			oldValue,
			onchanged,
			batchNum;
		
		return {
			// Set up handler for when the compute changes
			on: function(updater){
				if(!onchanged) {
					onchanged = function(ev){
						if (compute.bound && (ev.batchNum === undefined || ev.batchNum !== batchNum) ) {
							// Get the new value
							var reads = can.__clearReading();
							var newValue = func.call(context);
							can.__setReading(reads);
							// Call the updater with old and new values
							updater(newValue, oldValue, ev.batchNum);
							oldValue = newValue;
							batchNum = batchNum = ev.batchNum;
						}
					};
				}
				
				readInfo = getValueAndBind(func, context, {}, onchanged);
				oldValue = readInfo.value;
				
				setCachedValue(readInfo.value);
				
				compute.hasDependencies = !can.isEmptyObject(readInfo.observed);
			},
			// Remove handler for the compute
			off: function(updater){
				for (var name in readInfo.observed) {
					var ob = readInfo.observed[name];
					ob.obj.unbind(ob.event, onchanged);
				}
			}
		};
	};

	// ###isObserve
	//
	// Checks if an object is observable
	var isObserve = function (obj) {
		return obj instanceof can.Map || obj && obj.__get;
	},
	// Instead of calculating whether anything is listening every time,
	// use a function to do nothing (which may be overwritten)
		k = function () {};

	// ## Creating a can.compute
	//
	// A `can.compute` can be created by
	// - [Specifying the getterSeter function](#specifying-gettersetter-function)
	// - [Observing a property of an object](#observing-a-property-of-an-object)
	// - [Specifying an initial value and a setter function](#specifying-an-initial-value-and-a-setter)
	// - [Specifying an initial value and how to read, update, and listen to changes](#specifying-an-initial-value-and-a-settings-object)
	// - [Simply specifying an initial value](#specifying-only-a-value)
	can.compute = function (getterSetter, context, eventName, bindOnce) {
	// ### Setting up
		// Do nothing if getterSetter is already a compute
		if (getterSetter && getterSetter.isComputed) {
			return getterSetter;
		}
		// The computed object
		var computed,
			// The following functions are overwritten depending on how compute() is called
			// A method to set up listening
			on = k,
			// A method to teardown listening
			off = k,
			// Current cached value (valid only when bound is true)
			value,
			// How the value is read by default
			get = function () {
				return value;
			},
			// How the value is set by default
			set = function (newVal) {
				value = newVal;
			},
			setCached = set,
			// Save arguments for cloning
			args = [],
			// updater for when value is changed
			updater = function (newValue, oldValue, batchNum) {
				setCached(newValue);
				updateOnChange(computed, newValue,oldValue, batchNum);
			},
			// the form of the arguments
			form;
			
			
		// convert arguments to args to make V8 Happy
		for(var i = 0, arglen = arguments.length; i< arglen; i++){
			args[i] = arguments[i];
		}
		
		computed = function (newVal) {
			// If the computed function is called with arguments,
			// a value should be set
			if (arguments.length) {
				// Save a reference to the old value
				var old = value;
				// Setter may return the value if setter
				// is for a value maintained exclusively by this compute.
				var setVal = set.call(context, newVal, old);
				// If the computed function has dependencies,
				// return the current value
				if (computed.hasDependencies) {
					return get.call(context);
				}
				// Setting may not fire a change event, in which case
				// the value must be read
				if (setVal === undefined) {
					value = get.call(context);
				} else {
					value = setVal;
				}
				// Fire the change
				updateOnChange(computed, value, old);
				return value;
			} else {
				// Another compute may bind to this `computed`
				if (stack.length && computed.canReadForChangeEvent !== false) {

					// Tell the compute to listen to change on this computed
					// Use `can.__reading` to allow other compute to listen
					// for a change on this `computed`
					can.__reading(computed, 'change');
					// We are going to bind on this compute.
					// If we are not bound, we should bind so that
					// we don't have to re-read to get the value of this compute.
					if (!computed.bound) {
						can.compute.temporarilyBind(computed);
					}
				}
				// If computed is bound, use the cached value
				if (computed.bound) {
					return value;
				} else {
					return get.call(context);
				}
			}
		};
		// ###Specifying getterSetter function
		//
		// If `can.compute` is [called with a getterSetter function](http://canjs.com/docs/can.compute.html#sig_can_compute_getterSetter__context__),
		// override set and get
		if (typeof getterSetter === 'function') {
			// `can.compute(getterSetter, [context])`
			set = getterSetter;
			get = getterSetter;
			computed.canReadForChangeEvent = eventName === false ? false : true;
			
			var handlers = bindOnce ?
				setupSingleBindComputeHandlers(computed, getterSetter, context || this, setCached) :
				setupComputeHandlers(computed, getterSetter, context || this, setCached);
			on = handlers.on;
			off = handlers.off;
		
		// ###Observing a property of an object
		//
		// If `can.compute` is called with an 
		// [object, property name, and optional event name](http://canjs.com/docs/can.compute.html#sig_can_compute_object_propertyName__eventName__),
		// create a compute from a property of an object. This allows the
		// creation of a compute on objects that can be listened to with [`can.bind`](http://canjs.com/docs/can.bind.html)
		} else if (context) {
			if (typeof context === 'string') {
				// `can.compute(obj, "propertyName", [eventName])`
				var propertyName = context,
					isObserve = getterSetter instanceof can.Map;
				if (isObserve) {
					computed.hasDependencies = true;
					var handler;
					get = function(){
						return getterSetter.attr(propertyName);
					};
					set = function(newValue){
						getterSetter.attr(propertyName, newValue);
					};
					on = function(update){
						handler = function(ev, newVal,oldVal){
							update(newVal,oldVal, ev.batchNum);
						};
						getterSetter.bind( eventName || propertyName, handler);
						// Set the cached value
						value = can.__read(get).value;
					};
					off = function(update){
						getterSetter.unbind( eventName || propertyName, handler);
					};
				} else {
					get = function(){
						return getterSetter[propertyName];
					};
					set = function(newValue){
						getterSetter[propertyName] = newValue;
					};
					
					on = function(update){
						handler = function () {
							update(get(), value);
						};
						can.bind.call(getterSetter, eventName || propertyName, handler);
						// use can.__read because
						// we should not be indicating that some parent
						// reads this property if it happens to be binding on it
						value = can.__read(get)
							.value;
					};
					off = function(update){
						can.unbind.call(getterSetter, eventName || propertyName, handler);
					};
				}
			// ###Specifying an initial value and a setter
			//
			// If `can.compute` is called with an [initial value and a setter function](http://canjs.com/docs/can.compute.html#sig_can_compute_initialValue_setter_newVal_oldVal__),
			// a compute that can adjust incoming values is set up.
			} else {
				// `can.compute(initialValue, setter)`
				if (typeof context === 'function') {
					
					value = getterSetter;
					set = context;
					context = eventName;
					form = 'setter';
                    // ###Specifying an initial value and a settings object
                    //
                    // If `can.compute` is called with an [initial value and optionally a settings object](http://canjs.com/docs/can.compute.html#sig_can_compute_initialValue__settings__),
                    // a can.compute is created that can optionally specify how to read,
                    // update, and listen to changes in dependent values. This form of
                    // can.compute can be used to derive a compute that derives its
                    // value from any source
				} else {
					// `can.compute(initialValue,{get:, set:, on:, off:})`
					
					
					value = getterSetter;
					var options = context,
						oldUpdater = updater;
						
					context = options.context || options;
					get = options.get || get;
					set = options.set || function(){
						return value;
					};
					// This is a "hack" to allow async computes.
					if(options.fn) {
						var fn = options.fn,
							data;
						// make sure get is called with the newVal, but not setter
						get = function(){
							return fn.call(context, value);
						};
						// Check the number of arguments the 
						// async function takes.
						if(fn.length === 0) {
							
							data = setupComputeHandlers(computed, fn, context, setCached);

						} else if(fn.length === 1){
							data = setupComputeHandlers(computed, function(){
								return fn.call(context, value);
							}, context, setCached);
						} else {
							updater = function(newVal){
								if(newVal !== undefined) {
									oldUpdater(newVal, value);
								}
							};
							data = setupComputeHandlers(computed, function(){
								var res = fn.call(context, value, function(newVal){
									oldUpdater(newVal, value);
								});
								// If undefined is returned, don't update the value.
								return res !== undefined ? res : value;
							}, context, setCached);
						}
						
							
						on = data.on;
						off = data.off;
					} else {
						updater = function(){
							var newVal = get.call(context);
							oldUpdater(newVal, value);
						};
					}
					
					on = options.on || on;
					off = options.off || off;
				}
			}
		// ###Specifying only a value
		//
		// If can.compute is called with an initialValue only,
		// reads to this value can be observed.
		} else {
			// `can.compute(initialValue)`
			value = getterSetter;
		}
		can.cid(computed, 'compute');
		return can.simpleExtend(computed, {
			/**
			 * @property {Boolean} can.computed.isComputed compute.isComputed
			 * @parent can.compute
			 * Whether the value of the compute has been computed yet.
			 */
			isComputed: true,
			_bindsetup: function () {
				this.bound = true;
				// Set up live-binding
				// While binding, this should not count as a read
				var oldReading = can.__clearReading();
				on.call(this, updater);
				// Restore "Observed" for reading
				can.__setReading(oldReading);
			},
			_bindteardown: function () {
				off.call(this, updater);
				this.bound = false;
			},
			/**
			 * @function can.computed.bind compute.bind
			 * @parent can.compute
			 * @description Bind an event handler to a compute.
			 * @signature `compute.bind(eventType, handler)`
			 * @param {String} eventType The event to bind this handler to.
			 * The only event type that computes emit is _change_.
			 * @param {function({Object},{*},{*})} handler The handler to call when the event happens.
			 * The handler should have three parameters:
			 *
			 * - _event_ is the event object.
			 * - _newVal_ is the newly-computed value of the compute.
			 * - _oldVal_ is the value of the compute before it changed.
			 *
			 * `bind` lets you listen to a compute to know when it changes. It works just like
			 * can.Map's `[can.Map.prototype.bind bind]`:
			 * @codestart
			 * var tally = can.compute(0);
			 * tally.bind('change', function(ev, newVal, oldVal) {
			 *     console.log('The tally is now at ' + newVal + '.');
			 * });
			 *
			 * tally(tally() + 5); // The log reads:
			 *                     // 'The tally is now at 5.'
			 * @codeend
			 */
			bind: can.bindAndSetup,
			/**
			 * @function computed.unbind compute.unbind
			 * @parent can.compute
			 * @description Unbind an event handler from a compute.
			 * @signature `compute.unbind(eventType[, handler])`
			 * @param {String} eventType The type of event to unbind.
			 * The only event type available for computes is _change_.
			 * @param {function} [handler] If given, the handler to unbind.
			 * If _handler_ is not supplied, all handlers bound to _eventType_
			 * will be removed.
			 */
			unbind: can.unbindAndTeardown,
			clone: function (context) {
				if (context) {
					if (form === 'setter') {
						args[2] = context;
					} else {
						args[1] = context;
					}
				}
				return can.compute.apply(can, args);
			}
		});
	};
	// A list of temporarily bound computes
	var computes, unbindComputes = function () {
			for (var i = 0, len = computes.length; i < len; i++) {
				computes[i].unbind('change', k);
			}
			computes = null;
		};
	// Binds computes for a moment to retain their value and prevent caching
	can.compute.temporarilyBind = function (compute) {
		compute.bind('change', k);
		if (!computes) {
			computes = [];
			setTimeout(unbindComputes, 10);
		}
		computes.push(compute);
	};
	
	// Whether a compute is truthy
	can.compute.truthy = function (compute) {
		return can.compute(function () {
			var res = compute();
			if (typeof res === 'function') {
				res = res();
			}
			return !!res;
		});
	};
	can.compute.async = function(initialValue, asyncComputer, context){
		return can.compute(initialValue, {
			fn: asyncComputer,
			context: context
		});
	};
	// {map: new can.Map({first: "Justin"})}, ["map","first"]
	can.compute.read = function (parent, reads, options) {
		options = options || {};
		// `cur` is the current value.
		var cur = parent,
			type,
			// `prev` is the object we are reading from.
			prev,
			// `foundObs` did we find an observable.
			foundObs;
		for (var i = 0, readLength = reads.length; i < readLength; i++) {
			// Update what we are reading from.
			prev = cur;
			// Read from the compute. We can't read a property yet.
			if (prev && prev.isComputed) {
				if (options.foundObservable) {
					options.foundObservable(prev, i);
				}
				prev = cur = prev();
			}
			// Look to read a property from something.
			if (isObserve(prev)) {
				if (!foundObs && options.foundObservable) {
					options.foundObservable(prev, i);
				}
				foundObs = 1;
				// is it a method on the prototype?
				if (typeof prev[reads[i]] === 'function' && prev.constructor.prototype[reads[i]] === prev[reads[i]]) {
					// call that method
					if (options.returnObserveMethods) {
						cur = cur[reads[i]];
					} else if (reads[i] === 'constructor' && prev instanceof can.Construct) {
						cur = prev[reads[i]];
					} else {
						cur = prev[reads[i]].apply(prev, options.args || []);
					}
				} else {
					// use attr to get that value
					cur = cur.attr(reads[i]);
				}
			} else {
				// just do the dot operator
				cur = prev[reads[i]];
			}
			type = typeof cur;
			// If it's a compute, get the compute's value
			// unless we are at the end of the 
			if (cur && cur.isComputed && (!options.isArgument && i < readLength - 1)) {
				if (!foundObs && options.foundObservable) {
					options.foundObservable(prev, i + 1);
				}
				cur = cur();
			}
			// If it's an anonymous function, execute as requested
			else if (i < reads.length - 1 && type === 'function' && options.executeAnonymousFunctions && !(can.Construct && cur.prototype instanceof can.Construct)) {
				cur = cur();
			}
			// if there are properties left to read, and we don't have an object, early exit
			if (i < reads.length - 1 && (cur === null || type !== 'function' && type !== 'object')) {
				if (options.earlyExit) {
					options.earlyExit(prev, i, cur);
				}
				// return undefined so we know this isn't the right value
				return {
					value: undefined,
					parent: prev
				};
			}
		}
		// handle an ending function
		// unless it is a can.Construct-derived constructor
		if (typeof cur === 'function' && !(can.Construct && cur.prototype instanceof can.Construct) && !(can.route && cur === can.route)) {
			if (options.isArgument) {
				if (!cur.isComputed && options.proxyMethods !== false) {
					cur = can.proxy(cur, prev);
				}
			} else {
				if (cur.isComputed && !foundObs && options.foundObservable) {
					options.foundObservable(cur, i);
				}
				cur = cur.call(prev);
			}
		}
		// if we don't have a value, exit early.
		if (cur === undefined) {
			if (options.earlyExit) {
				options.earlyExit(prev, i - 1);
			}
		}
		return {
			value: cur,
			parent: prev
		};
	};

	return can.compute;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/scope',["can/util/library", "can/construct", "can/map", "can/list", "can/view", "can/compute"], function (can) {

		// ## Helpers

		// Regex for escaped periods
		var escapeReg = /(\\)?\./g,
		// Regex for double escaped periods
			escapeDotReg = /\\\./g,
		// **getNames**
		// Returns array of names by splitting provided string by periods and single escaped periods.
		// ```getNames("a.b\.c.d\\.e") //-> ['a', 'b', 'c', 'd.e']```
			getNames = function (attr) {
				var names = [],
					last = 0;
				// Goes through attr string and places the characters found between the periods and single escaped periods into the
				// `names` array.  Double escaped periods are ignored.
				attr.replace(escapeReg, function (first, second, index) {
					/* If period is double escaped then leave in place */
					if (!second) {
						names.push(
							attr
								.slice(last, index)
								/* replaces double-escaped period with period */
								.replace(escapeDotReg, '.')
						);
						last = index + first.length;
					}
				});
				/* Adds last portion of attr to names array */
				names.push(
					attr
						.slice(last)
						/* replaces double-escaped period with period */
						.replace(escapeDotReg, '.')
				);
				return names;
			};

		/**
		 * @add can.view.Scope
		 */
		var Scope = can.Construct.extend(

			/**
			 * @static
			 */
			{
				// ## Scope.read
				// Scope.read was moved to can.compute.read
				// can.compute.read reads properties from a parent.  A much more complex version of getObject.
				read: can.compute.read
			},
			/**
			 * @prototype
			 */
			{
				init: function (context, parent) {
					this._context = context;
					this._parent = parent;
					this.__cache = {};
				},

				// ## Scope.prototype.attr
				// Reads a value from the current context or parent contexts.
				attr: function (key) {
					// Reads for whatever called before attr.  It's possible
					// that this.read clears them.  We want to restore them.
					var previousReads = can.__clearReading(),
						res = this.read(key, {
							isArgument: true,
							returnObserveMethods: true,
							proxyMethods: false
						}).value;
					can.__setReading(previousReads);
					return res;
				},

				// ## Scope.prototype.add
				// Creates a new scope and sets the current scope to be the parent.
				// ```
				// var scope = new can.view.Scope([{name:"Chris"}, {name: "Justin"}]).add({name: "Brian"});
				// scope.attr("name") //-> "Brian"
				// ```
				add: function (context) {
					if (context !== this._context) {
						return new this.constructor(context, this);
					} else {
						return this;
					}
				},

				// ## Scope.prototype.computeData
				// Finds the first location of the key in the scope and then provides a get-set compute that represents the key's value
				// and other information about where the value was found.
				computeData: function (key, options) {
					options = options || {
						args: []
					};
					var self = this,
						rootObserve,
						rootReads,
						computeData = {
							// computeData.compute returns a get-set compute that is tied to the first location of the provided
							// key in the context of the scope.
							compute: can.compute(function (newVal) {
								// **Compute setter**
								if (arguments.length) {
									if (rootObserve.isComputed && !rootReads.length) {
										rootObserve(newVal);
									} else {
										var last = rootReads.length - 1;
										can.compute.read(rootObserve, rootReads.slice(0, last))
											.value.attr(rootReads[last], newVal);
									}
									// **Compute getter**
								} else {
									// If computeData has found the value for the key in the past in an observable then go directly to
									// the observable (rootObserve) that the value was found in the last time and return the new value.  This
									// is a huge performance gain for the fact that we aren't having to check the entire scope each time.
									if (rootObserve) {
										return can.compute.read(rootObserve, rootReads, options)
											.value;
									}
									// If the key has not already been located in a observable then we need to search the scope for the
									// key.  Once we find the key then we need to return it's value and if it is found in an observable
									// then we need to store the observable so the next time this compute is called it can grab the value
									// directly from the observable.
									var data = self.read(key, options);
									rootObserve = data.rootObserve;
									rootReads = data.reads;
									computeData.scope = data.scope;
									computeData.initialValue = data.value;
									computeData.reads = data.reads;
									computeData.root = rootObserve;
									return data.value;
								}
							})
						};
					return computeData;
				},

				// ## Scope.prototype.compute
				// Provides a get-set compute that represents a key's value.
				compute: function (key, options) {
					return this.computeData(key, options)
						.compute;
				},

				// ## Scope.prototype.read
				// Finds the first isntance of a key in the available scopes and returns the keys value along with the the observable the key
				// was found in, readsData and the current scope.
				/**
				 * @hide
				 * @param {can.mustache.key} attr A dot seperated path.  Use `"\."` if you have a property name that includes a dot.
				 * @param {can.view.Scope.readOptions} options that configure how this gets read.
				 * @return {{}}
				 * @option {Object} parent the value's immediate parent
				 * @option {can.Map|can.compute} rootObserve the first observable to read from.
				 * @option {Array<String>} reads An array of properties that can be used to read from the rootObserve to get the value.
				 * @option {*} value the found value
				 */
				read: function (attr, options) {
					// check if we should only look within current scope
					var stopLookup;
					if(attr.substr(0, 2) === './') {
						// set flag to halt lookup from walking up scope
						stopLookup = true;
						// stop lookup from checking parent scopes
						attr = attr.substr(2);
					}
					// check if we should be running this on a parent.
					else if (attr.substr(0, 3) === "../") {
						return this._parent.read(attr.substr(3), options);
					} else if (attr === "..") {
						return {
							value: this._parent._context
						};
					} else if (attr === "." || attr === "this") {
						return {
							value: this._context
						};
					}

					// Array of names from splitting attr string into names.  ```"a.b\.c.d\\.e" //-> ['a', 'b', 'c', 'd.e']```
					var names = attr.indexOf('\\.') === -1 ?
							// Reference doesn't contain escaped periods
							attr.split('.')
							// Reference contains escaped periods ```(`a.b\.c.foo` == `a["b.c"].foo)```
							: getNames(attr),
					// The current context (a scope is just data and a parent scope).
						context,
					// The current scope.
						scope = this,
					// While we are looking for a value, we track the most likely place this value will be found.
					// This is so if there is no me.name.first, we setup a listener on me.name.
					// The most likely candidate is the one with the most "read matches" "lowest" in the
					// context chain.
					// By "read matches", we mean the most number of values along the key.
					// By "lowest" in the context chain, we mean the closest to the current context.
					// We track the starting position of the likely place with `defaultObserve`.
						defaultObserve,
					// Tracks how to read from the defaultObserve.
						defaultReads = [],
					// Tracks the highest found number of "read matches".
						defaultPropertyDepth = -1,
					// `scope.read` is designed to be called within a compute, but
					// for performance reasons only listens to observables within one context.
					// This is to say, if you have me.name in the current context, but me.name.first and
					// we are looking for me.name.first, we don't setup bindings on me.name and me.name.first.
					// To make this happen, we clear readings if they do not find a value.  But,
					// if that path turns out to be the default read, we need to restore them.  This
					// variable remembers those reads so they can be restored.
						defaultComputeReadings,
					// Tracks the default's scope.
						defaultScope,
					// Tracks the first found observe.
						currentObserve,
					// Tracks the reads to get the value for a scope.
						currentReads;

					// Goes through each scope context provided until it finds the key (attr).  Once the key is found
					// then it's value is returned along with an observe, the current scope and reads.
					// While going through each scope context searching for the key, each observable found is returned and
					// saved so that either the observable the key is found in can be returned, or in the case the key is not
					// found in an observable the closest observable can be returned.

					while (scope) {
						context = scope._context;
						if (context !== null) {
							var data = can.compute.read(context, names, can.simpleExtend({
								/* Store found observable, incase we want to set it as the rootObserve. */
								foundObservable: function (observe, nameIndex) {
									currentObserve = observe;
									currentReads = names.slice(nameIndex);
								},
								// Called when we were unable to find a value.
								earlyExit: function (parentValue, nameIndex) {
									/* If this has more matching values */
									if (nameIndex > defaultPropertyDepth) {
										defaultObserve = currentObserve;
										defaultReads = currentReads;
										defaultPropertyDepth = nameIndex;
										defaultScope = scope;
										/* Clear and save readings so next attempt does not use these readings */
										defaultComputeReadings = can.__clearReading();
									}
								},
								// Execute anonymous functions found along the way
								executeAnonymousFunctions: true
							}, options));
							// **Key was found**, return value and location data
							if (data.value !== undefined) {
								return {
									scope: scope,
									rootObserve: currentObserve,
									value: data.value,
									reads: currentReads
								};
							}
						}
						// Prevent prior readings and then move up to the next scope.
						can.__clearReading();
						if(!stopLookup) {
							// Move up to the next scope.
							scope = scope._parent;
						} else {
							scope = null;
						}
					}

					// **Key was not found**, return undefined for the value.  Unless an observable was
					// found in the process of searching for the key, then return the most likely observable along with it's
					// scope and reads.

					if (defaultObserve) {
						can.__setReading(defaultComputeReadings);
						return {
							scope: defaultScope,
							rootObserve: defaultObserve,
							reads: defaultReads,
							value: undefined
						};
					} else {
						return {
							names: names,
							value: undefined
						};
					}
				}
			});

		can.view.Scope = Scope;
		return Scope;
	});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/elements',["can/util/library", "can/view"], function (can) {

	var selectsCommentNodes = (function(){
		return can.$(document.createComment('~')).length === 1;
	})();

	/**
	 * @property {Object} can.view.elements
	 * @parent can.view
	 *
	 * Provides helper methods for and information about the behavior
	 * of DOM elements.
	 */
	var elements = {
		tagToContentPropMap: {
			option: 'textContent' in document.createElement('option') ? 'textContent' : 'innerText',
			textarea: 'value'
		},
		/**
		 * @property {Object.<String,(String|Boolean|function)>} can.view.elements.attrMap
		 * @parent can.view.elements
		 *
		 *
		 * A mapping of
		 * special attributes to their JS property. For example:
		 *
		 *     "class" : "className"
		 *
		 * means get or set `element.className`. And:
		 *
		 *      "checked" : true
		 *
		 * means set `element.checked = true`.
		 *
		 *
		 * If the attribute name is not found, it's assumed to use
		 * `element.getAttribute` and `element.setAttribute`.
		 */
		// 3.0 TODO: remove
		attrMap: can.attr.map,
		// matches the attrName of a regexp
		attrReg: /([^\s=]+)[\s]*=[\s]*/,
		// 3.0 TODO: remove
		defaultValue: can.attr.defaultValue,
		// a map of parent element to child elements
		/**
		 * @property {Object.<String,String>} can.view.elements.tagMap
		 * @parent can.view.elements
		 *
		 * A mapping of parent node names to child node names that can be inserted within
		 * the parent node name.  For example: `table: "tbody"` means that
		 * if you want a placeholder element within a `table`, a `tbody` will be
		 * created.
		 */
		tagMap: {
			'': 'span',
			colgroup: 'col',
			table: 'tbody',
			tr: 'td',
			ol: 'li',
			ul: 'li',
			tbody: 'tr',
			thead: 'tr',
			tfoot: 'tr',
			select: 'option',
			optgroup: 'option'
		},
		// a tag's parent element
		reverseTagMap: {
			col: 'colgroup',
			tr: 'tbody',
			option: 'select',
			td: 'tr',
			th: 'tr',
			li: 'ul'
		},
		// Used to determine the parentNode if el is directly within a documentFragment
		getParentNode: function (el, defaultParentNode) {
			return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
		},
		// 3.0 TODO: remove
		setAttr: can.attr.set,
		// 3.0 TODO: remove
		getAttr: can.attr.get,
		// 3.0 TODO: remove
		removeAttr: can.attr.remove,
		// Gets a "pretty" value for something
		contentText: function (text) {
			if (typeof text === 'string') {
				return text;
			}
			// If has no value, return an empty string.
			if (!text && text !== 0) {
				return '';
			}
			return '' + text;
		},
		/**
		 * @function can.view.elements.after
		 * @parent can.view.elements
		 *
		 * Inserts newFrag after oldElements.
		 *
		 * @param {Array.<HTMLElement>} oldElements
		 * @param {DocumentFragment} newFrag
		 */
		after: function (oldElements, newFrag) {
			var last = oldElements[oldElements.length - 1];
			// Insert it in the `document` or `documentFragment`
			if (last.nextSibling) {
				can.insertBefore(last.parentNode, newFrag, last.nextSibling);
			} else {
				can.appendChild(last.parentNode, newFrag);
			}
		},
		/**
		 * @function can.view.elements.replace
		 * @parent can.view.elements
		 *
		 * Replaces `oldElements` with `newFrag`
		 *
		 * @param {Array.<HTMLElement>} oldElements
		 * @param {DocumentFragment} newFrag
		 */
		replace: function (oldElements, newFrag) {
			elements.after(oldElements, newFrag);
			if(can.remove(can.$(oldElements)).length < oldElements.length && !selectsCommentNodes) {
				can.each(oldElements, function(el) {
					if(el.nodeType === 8) {
						el.parentNode.removeChild(el);
					}
				});
			}
		}
	};

	can.view.elements = elements;

	return elements;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/callbacks',["can/util/library", "can/view"], function(can){


	var attr = can.view.attr = function (attributeName, attrHandler) {
		if(attrHandler) {
			if (typeof attributeName === "string") {
				attributes[attributeName] = attrHandler;
			} else {
				regExpAttributes.push({
					match: attributeName,
					handler: attrHandler
				});
			}
		} else {
			var cb = attributes[attributeName];
			if( !cb ) {
				
				for( var i = 0, len = regExpAttributes.length; i < len; i++) {
					var attrMatcher = regExpAttributes[i];
					if(attrMatcher.match.test(attributeName)) {
						cb = attrMatcher.handler;
						break;
					}
				}
			}
			return cb;
		}
	};

	var attributes = {},
		regExpAttributes = [],
		automaticCustomElementCharacters = /[-\:]/;

	var tag = can.view.tag = function (tagName, tagHandler) {
		if(tagHandler) {
			// if we have html5shive ... re-generate
			if (window.html5) {
				window.html5.elements += " " + tagName;
				window.html5.shivDocument();
			}
	
			tags[tagName.toLowerCase()] = tagHandler;
		} else {
			var cb = tags[tagName.toLowerCase()];
			if(!cb && automaticCustomElementCharacters.test(tagName)) {
				// empty callback for things that look like special tags
				cb = function(){};
			}
			return cb;
		}
		
	};
	var tags = {};
	
	can.view.callbacks = {
		_tags: tags,
		_attributes: attributes,
		_regExpAttributes: regExpAttributes,
		tag: tag,
		attr: attr,
		// handles calling back a tag callback
		tagHandler: function(el, tagName, tagData){
			var helperTagCallback = tagData.options.attr('tags.' + tagName),
				tagCallback = helperTagCallback || tags[tagName];
	
			// If this was an element like <foo-bar> that doesn't have a component, just render its content
			var scope = tagData.scope,
				res;
				
			if(tagCallback) {
				var reads = can.__clearReading();
				res = tagCallback(el, tagData);
				can.__setReading(reads);
			} else {
				res = scope;
			}
	
		
	
			// If the tagCallback gave us something to render with, and there is content within that element
			// render it!
			if (res && tagData.subtemplate) {
	
				if (scope !== res) {
					scope = scope.add(res);
				}
				var result = tagData.subtemplate(scope, tagData.options);
				var frag = typeof result === "string" ? can.view.frag(result) : result;
				can.appendChild(el, frag);
			}
		}
	};
	return can.view.callbacks;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/scanner',["can/view", "can/view/elements", "can/view/callbacks"], function (can, elements, viewCallbacks) {

	/**
	 * Helper(s)
	 */
	var newLine = /(\r|\n)+/g,
		notEndTag = /\//,
		// Escapes characters starting with `\`.
		clean = function (content) {
			return content
				.split('\\')
				.join("\\\\")
				.split("\n")
				.join("\\n")
				.split('"')
				.join('\\"')
				.split("\t")
				.join("\\t");
		},
		// Returns a tagName to use as a temporary placeholder for live content
		// looks forward ... could be slow, but we only do it when necessary
		getTag = function (tagName, tokens, i) {
			// if a tagName is provided, use that
			if (tagName) {
				return tagName;
			} else {
				// otherwise go searching for the next two tokens like "<",TAG
				while (i < tokens.length) {
					if (tokens[i] === "<" && !notEndTag.test(tokens[i + 1])) {
						return elements.reverseTagMap[tokens[i + 1]] || 'span';
					}
					i++;
				}
			}
			return '';
		},
		bracketNum = function (content) {
			return (--content.split("{")
				.length) - (--content.split("}")
				.length);
		},
		myEval = function (script) {
			eval(script);
		},
		attrReg = /([^\s]+)[\s]*=[\s]*$/,
		// Commands for caching.
		startTxt = 'var ___v1ew = [];',
		finishTxt = "return ___v1ew.join('')",
		put_cmd = "___v1ew.push(\n",
		insert_cmd = put_cmd,
		// Global controls (used by other functions to know where we are).
		// Are we inside a tag?
		htmlTag = null,
		// Are we within a quote within a tag?
		quote = null,
		// What was the text before the current quote? (used to get the `attr` name)
		beforeQuote = null,
		// Whether a rescan is in progress
		rescan = null,
		getAttrName = function () {
			var matches = beforeQuote.match(attrReg);
			return matches && matches[1];
		},
		// Used to mark where the element is.
		status = function () {
			// `t` - `1`.
			// `h` - `0`.
			// `q` - String `beforeQuote`.
			return quote ? "'" + getAttrName() + "'" : (htmlTag ? 1 : 0);
		},
		// returns the top of a stack
		top = function (stack) {
			return stack[stack.length - 1];
		},
		Scanner;

	/**
	 * @constructor can.view.Scanner
	 *
	 * can.view.Scanner is used to convert a template into a JavaScript function.  That
	 * function is called to produce a rendered result as a string. Often
	 * the rendered result will include data-view-id attributes on elements that
	 * will be processed after the template is used to create a document fragment.
	 *
	 *
	 * @param {{text: can.view.Scanner.text, tokens: Array<can.view.Scanner.token>, helpers: Array<can.view.Scanner.helpers>}}
	 */
	//
	/**
	 * @typedef {{0:String,}}
	 */

	can.view.Scanner = Scanner = function (options) {
		// Set options on self
		can.extend(this, {
			/**
			 * @typedef {{start: String, escape: String, scope: String, options: String}}  can.view.Scanner.text
			 */
			text: {},
			tokens: []
		}, options);
		// make sure it's an empty string if it's not
		this.text.options = this.text.options || "";

		// Cache a token lookup
		this.tokenReg = [];
		this.tokenSimple = {
			"<": "<",
			">": ">",
			'"': '"',
			"'": "'"
		};
		this.tokenComplex = [];
		this.tokenMap = {};
		for (var i = 0, token; token = this.tokens[i]; i++) {
			/**
			 * Token data structure (complex token and rescan function are optional):
			 * [
			 *	"token name",
			 *	"simple token or abbreviation",
			 *	/complex token regexp/,
			 *	function(content) {
			 *		// Rescan Function
			 *		return {
			 *			before: '\n',
			 *			content: content.trim(),
			 *			after: '\n'
			 *		}
			 * ]
			 */

			// Save complex mappings (custom regexp)
			if (token[2]) {
				this.tokenReg.push(token[2]);
				this.tokenComplex.push({
					abbr: token[1],
					re: new RegExp(token[2]),
					rescan: token[3]
				});
			}
			// Save simple mappings (string only, no regexp)
			else {
				this.tokenReg.push(token[1]);
				this.tokenSimple[token[1]] = token[0];
			}
			this.tokenMap[token[0]] = token[1];
		}

		// Cache the token registry.
		this.tokenReg = new RegExp("(" + this.tokenReg.slice(0)
			.concat(["<", ">", '"', "'"])
			.join("|") + ")", "g");
	};

	/**
	 * Extend can.View to add scanner support.
	 */
	Scanner.prototype = {
		// a default that can be overwritten
		helpers: [],

		scan: function (source, name) {
			var tokens = [],
				last = 0,
				simple = this.tokenSimple,
				complex = this.tokenComplex;

			source = source.replace(newLine, "\n");
			if (this.transform) {
				source = this.transform(source);
			}
			source.replace(this.tokenReg, function (whole, part) {
				// offset is the second to last argument
				var offset = arguments[arguments.length - 2];

				// if the next token starts after the last token ends
				// push what's in between
				if (offset > last) {
					tokens.push(source.substring(last, offset));
				}

				// push the simple token (if there is one)
				if (simple[whole]) {
					tokens.push(whole);
				}
				// otherwise lookup complex tokens
				else {
					for (var i = 0, token; token = complex[i]; i++) {
						if (token.re.test(whole)) {
							tokens.push(token.abbr);
							// Push a rescan function if one exists
							if (token.rescan) {
								tokens.push(token.rescan(part));
							}
							break;
						}
					}
				}

				// update the position of the last part of the last token
				last = offset + part.length;
			});

			// if there's something at the end, add it
			if (last < source.length) {
				tokens.push(source.substr(last));
			}

			var content = '',
				buff = [startTxt + (this.text.start || '')],
				// Helper `function` for putting stuff in the view concat.
				put = function (content, bonus) {
					buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
				},
				// A stack used to keep track of how we should end a bracket
				// `}`.
				// Once we have a `<%= %>` with a `leftBracket`,
				// we store how the file should end here (either `))` or `;`).
				endStack = [],
				// The last token, used to remember which tag we are in.
				lastToken,
				// The corresponding magic tag.
				startTag = null,
				// Was there a magic tag inside an html tag?
				magicInTag = false,
				// was there a special state
				specialStates = {
					attributeHookups: [],
					// a stack of tagHookups
					tagHookups: [],
					//last tag hooked up
					lastTagHookup: ''
				},
				// Helper `function` for removing tagHookups from the hookup stack
				popTagHookup = function() {
					// The length of tagHookups is the nested depth which can be used to uniquely identify custom tags of the same type
					specialStates.lastTagHookup = specialStates.tagHookups.pop() + specialStates.tagHookups.length;
				},
				// The current tag name.
				tagName = '',
				// stack of tagNames
				tagNames = [],
				// Pop from tagNames?
				popTagName = false,
				// Declared here.
				bracketCount,
				// in a special attr like src= or style=
				specialAttribute = false,

				i = 0,
				token,
				tmap = this.tokenMap,
				attrName;

			// Reinitialize the tag state goodness.
			htmlTag = quote = beforeQuote = null;
			for (;
				(token = tokens[i++]) !== undefined;) {
				if (startTag === null) {
					switch (token) {
					case tmap.left:
					case tmap.escapeLeft:
					case tmap.returnLeft:
						magicInTag = htmlTag && 1;
						/* falls through */
					case tmap.commentLeft:
						// A new line -- just add whatever content within a clean.
						// Reset everything.
						startTag = token;
						if (content.length) {
							put(content);
						}
						content = '';
						break;
					case tmap.escapeFull:
						// This is a full line escape (a line that contains only whitespace and escaped logic)
						// Break it up into escape left and right
						magicInTag = htmlTag && 1;
						rescan = 1;
						startTag = tmap.escapeLeft;
						if (content.length) {
							put(content);
						}
						rescan = tokens[i++];
						content = rescan.content || rescan;
						if (rescan.before) {
							put(rescan.before);
						}
						tokens.splice(i, 0, tmap.right);
						break;
					case tmap.commentFull:
						// Ignore full line comments.
						break;
					case tmap.templateLeft:
						content += tmap.left;
						break;
					case '<':
						// Make sure we are not in a comment.
						if (tokens[i].indexOf("!--") !== 0) {
							htmlTag = 1;
							magicInTag = 0;
						}

						content += token;

						break;
					case '>':
						htmlTag = 0;
						// content.substr(-1) doesn't work in IE7/8
						var emptyElement = (content.substr(content.length - 1) === "/" || content.substr(content.length - 2) === "--"),
							attrs = "";
						// if there was a magic tag
						// or it's an element that has text content between its tags,
						// but content is not other tags add a hookup
						// TODO: we should only add `can.EJS.pending()` if there's a magic tag
						// within the html tags.
						if (specialStates.attributeHookups.length) {
							attrs = "attrs: ['" + specialStates.attributeHookups.join("','") + "'], ";
							specialStates.attributeHookups = [];
						}
						// this is the > of a special tag
						// comparison to lastTagHookup makes sure the same custom tags can be nested
						if ((tagName + specialStates.tagHookups.length) !== specialStates.lastTagHookup && tagName === top(specialStates.tagHookups)) {
							// If it's a self closing tag (like <content/>) make sure we put the / at the end.
							if (emptyElement) {
								content = content.substr(0, content.length - 1);
							}
							// Put the start of the end
							buff.push(put_cmd,
								'"', clean(content), '"',
								",can.view.pending({tagName:'" + tagName + "'," + (attrs) + "scope: " + (this.text.scope || "this") + this.text.options);

							// if it's a self closing tag (like <content/>) close and end the tag
							if (emptyElement) {
								buff.push("}));");
								content = "/>";
								popTagHookup();
							}
							// if it's an empty tag	 
							else if (tokens[i] === "<" && tokens[i + 1] === "/" + tagName) {
								buff.push("}));");
								content = token;
								popTagHookup();
							} else {
								// it has content
								buff.push(",subtemplate: function(" + this.text.argNames + "){\n" + startTxt + (this.text.start || ''));
								content = '';
							}

						} else if (magicInTag || (!popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]]) || attrs) {
							// make sure / of /> is on the right of pending
							var pendingPart = ",can.view.pending({" + attrs + "scope: " + (this.text.scope || "this") + this.text.options + "}),\"";
							if (emptyElement) {
								put(content.substr(0, content.length - 1), pendingPart + "/>\"");
							} else {
								put(content, pendingPart + ">\"");
							}
							content = '';
							magicInTag = 0;
						} else {
							content += token;
						}

						// if it's a tag like <input/>
						if (emptyElement || popTagName) {
							// remove the current tag in the stack
							tagNames.pop();
							// set the current tag to the previous parent
							tagName = tagNames[tagNames.length - 1];
							// Don't pop next time
							popTagName = false;
						}
						specialStates.attributeHookups = [];
						break;
					case "'":
					case '"':
						// If we are in an html tag, finding matching quotes.
						if (htmlTag) {
							// We have a quote and it matches.
							if (quote && quote === token) {
								// We are exiting the quote.
								quote = null;
								// Otherwise we are creating a quote.
								// TODO: does this handle `\`?
								var attr = getAttrName();
								if (viewCallbacks.attr(attr)) {
									specialStates.attributeHookups.push(attr);
								}

								if (specialAttribute) {

									content += token;
									put(content);
									buff.push(finishTxt, "}));\n");
									content = "";
									specialAttribute = false;

									break;
								}

							} else if (quote === null) {
								quote = token;
								beforeQuote = lastToken;
								attrName = getAttrName();
								// TODO: check if there's magic!!!!
								if ((tagName === "img" && attrName === "src") || attrName === "style") {
									// put content that was before the attr name, but don't include the src=
									put(content.replace(attrReg, ""));
									content = "";

									specialAttribute = true;

									buff.push(insert_cmd, "can.view.txt(2,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt);
									put(attrName + "=" + token);
									break;
								}

							}
						}
						/* falls through */
					default:
						// Track the current tag
						if (lastToken === '<') {

							tagName = token.substr(0, 3) === "!--" ?
								"!--" : token.split(/\s/)[0];

							var isClosingTag = false,
								cleanedTagName;

							if (tagName.indexOf("/") === 0) {
								isClosingTag = true;
								cleanedTagName = tagName.substr(1);
							}

							if (isClosingTag) { // </tag>

								// when we enter a new tag, pop the tag name stack
								if (top(tagNames) === cleanedTagName) {
									// set tagName to the last tagName
									// if there are no more tagNames, we'll rely on getTag.
									tagName = cleanedTagName;
									popTagName = true;
								}
								// if we are in a closing tag of a custom tag
								if (top(specialStates.tagHookups) === cleanedTagName) {

									// remove the last < from the content
									put(content.substr(0, content.length - 1));

									// finish the "section"
									buff.push(finishTxt + "}}) );");
									// the < belongs to the outside
									content = "><";
									popTagHookup();
								}

							} else {
								if (tagName.lastIndexOf("/") === tagName.length - 1) {
									tagName = tagName.substr(0, tagName.length - 1);

								}

								if (tagName !== "!--" && (viewCallbacks.tag(tagName) )) {
									// if the content tag is inside something it doesn't belong ...
									if (tagName === "content" && elements.tagMap[top(tagNames)]) {
										// convert it to an element that will work
										token = token.replace("content", elements.tagMap[top(tagNames)]);
									}
									// we will hookup at the ending tag>
									specialStates.tagHookups.push(tagName);
								}

								tagNames.push(tagName);

							}

						}
						content += token;
						break;
					}
				} else {
					// We have a start tag.
					switch (token) {
					case tmap.right:
					case tmap.returnRight:
						switch (startTag) {
						case tmap.left:
							// Get the number of `{ minus }`
							bracketCount = bracketNum(content);

							// We are ending a block.
							if (bracketCount === 1) {
								// We are starting on. 
								buff.push(insert_cmd, 'can.view.txt(0,\'' + getTag(tagName, tokens, i) + '\',' + status() + ',this,function(){', startTxt, content);
								endStack.push({
									before: "",
									after: finishTxt + "}));\n"
								});
							} else {

								// How are we ending this statement?
								last = // If the stack has value and we are ending a block...
								endStack.length && bracketCount === -1 ? // Use the last item in the block stack.
								endStack.pop() : // Or use the default ending.
								{
									after: ";"
								};

								// If we are ending a returning block,
								// add the finish text which returns the result of the
								// block.
								if (last.before) {
									buff.push(last.before);
								}
								// Add the remaining content.
								buff.push(content, ";", last.after);
							}
							break;
						case tmap.escapeLeft:
						case tmap.returnLeft:
							// We have an extra `{` -> `block`.
							// Get the number of `{ minus }`.
							bracketCount = bracketNum(content);
							// If we have more `{`, it means there is a block.
							if (bracketCount) {
								// When we return to the same # of `{` vs `}` end with a `doubleParent`.
								endStack.push({
									before: finishTxt,
									after: "}));\n"
								});
							}

							var escaped = startTag === tmap.escapeLeft ? 1 : 0,
								commands = {
									insert: insert_cmd,
									tagName: getTag(tagName, tokens, i),
									status: status(),
									specialAttribute: specialAttribute
								};

							for (var ii = 0; ii < this.helpers.length; ii++) {
								// Match the helper based on helper
								// regex name value
								var helper = this.helpers[ii];
								if (helper.name.test(content)) {
									content = helper.fn(content, commands);

									// dont escape partials
									if (helper.name.source === /^>[\s]*\w*/.source) {
										escaped = 0;
									}
									break;
								}
							}

							// Handle special cases
							if (typeof content === 'object') {

								if (content.startTxt && content.end && specialAttribute) {
									buff.push(insert_cmd, "can.view.toStr( ",content.content, '() ) );');

								} else {

									if (content.startTxt) {
										buff.push(insert_cmd, "can.view.txt(\n" +
											(typeof status() === "string" || (content.escaped != null ? content.escaped : escaped)) + ",\n'" + tagName + "',\n" + status() + ",\nthis,\n");
									} else if (content.startOnlyTxt) {
										buff.push(insert_cmd, 'can.view.onlytxt(this,\n');
									}
									buff.push(content.content);
									if (content.end) {
										buff.push('));');
									}

								}

							} else if (specialAttribute) {

								buff.push(insert_cmd, content, ');');

							} else {
								// If we have `<%== a(function(){ %>` then we want
								// `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.

								buff.push(insert_cmd, "can.view.txt(\n" + (typeof status() === "string" || escaped) +
									",\n'" + tagName + "',\n" + status() + ",\nthis,\nfunction(){ " +
									(this.text.escape || '') +
									"return ", content,
									// If we have a block.
									bracketCount ?
									// Start with startTxt `"var _v1ew = [];"`.
									startTxt :
									// If not, add `doubleParent` to close push and text.
									"}));\n"
								);

								/*buff.push(insert_cmd, "can.view.txt(\n" +
									  + ",\n'" +
									  tagName + "',\n" +
									  status() +",\n" +
									  "this,\nfunction(){ " +
									  (this.text.escape || '') +
									  "return ", content,
									  // If we have a block.
									  bracketCount ?
									  // Start with startTxt `"var _v1ew = [];"`.
									  startTxt :
									  // If not, add `doubleParent` to close push and text.
									  "}));\n");*/

							}

							if (rescan && rescan.after && rescan.after.length) {
								put(rescan.after.length);
								rescan = null;
							}
							break;
						}
						startTag = null;
						content = '';
						break;
					case tmap.templateLeft:
						content += tmap.left;
						break;
					default:
						content += token;
						break;
					}
				}
				lastToken = token;
			}

			// Put it together...
			if (content.length) {
				// Should be `content.dump` in Ruby.
				put(content);
			}
			buff.push(";");
			var template = buff.join(''),
				out = {
					out: (this.text.outStart || "") + template + " " + finishTxt + (this.text.outEnd || "")
				};

			// Use `eval` instead of creating a function, because it is easier to debug.
			myEval.call(out, 'this.fn = (function(' + this.text.argNames + '){' + out.out + '});\r\n//# sourceURL=' + name + '.js');
			return out;
		}
	};

	// can.view.attr
	
	// This is called when there is a special tag
	can.view.pending = function (viewData) {
		// we need to call any live hookups
		// so get that and return the hook
		// a better system will always be called with the same stuff
		var hooks = can.view.getHooks();
		return can.view.hook(function (el) {
			can.each(hooks, function (fn) {
				fn(el);
			});
			viewData.templateType = "legacy";
			if (viewData.tagName) {
				viewCallbacks.tagHandler(el, viewData.tagName, viewData);
			}

			can.each(viewData && viewData.attrs || [], function (attributeName) {
				viewData.attributeName = attributeName;
				var callback = viewCallbacks.attr(attributeName);
				if(callback) {
					callback(el, viewData);
				}
			});

		});

	};

	can.view.tag("content", function (el, tagData) {
		return tagData.scope;
	});

	can.view.Scanner = Scanner;

	return Scanner;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/node_lists',["can/util/library", "can/view/elements"], function (can) {
	// ## Helpers
	// Some browsers don't allow expando properties on HTMLTextNodes
	// so let's try to assign a custom property, an 'expando' property.
	// We use this boolean to determine how we are going to hold on
	// to HTMLTextNode within a nodeList.  More about this in the 'id'
	// function.
	var canExpando = true;
	try {
		document.createTextNode('')._ = 0;
	} catch (ex) {
		canExpando = false;
	}
	
	// A mapping of element ids to nodeList id allowing us to quickly find an element
	// that needs to be replaced when updated.
	var nodeMap = {},
		// A mapping of ids to text nodes, this map will be used in the 
		// case of the browser not supporting expando properties.
		textNodeMap = {},
		// The name of the expando property; the value returned 
		// given a nodeMap key.
		expando = 'ejs_' + Math.random(),
		// The id used as the key in our nodeMap, this integer
		// will be preceded by 'element_' or 'obj_' depending on whether
		// the element has a nodeName.
		_id = 0,

		// ## nodeLists.id
		// Given a template node, create an id on the node as a expando
		// property, or if the node is an HTMLTextNode and the browser
		// doesn't support expando properties store the id with a
		// reference to the text node in an internal collection then return
		// the lookup id.
		id = function (node, localMap) {
			var _textNodeMap = localMap || textNodeMap;
			var id = readId(node,_textNodeMap);
			if(id) {
				return id;
			} else {
				// If the browser supports expando properties or the node
				// provided is not an HTMLTextNode, we don't need to work
				// with the internal textNodeMap and we can place the property
				// on the node.
				if (canExpando || node.nodeType !== 3) {
					++_id;
					return node[expando] = (node.nodeName ? 'element_' : 'obj_') + _id;
				} else {
					// If we didn't find the node, we need to register it and return
					// the id used.
					++_id;
	
					// If we didn't find the node, we need to register it and return
					// the id used.
					// 
					// We have to store the node itself because of the browser's lack
					// of support for expando properties (i.e. we can't use a look-up
					// table and store the id on the node as a custom property).
					_textNodeMap['text_' + _id] = node;
					return 'text_' + _id;
				}
			}
		},
		readId = function(node,textNodeMap){
			if (canExpando || node.nodeType !== 3) {
				return node[expando];
			} else {
				// The nodeList has a specific collection for HTMLTextNodes for 
				// (older) browsers that do not support expando properties.
				for (var textNodeID in textNodeMap) {
					if (textNodeMap[textNodeID] === node) {
						return textNodeID;
					}
				}
			}
		},
		splice = [].splice,
		push = [].push,

		// ## nodeLists.itemsInChildListTree
		// Given a nodeList return the number of child items in the provided
		// list and any child lists.
		itemsInChildListTree = function(list){
			var count = 0;
			for(var i = 0, len = list.length ; i < len; i++){
				var item = list[i];
				// If the item is an HTMLElement then increment the count by 1.
				if(item.nodeType) {
					count++;
				} else {
					// If the item is not an HTMLElement it is a list, so
					// increment the count by the number of items in the child
					// list.
					count += itemsInChildListTree(item);
				}
			}
			return count;
		},
		replacementMap = function(replacements, idMap){
			var map = {};
			for(var i = 0, len = replacements.length; i < len; i++){
				var node = nodeLists.first(replacements[i]);
				map[id(node, idMap)] = replacements[i];
			}
			return map;
		};

	// ## Registering & Updating
	// 
	// To keep all live-bound sections knowing which elements they are managing,
	// all live-bound elments are registered and updated when they change.
	//
	// For example, the above template, when rendered with data like:
	// 
	//     data = new can.Map({
	//         items: ["first","second"]
	//     })
	//
	// This will first render the following content:
	// 
	//     <div>
	//         <span data-view-id='5'/>
	//     </div>
	// 
	// When the `5` callback is called, this will register the `<span>` like:
	// 
	//     var ifsNodes = [<span 5>]
	//     nodeLists.register(ifsNodes);
	// 
	// And then render `{{if}}`'s contents and update `ifsNodes` with it:
	//
	//     nodeLists.update( ifsNodes, [<"\nItems:\n">, <span data-view-id="6">] );
	//
	// Next, hookup `6` is called which will regsiter the `<span>` like:
	//
	//     var eachsNodes = [<span 6>];
	//     nodeLists.register(eachsNodes);
	//
	// And then it will render `{{#each}}`'s content and update `eachsNodes` with it:
	//
	//     nodeLists.update(eachsNodes, [<label>,<label>]);
	//
	// As `nodeLists` knows that `eachsNodes` is inside `ifsNodes`, it also updates
	// `ifsNodes`'s nodes to look like:
	//
	//     [<"\nItems:\n">,<label>,<label>]
	//
	// Now, if all items were removed, `{{#if}}` would be able to remove
	// all the `<label>` elements.
	//
	// When you regsiter a nodeList, you can also provide a callback to know when
	// that nodeList has been replaced by a parent nodeList.  This is
	// useful for tearing down live-binding.
	var nodeLists = {
		id: id,
		
		// ## nodeLists.update
		// Updates a nodeList with new items, i.e. when values for the template have changed.
		update: function (nodeList, newNodes) {
			// Unregister all childNodeLists.
			var oldNodes = nodeLists.unregisterChildren(nodeList);
			
			newNodes = can.makeArray(newNodes);

			var oldListLength = nodeList.length;
			
			// Replace oldNodeLists's contents.
			splice.apply(nodeList, [
				0,
				oldListLength
			].concat(newNodes));

			if(nodeList.replacements){
				nodeLists.nestReplacements(nodeList);
			} else {
				nodeLists.nestList(nodeList);
			}
			
			return oldNodes;
		},
		nestReplacements: function(list){
			var index = 0,
				// temporary id map that is limited to this call
				idMap = {},
				// replacements are in reverse order in the DOM
				rMap = replacementMap(list.replacements, idMap),
				rCount = list.replacements.length;
			
			while(index < list.length && rCount) {
				var node = list[index],
					replacement = rMap[readId(node, idMap)];
				if( replacement ) {
					list.splice( index, itemsInChildListTree(replacement), replacement );
					rCount--;
				}
				index++;
			}
			list.replacements = [];
		},
		// ## nodeLists.nestList
		// If a given list does not exist in the nodeMap then create an lookup
		// id for it in the nodeMap and assign the list to it.
		// If the the provided does happen to exist in the nodeMap update the
		// elements in the list.
		// @param {Array.<HTMLElement>} nodeList The nodeList being nested.
		nestList: function(list){
			var index = 0;
			while(index < list.length) {
				var node = list[index],
					childNodeList = nodeMap[id(node)];
				if(childNodeList) {
					if(childNodeList !== list) {
						list.splice( index, itemsInChildListTree(childNodeList), childNodeList );
					}
				} else {
					// Indicate the new nodes belong to this list.
					nodeMap[id(node)] = list;
				}
				index++;
			}
		},

		// ## nodeLists.last
		// Return the last HTMLElement in a nodeList, if the last
		// element is a nodeList, returns the last HTMLElement of
		// the child list, etc.
		last: function(nodeList){
			var last = nodeList[nodeList.length - 1];
			// If the last node in the list is not an HTMLElement
			// it is a nodeList so call `last` again.
			if(last.nodeType) {
				return last;
			} else {
				return nodeLists.last(last);
			}
		},

		// ## nodeLists.first
		// Return the first HTMLElement in a nodeList, if the first
		// element is a nodeList, returns the first HTMLElement of
		// the child list, etc.
		first: function(nodeList) {
			var first = nodeList[0];
			// If the first node in the list is not an HTMLElement
			// it is a nodeList so call `first` again. 
			if(first.nodeType) {
				return first;
			} else {
				return nodeLists.first(first);
			}
		},

		// ## nodeLists.register
		// Registers a nodeList and returns the nodeList passed to register
		register: function (nodeList, unregistered, parent) {
			// If a unregistered callback has been provided assign it to the nodeList
			// as a property to be called when the nodeList is unregistred.
			nodeList.unregistered = unregistered;
			nodeList.parentList = parent;
			
			if(parent === true) {
				// this is the "top" parent in stache
				nodeList.replacements = [];
			} else if(parent) {
				// TOOD: remove
				parent.replacements.push(nodeList);
				nodeList.replacements = [];
			} else {
				nodeLists.nestList(nodeList);
			}
			
			
			return nodeList;
		},
		
		// ## nodeLists.unregisterChildren
		// Unregister all childen within the provided list and return the 
		// unregistred nodes.
		// @param {Array.<HTMLElement>} nodeList The child list to unregister.
		unregisterChildren: function(nodeList){
			var nodes = [];
			// For each node in the nodeList we want to compute it's id
			// and delete it from the nodeList's internal map.
			can.each(nodeList, function (node) {
				// If the node does not have a nodeType it is an array of
				// nodes.
				if(node.nodeType) {
					if(!nodeList.replacements) {
						delete nodeMap[id(node)];
					}

					nodes.push(node);
				} else {
					// Recursively unregister each of the child lists in 
					// the nodeList.
					push.apply(nodes, nodeLists.unregister(node));
				}
			});
			return nodes;
		},

		// ## nodeLists.unregister
		// Unregister's a nodeList and returns the unregistered nodes.  
		// Call if the nodeList is no longer being updated. This will 
		// also unregister all child nodeLists.
		unregister: function (nodeList) {
			var nodes = nodeLists.unregisterChildren(nodeList);
			// If an 'unregisted' function was provided during registration, remove
			// it from the list, and call the function provided.
			if (nodeList.unregistered) {
				var unregisteredCallback = nodeList.unregistered;
				delete nodeList.unregistered;
				delete nodeList.replacements;
				unregisteredCallback();
			}
			return nodes;
		},

		nodeMap: nodeMap
	};
	can.view.nodeLists = nodeLists;
	return nodeLists;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/parser',["can/view"], function(can){
	
	
	function makeMap(str){
		var obj = {}, items = str.split(",");
		for ( var i = 0; i < items.length; i++ ) {
			obj[ items[i] ] = true;
		}
			
		return obj;
	}
	
	var alphaNumericHU = "-A-Za-z0-9_",
		attributeNames = "[a-zA-Z_:]["+alphaNumericHU+":.]*",
		spaceEQspace = "\\s*=\\s*",
		dblQuote2dblQuote = "\"((?:\\\\.|[^\"])*)\"",
		quote2quote = "'((?:\\\\.|[^'])*)'",
		attributeEqAndValue = "(?:"+spaceEQspace+"(?:"+
		  "(?:\"[^\"]*\")|(?:'[^']*')|[^>\\s]+))?",
		matchStash = "\\{\\{[^\\}]*\\}\\}\\}?",
		stash = "\\{\\{([^\\}]*)\\}\\}\\}?",
		startTag = new RegExp("^<(["+alphaNumericHU+"]+)"+
				"(" +
					"(?:\\s*"+
						"(?:(?:"+
							"(?:"+attributeNames+")?"+
							attributeEqAndValue+")|"+
	                   "(?:"+matchStash+")+)"+
	                ")*"+
	            ")\\s*(\\/?)>"),
		endTag = new RegExp("^<\\/(["+alphaNumericHU+"]+)[^>]*>"),
		attr = new RegExp("(?:"+
					"(?:("+attributeNames+")|"+stash+")"+
								"(?:"+spaceEQspace+
									"(?:"+
										"(?:"+dblQuote2dblQuote+")|(?:"+quote2quote+")|([^>\\s]+)"+
									")"+
								")?)","g"),
		mustache = new RegExp(stash,"g"),
		txtBreak = /<|\{\{/;

	// Empty Elements - HTML 5
	var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");

	// Block Elements - HTML 5
	var block = makeMap("address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

	// Inline Elements - HTML 5
	var inline = makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

	// Attributes that have their values filled in disabled="disabled"
	var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

	// Special Elements (can contain anything)
	var special = makeMap("script,style");

	var HTMLParser = function (html, handler) {
		
		function parseStartTag(tag, tagName, rest, unary) {
			tagName = tagName.toLowerCase();

			if (block[tagName]) {
				while (stack.last() && inline[stack.last()]) {
					parseEndTag("", stack.last());
				}
			}

			if (closeSelf[tagName] && stack.last() === tagName) {
				parseEndTag("", tagName);
			}
			
			unary = empty[tagName] || !!unary;
			
			handler.start(tagName, unary);
			
			if (!unary) {
				stack.push(tagName);
			}
			// find attribute or special
			HTMLParser.parseAttrs(rest, handler);


			handler.end(tagName,unary);
			
		}

		function parseEndTag(tag, tagName) {
			// If no tag name is provided, clean shop
			var pos;
			if (!tagName) {
				pos = 0;
			}
				

				// Find the closest opened tag of the same type
			else {
				for (pos = stack.length - 1; pos >= 0; pos--) {
					if (stack[pos] === tagName) {
						break;
					}
				}
					
			}
				

			if (pos >= 0) {
				// Close all the open elements, up the stack
				for (var i = stack.length - 1; i >= pos; i--) {
					if (handler.close) {
						handler.close(stack[i]);
					}
				}
					
				// Remove the open elements from the stack
				stack.length = pos;
			}
		}
		
		function parseMustache(mustache, inside){
			if(handler.special){
				handler.special(inside);
			}
		}
		
		
		var index, chars, match, stack = [], last = html;
		stack.last = function () {
			return this[this.length - 1];
		};

		while (html) {
			chars = true;

			// Make sure we're not in a script or style element
			if (!stack.last() || !special[stack.last()]) {

				// Comment
				if (html.indexOf("<!--") === 0) {
					index = html.indexOf("-->");

					if (index >= 0) {
						if (handler.comment) {
							handler.comment(html.substring(4, index));
						}
						html = html.substring(index + 3);
						chars = false;
					}

					// end tag
				} else if (html.indexOf("</") === 0) {
					match = html.match(endTag);

					if (match) {
						html = html.substring(match[0].length);
						match[0].replace(endTag, parseEndTag);
						chars = false;
					}

					// start tag
				} else if (html.indexOf("<") === 0) {
					match = html.match(startTag);

					if (match) {
						html = html.substring(match[0].length);
						match[0].replace(startTag, parseStartTag);
						chars = false;
					}
				} else if (html.indexOf("{{") === 0 ) {
					match = html.match(mustache);
					
					if (match) {
						html = html.substring(match[0].length);
						match[0].replace(mustache, parseMustache);
					}
				}

				if (chars) {
					index = html.search(txtBreak);

					var text = index < 0 ? html : html.substring(0, index);
					html = index < 0 ? "" : html.substring(index);

					if (handler.chars && text) {
						handler.chars(text);
					}
				}

			} else {
				html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function (all, text) {
					text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
					if (handler.chars) {
						handler.chars(text);
					}
					return "";
				});

				parseEndTag("", stack.last());
			}

			if (html === last) {
				throw "Parse Error: " + html;
			}
				
			last = html;
		}

		// Clean up any remaining tags
		parseEndTag();

		
		handler.done();
	};
	HTMLParser.parseAttrs = function(rest, handler){
		
		
		(rest != null ? rest : "").replace(attr, function (text, name, special, dblQuote, singleQuote, val) {
			if(special) {
				handler.special(special);
				
			}
			if(name || dblQuote || singleQuote || val) {
				var value = arguments[3] ? arguments[3] :
					arguments[4] ? arguments[4] :
					arguments[5] ? arguments[5] :
					fillAttrs[name.toLowerCase()] ? name : "";
				handler.attrStart(name || "");
				
				var last = mustache.lastIndex = 0,
					res = mustache.exec(value),
					chars;
				while(res) {
					chars = value.substring(
						last,
						mustache.lastIndex - res[0].length );
					if( chars.length ) {
						handler.attrValue(chars);
					}
					handler.special(res[1]);
					last = mustache.lastIndex;
					res = mustache.exec(value);
				}
				chars = value.substr(
						last,
						value.length );
				if(chars) {
					handler.attrValue(chars);
				}
				handler.attrEnd(name || "");
			}

			
		});
		
		
	};

	can.view.parser = HTMLParser;
	
	return HTMLParser;
	
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/live',["can/util/library", "can/view/elements", "can/view", "can/view/node_lists", "can/view/parser"], function (can, elements, view, nodeLists, parser) {

	elements = elements || can.view.elements;
	nodeLists = nodeLists || can.view.NodeLists;
	parser = parser || can.view.parser;

	// ## live.js
	//
	// The live module provides live binding for computes
	// and can.List.
	//
	// Currently, it's API is designed for `can/view/render`, but
	// it could easily be used for other purposes.
	// ### Helper methods
	//
	// #### setup
	//
	// `setup(HTMLElement, bind(data), unbind(data)) -> data`
	//
	// Calls bind right away, but will call unbind
	// if the element is "destroyed" (removed from the DOM).
	var setup = function (el, bind, unbind) {
		// Removing an element can call teardown which
		// unregister the nodeList which calls teardown
		var tornDown = false,
			teardown = function () {
				if (!tornDown) {
					tornDown = true;
					unbind(data);
					can.unbind.call(el, 'removed', teardown);
				}
				return true;
			}, data = {
				teardownCheck: function (parent) {
					return parent ? false : teardown();
				}
			};
		can.bind.call(el, 'removed', teardown);
		bind(data);
		return data;
	},
		// #### listen
		// Calls setup, but presets bind and unbind to
		// operate on a compute
		listen = function (el, compute, change) {
			return setup(el, function () {
				compute.bind('change', change);
			}, function (data) {
				compute.unbind('change', change);
				if (data.nodeList) {
					nodeLists.unregister(data.nodeList);
				}
			});
		},
		// #### getAttributeParts
		// Breaks up a string like foo='bar' into ["foo","'bar'""]
		getAttributeParts = function (newVal) {
			var attrs = {},
				attr;
			parser.parseAttrs(newVal,{
				attrStart: function(name){
					attrs[name] = "";
					attr = name;
				},
				attrValue: function(value){
					attrs[attr] += value;
				},
				attrEnd: function(){}
			});
			return attrs;
		},
		splice = [].splice,
		isNode = function(obj){
			return obj && obj.nodeType;
		},
		addTextNodeIfNoChildren = function(frag){
			if(!frag.childNodes.length) {
				frag.appendChild(document.createTextNode(""));
			}
		};
	/**
	 * @property {Object} can.view.live
	 * @parent can.view.static
	 * @release 2.0.4
	 *
	 * Setup live-binding between the DOM and a compute manually.
	 * 
	 * @option {Object} An object with the live-binding methods:
	 * [can.view.live.html], [can.view.live.list], [can.view.live.text], 
	 * [can.view.live.attr] and [can.view.live.attrs].
	 * 
	 * @body
	 *
	 * ## Use
	 *
	 * `can.view.live` is an object with utlitiy methods for setting up
	 * live-binding in relation to different parts of the DOM and DOM elements.  For 
	 * example, to make an `<h2>`'s text stay live with
	 * a compute:
	 * 
	 *     var text = can.compute("Hello World");
	 *     var textNode = $("h2").text(" ")[0].childNodes[0];
	 *     can.view.live.text(textNode, text);
	 *
	 *
	 */
	var live = {
		/**
		 * @function can.view.live.list
		 * @parent can.view.live
		 * @release 2.0.4
		 *
		 * Live binds a compute's [can.List] incrementally.
		 *
		 *
		 * @param {HTMLElement} el An html element to replace with the live-section.
		 *
		 * @param {can.compute|can.List} list A [can.List] or [can.compute] whose value is a [can.List].
		 *
		 * @param {function(this:*,*,index):String} render(index, index) A function that when called with
		 * the incremental item to render and the index of the item in the list.
		 *
		 * @param {Object} context The `this` the `render` function will be called with.
		 *
		 * @param {HTMLElement} [parentNode] An overwritable parentNode if `el`'s parent is
		 * a documentFragment.
		 *
		 * ## Use
		 *
		 * `can.view.live.list` is used to setup incremental live-binding.
		 *
		 *     // a compute that change's it's list
		 *     var todos = can.compute(function(){
		 *       return new Todo.List({page: can.route.attr("page")})
		 *     })
		 *
		 *     var placeholder = document.createTextNode(" ")
		 *     $("ul#todos").append(placeholder)
		 *
		 *
		 *
		 *     can.view.live.list(
		 *       placeholder,
		 *       todos,
		 *       function(todo, index){
		 *         return "<li>"+todo.attr("name")+"</li>"
		 *       })
		 *
		 */
		list: function (el, compute, render, context, parentNode, nodeList) {
			
			// A nodeList of all elements this live-list manages.
			// This is here so that if this live list is within another section
			// that section is able to remove the items in this list.
			var masterNodeList = nodeList || [el],
				// A mapping of items to their indicies'
				indexMap = [],
				// Called when items are added to the list.
				add = function (ev, items, index) {
					// Collect new html and mappings
					var frag = document.createDocumentFragment(),
						newNodeLists = [],
						newIndicies = [];
					// For each new item,
					can.each(items, function (item, key) {
						var itemNodeList = [];

						if(nodeList) {
							nodeLists.register(itemNodeList,null, true);
						}
						
						var itemIndex = can.compute(key + index),
							// get its string content
							itemHTML = render.call(context, item, itemIndex, itemNodeList),
							gotText = typeof itemHTML === "string",
							// and convert it into elements.
							itemFrag = can.frag(itemHTML);
						// Add those elements to the mappings.
						
						itemFrag = gotText ? can.view.hookup(itemFrag) : itemFrag;
						
						var childNodes = can.makeArray(itemFrag.childNodes);
						if(nodeList) {
							nodeLists.update(itemNodeList, childNodes);
							newNodeLists.push(itemNodeList);
						} else {
							newNodeLists.push(nodeLists.register(childNodes));
						}
						
						
						// Hookup the fragment (which sets up child live-bindings) and
						// add it to the collection of all added elements.
						frag.appendChild(itemFrag);
						// track indicies;
						newIndicies.push(itemIndex);
					});
					// The position of elements is always after the initial text placeholder node
					var masterListIndex = index+1;
					
					
					// Check if we are adding items at the end
					if (!masterNodeList[masterListIndex]) {
						elements.after(masterListIndex === 1 ? [text] : [nodeLists.last(masterNodeList[masterListIndex - 1])], frag);
					} else {
						// Add elements before the next index's first element.
						var el = nodeLists.first(masterNodeList[masterListIndex]);
						can.insertBefore(el.parentNode, frag, el);
					}
					splice.apply(masterNodeList, [
						masterListIndex,
						0
					].concat(newNodeLists));
					
					// update indices after insert point
					splice.apply(indexMap, [
						index,
						0
					].concat(newIndicies));
					
					for (var i = index + newIndicies.length, len = indexMap.length; i < len; i++) {
						indexMap[i](i);
					}
				},
				// Called when items are removed or when the bindings are torn down.
				remove = function (ev, items, index, duringTeardown, fullTeardown) {
					// If this is because an element was removed, we should
					// check to make sure the live elements are still in the page.
					// If we did this during a teardown, it would cause an infinite loop.
					if (!duringTeardown && data.teardownCheck(text.parentNode)) {
						return;
					}
					var removedMappings = masterNodeList.splice(index+1, items.length),
						itemsToRemove = [];
					can.each(removedMappings, function (nodeList) {
						
						// Unregister to free up event bindings.
						var nodesToRemove = nodeLists.unregister(nodeList);
						
						// add items that we will remove all at once
						[].push.apply(itemsToRemove, nodesToRemove);
					});
					// update indices after remove point
					indexMap.splice(index, items.length);
					for (var i = index, len = indexMap.length; i < len; i++) {
						indexMap[i](i);
					}
					// don't remove elements during teardown.  Something else will probably be doing that.
					if(!fullTeardown) {
						can.remove(can.$(itemsToRemove));
					}
					
				},
				// A text node placeholder
				text = document.createTextNode(''),
				// The current list.
				list,
				// Called when the list is replaced with a new list or the binding is torn-down.
				teardownList = function (fullTeardown) {
					// there might be no list right away, and the list might be a plain
					// array
					if (list && list.unbind) {
						list.unbind('add', add)
							.unbind('remove', remove);
					}
					// use remove to clean stuff up for us
					remove({}, {
						length: masterNodeList.length - 1
					}, 0, true, fullTeardown);
				},
				// Called when the list is replaced or setup.
				updateList = function (ev, newList, oldList) {
					teardownList();
					// make an empty list if the compute returns null or undefined
					list = newList || [];
					// list might be a plain array
					if (list.bind) {
						list.bind('add', add)
							.bind('remove', remove);
					}
					add({}, list, 0);
				};
			parentNode = elements.getParentNode(el, parentNode);
			// Setup binding and teardown to add and remove events
			var data = setup(parentNode, function () {
				if (can.isFunction(compute)) {
					compute.bind('change', updateList);
				}
			}, function () {
				if (can.isFunction(compute)) {
					compute.unbind('change', updateList);
				}
				teardownList(true);
			});
			if(!nodeList) {
				live.replace(masterNodeList, text, data.teardownCheck);
			} else {
				elements.replace(masterNodeList, text);
				nodeLists.update(masterNodeList, [text]);
				nodeList.unregistered = data.teardownCheck;
			}
			
			// run the list setup
			updateList({}, can.isFunction(compute) ? compute() : compute);
		},
		/**
		 * @function can.view.live.html
		 * @parent can.view.live
		 * @release 2.0.4
		 *
		 * Live binds a compute's value to a collection of elements.
		 *
		 *
		 * @param {HTMLElement} el An html element to replace with the live-section.
		 *
		 * @param {can.compute} compute A [can.compute] whose value is HTML.
		 *
		 * @param {HTMLElement} [parentNode] An overwritable parentNode if `el`'s parent is
		 * a documentFragment.
		 *
		 * ## Use
		 *
		 * `can.view.live.html` is used to setup incremental live-binding.
		 *
		 *     // a compute that change's it's list
		 *     var greeting = can.compute(function(){
		 *       return "Welcome <i>"+me.attr("name")+"</i>"
		 *     });
		 *
		 *     var placeholder = document.createTextNode(" ");
		 *     $("#greeting").append(placeholder);
		 *
		 *     can.view.live.html( placeholder,  greeting );
		 *
		 */
		html: function (el, compute, parentNode, nodeList) {
			var data;
			parentNode = elements.getParentNode(el, parentNode);
			data = listen(parentNode, compute, function (ev, newVal, oldVal) {
				
				// TODO: remove teardownCheck in 2.1
				var attached = nodeLists.first(nodes).parentNode;
				// update the nodes in the DOM with the new rendered value
				if (attached) {
					makeAndPut(newVal);
				}
				data.teardownCheck(nodeLists.first(nodes).parentNode);
			});

			var nodes = nodeList || [el],
				makeAndPut = function (val) {
					var isString = !isNode(val),
						frag = can.frag(val),
						oldNodes = can.makeArray(nodes);
					
					// Add a placeholder textNode if necessary.
					addTextNodeIfNoChildren(frag);
					
					if(isString){
						frag = can.view.hookup(frag, parentNode);
					}
					// We need to mark each node as belonging to the node list.
					oldNodes = nodeLists.update(nodes, frag.childNodes);
					elements.replace(oldNodes, frag);
				};
			data.nodeList = nodes;
			
			// register the span so nodeLists knows the parentNodeList
			if(!nodeList) {
				nodeLists.register(nodes, data.teardownCheck);
			} else {
				nodeList.unregistered = data.teardownCheck;
			}
			makeAndPut(compute());
		},
		/**
		 * @function can.view.live.replace
		 * @parent can.view.live
		 * @release 2.0.4
		 *
		 * Replaces one element with some content while keeping [can.view.live.nodeLists nodeLists] data
		 * correct.
		 *
		 * @param {Array.<HTMLElement>} nodes An array of elements.  There should typically be one element.
		 * @param {String|HTMLElement|DocumentFragment} val The content that should replace
		 * `nodes`.  If a string is passed, it will be [can.view.hookup hookedup].
		 *
		 * @param {function} [teardown] A callback if these elements are torn down.
		 */
		replace: function (nodes, val, teardown) {
			var oldNodes = nodes.slice(0),
				frag = can.frag(val);
			nodeLists.register(nodes, teardown);
			
			
			if (typeof val === 'string') {
				// if it was a string, check for hookups
				frag = can.view.hookup(frag, nodes[0].parentNode);
			}
			// We need to mark each node as belonging to the node list.
			nodeLists.update(nodes, frag.childNodes);
			elements.replace(oldNodes, frag);
			return nodes;
		},
		/**
		 * @function can.view.live.text
		 * @parent can.view.live
		 * @release 2.0.4
		 *
		 * Replaces one element with some content while keeping [can.view.live.nodeLists nodeLists] data
		 * correct.
		 */
		text: function (el, compute, parentNode, nodeList) {
			var parent = elements.getParentNode(el, parentNode);
			// setup listening right away so we don't have to re-calculate value
			var data = listen(parent, compute, function (ev, newVal, oldVal) {
				// Sometimes this is 'unknown' in IE and will throw an exception if it is
				/* jshint ignore:start */
				if (typeof node.nodeValue !== 'unknown') {
					node.nodeValue = can.view.toStr(newVal);
				}
				/* jshint ignore:end */
				// TODO: remove in 2.1
				data.teardownCheck(node.parentNode);
			});
			// The text node that will be updated
				
			var node = document.createTextNode(can.view.toStr(compute()));
			if(nodeList) {
				nodeList.unregistered = data.teardownCheck;
				data.nodeList = nodeList;
				
				nodeLists.update(nodeList, [node]);
				elements.replace([el], node);
			} else {
				// Replace the placeholder with the live node and do the nodeLists thing.
				// Add that node to nodeList so we can remove it when the parent element is removed from the page
				data.nodeList = live.replace([el], node, data.teardownCheck);
			}
			
		},
		setAttributes: function(el, newVal) {
			var attrs = getAttributeParts(newVal);
			for(var name in attrs) {
				can.attr.set(el, name, attrs[name]);
			}
		},
		/**
		 * @function can.view.live.attrs
		 * @parent can.view.live
		 * 
		 * Keep attributes live to a [can.compute].
		 * 
		 * @param {HTMLElement} el The element whos attributes will be kept live.
		 * @param {can.compute} compute The compute.
		 * 
		 * @body
		 * 
		 * ## Use
		 * 
		 *     var div = document.createElement('div');
		 *     var compute = can.compute("foo='bar' zed='ted'");
		 *     can.view.live.attr(div,compute);
		 * 
		 */
		attributes: function (el, compute, currentValue) {
			var oldAttrs = {};
			
			var setAttrs = function (newVal) {
				var newAttrs = getAttributeParts(newVal),
					name;
				for( name in newAttrs ) {
					var newValue = newAttrs[name],
						oldValue = oldAttrs[name];
					if(newValue !== oldValue) {
						can.attr.set(el, name, newValue);
					}
					delete oldAttrs[name];
				}
				for( name in oldAttrs ) {
					elements.removeAttr(el, name);
				}
				oldAttrs = newAttrs;
			};
			listen(el, compute, function (ev, newVal) {
				setAttrs(newVal);
			});
			// current value has been set
			if (arguments.length >= 3) {
				oldAttrs = getAttributeParts(currentValue);
			} else {
				setAttrs(compute());
			}
		},
		attributePlaceholder: '__!!__',
		attributeReplace: /__!!__/g,
		attribute: function (el, attributeName, compute) {
			listen(el, compute, function (ev, newVal) {
				elements.setAttr(el, attributeName, hook.render());
			});
			var wrapped = can.$(el),
				hooks;
			// Get the list of hookups or create one for this element.
			// Hooks is a map of attribute names to hookup `data`s.
			// Each hookup data has:
			// `render` - A `function` to render the value of the attribute.
			// `funcs` - A list of hookup `function`s on that attribute.
			// `batchNum` - The last event `batchNum`, used for performance.
			hooks = can.data(wrapped, 'hooks');
			if (!hooks) {
				can.data(wrapped, 'hooks', hooks = {});
			}
			// Get the attribute value.
			var attr = elements.getAttr(el, attributeName),
				// Split the attribute value by the template.
				// Only split out the first __!!__ so if we have multiple hookups in the same attribute,
				// they will be put in the right spot on first render
				parts = attr.split(live.attributePlaceholder),
				goodParts = [],
				hook;
			goodParts.push(parts.shift(), parts.join(live.attributePlaceholder));
			// If we already had a hookup for this attribute...
			if (hooks[attributeName]) {
				// Just add to that attribute's list of `function`s.
				hooks[attributeName].computes.push(compute);
			} else {
				// Create the hookup data.
				hooks[attributeName] = {
					render: function () {
						var i = 0,
							// attr doesn't have a value in IE
							newAttr = attr ? attr.replace(live.attributeReplace, function () {
								return elements.contentText(hook.computes[i++]());
							}) : elements.contentText(hook.computes[i++]());
						return newAttr;
					},
					computes: [compute],
					batchNum: undefined
				};
			}
			// Save the hook for slightly faster performance.
			hook = hooks[attributeName];
			// Insert the value in parts.
			goodParts.splice(1, 0, compute());

			// Set the attribute.
			elements.setAttr(el, attributeName, goodParts.join(''));
		},
		specialAttribute: function (el, attributeName, compute) {
			listen(el, compute, function (ev, newVal) {
				elements.setAttr(el, attributeName, getValue(newVal));
			});
			elements.setAttr(el, attributeName, getValue(compute()));
		},
		/**
		 * @function can.view.live.attr
		 * @parent can.view.live
		 * 
		 * Keep an attribute live to a [can.compute].
		 * 
		 * @param {HTMLElement} el The element whos attribute will be kept live.
		 * @param {String} attributeName The attribute name.
		 * @param {can.compute} compute The compute.
		 * 
		 * @body
		 * 
		 * ## Use
		 * 
		 *     var div = document.createElement('div');
		 *     var compute = can.compute("foo bar");
		 *     can.view.live.attr(div,"class", compute);
		 */
		simpleAttribute: function(el, attributeName, compute){
			listen(el, compute, function (ev, newVal) {
				elements.setAttr(el, attributeName, newVal);
			});
			elements.setAttr(el, attributeName, compute());
		}
	};
	live.attr = live.simpleAttribute;
	live.attrs = live.attributes;
	var newLine = /(\r|\n)+/g;
	var getValue = function (val) {
		var regexp = /^["'].*["']$/;
		val = val.replace(elements.attrReg, '')
			.replace(newLine, '');
		// check if starts and ends with " or '
		return regexp.test(val) ? val.substr(1, val.length - 2) : val;
	};
	can.view.live = live;

	return live;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/render',["can/view", "can/view/elements", "can/view/live", "can/util/string"], function (can, elements, live) {

	/**
	 * Helper(s)
	 */
	var pendingHookups = [],
		tagChildren = function (tagName) {
			var newTag = elements.tagMap[tagName] || "span";
			if (newTag === "span") {
				//innerHTML in IE doesn't honor leading whitespace after empty elements
				return "@@!!@@";
			}
			return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
		},
		contentText = function (input, tag) {

			// If it's a string, return.
			if (typeof input === 'string') {
				return input;
			}
			// If has no value, return an empty string.
			if (!input && input !== 0) {
				return '';
			}

			// If it's an object, and it has a hookup method.
			var hook = (input.hookup &&

				// Make a function call the hookup method.
				function (el, id) {
					input.hookup.call(input, el, id);
				}) ||

			// Or if it's a `function`, just use the input.
			(typeof input === 'function' && input);

			// Finally, if there is a `function` to hookup on some dom,
			// add it to pending hookups.
			if (hook) {
				if (tag) {
					return "<" + tag + " " + can.view.hook(hook) + "></" + tag + ">";
				} else {
					pendingHookups.push(hook);
				}

				return '';
			}

			// Finally, if all else is `false`, `toString()` it.
			return "" + input;
		},
		// Returns escaped/sanatized content for anything other than a live-binding
		contentEscape = function (txt, tag) {
			return (typeof txt === 'string' || typeof txt === 'number') ?
				can.esc(txt) :
				contentText(txt, tag);
		},
		// A flag to indicate if .txt was called within a live section within an element like the {{name}}
		// within `<div {{#person}}{{name}}{{/person}}/>`.
		withinTemplatedSectionWithinAnElement = false,
		emptyHandler = function () {};

	var lastHookups;

	can.extend(can.view, {
		live: live,
		// called in text to make a temporary 
		// can.view.lists function that can be called with
		// the list to iterate over and the template
		// used to produce the content within the list
		setupLists: function () {

			var old = can.view.lists,
				data;

			can.view.lists = function (list, renderer) {
				data = {
					list: list,
					renderer: renderer
				};
				return Math.random();
			};
			// sets back to the old data
			return function () {
				can.view.lists = old;
				return data;
			};
		},
		getHooks: function () {
			var hooks = pendingHookups.slice(0);
			lastHookups = hooks;
			pendingHookups = [];
			return hooks;
		},
		onlytxt: function (self, func) {
			return contentEscape(func.call(self));
		},
		/**
		 * @function can.view.txt
		 * @hide
		 *
		 * A helper function used to insert the
		 * value of the contents of a magic tag into
		 * a template's output. It detects if an observable value is
		 * read and will setup live binding.
		 *
		 * @signature `can.view.txt(escape, tagName, status, self, func)`
		 *
		 * @param {Number} 1 if the content returned should be escaped, 0 if otherwise.
		 * @param {String} tagName the name of the tag the magic tag is most immediately
		 * within. Ex: `"li"`.
		 * @param {String|Number} status A flag indicates which part of a tag the
		 * magic tag is within. Status can be:
		 *
		 *  - _STRING_ - The name of the attribute the magic tag is within. Ex: `"class"`
		 *  - `1` - The magic tag is within a tag like `<div <%= %>>`
		 *  - `0` - The magic tag is outside (or between) tags like `<div><%= %></div>`
		 *
		 * @param {*} self The `this` of the current context template. `func` is called with
		 * self as this.
		 *
		 * @param {function} func The "wrapping" function. For
		 * example:  `<%= task.attr('name') %>` becomes
		 *   `(function(){return task.attr('name')})
		 *
		 */
		txt: function (escape, tagName, status, self, func) {
			// the temporary tag needed for any live setup
			var tag = (elements.tagMap[tagName] || "span"),
				// should live-binding be setup
				setupLiveBinding = false,
				// the compute's value
				value,
				listData,
				compute,
				unbind = emptyHandler,
				attributeName;

			// Are we currently within a live section within an element like the {{name}}
			// within `<div {{#person}}{{name}}{{/person}}/>`.
			if (withinTemplatedSectionWithinAnElement) {
				value = func.call(self);
			} else {

				// If this magic tag is within an attribute or an html element,
				// set the flag to true so we avoid trying to live bind
				// anything that func might be setup.
				// TODO: the scanner should be able to set this up.
				if (typeof status === "string" || status === 1) {
					withinTemplatedSectionWithinAnElement = true;
				}

				// Sets up a listener so we know any can.view.lists called 
				// when func is called
				var listTeardown = can.view.setupLists();
				// 
				unbind = function () {
					compute.unbind("change", emptyHandler);
				};
				// Create a compute that calls func and looks for dependencies.
				// By passing `false`, this compute can not be a dependency of other 
				// computes.  This is because live-bits are nested, but 
				// handle their own updating. For example:
				//     {{#if items.length}}{{#items}}{{.}}{{/items}}{{/if}}
				// We do not want `{{#if items.length}}` changing the DOM if
				// `{{#items}}` text changes.
				compute = can.compute(func, self, false);

				// Bind to get and temporarily cache the value of the compute.
				compute.bind("change", emptyHandler);

				// Call the "wrapping" function and get the binding information
				listData = listTeardown();

				// Get the value of the compute
				value = compute();

				// Let people know we are no longer within an element.
				withinTemplatedSectionWithinAnElement = false;

				// If we should setup live-binding.
				setupLiveBinding = compute.hasDependencies;
			}

			if (listData) {
				unbind();
				return "<" + tag + can.view.hook(function (el, parentNode) {
					live.list(el, listData.list, listData.renderer, self, parentNode);
				}) + "></" + tag + ">";
			}

			// If we had no observes just return the value returned by func.
			if (!setupLiveBinding || typeof value === "function") {
				unbind();
				return ((withinTemplatedSectionWithinAnElement || escape === 2 || !escape) ?
					contentText :
					contentEscape)(value, status === 0 && tag);
			}

			// the property (instead of innerHTML elements) to adjust. For
			// example options should use textContent
			var contentProp = elements.tagToContentPropMap[tagName];

			// The magic tag is outside or between tags.
			if (status === 0 && !contentProp) {
				// Return an element tag with a hookup in place of the content
				return "<" + tag + can.view.hook(
					// if value is an object, it's likely something returned by .safeString
					escape && typeof value !== "object" ?
					// If we are escaping, replace the parentNode with 
					// a text node who's value is `func`'s return value.
					function (el, parentNode) {
						live.text(el, compute, parentNode);
						unbind();
					} :
					// If we are not escaping, replace the parentNode with a
					// documentFragment created as with `func`'s return value.
					function (el, parentNode) {
						live.html(el, compute, parentNode);
						unbind();
						//children have to be properly nested HTML for buildFragment to work properly
					}) + ">" + tagChildren(tag) + "</" + tag + ">";
				// In a tag, but not in an attribute
			} else if (status === 1) {
				// remember the old attr name
				pendingHookups.push(function (el) {
					live.attributes(el, compute, compute());
					unbind();
				});

				return compute();
			} else if (escape === 2) { // In a special attribute like src or style

				attributeName = status;
				pendingHookups.push(function (el) {
					live.specialAttribute(el, attributeName, compute);
					unbind();
				});
				return compute();
			} else { // In an attribute...
				attributeName = status === 0 ? contentProp : status;
				// if the magic tag is inside the element, like `<option><% TAG %></option>`,
				// we add this hookup to the last element (ex: `option`'s) hookups.
				// Otherwise, the magic tag is in an attribute, just add to the current element's
				// hookups.
				(status === 0 ? lastHookups : pendingHookups)
					.push(function (el) {
						live.attribute(el, attributeName, compute);
						unbind();
					});
				return live.attributePlaceholder;
			}
		}
	});

	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/mustache',["can/util/library", "can/view/scope", "can/view", "can/view/scanner", "can/compute", "can/view/render"], function (can) {

		// # mustache.js
		// `can.Mustache`: The Mustache templating engine.
		// 
		// See the [Transformation](#section-29) section within *Scanning Helpers* for a detailed explanation 
		// of the runtime render code design. The majority of the Mustache engine implementation 
		// occurs within the *Transformation* scanning helper.

		// ## Initialization
		//
		// Define the view extension.
		can.view.ext = ".mustache";

		// ### Setup internal helper variables and functions.
		//
		// An alias for the context variable used for tracking a stack of contexts.
		// This is also used for passing to helper functions to maintain proper context.
		var SCOPE = 'scope',
			// An alias for the variable used for the hash object that can be passed
			// to helpers via `options.hash`.
			HASH = '___h4sh',
			// An alias for the most used context stacking call.
			CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options}',
			// a context object used to incidate being special
			SPECIAL_CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options, special: true}',
			// argument names used to start the function (used by scanner and steal)
			ARG_NAMES = SCOPE + ",options",

			// matches arguments inside a {{ }}
			argumentsRegExp = /((([^'"\s]+?=)?('.*?'|".*?"))|.*?)\s/g,

			// matches a literal number, string, null or regexp
			literalNumberStringBooleanRegExp = /^(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false|null|undefined)|((.+?)=(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|(.+))))$/,

			// returns an object literal that we can use to look up a value in the current scope
			makeLookupLiteral = function (type) {
				return '{get:"' + type.replace(/"/g, '\\"') + '"}';
			},
			// returns if the object is a lookup
			isLookup = function (obj) {
				return obj && typeof obj.get === "string";
			},

			/*
			 * Checks whether an object is like a can.Map. This takes into
			 * fact that can.route is can.Map like.
			 * @param  {[can.Map]}  observable
			 * @return {Boolean} returns if the object is observable like.
			 */
			isObserveLike = function (obj) {
				return obj instanceof can.Map || (obj && !! obj._get);
			},

			/*
			 * Tries to determine if the object passed is an array.
			 * @param  {Array}  obj The object to check.
			 * @return {Boolean} returns if the object is an array.
			 */
			isArrayLike = function (obj) {
				return obj && obj.splice && typeof obj.length === 'number';
			},
			// used to make sure .fn and .inverse are always called with a Scope like object
			makeConvertToScopes = function (original, scope, options) {
				var originalWithScope = function(ctx, opts){
					return original(ctx || scope, opts);
				};
				return function (updatedScope, updatedOptions) {
					if (updatedScope !== undefined && !(updatedScope instanceof can.view.Scope)) {
						updatedScope = scope.add(updatedScope);
					}
					if (updatedOptions !== undefined && !(updatedOptions instanceof can.view.Options)) {
						updatedOptions = options.add(updatedOptions);
					}
					return originalWithScope(updatedScope, updatedOptions || options);
				};
			};

		// ## Mustache
		/**
		 * @hide
		 * The Mustache templating engine.
		 * @param {Object} options	Configuration options
		 */
		var Mustache = function (options, helpers) {
			// Support calling Mustache without the constructor.
			// This returns a function that renders the template.
			if (this.constructor !== Mustache) {
				var mustache = new Mustache(options);
				return function (data, options) {
					return mustache.render(data, options);
				};
			}

			// If we get a `function` directly, it probably is coming from
			// a `steal`-packaged view.
			if (typeof options === "function") {
				this.template = {
					fn: options
				};
				return;
			}

			// Set options on self.
			can.extend(this, options);
			this.template = this.scanner.scan(this.text, this.name);
		};

		/**
		 * @add can.MustacheConstructor
		 */
		// Put Mustache on the `can` object.
		can.Mustache = window.Mustache = Mustache;

		/** 
		 * @prototype
		 */
		Mustache.prototype.
		/**
		 * @function can.MustacheConstructor.prototype.render render
		 * @parent can.MustacheConstructor.prototype
		 * @signature `mustache.render( data [, helpers] )`
		 * @param {Object} data Data to interpolate into the template.
		 * @return {String} The template with interpolated data, in string form.
		 * @hide
		 *
		 * @body
		 * Renders an object with view helpers attached to the view.
		 *
		 *		 new Mustache({text: "<%= message %>"}).render({
		 *			 message: "foo"
		 *		 })
		 */
		render = function (data, options) {
			if (!(data instanceof can.view.Scope)) {
				data = new can.view.Scope(data || {});
			}
			if (!(options instanceof can.view.Options)) {
				options = new can.view.Options(options || {});
			}
			options = options || {};

			return this.template.fn.call(data, data, options);
		};

		can.extend(Mustache.prototype, {
			// Share a singleton scanner for parsing templates.
			scanner: new can.view.Scanner({
				// A hash of strings for the scanner to inject at certain points.
				text: {
					// This is the logic to inject at the beginning of a rendered template. 
					// This includes initializing the `context` stack.
					start: "", //"var "+SCOPE+"= this instanceof can.view.Scope? this : new can.view.Scope(this);\n",
					scope: SCOPE,
					options: ",options: options",
					argNames: ARG_NAMES
				},

				// An ordered token registry for the scanner.
				// This needs to be ordered by priority to prevent token parsing errors.
				// Each token follows the following structure:
				//
				//		[
				//			// Which key in the token map to match.
				//			"tokenMapName",
				//
				//			// A simple token to match, like "{{".
				//			"token",
				//
				//			// Optional. A complex (regexp) token to match that 
				//			// overrides the simple token.
				//			"[\\s\\t]*{{",
				//
				//			// Optional. A function that executes advanced 
				//			// manipulation of the matched content. This is 
				//			// rarely used.
				//			function(content){   
				//				return content;
				//			}
				//		]
				tokens: [
					/**
					 * @function can.mustache.tags.escaped {{key}}
					 *
					 * @description Insert the value of the [can.mustache.key key] into the
					 * output of the template.
					 *
					 * @parent can.mustache.tags 0
					 *
					 * @signature `{{key}}`
					 *
					 * @param {can.mustache.key} key A key that references one of the following:
					 *
					 *  - A [can.mustache.registerHelper registered helper].
					 *  - A value within the current or parent
					 *    [can.mustache.context context]. If the value is a function or [can.compute], the
					 *    function's return value is used.
					 *
					 * @return {String|Function|*}
					 *
					 * After the key's value is found (and set to any function's return value),
					 * it is passed to [can.view.txt] as the result of a call to its `func`
					 * argument. There, if the value is a:
					 *
					 *  - `null` or `undefined` - an empty string is inserted into the rendered template result.
					 *  - `String` or `Number` - the value is inserted into the rendered template result.
					 *  - `Function` - A [can.view.hook hookup] attribute or element is inserted so this function
					 *    will be called back with the DOM element after it is created.
					 *
					 * @body
					 *
					 * ## Use
					 *
					 * `{{key}}` insert data into the template. It most commonly references
					 * values within the current [can.mustache.context context]. For example:
					 *
					 * Rendering:
					 *
					 *     <h1>{{name}}</h1>
					 *
					 * With:
					 *
					 *     {name: "Austin"}
					 *
					 * Results in:
					 *
					 *     <h1>Austin</h1>
					 *
					 * If the key value is a String or Number, it is inserted into the template.
					 * If it is `null` or `undefined`, nothing is added to the template.
					 *
					 *
					 * ## Nested Properties
					 *
					 * Mustache supports nested paths, making it possible to
					 * look up properties nested deep inside the current context. For example:
					 *
					 * Rendering:
					 *
					 *     <h1>{{book.author}}</h1>
					 *
					 * With:
					 *
					 *     {
					 *       book: {
					 *         author: "Ernest Hemingway"
					 *       }
					 *     }
					 *
					 * Results in:
					 *
					 *     <h1>Ernest Hemingway</h1>
					 *
					 * ## Looking up values in parent contexts
					 *
					 * Sections and block helpers can create their own contexts. If a key's value
					 * is not found in the current context, it will look up the key's value
					 * in parent contexts. For example:
					 *
					 * Rendering:
					 *
					 *     {{#chapters}}
					 *        <li>{{title}} - {{name}}</li>
					 *     {{chapters}}
					 *
					 * With:
					 *
					 *     {
					 *       title: "The Book of Bitovi"
					 *       chapters: [{name: "Breakdown"}]
					 *     }
					 *
					 * Results in:
					 *
					 *     <li>The Book of Bitovi - Breakdown</li>
					 *
					 *
					 */
					// Return unescaped
					["returnLeft", "{{{", "{{[{&]"],
					// Full line comments
					["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],
					/**
					 * @function can.mustache.tags.comment {{!key}}
					 *
					 * @parent can.mustache.tags 7
					 *
					 * @description A comment that doesn't get inserted into the rendered result.
					 *
					 * @signature `{{!key}}`
					 *
					 * The comment tag operates similarly to a `<!-- -->` tag in HTML. It exists in your template but never shows up.
					 *
					 * @param {can.mustache.key} key Everything within this tag is completely ignored.
					 * @return {String}
					 *
					 */
					// Inline comments
					["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],
					/**
					 * @function can.mustache.tags.unescaped {{{key}}}
					 *
					 * @parent can.mustache.tags 1
					 *
					 * @description Insert the unescaped value of the [can.mustache.key key] into the
					 * output of the template.
					 *
					 * @signature `{{{key}}}`
					 *
					 * Behaves just like [can.mustache.tags.escaped {{key}}] and [can.mustache.helpers.helper {{helper}}] but does not
					 * escape the result.
					 *
					 * @param {can.mustache.key} key A key that references a value within the current or parent
					 * context. If the value is a function or can.compute, the function's return value is used.
					 * @return {String|Function|*}
					 *
					 *
					 */
					//
					/**
					 * @function can.mustache.tags.unescaped2 {{&key}}
					 *
					 * @parent can.mustache.tags 2
					 *
					 * @description Insert the unescaped value of the [can.mustache.key key] into the
					 * output of the template.
					 *
					 * @signature `{{&key}}`
					 *
					 * The `{{&key}}` tag is an alias for [can.mustache.tags.unescaped {{{key}}}], behaving just
					 * like [can.mustache.tags.escaped {{key}}] and [can.mustache.helpers.helper {{helper}}] but does not
					 * escape the result.
					 *
					 * @param {can.mustache.key} key A key that references a value within the current or parent
					 * context. If the value is a function or can.compute, the function's return value is used.
					 * @return {String|Function|*}
					 *
					 */
					// Full line escapes
					// This is used for detecting lines with only whitespace and an escaped tag
					["escapeFull", "{{}}", "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)",
						function (content) {
							return {
								before: /^\n.+?\n$/.test(content) ? '\n' : '',
								content: content.match(/\{\{(.+?)\}\}/)[1] || ''
							};
						}
					],
					// Return escaped
					["escapeLeft", "{{"],
					// Close return unescaped
					["returnRight", "}}}"],
					// Close tag
					["right", "}}"]
				],

				// ## Scanning Helpers
				//
				// This is an array of helpers that transform content that is within escaped tags like `{{token}}`. These helpers are solely for the scanning phase; they are unrelated to Mustache/Handlebars helpers which execute at render time. Each helper has a definition like the following:
				//
				//		{
				//			// The content pattern to match in order to execute.
				//			// Only the first matching helper is executed.
				//			name: /pattern to match/,
				//
				//			// The function to transform the content with.
				//			// @param {String} content   The content to transform.
				//			// @param {Object} cmd       Scanner helper data.
				//			//                           {
				//			//                             insert: "insert command",
				//			//                             tagName: "div",
				//			//                             status: 0
				//			//                           }
				//			fn: function(content, cmd) {
				//				return 'for text injection' || 
				//					{ raw: 'to bypass text injection' };
				//			}
				//		}
				helpers: [
					// ### Partials
					//
					// Partials begin with a greater than sign, like {{> box}}.
					// 
					// Partials are rendered at runtime (as opposed to compile time), 
					// so recursive partials are possible. Just avoid infinite loops.
					// 
					// For example, this template and partial:
					// 
					// 		base.mustache:
					// 			<h2>Names</h2>
					// 			{{#names}}
					// 				{{> user}}
					// 			{{/names}}
					// 			
					// 		user.mustache:
					// 			<strong>{{name}}</strong>
					{
						name: /^>[\s]*\w*/,
						fn: function (content, cmd) {
							// Get the template name and call back into the render method,
							// passing the name and the current context.
							var templateName = can.trim(content.replace(/^>\s?/, ''))
								.replace(/["|']/g, "");
							return "can.Mustache.renderPartial('" + templateName + "'," + ARG_NAMES + ")";
						}
					},

					// ### Data Hookup
					// 
					// This will attach the data property of `this` to the element
					// its found on using the first argument as the data attribute
					// key.
					// 
					// For example:
					// 	
					//		<li id="nameli" {{ data 'name' }}></li>
					// 
					// then later you can access it like:
					// 
					//		can.$('#nameli').data('name');
					/**
					 * @function can.mustache.helpers.data {{data name}}
					 * @parent can.mustache.htags 7
					 * @signature `{{data name}}`
					 *
					 * Adds the current [can.mustache.context context] to the
					 * element's [can.data].
					 *
					 * @param {String} name The name of the data attribute to use for the
					 * context.
					 *
					 * @body
					 *
					 * ## Use
					 *
					 * It is common for you to want some data in the template to be available
					 * on an element.  `{{data name}}` allows you to save the
					 * context so it can later be retrieved by [can.data] or
					 * `$.fn.data`. For example,
					 *
					 * The template:
					 *
					 *     <ul>
					 *       <li id="person" {{data 'person'}}>{{name}}</li>
					 *     </ul>
					 *
					 * Rendered with:
					 *
					 *     document.body.appendChild(
					 *       can.view.mustache(template,{ person: { name: 'Austin' } });
					 *
					 * Retrieve the person data back with:
					 *
					 *     $("#person").data("person")
					 *
					 */
					{
						name: /^\s*data\s/,
						fn: function (content, cmd) {
							var attr = content.match(/["|'](.*)["|']/)[1];
							// return a function which calls `can.data` on the element
							// with the attribute name with the current context.
							return "can.proxy(function(__){" +
							// "var context = this[this.length-1];" +
							// "context = context." + STACKED + " ? context[context.length-2] : context; console.warn(this, context);" +
							"can.data(can.$(__),'" + attr + "', this.attr('.')); }, " + SCOPE + ")";
						}
					}, {
						name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
						fn: function (content) {
							var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
								parts = content.match(quickFunc);

							//find 
							return "can.proxy(function(__){var " + parts[1] + "=can.$(__);with(" + SCOPE + ".attr('.')){" + parts[2] + "}}, this);";
						}
					},
					// ### Transformation (default)
					//
					// This transforms all content to its interpolated equivalent,
					// including calls to the corresponding helpers as applicable. 
					// This outputs the render code for almost all cases.
					//
					// #### Definitions
					// 
					// * `context` - This is the object that the current rendering context operates within. 
					//		Each nested template adds a new `context` to the context stack.
					// * `stack` - Mustache supports nested sections, 
					//		each of which add their own context to a stack of contexts.
					//		Whenever a token gets interpolated, it will check for a match against the 
					//		last context in the stack, then iterate through the rest of the stack checking for matches.
					//		The first match is the one that gets returned.
					// * `Mustache.txt` - This serializes a collection of logic, optionally contained within a section.
					//		If this is a simple interpolation, only the interpolation lookup will be passed.
					//		If this is a section, then an `options` object populated by the truthy (`options.fn`) and 
					//		falsey (`options.inverse`) encapsulated functions will also be passed. This section handling 
					//		exists to support the runtime context nesting that Mustache supports.
					// * `Mustache.get` - This resolves an interpolation reference given a stack of contexts.
					// * `options` - An object containing methods for executing the inner contents of sections or helpers.  
					//		`options.fn` - Contains the inner template logic for a truthy section.  
					//		`options.inverse` - Contains the inner template logic for a falsey section.  
					//		`options.hash` - Contains the merged hash object argument for custom helpers.
					//
					// #### Design
					//
					// This covers the design of the render code that the transformation helper generates.
					//
					// ##### Pseudocode
					// 
					// A detailed explanation is provided in the following sections, but here is some brief pseudocode
					// that gives a high level overview of what the generated render code does (with a template similar to  
					// `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`).
					//
					// *Initialize the render code.*
					// 
					// 		view = []
					// 		context = []
					// 		stack = fn { context.concat([this]) }
					// 		
					// *Render the root section.*
					//
					// 		view.push( "string" )
					// 		view.push( can.view.txt(
					//
					// *Render the nested section with `can.Mustache.txt`.*
					//
					// 			txt( 
					//
					// *Add the current context to the stack.*
					//
					// 				stack(), 
					//
					// *Flag this for truthy section mode.*
					//
					// 				"#",
					//
					// *Interpolate and check the `a` variable for truthyness using the stack with `can.Mustache.get`.*
					// 
					// 				get( "a", stack() ),
					//
					// *Include the nested section's inner logic.
					// The stack argument is usually the parent section's copy of the stack, 
					// but it can be an override context that was passed by a custom helper.
					// Sections can nest `0..n` times -- **NESTCEPTION**.*
					//
					// 				{ fn: fn(stack) {
					//
					// *Render the nested section (everything between the `{{#a}}` and `{{/a}}` tokens).*
					//
					// 					view = []
					// 					view.push( "string" )
					// 					view.push(
					//
					// *Add the current context to the stack.*
					//
					// 						stack(),
					//
					// *Flag this as interpolation-only mode.*
					//
					// 						null,
					//
					// *Interpolate the `b.c.d.e.name` variable using the stack.*
					//
					// 						get( "b.c.d.e.name", stack() ),
					// 					)
					// 					view.push( "string" )
					//
					// *Return the result for the nested section.*
					//
					// 					return view.join()
					// 				}}
					// 			)
					// 		))
					// 		view.push( "string" )
					//
					// *Return the result for the root section, which includes all nested sections.*
					//
					// 		return view.join()
					//
					// ##### Initialization
					//
					// Each rendered template is started with the following initialization code:
					//
					// 		var ___v1ew = [];
					// 		var ___c0nt3xt = [];
					// 		___c0nt3xt.__sc0pe = true;
					// 		var __sc0pe = function(context, self) {
					// 			var s;
					// 			if (arguments.length == 1 && context) {
					// 				s = !context.__sc0pe ? [context] : context;
					// 			} else {
					// 				s = context && context.__sc0pe 
					//					? context.concat([self]) 
					//					: __sc0pe(context).concat([self]);
					// 			}
					// 			return (s.__sc0pe = true) && s;
					// 		};
					//
					// The `___v1ew` is the the array used to serialize the view.
					// The `___c0nt3xt` is a stacking array of contexts that slices and expands with each nested section.
					// The `__sc0pe` function is used to more easily update the context stack in certain situations.
					// Usually, the stack function simply adds a new context (`self`/`this`) to a context stack. 
					// However, custom helpers will occasionally pass override contexts that need their own context stack.
					//
					// ##### Sections
					//
					// Each section, `{{#section}} content {{/section}}`, within a Mustache template generates a section 
					// context in the resulting render code. The template itself is treated like a root section, with the 
					// same execution logic as any others. Each section can have `0..n` nested sections within it.
					//
					// Here's an example of a template without any descendent sections.  
					// Given the template: `"{{a.b.c.d.e.name}}" == "Phil"`  
					// Would output the following render code:
					//
					//		___v1ew.push("\"");
					//		___v1ew.push(can.view.txt(1, '', 0, this, function() {
					// 			return can.Mustache.txt(__sc0pe(___c0nt3xt, this), null, 
					//				can.Mustache.get("a.b.c.d.e.name", 
					//					__sc0pe(___c0nt3xt, this))
					//			);
					//		}));
					//		___v1ew.push("\" == \"Phil\"");
					//
					// The simple strings will get appended to the view. Any interpolated references (like `{{a.b.c.d.e.name}}`) 
					// will be pushed onto the view via `can.view.txt` in order to support live binding.
					// The function passed to `can.view.txt` will call `can.Mustache.txt`, which serializes the object data by doing 
					// a context lookup with `can.Mustache.get`.
					//
					// `can.Mustache.txt`'s first argument is a copy of the context stack with the local context `this` added to it.
					// This stack will grow larger as sections nest.
					//
					// The second argument is for the section type. This will be `"#"` for truthy sections, `"^"` for falsey, 
					// or `null` if it is an interpolation instead of a section.
					//
					// The third argument is the interpolated value retrieved with `can.Mustache.get`, which will perform the 
					// context lookup and return the approriate string or object.
					//
					// Any additional arguments, if they exist, are used for passing arguments to custom helpers.
					//
					// For nested sections, the last argument is an `options` object that contains the nested section's logic.
					//
					// Here's an example of a template with a single nested section.  
					// Given the template: `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`  
					// Would output the following render code:
					//
					//		___v1ew.push("\"");
					// 		___v1ew.push(can.view.txt(0, '', 0, this, function() {
					// 			return can.Mustache.txt(__sc0pe(___c0nt3xt, this), "#", 
					//				can.Mustache.get("a", __sc0pe(___c0nt3xt, this)), 
					//					[{
					// 					_: function() {
					// 						return ___v1ew.join("");
					// 					}
					// 				}, {
					// 					fn: function(___c0nt3xt) {
					// 						var ___v1ew = [];
					// 						___v1ew.push(can.view.txt(1, '', 0, this, 
					//								function() {
					//                                  return can.Mustache.txt(
					// 									__sc0pe(___c0nt3xt, this), 
					// 									null, 
					// 									can.Mustache.get("b.c.d.e.name", 
					// 										__sc0pe(___c0nt3xt, this))
					// 								);
					// 							}
					// 						));
					// 						return ___v1ew.join("");
					// 					}
					// 				}]
					//			)
					// 		}));
					//		___v1ew.push("\" == \"Phil\"");
					//
					// This is specified as a truthy section via the `"#"` argument. The last argument includes an array of helper methods used with `options`.
					// These act similarly to custom helpers: `options.fn` will be called for truthy sections, `options.inverse` will be called for falsey sections.
					// The `options._` function only exists as a dummy function to make generating the section nesting easier (a section may have a `fn`, `inverse`,
					// or both, but there isn't any way to determine that at compilation time).
					// 
					// Within the `fn` function is the section's render context, which in this case will render anything between the `{{#a}}` and `{{/a}}` tokens.
					// This function has `___c0nt3xt` as an argument because custom helpers can pass their own override contexts. For any case where custom helpers
					// aren't used, `___c0nt3xt` will be equivalent to the `__sc0pe(___c0nt3xt, this)` stack created by its parent section. The `inverse` function
					// works similarly, except that it is added when `{{^a}}` and `{{else}}` are used. `var ___v1ew = []` is specified in `fn` and `inverse` to 
					// ensure that live binding in nested sections works properly.
					//
					// All of these nested sections will combine to return a compiled string that functions similar to EJS in its uses of `can.view.txt`.
					//
					// #### Implementation
					{
						name: /^.*$/,
						fn: function (content, cmd) {
							var mode = false,
								result = {
									content: "",
									startTxt: false,
									startOnlyTxt: false,
									end: false
								};

							// Trim the content so we don't have any trailing whitespace.
							content = can.trim(content);

							// Determine what the active mode is.
							// 
							// * `#` - Truthy section
							// * `^` - Falsey section
							// * `/` - Close the prior section
							// * `else` - Inverted section (only exists within a truthy/falsey section)
							if (content.length && (mode = content.match(/^([#^/]|else$)/))) {
								mode = mode[0];
								switch (mode) {
									/**
									 * @function can.mustache.helpers.section {{#key}}
									 * @parent can.mustache.tags 3
									 *
									 * @signature `{{#key}}BLOCK{{/key}}`
									 *
									 * Render blocks of text one or more times, depending
									 * on the value of the key in the current context.
									 *
									 * @param {can.mustache.key} key A key that references a value within the current or parent
									 * [can.mustache.context context]. If the value is a function or [can.compute], the
									 * function's return value is used.
									 *
									 *
									 * @return {String}
									 *
									 * Depending on the value's type, the following actions happen:
									 *
									 * - `Array` or [can.List] - the block is rendered for
									 *   each item in the array. The [can.mustache.context context] is set to
									 *   the item within each block rendering.
									 * - A `truthy` value - the block is rendered with the [can.mustache.context context]
									 *   set to the value.
									 * - A `falsey` value - the block is not rendered.
									 *
									 * The rendered result of the blocks, block or an empty string is returned.
									 *
									 * @body
									 *
									 * Sections contain text blocks and evaluate whether to render it or not.  If
									 * the object evaluates to an array it will iterate over it and render the block
									 * for each item in the array.  There are four different types of sections.
									 *
									 * ## Falseys or Empty Arrays
									 *
									 * If the value returns a `false`, `undefined`, `null`, `""` or `[]` we consider
									 * that a *falsey* value.
									 *
									 * If the value is falsey, the section will **NOT** render the block.
									 *
									 *     {
									 *       friends: false
									 *     }
									 *
									 *     {{#friends}}
									 *       Never shown!
									 *     {{/friends}}
									 *
									 *
									 * ## Arrays
									 *
									 * If the value is a non-empty array, sections will iterate over the
									 * array of items, rendering the items in the block.
									 *
									 * For example, a list of friends will iterate
									 * over each of those items within a section.
									 *
									 *     {
									 *         friends: [
									 *             { name: "Austin" },
									 *             { name: "Justin" }
									 *         ]
									 *     }
									 *
									 *     <ul>
									 *         {{#friends}}
									 *             <li>{{name}}</li>
									 *         {{/friends}}
									 *     </ul>
									 *
									 * would render:
									 *
									 *     <ul>
									 *         <li>Austin</li>
									 *         <li>Justin</li>
									 *     </ul>
									 *
									 * Reminder: Sections will reset the current context to the value for which it is iterating.
									 * See the [basics of contexts](#Basics) for more information.
									 *
									 * ## Truthys
									 *
									 * When the value is a non-falsey object but not a list, it is considered truthy and will be used
									 * as the context for a single rendering of the block.
									 *
									 *     {
									 *         friends: { name: "Jon" }
									 *     }
									 *
									 *     {{#friends}}
									 *         Hi {{name}}
									 *     {{/friends}}
									 *
									 * would render:
									 *
									 *     Hi Jon!
									 */
									// 
									/**
									 * @function can.mustache.helpers.helper {{helper args hashes}}
									 * @parent can.mustache.htags 0
									 *
									 * @description Calls a mustache helper function and inserts its return value into
									 * the rendered template.
									 *
									 * @signature `{{helper [args...] [hashProperty=hashValue...]}}`
									 *
									 * Calls a mustache helper function or a function. For example:
									 *
									 * The template:
									 *
									 *     <p>{{madLib "Lebron James" verb 4 foo="bar"}}</p>
									 *
									 * Rendered with:
									 *
									 *     {verb: "swept"}
									 *
									 * Will call a `madLib` helper with the following arguements:
									 *
									 *     can.mustache.registerHelper('madLib',
									 *       function(subject, verb, number, options){
									 *         // subject -> "Lebron James"
									 *         // verb -> "swept"
									 *         // number -> 4
									 *         // options.hash.foo -> "bar"
									 *     });
									 *
									 * @param {can.mustache.key} helper A key that finds a [can.mustache.helper helper function]
									 * that is either [can.mustache.registerHelper registered] or found within the
									 * current or parent [can.mustache.context context].
									 *
									 * @param {...can.mustache.key|String|Number} [args] Space seperated arguments
									 * that get passed to the helper function as arguments. If the key's value is a:
									 *
									 *  - [can.Map] - A getter/setter [can.compute] is passed.
									 *  - [can.compute] - The can.compute is passed.
									 *  - `function` - The function's return value is passed.
									 *
									 * @param {String} hashProperty
									 *
									 * A property name that gets added to a [can.mustache.helperOptions helper options]'s
									 * hash object.
									 *
									 * @param {...can.mustache.key|String|Number} hashValue A value that gets
									 * set as a property value of the [can.mustache.helperOptions helper option argument]'s
									 * hash object.
									 *
									 * @body
									 *
									 * ## Use
									 *
									 * The `{{helper}}` syntax is used to call out to Mustache [can.mustache.helper helper functions] functions
									 * that may contain more complex functionality. `helper` is a [can.mustache.key key] that must match either:
									 *
									 *  - a [can.mustache.registerHelper registered helper function], or
									 *  - a function in the current or parent [can.mustache.context contexts]
									 *
									 * The following example shows both cases.
									 *
									 * The Template:
									 *
									 *     <p>{{greeting}} {{user}}</p>
									 *
									 * Rendered with data:
									 *
									 *     {
									 *       user: function(){ return "Justin" }
									 *     }
									 *
									 * And a with a registered helper like:
									 *
									 *     can.mustache.registerHelper('greeting', function(){
									 *       return "Hello"
									 *     });
									 *
									 * Results in:
									 *
									 *     <p>Hello Justin</p>
									 *
									 * ## Arguments
									 *
									 * Arguments can be passed from the template to helper function by
									 * listing space seperated strings, numbers or other [can.mustache.key keys] after the
									 * `helper` name.  For example:
									 *
									 * The template:
									 *
									 *     <p>{{madLib "Lebron James" verb 4}}</p>
									 *
									 * Rendered with:
									 *
									 *     {verb: "swept"}
									 *
									 * Will call a `madLib` helper with the following arguements:
									 *
									 *     can.mustache.registerHelper('madLib',
									 *       function(subject, verb, number, options){
									 *         // subject -> "Lebron James"
									 *         // verb -> "swept"
									 *         // number -> 4
									 *     });
									 *
									 * If an argument `key` value is a [can.Map] property, the Observe's
									 * property is converted to a getter/setter [can.compute]. For example:
									 *
									 * The template:
									 *
									 *     <p>What! My name is: {{mr user.name}}</p>
									 *
									 * Rendered with:
									 *
									 *     {user: new can.Map({name: "Slim Shady"})}
									 *
									 * Needs the helper to check if name is a function or not:
									 *
									 *     can.mustache.registerHelper('mr',function(name){
									 *       return "Mr. "+ (typeof name === "function" ?
									 *                       name():
									 *                       name)
									 *     })
									 *
									 * This behavior enables two way binding helpers and is explained in more detail
									 * on the [can.mustache.helper helper functions] docs.
									 *
									 * ## Hash
									 *
									 * If enumerated arguments isn't an appropriate way to configure the behavior
									 * of a helper, it's possible to pass a hash of key-value pairs to the
									 * [can.mustache.helperOptions helper option argument]'s
									 * hash object.  Properties and values are specified
									 * as `hashProperty=hashValue`.  For example:
									 *
									 * The template:
									 *
									 *     <p>My {{excuse who=pet how="shreded"}}</p>
									 * `
									 * And the helper:
									 *
									 *     can.mustache.registerHelper("excuse",function(options){
									 *       return ["My",
									 *         options.hash.who || "dog".
									 *         options.hash.how || "ate",
									 *         "my",
									 *         options.hash.what || "homework"].join(" ")
									 *     })
									 *
									 * Render with:
									 *
									 *     {pet: "cat"}
									 *
									 * Results in:
									 *
									 *     <p>My cat shareded my homework</p>
									 *
									 * ## Returning an element callback function
									 *
									 * If a helper returns a function, that function is called back after
									 * the template has been rendered into DOM elements. This can
									 * be used to create mustache tags that have rich behavior. Read about it
									 * on the [can.mustache.helper helper function] page.
									 *
									 */
									// 
									/**
									 * @function can.mustache.helpers.sectionHelper {{#helper args hashes}}
									 * @parent can.mustache.htags 1
									 *
									 * Calls a mustache helper function with a block, and optional inverse
									 * block.
									 *
									 * @signature `{{#helper [args...] [hashName=hashValue...]}}BLOCK{{/helper}}`
									 *
									 * Calls a mustache helper function or a function with a block to
									 * render.
									 *
									 * The template:
									 *
									 *     <p>{{countTo number}}{{num}}{{/countTo}}</p>
									 *
									 * Rendered with:
									 *
									 *     {number: 5}
									 *
									 * Will call the `countTo` helper:
									 *
									 *     can.mustache.registerHelper('madLib',
									 *       function(number, options){
									 *         var out = []
									 *         for(var i =0; i < number; i++){
									 *           out.push( options.fn({num: i+1}) )
									 *         }
									 *         return out.join(" ")
									 *     });
									 *
									 * Results in:
									 *
									 *     <p>1 2 3 4 5</p>
									 *
									 * @param {can.mustache.key} helper A key that finds a [can.mustache.helper helper function]
									 * that is either [can.mustache.registerHelper registered] or found within the
									 * current or parent [can.mustache.context context].
									 *
									 * @param {...can.mustache.key|String|Number} [args] Space seperated arguments
									 * that get passed to the helper function as arguments. If the key's value is a:
									 *
									 *  - [can.Map] - A getter/setter [can.compute] is passed.
									 *  - [can.compute] - The can.compute is passed.
									 *  - `function` - The function's return value is passed.
									 *
									 * @param {String} hashProperty
									 *
									 * A property name that gets added to a [can.mustache.helperOptions helper options]'s
									 * hash object.
									 *
									 * @param {...can.mustache.key|String|Number} hashValue A value that gets
									 * set as a property value of the [can.mustache.helperOptions helper option argument]'s
									 * hash object.
									 *
									 * @param {mustache} BLOCK A mustache template that gets compiled and
									 * passed to the helper function as the [can.mustache.helperOptions options argument's] `fn`
									 * property.
									 *
									 *
									 * @signature `{{#helper [args...] [hashName=hashValue...]}}BLOCK{{else}}INVERSE{{/helper}}`
									 *
									 * Calls a mustache helper function or a function with a `fn` and `inverse` block to
									 * render.
									 *
									 * The template:
									 *
									 *     <p>The bed is
									 *        {{isJustRight firmness}}
									 *           pefect!
									 *        {{else}}
									 *           uncomfortable.
									 *        {{/justRight}}</p>
									 *
									 * Rendered with:
									 *
									 *     {firmness: 45}
									 *
									 * Will call the `isJustRight` helper:
									 *
									 *     can.mustache.registerHelper('isJustRight',
									 *       function(number, options){
									 *         if(number > 50){
									 *           return options.fn(this)
									 *         } else {
									 *           return options.inverse(this)
									 *         }
									 *         return out.join(" ")
									 *     });
									 *
									 * Results in:
									 *
									 *     <p>The bed is uncomfortable.</p>
									 *
									 * @param {can.mustache.key} helper A key that finds a [can.mustache.helper helper function]
									 * that is either [can.mustache.registerHelper registered] or found within the
									 * current or parent [can.mustache.context context].
									 *
									 * @param {...can.mustache.key|String|Number} [args] Space seperated arguments
									 * that get passed to the helper function as arguments. If the key's value is a:
									 *
									 *  - [can.Map] - A getter/setter [can.compute] is passed.
									 *  - [can.compute] - The can.compute is passed.
									 *  - `function` - The function's return value is passed.
									 *
									 * @param {String} hashProperty
									 *
									 * A property name that gets added to a [can.mustache.helperOptions helper options]'s
									 * hash object.
									 *
									 * @param {...can.mustache.key|String|Number} hashValue A value that gets
									 * set as a property value of the [can.mustache.helperOptions helper option argument]'s
									 * hash object.
									 *
									 * @param {mustache} BLOCK A mustache template that gets compiled and
									 * passed to the helper function as the [can.mustache.helperOptions options argument's] `fn`
									 * property.
									 *
									 * @param {mustache} INVERSE A mustache template that gets compiled and
									 * passed to the helper function as the [can.mustache.helperOptions options argument's] `inverse`
									 * property.
									 *
									 *
									 * @body
									 *
									 * ## Use
									 *
									 * Read the [use section of {{helper}}](can.mustache.helpers.helper.html#section_Use) to better understand how:
									 *
									 *  - [Helper functions are found](can.mustache.helpers.helper.html#section_Arguments)
									 *  - [Arguments are passed to the helper](can.mustache.helpers.helper.html#section_Arguments)
									 *  - [Hash values are passed to the helper](can.mustache.helpers.helper.html#section_Hash)
									 *
									 * Read how [helpers that return functions](can.mustache.helper.html#section_Returninganelementcallbackfunction) can
									 * be used for rich behavior like 2-way binding.
									 *
									 */
									// Open a new section.
								case '#':
									/**
									 * @function can.mustache.helpers.inverse {{^key}}
									 * @parent can.mustache.tags 5
									 *
									 * @signature `{{^key}}BLOCK{{/key}}`
									 *
									 * Render blocks of text if the value of the key
									 * is falsey.  An inverted section syntax is similar to regular
									 * sections except it begins with a caret rather than a
									 * pound. If the value referenced is falsey, the section will render.
									 *
									 * @param {can.mustache.key} key A key that references a value within the current or parent
									 * [can.mustache.context context]. If the value is a function or [can.compute], the
									 * function's return value is used.
									 *
									 * @return {String}
									 *
									 * Depending on the value's type, the following actions happen:
									 *
									 * - A `truthy` value - the block is not rendered.
									 * - A `falsey` value - the block is rendered.
									 *
									 * The rendered result of the block or an empty string is returned.
									 *
									 * @body
									 *
									 * ## Use
									 *
									 * Inverted sections match falsey values. An inverted section
									 * syntax is similar to regular sections except it begins with a caret
									 * rather than a pound. If the value referenced is falsey, the section
									 * will render. For example:
									 *
									 *
									 * The template:
									 *
									 *     <ul>
									 *         {{#friends}}
									 *             </li>{{name}}</li>
									 *         {{/friends}}
									 *         {{^friends}}
									 *             <li>No friends.</li>
									 *         {{/friends}}
									 *     </ul>
									 *
									 * And data:
									 *
									 *     {
									 *         friends: []
									 *     }
									 *
									 * Results in:
									 *
									 *
									 *     <ul>
									 *         <li>No friends.</li>
									 *     </ul>
									 */
								case '^':
									if (cmd.specialAttribute) {
										result.startOnlyTxt = true;
										//result.push(cmd.insert + 'can.view.onlytxt(this,function(){ return ');
									} else {
										result.startTxt = true;
										// sections should never be escaped
										result.escaped = 0;
										//result.push(cmd.insert + 'can.view.txt(0,\'' + cmd.tagName + '\',' + cmd.status + ',this,function(){ return ');
									}
									break;
									// Close the prior section.
									/**
									 * @function can.mustache.helpers.close {{/key}}
									 * @parent can.mustache.tags 4
									 *
									 * @signature `{{/key}}`
									 *
									 * Ends a [can.mustache.helpers.section {{#key}}] or [can.mustache.helpers.sectionHelper {{#helper}}]
									 * block.
									 *
									 * @param {can.mustache.key} [key] A key that matches the opening key or helper name. It's also
									 * possible to simply write `{{/}}` to end a block.
									 */
								case '/':
									result.end = true;
									result.content += 'return ___v1ew.join("");}}])';
									return result;
								}

								// Trim the mode off of the content.
								content = content.substring(1);
							}

							// `else` helpers are special and should be skipped since they don't 
							// have any logic aside from kicking off an `inverse` function.
							if (mode !== 'else') {
								var args = [],
									hashes = [],
									i = 0,
									m;

								// Start the content render block.
								result.content += 'can.Mustache.txt(\n' +
									(cmd.specialAttribute ? SPECIAL_CONTEXT_OBJ : CONTEXT_OBJ ) +
									',\n' + (mode ? '"' + mode + '"' : 'null') + ',';

								// Parse the helper arguments.
								// This needs uses this method instead of a split(/\s/) so that 
								// strings with spaces can be correctly parsed.
								(can.trim(content) + ' ')
									.replace(argumentsRegExp, function (whole, arg) {

										// Check for special helper arguments (string/number/boolean/hashes).
										if (i && (m = arg.match(literalNumberStringBooleanRegExp))) {
											// Found a native type like string/number/boolean.
											if (m[2]) {
												args.push(m[0]);
											}
											// Found a hash object.
											else {
												// Addd to the hash object.

												hashes.push(m[4] + ":" + (m[6] ? m[6] : makeLookupLiteral(m[5])));
											}
										}
										// Otherwise output a normal interpolation reference.
										else {
											args.push(makeLookupLiteral(arg));
										}
										i++;
									});

								result.content += args.join(",");
								if (hashes.length) {
									result.content += ",{" + HASH + ":{" + hashes.join(",") + "}}";
								}

							}

							// Create an option object for sections of code.
							if (mode && mode !== 'else') {
								result.content += ',[\n\n';
							}
							switch (mode) {
								// Truthy section
							case '^':
							case '#':
								result.content += ('{fn:function(' + ARG_NAMES + '){var ___v1ew = [];');
								break;
								// If/else section
								// Falsey section
								/**
								 * @function can.mustache.helpers.else {{else}}
								 * @parent can.mustache.htags 3
								 *
								 * @signature `{{#helper}}BLOCK{{else}}INVERSE{{/helper}}`
								 *
								 * Creates an `inverse` block for a [can.mustache.helper helper function]'s
								 * [can.mustache.helperOptions options argument]'s `inverse` property.
								 *
								 * @param {can.mustache} INVERSE a mustache template coverted to a
								 * function and set as the [can.mustache.helper helper function]'s
								 * [can.mustache.helperOptions options argument]'s `inverse` property.
								 *
								 * @body
								 *
								 * ## Use
								 *
								 * For more information on how `{{else}}` is used checkout:
								 *
								 *  - [can.mustache.helpers.if {{if key}}]
								 *  - [can.mustache.helpers.sectionHelper {{#helper}}]
								 *
								 */
							case 'else':
								result.content += 'return ___v1ew.join("");}},\n{inverse:function(' + ARG_NAMES + '){\nvar ___v1ew = [];';
								break;

								// Not a section, no mode
							default:
								result.content += (')');
								break;
							}

							if (!mode) {
								result.startTxt = true;
								result.end = true;
							}

							return result;
						}
					}
				]
			})
		});

		// Add in default scanner helpers first.
		// We could probably do this differently if we didn't 'break' on every match.
		var helpers = can.view.Scanner.prototype.helpers;
		for (var i = 0; i < helpers.length; i++) {
			Mustache.prototype.scanner.helpers.unshift(helpers[i]);
		}

		/**
		 * @function can.MustacheConstructor.txt
		 * @hide
		 *
		 * Evaluates the resulting string based on the context/name.
		 *
		 * @param {Object|Array} context	The context stack to be used with evaluation.
		 * @param {String} mode		The mode to evaluate the section with: # for truthy, ^ for falsey
		 * @param {String|Object} name	The string (or sometimes object) to pass to the given helper method.
		 */
		Mustache.txt = function (scopeAndOptions, mode, name) {

			// here we are going to cache the lookup values so future calls are much faster
			var scope = scopeAndOptions.scope,
				options = scopeAndOptions.options,
				args = [],
				helperOptions = {
					fn: function () {},
					inverse: function () {}
				},
				hash,
				context = scope.attr("."),
				getHelper = true,
				helper;

			// convert lookup values to actual values in name, arguments, and hash
			for (var i = 3; i < arguments.length; i++) {
				var arg = arguments[i];
				if (mode && can.isArray(arg)) {
					// merge into options
					helperOptions = can.extend.apply(can, [helperOptions].concat(arg));
				} else if (arg && arg[HASH]) {
					hash = arg[HASH];
					// get values on hash
					for (var prop in hash) {
						if (isLookup(hash[prop])) {
							hash[prop] = Mustache.get(hash[prop].get, scopeAndOptions, false, true);
						}
					}
				} else if (arg && isLookup(arg)) {
					args.push(Mustache.get(arg.get, scopeAndOptions, false, true, true));
				} else {
					args.push(arg);
				}
			}

			if (isLookup(name)) {
				var get = name.get;
				name = Mustache.get(name.get, scopeAndOptions, args.length, false);

				// Base whether or not we will get a helper on whether or not the original
				// name.get and Mustache.get resolve to the same thing. Saves us from running
				// into issues like {{text}} / {text: 'with'}
				getHelper = (get === name);
			}

			// overwrite fn and inverse to always convert to scopes
			helperOptions.fn = makeConvertToScopes(helperOptions.fn, scope, options);
			helperOptions.inverse = makeConvertToScopes(helperOptions.inverse, scope, options);

			// if mode is ^, swap fn and inverse
			if(mode === '^') {
				var tmp = helperOptions.fn;
				helperOptions.fn = helperOptions.inverse;
				helperOptions.inverse = tmp;
			}

			// Check for a registered helper or a helper-like function.
			if (helper = (getHelper && (typeof name === "string" && Mustache.getHelper(name, options)) || (can.isFunction(name) && !name.isComputed && {
				fn: name
			}))) {
				// Add additional data to be used by helper functions

				can.extend(helperOptions, {
					context: context,
					scope: scope,
					contexts: scope,
					hash: hash
				});

				args.push(helperOptions);
				// Call the helper.
				return function () {
					return helper.fn.apply(context, args) || '';
				};

			}
			/*if( !mode && !args.length && can.isFunction(name) && name.isComputed ) {
				if(!scopeAndOptions.special) {
					name.canReadForChangeEvent = false;
				}
				return name;
			}*/
			return function () {
				//{{#foo.bar zed ted}}
				var value;
				if (can.isFunction(name) && name.isComputed) {
					value = name();
				} else {
					value = name;
				}
				// An array of arguments to check for truthyness when evaluating sections.
				var validArgs = args.length ? args : [value],
					// Whether the arguments meet the condition of the section.
					valid = true,
					result = [],
					i, argIsObserve, arg;
				// Validate the arguments based on the section mode.
				if (mode) {
					for (i = 0; i < validArgs.length; i++) {
						arg = validArgs[i];
						argIsObserve = typeof arg !== 'undefined' && isObserveLike(arg);
						// Array-like objects are falsey if their length = 0.
						if (isArrayLike(arg)) {
							// Use .attr to trigger binding on empty lists returned from function
							if (mode === '#') {
								valid = valid && !! (argIsObserve ? arg.attr('length') : arg.length);
							} else if (mode === '^') {
								valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
							}
						}
						// Otherwise just check if it is truthy or not.
						else {
							valid = mode === '#' ? valid && !! arg : mode === '^' ? valid && !arg : valid;
						}
					}
				}

				// Otherwise interpolate like normal.
				if (valid) {

					if (mode === "#") {
						if (isArrayLike(value)) {
							var isObserveList = isObserveLike(value);

							// Add the reference to the list in the contexts.
							for (i = 0; i < value.length; i++) {
								result.push(helperOptions.fn(
									isObserveList ? value.attr('' + i) : value[i]));
							}
							return result.join('');
						}
						// Normal case.
						else {
							return helperOptions.fn(value || {}) || '';
						}
					} else if (mode === "^") {
						return helperOptions.inverse(value || {}) || '';
					} else {
						return '' + (value != null ? value : '');
					}
				}

				return '';
			};
		};

		/**
		 * @function can.MustacheConstructor.get
		 * @hide
		 *
		 * Resolves a key for a given object (and then a context if that fails).
		 *
		 *     obj = this
		 *     context = { a: true }
		 *     ref = 'a.b.c'
		 *          => obj.a.b.c || context.a.b.c || ''
		 *
		 * This implements the following Mustache specs:
		 * Deeply Nested Contexts
		 * All elements on the context stack should be accessible.
		 *
		 *     {{#bool}}B {{#bool}}C{{/bool}} D{{/bool}}
		 *     { bool: true }
		 *     => "B C D"
		 *
		 * Basic Context Miss Interpolation
		 * Failed context lookups should default to empty strings.
		 *
		 *     {{cannot}}
		 *     => ""
		 *
		 * Dotted Names - Broken Chains
		 * Any falsey value prior to the last part of the name should yield ''.
		 *		{{a.b.c}}
		 *		{ a: { d: 1 } }
		 *		=> ""
		 *
		 * @param {can.mustache.key} key The reference to check for on the obj/context.
		 * @param {Object} obj The object to use for checking for a reference.
		 * @param {Object} context The context to use for checking for a reference if it doesn't exist in the object.
		 * @param {Boolean} [isHelper] Whether the reference is seen as a helper.
		 */
		Mustache.get = function (key, scopeAndOptions, isHelper, isArgument, isLookup) {

			// Cache a reference to the current context and options, we will use them a bunch.
			var context = scopeAndOptions.scope.attr('.'),
				options = scopeAndOptions.options || {};

			// If key is called as a helper,
			if (isHelper) {
				// try to find a registered helper.
				if (Mustache.getHelper(key, options)) {
					return key;
				}
				// Support helper-like functions as anonymous helpers.
				// Check if there is a method directly in the "top" context.
				if (scopeAndOptions.scope && can.isFunction(context[key])) {
					return context[key];
				}

			
			}

			// Get a compute (and some helper data) that represents key's value in the current scope
			var computeData = scopeAndOptions.scope.computeData(key, {
				isArgument: isArgument,
				args: [context, scopeAndOptions.scope]
			}),
				compute = computeData.compute;

			// Bind on the compute to cache its value. We will unbind in a timeout later.
			can.compute.temporarilyBind(compute);

			// computeData gives us an initial value
			var initialValue = computeData.initialValue;
			  
		

			// Use helper over the found value if the found value isn't in the current context
			if (!isLookup && (initialValue === undefined || computeData.scope !== scopeAndOptions.scope) && Mustache.getHelper(key, options)) {
				return key;
			}

			// If there are no dependencies, just return the value.
			if (!compute.hasDependencies) {
				return initialValue;
			} else {
				return compute;
			}
		};

		/**
		 * @hide
		 *
		 * Resolves an object to its truthy equivalent.
		 *
		 * @param {Object} value    The object to resolve.
		 * @return {Object} The resolved object.
		 */
		Mustache.resolve = function (value) {
			if (isObserveLike(value) && isArrayLike(value) && value.attr('length')) {
				return value;
			} else if (can.isFunction(value)) {
				return value();
			} else {
				return value;
			}
		};

		/**
		 * @static
		 */

		can.view.Options = can.view.Scope.extend({
			init: function (data, parent) {
				if (!data.helpers && !data.partials && !data.tags) {
					data = {
						helpers: data
					};
				}
				can.view.Scope.prototype.init.apply(this, arguments);
			}
		});

		// ## Helpers
		//
		// Helpers are functions that can be called from within a template.
		// These helpers differ from the scanner helpers in that they execute
		// at runtime instead of during compilation.
		//
		// Custom helpers can be added via `can.Mustache.registerHelper`,
		// but there are also some built-in helpers included by default.
		// Most of the built-in helpers are little more than aliases to actions 
		// that the base version of Mustache simply implies based on the 
		// passed in object.
		// 
		// Built-in helpers:
		// 
		// * `data` - `data` is a special helper that is implemented via scanning helpers. 
		//		It hooks up the active element to the active data object: `<div {{data "key"}} />`
		// * `if` - Renders a truthy section: `{{#if var}} render {{/if}}`
		// * `unless` - Renders a falsey section: `{{#unless var}} render {{/unless}}`
		// * `each` - Renders an array: `{{#each array}} render {{this}} {{/each}}`
		// * `with` - Opens a context section: `{{#with var}} render {{/with}}`
		Mustache._helpers = {};
		/**
		 * @function can.mustache.registerHelper
		 * @parent can.mustache.methods
		 * @description Register a helper.
		 * @function can.mustache.registerHelper registerHelper
		 * @signature `Mustache.registerHelper(name, helper)`
		 * @param {String} name The name of the helper.
		 * @param {can.mustache.helper} helper The helper function.
		 *
		 * @body
		 * Registers a helper with the Mustache system.
		 * Pass the name of the helper followed by the
		 * function to which Mustache should invoke.
		 * These are run at runtime.
		 */
		Mustache.registerHelper = function (name, fn) {
			this._helpers[name] = {
				name: name,
				fn: fn
			};
		};

		/**
		 * @hide
		 * @function can.MustacheConstructor.getHelper getHelper
		 * @description Retrieve a helper.
		 * @signature `Mustache.getHelper(name)`
		 * @param {String} name The name of the helper.
		 * @return {Function|null} The helper, or `null` if
		 * no helper by that name is found.
		 *
		 * @body
		 * Returns a helper given the name.
		 */
		Mustache.getHelper = function (name, options) {
			var helper = options.attr("helpers." + name);
			return helper ? {
				fn: helper
			} : this._helpers[name];
		};

		/**
		 * @function can.MustacheConstructor.static.render render
		 * @hide
		 * @parent can.Mustache.static
		 * @signature `Mustache.render(partial, context)`
		 * @param {Object} partial
		 * @param {can.view.Scope} scope
		 *
		 * @body
		 * `Mustache.render` is a helper method that calls
		 * into `can.view.render` passing the partial
		 * and the context object.
		 *
		 * Its purpose is to determine if the partial object
		 * being passed represents a template like:
		 *
		 *     partial === "movember.mustache"
		 *
		 * or if the partial is a variable name that represents
		 * a partial on the context object such as:
		 *
		 *     context[partial] === "movember.mustache"
		 */
		Mustache.render = function (partial, scope, options) {
			// TOOD: clean up the following
			// If there is a "partial" property and there is not
			// an already-cached partial, we use the value of the 
			// property to look up the partial

			// if this partial is not cached ...
			if (!can.view.cached[partial]) {
				// we don't want to bind to changes so clear and restore reading
				var reads = can.__clearReading();
				if (scope.attr('partial')) {
					partial = scope.attr('partial');
				}
				can.__setReading(reads);
			}

			// Call into `can.view.render` passing the
			// partial and scope.
			return can.view.render(partial, scope, options);
		};

		/**
		 * @function can.mustache.safeString
		 * @parent can.mustache.methods
		 * 
		 * @signature `can.mustache.safeString(str)`
		 *
		 * @param {String} str A string you don't want to become escaped.
		 * @return {String} A string flagged by `can.mustache` as safe, which will
		 * not become escaped, even if you use [can.mustache.tags.unescaped](triple slash).
		 *
		 * @body
		 * If you write a helper that generates its own HTML, you will
		 * usually want to return a `can.mustache.safeString.` In this case,
		 * you will want to manually escape parameters with `[can.esc].`
		 *
		 * @codestart
		 * can.mustache.registerHelper('link', function(text, url) {
		 *   text = can.esc(text);
		 *   url  = can.esc(url);
		 *
		 *   var result = '&lt;a href="' + url + '"&gt;' + text + '&lt;/a&gt;';
		 *   return can.mustache.safeString(result);
		 * });
		 * @codeend
		 *
		 * Rendering:
		 * @codestart
		 * &lt;div&gt;{{link "Google", "http://google.com"}}&lt;/div&gt;
		 * @codeend
		 *
		 * Results in:
		 *
		 * @codestart
		 * &lt;div&gt;&lt;a href="http://google.com"&gt;Google&lt;/a&gt;&lt;/div&gt;
		 * @codeend
		 *
		 * As an anchor tag whereas if we would have just returned the result rather than a
		 * `can.mustache.safeString` our template would have rendered a div with the escaped anchor tag.
		 *
		 */
		Mustache.safeString = function (str) {
			return {
				toString: function () {
					return str;
				}
			};
		};

		Mustache.renderPartial = function (partialName, scope, options) {
			var partial = options.attr("partials." + partialName);
			if (partial) {
				return partial.render ? partial.render(scope, options) :
					partial(scope, options);
			} else {
				return can.Mustache.render(partialName, scope, options);
			}
		};

		// The built-in Mustache helpers.
		can.each({
			// Implements the `if` built-in helper.
			/**
			 * @function can.mustache.helpers.if {{#if key}}
			 * @parent can.mustache.htags 2
			 * @signature `{{#if key}}BLOCK{{/if}}`
			 *
			 * Renders the `BLOCK` template within the current template.
			 *
			 * @param {can.mustache.key} key A key that references a value within the current or parent
			 * context. If the value is a function or can.compute, the function's return value is used.
			 *
			 * @param {can.mustache} BLOCK A mustache template.
			 *
			 * @return {String} If the key's value is truthy, the `BLOCK` is rendered with the
			 * current context and its value is returned; otherwise, an empty string.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * `{{#if key}}` provides explicit conditional truthy tests. For example,
			 *
			 * The template:
			 *
			 *     {{#if user.isFemale}}
			 *       {{#if user.isMarried}}
			 *         Mrs
			 *       {{/if}}
			 *       {{#if user.isSingle}}
			 *         Miss
			 *       {{/if}}
			 *     {{/if}}
			 *
			 * Rendered with:
			 *
			 *     {user: {isFemale: true, isMarried: true}}
			 *
			 * Results in:
			 *
			 *     Mrs
			 *
			 * If can be used with [can.mustache.helpers.else {{else}}] too. For example,
			 *
			 *     {{#if user.isFemale}}
			 *       {{#if user.isMarried}}
			 *         Mrs
			 *       {{else}}
			 *         Miss
			 *       {{/if}}
			 *     {{/if}}
			 *
			 * Rendered with:
			 *
			 *     {user: {isFemale: true, isMarried: false}}
			 *
			 * Results in:
			 *
			 *     Miss
			 */
			'if': function (expr, options) {
				var value;
				// if it's a function, wrap its value in a compute
				// that will only change values from true to false
				if (can.isFunction(expr)) {
					value = can.compute.truthy(expr)();
				} else {
					value = !! Mustache.resolve(expr);
				}

				if (value) {
					return options.fn(options.contexts || this);
				} else {
					return options.inverse(options.contexts || this);
				}
			},
			// Implements the `unless` built-in helper.
			/**
			 * @function can.mustache.helpers.unless {{#unless key}}
			 * @parent can.mustache.htags 4
			 *
			 * @signature `{{#unless key}}BLOCK{{/unless}}`
			 *
			 * Render the block of text if the key's value is falsey.
			 *
			 * @param {can.mustache.key} key A key that references a value within the current or parent
			 * context. If the value is a function or can.compute, the function's
			 * return value is used.
			 *
			 * @param {can.mustache} BLOCK A template that is rendered
			 * if the `key`'s value is falsey.
			 *
			 * @body
			 *
			 * The `unless` helper evaluates the inverse of the value
			 * of the key and renders the block between the helper and the slash.
			 *
			 *     {{#unless expr}}
			 *       // unless
			 *     {{/unless}}
			 */
			'unless': function (expr, options) {
				return Mustache._helpers['if'].fn.apply(this, [can.isFunction(expr) ? can.compute(function() { return !expr(); }) : !expr, options]);
			},

			// Implements the `each` built-in helper.
			/**
			 * @function can.mustache.helpers.each {{#each key}}
			 * @parent can.mustache.htags 5
			 *
			 * @signature `{{#each key}}BLOCK{{/each}}`
			 *
			 * Render the block of text for each item in key's value.
			 *
			 * @param {can.mustache.key} key A key that references a value within the current or parent
			 * context. If the value is a function or can.compute, the function's
			 * return value is used.
			 *
			 * If the value of the key is a [can.List], the resulting HTML is updated when the
			 * list changes. When a change in the list happens, only the minimum amount of DOM
			 * element changes occur.
			 *
			 * If the value of the key is a [can.Map], the resulting HTML is updated whenever
			 * attributes are added or removed. When a change in the map happens, only
			 * the minimum amount of DOM element changes occur.
			 *
			 * @param {can.mustache} BLOCK A template that is rendered for each item in
			 * the `key`'s value. The `BLOCK` is rendered with the context set to the item being rendered.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * Use the `each` helper to iterate over a array
			 * of items and render the block between the helper and the slash. For example,
			 *
			 * The template:
			 *
			 *     <ul>
			 *       {{#each friends}}
			 *         <li>{{name}}</li>
			 *       {{/each}}
			 *     </ul>
			 *
			 * Rendered with:
			 *
			 *     {friends: [{name: "Austin"},{name: "Justin"}]}
			 *
			 * Renders:
			 *
			 *     <ul>
			 *       <li>Austin</li>
			 *       <li>Justin</li>
			 *     </ul>
			 *
			 * ## Object iteration
			 *
			 * As of 2.1, you can now iterate over properties of objects and attributes with
			 * the `each` helper. When iterating over [can.Map] it will only iterate over the
			 * map's [keys](can.Map.keys.html) and none of the hidden properties of a can.Map. For example,
			 *
			 * The template:
			 *
			 *     <ul>
			 *       {{#each person}}
			 *         <li>{{.}}</li>
			 *       {{/each}}
			 *     </ul>
			 *
			 * Rendered with:
			 *
			 *     {person: {name: 'Josh', age: 27}}
			 *
			 * Renders:
			 *
			 *     <ul>
			 *       <li>Josh</li>
			 *       <li>27</li>
			 *     </ul>
			 */
			'each': function (expr, options) {
				// Check if this is a list or a compute that resolves to a list, and setup
				// the incremental live-binding 

				// First, see what we are dealing with.  It's ok to read the compute
				// because can.view.text is only temporarily binding to what is going on here.
				// Calling can.view.lists prevents anything from listening on that compute.
				var resolved = Mustache.resolve(expr),
					result = [],
					keys,
					key,
					i;

				// When resolved === undefined, the property hasn't been defined yet
				// Assume it is intended to be a list
				if (can.view.lists && (resolved instanceof can.List || (expr && expr.isComputed && resolved === undefined))) {
					return can.view.lists(expr, function (item, index) {
						return options.fn(options.scope.add({
								"@index": index
							})
							.add(item));
					});
				}
				expr = resolved;

				if ( !! expr && isArrayLike(expr)) {
					for (i = 0; i < expr.length; i++) {
						result.push(options.fn(options.scope.add({
								"@index": i
							})
							.add(expr[i])));
					}
					return result.join('');
				} else if (isObserveLike(expr)) {
					keys = can.Map.keys(expr);
					// listen to keys changing so we can livebind lists of attributes.

					for (i = 0; i < keys.length; i++) {
						key = keys[i];
						result.push(options.fn(options.scope.add({
								"@key": key
							})
							.add(expr[key])));
					}
					return result.join('');
				} else if (expr instanceof Object) {
					for (key in expr) {
						result.push(options.fn(options.scope.add({
								"@key": key
							})
							.add(expr[key])));
					}
					return result.join('');

				}
			},
			// Implements the `with` built-in helper.
			/**
			 * @function can.mustache.helpers.with {{#with key}}
			 * @parent can.mustache.htags 6
			 *
			 * @signature `{{#with key}}BLOCK{{/with}}`
			 *
			 * Changes the context within a block.
			 *
			 * @param {can.mustache.key} key A key that references a value within the current or parent
			 * context. If the value is a function or can.compute, the function's
			 * return value is used.
			 *
			 * @param {can.mustache} BLOCK A template that is rendered
			 * with the context of the `key`'s value.
			 *
			 * @body
			 *
			 * Mustache typically applies the context passed in the section
			 * at compiled time.  However, if you want to override this
			 * context you can use the `with` helper.
			 *
			 *     {{#with arr}}
			 *       // with
			 *     {{/with}}
			 */
			'with': function (expr, options) {
				var ctx = expr;
				expr = Mustache.resolve(expr);
				if ( !! expr) {
					return options.fn(ctx);
				}
			},
			/**
			 * @function can.mustache.helpers.log {{log}}
			 * @parent can.mustache.htags 9
			 *
			 * @signature `{{#log [message]}}`
			 *
			 * Logs the context of the current block with an optional message.
			 *
			 * @param {*} message An optional message to log out in addition to the
			 * current context.
			 *
			 */
			'log': function (expr, options) {
				if(typeof console !== "undefined" && console.log) {
					if (!options) {
						console.log(expr.context);
					} else {
						console.log(expr, options.context);
					}
				}
			},
			/**
			 * @function can.mustache.helpers.elementCallback {{(el)->CODE}}
			 *
			 * @parent can.mustache.htags 8
			 *
			 * @signature `{{(el) -> CODE}}`
			 *
			 * Executes an element callback with the inline code on the element.
			 *
			 * @param {String} code The inline code to execute on the element.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * It is common for you to want to execute some code on a given
			 * DOM element. An example would be for initializing a jQuery plugin
			 * on the new HTML.
			 *
			 *     <div class="tabs" {{(el) -> el.jquery_tabs()}}></div>
			 *
			 */
			//
			/**
			 * @function can.mustache.helpers.index {{@index}}
			 *
			 * @parent can.mustache.htags 10
			 *
			 * @signature `{{@index [offset]}}`
			 *
			 * Insert the index of an Array or can.List we are iterating on with [#each](can.mustache.helpers.each)
			 *
			 * @param {Number} offset The number to optionally offset the index by.
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * When iterating over and array or list of items, you might need to render the index
			 * of the item. Use the `@index` directive to do so. For example,
			 *
			 * The template:
			 *
			 *     <ul>
			 *       {{#each items}}
			 *         <li> {{@index}} - {{.}} </li>
			 *       {{/each}}
			 *     </ul>
			 *
			 * Rendered with:
			 *
			 *     { items: ['Josh', 'Eli', 'David'] }
			 *
			 * Renders:
			 *
			 *     <ul>
			 *       <li> 0 - Josh </li>
			 *       <li> 1 - Eli </li>
			 *       <li> 2 - David </li>
			 *     </ul>
			 *
			 */
			"@index": function(offset, options) {
				if (!options) {
					options = offset;
					offset = 0;
				}
				var index = options.scope.attr("@index");
				return ""+((can.isFunction(index) ? index() : index) + offset);
			}
			/**
			 * @function can.mustache.helpers.key {{@key}}
			 *
			 * @parent can.mustache.htags 11
			 *
			 * @signature `{{@key}}`
			 *
			 * Insert the property name of an Object or attribute name of a can.Map that we iterate over with [#each](can.mustache.helpers.each)
			 *
			 * @body
			 *
			 * ## Use
			 *
			 * Use `{{@key}}` to render the property or attribute name of an Object or can.Map, when iterating over it with [#each](can.mustache.helpers.each). For example,
			 *
			 * The template:
			 *
			 *     <ul>
			 *       {{#each person}}
			 *         <li> {{@key}}: {{.}} </li>
			 *       {{/each}}
			 *     </ul>
			 *
			 * Rendered with:
			 *
			 *     { person: {name: 'Josh', age: 27, likes: 'Mustache, JavaScript, High Fives'} }
			 *
			 * Renders:
			 *
			 *     <ul>
			 *       <li> name: Josh </li>
			 *       <li> age: 27 </li>
			 *       <li> likes: Mustache, JavaScript, High Fives </li>
			 *     </ul>
			 *
			 */
		}, function (fn, name) {
			Mustache.registerHelper(name, fn);
		});

		// ## Registration
		//
		// Registers Mustache with can.view.
		can.view.register({
			suffix: "mustache",

			contentType: "x-mustache-template",

			// Returns a `function` that renders the view.
			script: function (id, src) {
				return "can.Mustache(function(" + ARG_NAMES + ") { " + new Mustache({
					text: src,
					name: id
				})
					.template.out + " })";
			},

			renderer: function (id, text) {
				return Mustache({
					text: text,
					name: id
				});
			}
		});
		
		can.mustache.registerHelper = can.proxy(can.Mustache.registerHelper, can.Mustache);
		can.mustache.safeString = can.Mustache.safeString;
		return can;
	});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/observe',["can/util/library", "can/map", "can/list", "can/compute"], function (can) {
	can.Observe = can.Map;
	can.Observe.startBatch = can.batch.start;
	can.Observe.stopBatch = can.batch.stop;
	can.Observe.triggerBatch = can.batch.trigger;
	return can;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/view/bindings',["can/util/library", "can/view/mustache", "can/control"], function (can) {
	/**
	 * @function isContentEditable
	 * @hide
	 *
	 * Determines if an element is contenteditable.
	 *
	 * An element is contenteditable if it contains the `contenteditable`
	 * attribute set to either an empty string or "true".
	 *
	 * By default an element is also contenteditable if its immediate parent
	 * has a truthy version of the attribute, unless the element is explicitly
	 * set to "false".
	 *
	 * @param {HTMLElement} el
	 * @return {Boolean} returns if the element is editable
	 */
	// Function for determining of an element is contenteditable
	var isContentEditable = (function(){
		// A contenteditable element has a value of an empty string or "true"
		var values = {
			"": true,
			"true": true,
			"false": false
		};

		// Tests if an element has the appropriate contenteditable attribute
		var editable = function(el){
			// DocumentFragments do not have a getAttribute
			if(!el || !el.getAttribute) {
				return;
			}

			var attr = el.getAttribute("contenteditable");
			return values[attr];
		};

		return function (el){
			// First check if the element is explicitly true or false
			var val = editable(el);
			if(typeof val === "boolean") {
				return val;
			} else {
				// Otherwise, check the parent
				return !!editable(el.parentNode);
			}
		};
	})(),
		removeCurly = function(value){
			if(value[0] === "{" && value[value.length-1] === "}") {
				return value.substr(1, value.length - 2);
			}
			return value;
		};

	// ## can-value
	// Implement the `can-value` special attribute
	// 
	// ### Usage
	// 		
	// 		<input can-value="name" />
	// 
	// When a view engine finds this attribute, it will call this callback. The value of the attribute 
	// should be a string representing some value in the current scope to cross-bind to.
	can.view.attr("can-value", function (el, data) {

		var attr = removeCurly(el.getAttribute("can-value")),
			// Turn the attribute passed in into a compute.  If the user passed in can-value="name" and the current 
			// scope of the template is some object called data, the compute representing this can-value will be the 
			// data.attr('name') property.
			value = data.scope.computeData(attr, {
				args: []
			})
				.compute,
			trueValue,
			falseValue;

		// Depending on the type of element, this attribute has different behavior. can.Controls are defined (further below 
		// in this file) for each type of input. This block of code collects arguments and instantiates each can.Control. There 
		// is one for checkboxes/radios, another for multiselect inputs, and another for everything else.
		if (el.nodeName.toLowerCase() === "input") {
			if (el.type === "checkbox") {
				// If the element is a checkbox and has an attribute called "can-true-value", 
				// set up a compute that toggles the value of the checkbox to "true" based on another attribute. 
				// 
				// 		<input type='checkbox' can-value='sex' can-true-value='male' can-false-value='female' />
				if (can.attr.has(el, "can-true-value")) {
					trueValue = el.getAttribute("can-true-value");
				} else {
					trueValue = true;
				}
				if (can.attr.has(el, "can-false-value")) {
					falseValue = el.getAttribute("can-false-value");
				} else {
					falseValue = false;
				}
			}

			if (el.type === "checkbox" || el.type === "radio") {
				// For checkboxes and radio buttons, create a Checked can.Control around the input.  Pass in 
				// the compute representing the can-value and can-true-value and can-false-value properties (if 
				// they were used).
				new Checked(el, {
					value: value,
					trueValue: trueValue,
					falseValue: falseValue
				});
				return;
			}
		}
		if (el.nodeName.toLowerCase() === "select" && el.multiple) {
			// For multiselect enabled select inputs, we instantiate a special control around that select element 
			// called Multiselect
			new Multiselect(el, {
				value: value
			});
			return;
		}
		// For contenteditable elements, we instantiate a Content control.
		if (isContentEditable(el)) {
			new Content(el, {
				value: value
			});
			return;
		}
		// The default case. Instantiate the Value control around the element. Pass it the compute representing 
		// the observable attribute property that was set.
		new Value(el, {
			value: value
		});
	});

	// ## Special Event Types (can-SPECIAL)

	// A special object, similar to [$.event.special](http://benalman.com/news/2010/03/jquery-special-events/), 
	// for adding hooks for special can-SPECIAL types (not native DOM events). Right now, only can-enter is 
	// supported, but this object might be exported so that it can be added to easily.
	// 
	// To implement a can-SPECIAL event type, add a property to the special object, whose value is a function 
	// that returns the following: 
	//		
	//		// the real event name to bind to
	//		event: "event-name",
	//		handler: function (ev) {
	//			// some logic that figures out if the original handler should be called or not, and if so...
	//			return original.call(this, ev);
	//		}
	var special = {
		enter: function (data, el, original) {
			return {
				event: "keyup",
				handler: function (ev) {
					if (ev.keyCode === 13) {
						return original.call(this, ev);
					}
				}
			};
		}
	};

	// ## can-EVENT
	// The following section contains code for implementing the can-EVENT attribute. 
	// This binds on a wildcard attribute name. Whenever a view is being processed 
	// and can-xxx (anything starting with can-), this callback will be run.  Inside, its setting up an event handler 
	// that calls a method identified by the value of this attribute.
	can.view.attr(/can-[\w\.]+/, function (el, data) {

		// the attribute name is the function to call
		var attributeName = data.attributeName,
			// The event type to bind on is deteremined by whatever is after can-
			// 
			// For example, can-submit binds on the submit event.
			event = attributeName.substr("can-".length),
			// This is the method that the event will initially trigger. It will look up the method by the string name 
			// passed in the attribute and call it.
			handler = function (ev) {
				// The attribute value, representing the name of the method to call (i.e. can-submit="foo" foo is the 
				// name of the method)
				var attr = removeCurly( el.getAttribute(attributeName) ),
					scopeData = data.scope.read(attr, {
						returnObserveMethods: true,
						isArgument: true
					});
				return scopeData.value.call(scopeData.parent, data.scope._context, can.$(this), ev);
			};

		// This code adds support for special event types, like can-enter="foo". special.enter (or any special[event]) is 
		// a function that returns an object containing an event and a handler. These are to be used for binding. For example, 
		// when a user adds a can-enter attribute, we'll bind on the keyup event, and the handler performs special logic to 
		// determine on keyup if the enter key was pressed.
		if (special[event]) {
			var specialData = special[event](data, el, handler);
			handler = specialData.handler;
			event = specialData.event;
		}
		// Bind the handler defined above to the element we're currently processing and the event name provided in this 
		// attribute name (can-click="foo")
		can.bind.call(el, event, handler);
	});


	// ## Two way binding can.Controls
	// Each type of input that is supported by view/bindings is wrapped with a special can.Control.  The control serves 
	// two functions: 
	// 1. Bind on the property changing (the compute we're two-way binding to) and change the input value.
	// 2. Bind on the input changing and change the property (compute) we're two-way binding to.
	// There is one control per input type. There could easily be more for more advanced input types, like the HTML5 type="date" input type.


	// ### Value 
	// A can.Control that manages the two-way bindings on most inputs.  When can-value is found as an attribute 
	// on an input, the callback above instantiates this Value control on the input element.
	var Value = can.Control.extend({
		init: function () {
			// Handle selects by calling `set` after this thread so the rest of the element can finish rendering.
			if (this.element[0].nodeName.toUpperCase() === "SELECT") {
				setTimeout(can.proxy(this.set, this), 1);
			} else {
				this.set();
			}

		},
		// If the live bound data changes, call set to reflect the change in the dom.
		"{value} change": "set",
		set: function () {
			// This may happen in some edgecases, esp. with selects that are not in DOM after the timeout has fired
			if (!this.element) {
				return;
			}
			var val = this.options.value();
			// Set the element's value to match the attribute that was passed in
			this.element[0].value = (val == null ? '' : val);
		},
		// If the input value changes, this will set the live bound data to reflect the change.
		"change": function () {
			// This may happen in some edgecases, esp. with selects that are not in DOM after the timeout has fired
			if (!this.element) {
				return;
			}
			// Set the value of the attribute passed in to reflect what the user typed
			this.options.value(this.element[0].value);
		}
	}),
	// ### Checked 
	// A can.Control that manages the two-way bindings on a checkbox element.  When can-value is found as an attribute 
	// on a checkbox, the callback above instantiates this Checked control on the checkbox element.
		Checked = can.Control.extend({
			init: function () {
				// If its not a checkbox, its a radio input
				this.isCheckbox = (this.element[0].type.toLowerCase() === "checkbox");
				this.check();
			},
			// `value` is the compute representing the can-value for this element.  For example can-value="foo" and current 
			// scope is someObj, value is the compute representing someObj.attr('foo')
			"{value} change": "check",
			check: function () {
				// jshint eqeqeq: false
				if (this.isCheckbox) {
					var value = this.options.value(),
						trueValue = this.options.trueValue || true;
					// If `can-true-value` attribute was set, check if the value is equal to that string value, and set 
					// the checked property based on their equality.
					this.element[0].checked = (value === trueValue);
				}
				// Its a radio input type
				else {
					var setOrRemove = this.options.value() == this.element[0].value ?
						"set" : "remove";

					can.attr[setOrRemove](this.element[0], 'checked', true);

				}

			},
			// This event is triggered by the DOM.  If a change event occurs, we must set the value of the compute (options.value).
			"change": function () {

				if (this.isCheckbox) {
					// If the checkbox is checked and can-true-value was used, set value to the string value of can-true-value.  If 
					// can-false-value was used and checked is false, set value to the string value of can-false-value.
					this.options.value(this.element[0].checked ? this.options.trueValue : this.options.falseValue);
				}
				// Radio input type
				else {
					if (this.element[0].checked) {
						this.options.value(this.element[0].value);
					}
				}

			}
		}),
		// ### Multiselect
		// A can.Control that handles select input with the "multiple" attribute (meaning more than one can be selected at once). 
		Multiselect = Value.extend({
			init: function () {
				this.delimiter = ";";
				this.set();
			},
			// Since this control extends Value (above), the set method will be called when the value compute changes (and on init).
			set: function () {

				var newVal = this.options.value();


				// When given a string, try to extract all the options from it (i.e. "a;b;c;d")
				if (typeof newVal === 'string') {
					newVal = newVal.split(this.delimiter);
					this.isString = true;
				}
				// When given something else, try to make it an array and deal with it
				else if (newVal) {
					newVal = can.makeArray(newVal);
				}

				// Make an object containing all the options passed in for convenient lookup
				var isSelected = {};
				can.each(newVal, function (val) {
					isSelected[val] = true;
				});

				// Go through each &lt;option/&gt; element, if it has a value property (its a valid option), then 
				// set its selected property if it was in the list of vals that were just set.
				can.each(this.element[0].childNodes, function (option) {
					if (option.value) {
						option.selected = !! isSelected[option.value];
					}

				});

			},
			// A helper function used by the 'change' handler below. Its purpose is to return an array of selected 
			// values, like ["foo", "bar"]
			get: function () {
				var values = [],
					children = this.element[0].childNodes;

				can.each(children, function (child) {
					if (child.selected && child.value) {
						values.push(child.value);
					}
				});

				return values;
			},
			// Called when the user changes this input in any way.
			'change': function () {
				// Get an array of the currently selected values
				var value = this.get(),
					currentValue = this.options.value();

				// If the compute is a string, set its value to the joined version of the values array (i.e. "foo;bar")
				if (this.isString || typeof currentValue === "string") {
					this.isString = true;
					this.options.value(value.join(this.delimiter));
				}
				// If the compute is a can.List, replace its current contents with the new array of values
				else if (currentValue instanceof can.List) {
					currentValue.attr(value, true);
				}
				// Otherwise set the value to the array of values selected in the input.
				else {
					this.options.value(value);
				}

			}
		}),
		Content = can.Control.extend({
			init: function () {
				this.set();
				this.on("blur", "setValue");
			},
			"{value} change": "set",
			set: function () {
				var val = this.options.value();
				this.element[0].innerHTML = (typeof val === 'undefined' ? '' : val);
			},
			setValue: function () {
				this.options.value(this.element[0].innerHTML);
			}
		});

});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can/component',["can/util/library", "can/view/callbacks", "can/control", "can/observe", "can/view/mustache", "can/view/bindings"], function (can, viewCallbacks) {
	// ## Helpers
	// Attribute names to ignore for setting scope values.
	var ignoreAttributesRegExp = /^(dataViewId|class|id)$/i,
		paramReplacer = /\{([^\}]+)\}/g;

	/**
	 * @add can.Component
	 */
	var Component = can.Component = can.Construct.extend(
		
		// ## Static
		/**
		 * @static
		 */
		
		{
			// ### setup
			// 
			// When a component is extended, this sets up the component's internal constructor
			// functions and templates for later fast initialization.
			setup: function () {
				can.Construct.setup.apply(this, arguments);

				// When `can.Component.setup` function is ran for the first time, `can.Component` doesn't exist yet 
				// which ensures that the following code is ran only in constructors that extend `can.Component`. 
				if (can.Component) {
					var self = this,
						scope = this.prototype.scope;
					
					// Define a control using the `events` prototype property.
					this.Control = ComponentControl.extend( this.prototype.events );
					
					// Look to convert `scope` to a Map constructor function.
					if (!scope || (typeof scope === "object" && ! (scope instanceof can.Map)  ) ) {
						// If scope is an object, use that object as the prototype of an extended 
						// Map constructor function.
						// A new instance of that Map constructor function will be created and
						// set a the constructor instance's scope.
						this.Map = can.Map.extend(scope || {});
					}
					else if (scope.prototype instanceof can.Map) {
						// If scope is a can.Map constructor function, just use that.
						this.Map = scope;
					}
					
					// Look for default `@` values. If a `@` is found, these
					// attributes string values will be set and 2-way bound on the
					// component instance's scope.
					this.attributeScopeMappings = {};
					can.each(this.Map ? this.Map.defaults : {}, function (val, prop) {
						if (val === "@") {
							self.attributeScopeMappings[prop] = prop;
						}
					});

					// Convert the template into a renderer function.
					if (this.prototype.template) {
						// If `this.prototype.template` is a function create renderer from it by
						// wrapping it with the anonymous function that will pass it the arguments,
						// otherwise create the render from the string
						if (typeof this.prototype.template === "function") {
							var temp = this.prototype.template;
							this.renderer = function () {
								return can.view.frag(temp.apply(null, arguments));
							};
						} else {
							this.renderer = can.view.mustache(this.prototype.template);
						}
					}

					// Register this component to be created when its `tag` is found.
					can.view.tag(this.prototype.tag, function (el, options) {
						new self(el, options);
					});
				}

			}
		}, {
			// ## Prototype
			/**
			 * @prototype
			 */
			// ### setup
			// When a new component instance is created, setup bindings, render the template, etc.
			setup: function (el, hookupOptions) {
				// Setup values passed to component
				var initalScopeData = {},
					component = this,
					twoWayBindings = {},
					// what scope property is currently updating
					scopePropertyUpdating,
					// the object added to the scope
					componentScope,
					frag;

				// ## Scope

				// Add scope prototype properties marked with an "@" to the `initialScopeData` object
				can.each(this.constructor.attributeScopeMappings, function (val, prop) {
					initalScopeData[prop] = el.getAttribute(can.hyphenate(val));
				});
				
				// Get the value in the scope for each attribute
				// the hookup should probably happen after?
				can.each(can.makeArray(el.attributes), function (node, index) {
					var name = can.camelize(node.nodeName.toLowerCase()),
						value = node.value;

				

					// Ignore attributes already present in the ScopeMappings.
					if (component.constructor.attributeScopeMappings[name] || ignoreAttributesRegExp.test(name) || viewCallbacks.attr(node.nodeName)) {
						return;
					}
					// Only setup bindings if attribute looks like `foo="{bar}"`
					if(value[0] === "{" && value[value.length-1] === "}") {
						value = value.substr(1, value.length - 2 );
					} else {
						// Legacy template types will crossbind "foo=bar"
						if(hookupOptions.templateType !== "legacy") {
							initalScopeData[name] = value;
							return;
						}
					}
					// Cross-bind the value in the scope to this 
					// component's scope
					var computeData = hookupOptions.scope.computeData(value, {
						args: []
					}),
						compute = computeData.compute;

					// bind on this, check it's value, if it has dependencies
					var handler = function (ev, newVal) {
						scopePropertyUpdating = name;
						componentScope.attr(name, newVal);
						scopePropertyUpdating = null;
					};

					// Compute only returned if bindable
					compute.bind("change", handler);

					// Set the value to be added to the scope
					initalScopeData[name] = compute();
					
					// We don't need to listen to the compute `change` if it doesn't have any dependencies
					if (!compute.hasDependencies) {
						compute.unbind("change", handler);
					} else {
						// Make sure we unbind (there's faster ways of doing this)
						can.bind.call(el, "removed", function () {
							compute.unbind("change", handler);
						});
						// Setup the two-way binding
						twoWayBindings[name] = computeData;
					}

				});
				if (this.constructor.Map) {
					// If `Map` property is set on the constructor use it to wrap the `initialScopeData`
					componentScope = new this.constructor.Map(initalScopeData);
				} else if (this.scope instanceof can.Map) {
					// If `this.scope` is instance of `can.Map` assign it to the `componentScope`
					componentScope = this.scope;
				} else if (can.isFunction(this.scope)) {
					// If `this.scope` is a function, call the function and 
					var scopeResult = this.scope(initalScopeData, hookupOptions.scope, el);

					if (scopeResult instanceof can.Map) {
						// If the function returns a can.Map, use that as the scope
						componentScope = scopeResult;
					} else if (scopeResult.prototype instanceof can.Map) {
						// If `scopeResult` is of a `can.Map` type, use it to wrap the `initialScopeData`
						componentScope = new scopeResult(initalScopeData);
					} else {
						// Otherwise extend `can.Map` with the `scopeResult` and initialize it with the `initialScopeData`
						componentScope = new(can.Map.extend(scopeResult))(initalScopeData);
					}

				}

				// ## Two way bindings

				// Object to hold the bind handlers so we can tear them down
				var handlers = {};
				// Setup reverse bindings
				can.each(twoWayBindings, function (computeData, prop) {
					handlers[prop] = function (ev, newVal) {
						// Check that this property is not being changed because
						// it's source value just changed
						if (scopePropertyUpdating !== prop) {
							computeData.compute(newVal);
						}
					};
					componentScope.bind(prop, handlers[prop]);
				});
				// Teardown reverse bindings when the element is removed
				can.bind.call(el, "removed", function () {
					can.each(handlers, function (handler, prop) {
						componentScope.unbind(prop, handlers[prop]);
					});
				});
				// Setup the attributes bindings
				if (!can.isEmptyObject(this.constructor.attributeScopeMappings) || hookupOptions.templateType !== "legacy") {
					// Bind on the `attributes` event and update the scope.
					can.bind.call(el, "attributes", function (ev) {
						// Convert attribute name from the `attribute-name` to the `attributeName` format.
						var camelized = can.camelize(ev.attributeName);
						if (!twoWayBindings[camelized] && !ignoreAttributesRegExp.test(camelized) ) {
							// If there is a mapping for this attribute, update the `componentScope` attribute
							componentScope.attr(camelized, el.getAttribute(ev.attributeName));
						}
					});

				}

				// Set `componentScope` to `this.scope` and set it to the element's `data` object as a `scope` property
				this.scope = componentScope;
				can.data(can.$(el), "scope", this.scope);

				// Create a real Scope object out of the scope property
				var renderedScope = hookupOptions.scope.add(this.scope),
					options = {
						helpers: {}
					};

				// ## Helpers


				// Setup helpers to callback with `this` as the component
				can.each(this.helpers || {}, function (val, prop) {
					if (can.isFunction(val)) {
						options.helpers[prop] = function () {
							return val.apply(componentScope, arguments);
						};
					}
				});

				// ## `events` control

				// Create a control to listen to events
				this._control = new this.constructor.Control(el, {
					// Pass the scope to the control so we can listen to it's changes from the controller.
					scope: this.scope
				});

				// ## Rendering

				// If this component has a template (that we've already converted to a renderer)
				if (this.constructor.renderer) {
					// If `options.tags` doesn't exist set it to an empty object.
					if (!options.tags) {
						options.tags = {};
					}

					// We need be alerted to when a <content> element is rendered so we can put the original contents of the widget in its place
					options.tags.content = function contentHookup(el, rendererOptions) {
						// First check if there was content within the custom tag
						// otherwise, render what was within <content>, the default code
						var subtemplate = hookupOptions.subtemplate || rendererOptions.subtemplate;

						if (subtemplate) {

							// `rendererOptions.options` is a scope of helpers where `<content>` was found, so
							// the right helpers should already be available.
							// However, `_tags.content` is going to point to this current content callback.  We need to 
							// remove that so it will walk up the chain

							delete options.tags.content;

							can.view.live.replace([el], subtemplate(
								// This is the context of where `<content>` was found
								// which will have the the component's context
								rendererOptions.scope,

								rendererOptions.options));

							// Restore the content tag so it could potentially be used again (as in lists)
							options.tags.content = contentHookup;
						}
					};
					// Render the component's template
					frag = this.constructor.renderer(renderedScope, hookupOptions.options.add(options));
				} else {
					// Otherwise render the contents between the 
					if(hookupOptions.templateType === "legacy") {
						frag = can.view.frag(hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(options)) : "");
					} else {
						frag = hookupOptions.subtemplate ? hookupOptions.subtemplate(renderedScope, hookupOptions.options.add(options)) : document.createDocumentFragment();
					}
					
				}
				// Append the resulting document fragment to the element
				can.appendChild(el, frag);
			}
		});

	var ComponentControl = can.Control.extend({
		// Change lookup to first look in the scope.
		_lookup: function (options) {
			return [options.scope, options, window];
		},
		_action: function (methodName, options, controlInstance ) {
			var hasObjectLookup, readyCompute;

			paramReplacer.lastIndex = 0;

			hasObjectLookup = paramReplacer.test(methodName);

			// If we don't have options (a `control` instance), we'll run this 
			// later.
			if( !controlInstance && hasObjectLookup) {
				return;
			} else if( !hasObjectLookup ) {
				return can.Control._action.apply(this, arguments);
			} else {
				// We have `hasObjectLookup` and `controlInstance`.

				readyCompute = can.compute(function(){
					var delegate;
					
					// Set the delegate target and get the name of the event we're listening to.
					var name = methodName.replace(paramReplacer, function(matched, key){
						var value;

						// If we are listening directly on the `scope` set it as a delegate target.
						if(key === "scope") {
							delegate = options.scope;
							return "";
						}
						
						// Remove `scope.` from the start of the key and read the value from the `scope`.
						key = key.replace(/^scope\./,"");
						value = can.compute.read(options.scope, key.split("."), {isArgument: true}).value;

						// If `value` is undefined use `can.getObject` to get the value.
						if(value === undefined) {
							value = can.getObject(key);
						}

						// If `value` is a string we just return it, otherwise we set it as a delegate target.
						if(typeof value === "string") {
							return value;
						} else {
							delegate = value;
							return "";
						}
	
					});
					
					// Get the name of the `event` we're listening to.
					var parts = name.split(/\s+/g),
						event = parts.pop();

					// Return everything needed to handle the event we're listening to.
					return {
						processor: this.processors[event] || this.processors.click,
						parts: [name, parts.join(" "), event],
						delegate: delegate || undefined
					};
					
				}, this);

				// Create a handler function that we'll use to handle the `change` event on the `readyCompute`.
				var handler = function(ev, ready){
					controlInstance._bindings.control[methodName](controlInstance.element);
					controlInstance._bindings.control[methodName] = ready.processor(
									ready.delegate || controlInstance.element,
									ready.parts[2], ready.parts[1], methodName, controlInstance);
				};

				readyCompute.bind("change", handler);
				
				controlInstance._bindings.readyComputes[methodName] = {
					compute: readyCompute,
					handler: handler
				};

				return readyCompute();
			}
		}
	},
	// Extend `events` with a setup method that listens to changes in `scope` and
	// rebinds all templated event handlers.
	{
		setup: function (el, options) {
			this.scope = options.scope;
			return can.Control.prototype.setup.call(this, el, options);
		},
		off: function(){
			// If `this._bindings` exists we need to go through it's `readyComputes` and manually
			// unbind `change` event listeners set by the controller.
			if( this._bindings ) {
				can.each(this._bindings.readyComputes || {}, function (value) {
					value.compute.unbind("change", value.handler);
				});
			}
			// Call `can.Control.prototype.off` function on this instance to cleanup the bindings.
			can.Control.prototype.off.apply(this, arguments);
			this._bindings.readyComputes = {};
		}
	});

	// If there is a `$` object and it has the `fn` object, create the `scope` plugin that returns
	// the scope object
	if (window.$ && $.fn) {
		$.fn.scope = function (attr) {
			// If `attr` is passed to the `scope` plugin return the value of that 
			// attribute on the `scope` object, otherwise return the whole scope
			if (attr) {
				return this.data("scope")
					.attr(attr);
			} else {
				return this.data("scope");
			}
		};
	}

	// Define the `can.scope` function that can be used to retrieve the `scope` from the element
	can.scope = function (el, attr) {
		el = can.$(el);
		// If `attr` is passed to the `can.scope` function return the value of that
		// attribute on the `scope` object otherwise return the whole scope
		if (attr) {
			return can.data(el, "scope")
				.attr(attr);
		} else {
			return can.data(el, "scope");
		}
	};

	return Component;
});
/*!
 * CanJS - 2.1.3
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Mon, 25 Aug 2014 21:51:29 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define('can',["can/util/library", "can/control/route", "can/model", "can/view/mustache", "can/component"], function(can) {
	return can;
});
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define('jquery.cookie',['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r=Array.prototype,e=Object.prototype,u=Function.prototype,i=r.push,a=r.slice,o=r.concat,l=e.toString,c=e.hasOwnProperty,f=Array.isArray,s=Object.keys,p=u.bind,h=function(n){return n instanceof h?n:this instanceof h?void(this._wrapped=n):new h(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=h),exports._=h):n._=h,h.VERSION="1.7.0";var g=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}};h.iteratee=function(n,t,r){return null==n?h.identity:h.isFunction(n)?g(n,t,r):h.isObject(n)?h.matches(n):h.property(n)},h.each=h.forEach=function(n,t,r){if(null==n)return n;t=g(t,r);var e,u=n.length;if(u===+u)for(e=0;u>e;e++)t(n[e],e,n);else{var i=h.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},h.map=h.collect=function(n,t,r){if(null==n)return[];t=h.iteratee(t,r);for(var e,u=n.length!==+n.length&&h.keys(n),i=(u||n).length,a=Array(i),o=0;i>o;o++)e=u?u[o]:o,a[o]=t(n[e],e,n);return a};var v="Reduce of empty array with no initial value";h.reduce=h.foldl=h.inject=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length,o=0;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[o++]:o++]}for(;a>o;o++)u=i?i[o]:o,r=t(r,n[u],u,n);return r},h.reduceRight=h.foldr=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[--a]:--a]}for(;a--;)u=i?i[a]:a,r=t(r,n[u],u,n);return r},h.find=h.detect=function(n,t,r){var e;return t=h.iteratee(t,r),h.some(n,function(n,r,u){return t(n,r,u)?(e=n,!0):void 0}),e},h.filter=h.select=function(n,t,r){var e=[];return null==n?e:(t=h.iteratee(t,r),h.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e)},h.reject=function(n,t,r){return h.filter(n,h.negate(h.iteratee(t)),r)},h.every=h.all=function(n,t,r){if(null==n)return!0;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,!t(n[u],u,n))return!1;return!0},h.some=h.any=function(n,t,r){if(null==n)return!1;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,t(n[u],u,n))return!0;return!1},h.contains=h.include=function(n,t){return null==n?!1:(n.length!==+n.length&&(n=h.values(n)),h.indexOf(n,t)>=0)},h.invoke=function(n,t){var r=a.call(arguments,2),e=h.isFunction(t);return h.map(n,function(n){return(e?t:n[t]).apply(n,r)})},h.pluck=function(n,t){return h.map(n,h.property(t))},h.where=function(n,t){return h.filter(n,h.matches(t))},h.findWhere=function(n,t){return h.find(n,h.matches(t))},h.max=function(n,t,r){var e,u,i=-1/0,a=-1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],e>i&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(u>a||u===-1/0&&i===-1/0)&&(i=n,a=u)});return i},h.min=function(n,t,r){var e,u,i=1/0,a=1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],i>e&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(a>u||1/0===u&&1/0===i)&&(i=n,a=u)});return i},h.shuffle=function(n){for(var t,r=n&&n.length===+n.length?n:h.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=h.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},h.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=h.values(n)),n[h.random(n.length-1)]):h.shuffle(n).slice(0,Math.max(0,t))},h.sortBy=function(n,t,r){return t=h.iteratee(t,r),h.pluck(h.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var m=function(n){return function(t,r,e){var u={};return r=h.iteratee(r,e),h.each(t,function(e,i){var a=r(e,i,t);n(u,e,a)}),u}};h.groupBy=m(function(n,t,r){h.has(n,r)?n[r].push(t):n[r]=[t]}),h.indexBy=m(function(n,t,r){n[r]=t}),h.countBy=m(function(n,t,r){h.has(n,r)?n[r]++:n[r]=1}),h.sortedIndex=function(n,t,r,e){r=h.iteratee(r,e,1);for(var u=r(t),i=0,a=n.length;a>i;){var o=i+a>>>1;r(n[o])<u?i=o+1:a=o}return i},h.toArray=function(n){return n?h.isArray(n)?a.call(n):n.length===+n.length?h.map(n,h.identity):h.values(n):[]},h.size=function(n){return null==n?0:n.length===+n.length?n.length:h.keys(n).length},h.partition=function(n,t,r){t=h.iteratee(t,r);var e=[],u=[];return h.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},h.first=h.head=h.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:a.call(n,0,t)},h.initial=function(n,t,r){return a.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},h.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:a.call(n,Math.max(n.length-t,0))},h.rest=h.tail=h.drop=function(n,t,r){return a.call(n,null==t||r?1:t)},h.compact=function(n){return h.filter(n,h.identity)};var y=function(n,t,r,e){if(t&&h.every(n,h.isArray))return o.apply(e,n);for(var u=0,a=n.length;a>u;u++){var l=n[u];h.isArray(l)||h.isArguments(l)?t?i.apply(e,l):y(l,t,r,e):r||e.push(l)}return e};h.flatten=function(n,t){return y(n,t,!1,[])},h.without=function(n){return h.difference(n,a.call(arguments,1))},h.uniq=h.unique=function(n,t,r,e){if(null==n)return[];h.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=h.iteratee(r,e));for(var u=[],i=[],a=0,o=n.length;o>a;a++){var l=n[a];if(t)a&&i===l||u.push(l),i=l;else if(r){var c=r(l,a,n);h.indexOf(i,c)<0&&(i.push(c),u.push(l))}else h.indexOf(u,l)<0&&u.push(l)}return u},h.union=function(){return h.uniq(y(arguments,!0,!0,[]))},h.intersection=function(n){if(null==n)return[];for(var t=[],r=arguments.length,e=0,u=n.length;u>e;e++){var i=n[e];if(!h.contains(t,i)){for(var a=1;r>a&&h.contains(arguments[a],i);a++);a===r&&t.push(i)}}return t},h.difference=function(n){var t=y(a.call(arguments,1),!0,!0,[]);return h.filter(n,function(n){return!h.contains(t,n)})},h.zip=function(n){if(null==n)return[];for(var t=h.max(arguments,"length").length,r=Array(t),e=0;t>e;e++)r[e]=h.pluck(arguments,e);return r},h.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},h.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=h.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}for(;u>e;e++)if(n[e]===t)return e;return-1},h.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=n.length;for("number"==typeof r&&(e=0>r?e+r+1:Math.min(e,r+1));--e>=0;)if(n[e]===t)return e;return-1},h.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var d=function(){};h.bind=function(n,t){var r,e;if(p&&n.bind===p)return p.apply(n,a.call(arguments,1));if(!h.isFunction(n))throw new TypeError("Bind must be called on a function");return r=a.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(a.call(arguments)));d.prototype=n.prototype;var u=new d;d.prototype=null;var i=n.apply(u,r.concat(a.call(arguments)));return h.isObject(i)?i:u}},h.partial=function(n){var t=a.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===h&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},h.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=h.bind(n[r],n);return n},h.memoize=function(n,t){var r=function(e){var u=r.cache,i=t?t.apply(this,arguments):e;return h.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},h.delay=function(n,t){var r=a.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},h.defer=function(n){return h.delay.apply(h,[n,1].concat(a.call(arguments,1)))},h.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var l=function(){o=r.leading===!1?0:h.now(),a=null,i=n.apply(e,u),a||(e=u=null)};return function(){var c=h.now();o||r.leading!==!1||(o=c);var f=t-(c-o);return e=this,u=arguments,0>=f||f>t?(clearTimeout(a),a=null,o=c,i=n.apply(e,u),a||(e=u=null)):a||r.trailing===!1||(a=setTimeout(l,f)),i}},h.debounce=function(n,t,r){var e,u,i,a,o,l=function(){var c=h.now()-a;t>c&&c>0?e=setTimeout(l,t-c):(e=null,r||(o=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,a=h.now();var c=r&&!e;return e||(e=setTimeout(l,t)),c&&(o=n.apply(i,u),i=u=null),o}},h.wrap=function(n,t){return h.partial(t,n)},h.negate=function(n){return function(){return!n.apply(this,arguments)}},h.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},h.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},h.before=function(n,t){var r;return function(){return--n>0?r=t.apply(this,arguments):t=null,r}},h.once=h.partial(h.before,2),h.keys=function(n){if(!h.isObject(n))return[];if(s)return s(n);var t=[];for(var r in n)h.has(n,r)&&t.push(r);return t},h.values=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},h.pairs=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},h.invert=function(n){for(var t={},r=h.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},h.functions=h.methods=function(n){var t=[];for(var r in n)h.isFunction(n[r])&&t.push(r);return t.sort()},h.extend=function(n){if(!h.isObject(n))return n;for(var t,r,e=1,u=arguments.length;u>e;e++){t=arguments[e];for(r in t)c.call(t,r)&&(n[r]=t[r])}return n},h.pick=function(n,t,r){var e,u={};if(null==n)return u;if(h.isFunction(t)){t=g(t,r);for(e in n){var i=n[e];t(i,e,n)&&(u[e]=i)}}else{var l=o.apply([],a.call(arguments,1));n=new Object(n);for(var c=0,f=l.length;f>c;c++)e=l[c],e in n&&(u[e]=n[e])}return u},h.omit=function(n,t,r){if(h.isFunction(t))t=h.negate(t);else{var e=h.map(o.apply([],a.call(arguments,1)),String);t=function(n,t){return!h.contains(e,t)}}return h.pick(n,t,r)},h.defaults=function(n){if(!h.isObject(n))return n;for(var t=1,r=arguments.length;r>t;t++){var e=arguments[t];for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n},h.clone=function(n){return h.isObject(n)?h.isArray(n)?n.slice():h.extend({},n):n},h.tap=function(n,t){return t(n),n};var b=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof h&&(n=n._wrapped),t instanceof h&&(t=t._wrapped);var u=l.call(n);if(u!==l.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]===n)return e[i]===t;var a=n.constructor,o=t.constructor;if(a!==o&&"constructor"in n&&"constructor"in t&&!(h.isFunction(a)&&a instanceof a&&h.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c,f;if("[object Array]"===u){if(c=n.length,f=c===t.length)for(;c--&&(f=b(n[c],t[c],r,e)););}else{var s,p=h.keys(n);if(c=p.length,f=h.keys(t).length===c)for(;c--&&(s=p[c],f=h.has(t,s)&&b(n[s],t[s],r,e)););}return r.pop(),e.pop(),f};h.isEqual=function(n,t){return b(n,t,[],[])},h.isEmpty=function(n){if(null==n)return!0;if(h.isArray(n)||h.isString(n)||h.isArguments(n))return 0===n.length;for(var t in n)if(h.has(n,t))return!1;return!0},h.isElement=function(n){return!(!n||1!==n.nodeType)},h.isArray=f||function(n){return"[object Array]"===l.call(n)},h.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},h.each(["Arguments","Function","String","Number","Date","RegExp"],function(n){h["is"+n]=function(t){return l.call(t)==="[object "+n+"]"}}),h.isArguments(arguments)||(h.isArguments=function(n){return h.has(n,"callee")}),"function"!=typeof/./&&(h.isFunction=function(n){return"function"==typeof n||!1}),h.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},h.isNaN=function(n){return h.isNumber(n)&&n!==+n},h.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===l.call(n)},h.isNull=function(n){return null===n},h.isUndefined=function(n){return n===void 0},h.has=function(n,t){return null!=n&&c.call(n,t)},h.noConflict=function(){return n._=t,this},h.identity=function(n){return n},h.constant=function(n){return function(){return n}},h.noop=function(){},h.property=function(n){return function(t){return t[n]}},h.matches=function(n){var t=h.pairs(n),r=t.length;return function(n){if(null==n)return!r;n=new Object(n);for(var e=0;r>e;e++){var u=t[e],i=u[0];if(u[1]!==n[i]||!(i in n))return!1}return!0}},h.times=function(n,t,r){var e=Array(Math.max(0,n));t=g(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},h.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},h.now=Date.now||function(){return(new Date).getTime()};var _={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},w=h.invert(_),j=function(n){var t=function(t){return n[t]},r="(?:"+h.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};h.escape=j(_),h.unescape=j(w),h.result=function(n,t){if(null==n)return void 0;var r=n[t];return h.isFunction(r)?n[t]():r};var x=0;h.uniqueId=function(n){var t=++x+"";return n?n+t:t},h.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var A=/(.)^/,k={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},O=/\\|'|\r|\n|\u2028|\u2029/g,F=function(n){return"\\"+k[n]};h.template=function(n,t,r){!t&&r&&(t=r),t=h.defaults({},t,h.templateSettings);var e=RegExp([(t.escape||A).source,(t.interpolate||A).source,(t.evaluate||A).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(O,F),u=o+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":a&&(i+="';\n"+a+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=new Function(t.variable||"obj","_",i)}catch(o){throw o.source=i,o}var l=function(n){return a.call(this,n,h)},c=t.variable||"obj";return l.source="function("+c+"){\n"+i+"}",l},h.chain=function(n){var t=h(n);return t._chain=!0,t};var E=function(n){return this._chain?h(n).chain():n};h.mixin=function(n){h.each(h.functions(n),function(t){var r=h[t]=n[t];h.prototype[t]=function(){var n=[this._wrapped];return i.apply(n,arguments),E.call(this,r.apply(h,n))}})},h.mixin(h),h.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=r[n];h.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],E.call(this,r)}}),h.each(["concat","join","slice"],function(n){var t=r[n];h.prototype[n]=function(){return E.call(this,t.apply(this._wrapped,arguments))}}),h.prototype.value=function(){return this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return h})}).call(this);
//# sourceMappingURL=underscore-min.map;
!function(e,n){function r(e,n){var r,t,u=e.toLowerCase();for(n=[].concat(n),r=0;r<n.length;r+=1)if(t=n[r]){if(t.test&&t.test(e))return!0;if(t.toLowerCase()===u)return!0}}var t=n.prototype.trim,u=n.prototype.trimRight,i=n.prototype.trimLeft,l=function(e){return 1*e||0},o=function(e,n){if(1>n)return"";for(var r="";n>0;)1&n&&(r+=e),n>>=1,e+=e;return r},a=[].slice,c=function(e){return null==e?"\\s":e.source?e.source:"["+g.escapeRegExp(e)+"]"},s={lt:"<",gt:">",quot:'"',amp:"&",apos:"'"},f={};for(var p in s)f[s[p]]=p;f["'"]="#39";var h=function(){function e(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}var r=o,t=function(){return t.cache.hasOwnProperty(arguments[0])||(t.cache[arguments[0]]=t.parse(arguments[0])),t.format.call(null,t.cache[arguments[0]],arguments)};return t.format=function(t,u){var i,l,o,a,c,s,f,p=1,g=t.length,d="",m=[];for(l=0;g>l;l++)if(d=e(t[l]),"string"===d)m.push(t[l]);else if("array"===d){if(a=t[l],a[2])for(i=u[p],o=0;o<a[2].length;o++){if(!i.hasOwnProperty(a[2][o]))throw new Error(h('[_.sprintf] property "%s" does not exist',a[2][o]));i=i[a[2][o]]}else i=a[1]?u[a[1]]:u[p++];if(/[^s]/.test(a[8])&&"number"!=e(i))throw new Error(h("[_.sprintf] expecting number but found %s",e(i)));switch(a[8]){case"b":i=i.toString(2);break;case"c":i=n.fromCharCode(i);break;case"d":i=parseInt(i,10);break;case"e":i=a[7]?i.toExponential(a[7]):i.toExponential();break;case"f":i=a[7]?parseFloat(i).toFixed(a[7]):parseFloat(i);break;case"o":i=i.toString(8);break;case"s":i=(i=n(i))&&a[7]?i.substring(0,a[7]):i;break;case"u":i=Math.abs(i);break;case"x":i=i.toString(16);break;case"X":i=i.toString(16).toUpperCase()}i=/[def]/.test(a[8])&&a[3]&&i>=0?"+"+i:i,s=a[4]?"0"==a[4]?"0":a[4].charAt(1):" ",f=a[6]-n(i).length,c=a[6]?r(s,f):"",m.push(a[5]?i+c:c+i)}return m.join("")},t.cache={},t.parse=function(e){for(var n=e,r=[],t=[],u=0;n;){if(null!==(r=/^[^\x25]+/.exec(n)))t.push(r[0]);else if(null!==(r=/^\x25{2}/.exec(n)))t.push("%");else{if(null===(r=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(n)))throw new Error("[_.sprintf] huh?");if(r[2]){u|=1;var i=[],l=r[2],o=[];if(null===(o=/^([a-z_][a-z_\d]*)/i.exec(l)))throw new Error("[_.sprintf] huh?");for(i.push(o[1]);""!==(l=l.substring(o[0].length));)if(null!==(o=/^\.([a-z_][a-z_\d]*)/i.exec(l)))i.push(o[1]);else{if(null===(o=/^\[(\d+)\]/.exec(l)))throw new Error("[_.sprintf] huh?");i.push(o[1])}r[2]=i}else u|=2;if(3===u)throw new Error("[_.sprintf] mixing positional and named placeholders is not (yet) supported");t.push(r)}n=n.substring(r[0].length)}return t},t}(),g={VERSION:"2.4.0",isBlank:function(e){return null==e&&(e=""),/^\s*$/.test(e)},stripTags:function(e){return null==e?"":n(e).replace(/<\/?[^>]+>/g,"")},capitalize:function(e){return e=null==e?"":n(e),e.charAt(0).toUpperCase()+e.slice(1)},chop:function(e,r){return null==e?[]:(e=n(e),r=~~r,r>0?e.match(new RegExp(".{1,"+r+"}","g")):[e])},clean:function(e){return g.strip(e).replace(/\s+/g," ")},count:function(e,r){if(null==e||null==r)return 0;e=n(e),r=n(r);for(var t=0,u=0,i=r.length;;){if(u=e.indexOf(r,u),-1===u)break;t++,u+=i}return t},chars:function(e){return null==e?[]:n(e).split("")},swapCase:function(e){return null==e?"":n(e).replace(/\S/g,function(e){return e===e.toUpperCase()?e.toLowerCase():e.toUpperCase()})},escapeHTML:function(e){return null==e?"":n(e).replace(/[&<>"']/g,function(e){return"&"+f[e]+";"})},unescapeHTML:function(e){return null==e?"":n(e).replace(/\&([^;]+);/g,function(e,r){var t;return r in s?s[r]:(t=r.match(/^#x([\da-fA-F]+)$/))?n.fromCharCode(parseInt(t[1],16)):(t=r.match(/^#(\d+)$/))?n.fromCharCode(~~t[1]):e})},escapeRegExp:function(e){return null==e?"":n(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},splice:function(e,n,r,t){var u=g.chars(e);return u.splice(~~n,~~r,t),u.join("")},insert:function(e,n,r){return g.splice(e,n,0,r)},include:function(e,r){return""===r?!0:null==e?!1:-1!==n(e).indexOf(r)},join:function(){var e=a.call(arguments),n=e.shift();return null==n&&(n=""),e.join(n)},lines:function(e){return null==e?[]:n(e).split("\n")},reverse:function(e){return g.chars(e).reverse().join("")},startsWith:function(e,r){return""===r?!0:null==e||null==r?!1:(e=n(e),r=n(r),e.length>=r.length&&e.slice(0,r.length)===r)},endsWith:function(e,r){return""===r?!0:null==e||null==r?!1:(e=n(e),r=n(r),e.length>=r.length&&e.slice(e.length-r.length)===r)},succ:function(e){return null==e?"":(e=n(e),e.slice(0,-1)+n.fromCharCode(e.charCodeAt(e.length-1)+1))},titleize:function(e){return null==e?"":(e=n(e).toLowerCase(),e.replace(/(?:^|\s|-)\S/g,function(e){return e.toUpperCase()}))},camelize:function(e){return g.trim(e).replace(/[-_\s]+(.)?/g,function(e,n){return n?n.toUpperCase():""})},underscored:function(e){return g.trim(e).replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase()},dasherize:function(e){return g.trim(e).replace(/([A-Z])/g,"-$1").replace(/[-_\s]+/g,"-").toLowerCase()},classify:function(e){return g.capitalize(g.camelize(n(e).replace(/[\W_]/g," ")).replace(/\s/g,""))},humanize:function(e){return g.capitalize(g.underscored(e).replace(/_id$/,"").replace(/_/g," "))},trim:function(e,r){return null==e?"":!r&&t?t.call(e):(r=c(r),n(e).replace(new RegExp("^"+r+"+|"+r+"+$","g"),""))},ltrim:function(e,r){return null==e?"":!r&&i?i.call(e):(r=c(r),n(e).replace(new RegExp("^"+r+"+"),""))},rtrim:function(e,r){return null==e?"":!r&&u?u.call(e):(r=c(r),n(e).replace(new RegExp(r+"+$"),""))},truncate:function(e,r,t){return null==e?"":(e=n(e),t=t||"...",r=~~r,e.length>r?e.slice(0,r)+t:e)},prune:function(e,r,t){if(null==e)return"";if(e=n(e),r=~~r,t=null!=t?n(t):"...",e.length<=r)return e;var u=function(e){return e.toUpperCase()!==e.toLowerCase()?"A":" "},i=e.slice(0,r+1).replace(/.(?=\W*\w*$)/g,u);return i=i.slice(i.length-2).match(/\w\w/)?i.replace(/\s*\S+$/,""):g.rtrim(i.slice(0,i.length-1)),(i+t).length>e.length?e:e.slice(0,i.length)+t},words:function(e,n){return g.isBlank(e)?[]:g.trim(e,n).split(n||/\s+/)},pad:function(e,r,t,u){e=null==e?"":n(e),r=~~r;var i=0;switch(t?t.length>1&&(t=t.charAt(0)):t=" ",u){case"right":return i=r-e.length,e+o(t,i);case"both":return i=r-e.length,o(t,Math.ceil(i/2))+e+o(t,Math.floor(i/2));default:return i=r-e.length,o(t,i)+e}},lpad:function(e,n,r){return g.pad(e,n,r)},rpad:function(e,n,r){return g.pad(e,n,r,"right")},lrpad:function(e,n,r){return g.pad(e,n,r,"both")},sprintf:h,vsprintf:function(e,n){return n.unshift(e),h.apply(null,n)},toNumber:function(e,n){return e?(e=g.trim(e),e.match(/^-?\d+(?:\.\d+)?$/)?l(l(e).toFixed(~~n)):0/0):0},numberFormat:function(e,n,r,t){if(isNaN(e)||null==e)return"";e=e.toFixed(~~n),t="string"==typeof t?t:",";var u=e.split("."),i=u[0],l=u[1]?(r||".")+u[1]:"";return i.replace(/(\d)(?=(?:\d{3})+$)/g,"$1"+t)+l},strRight:function(e,r){if(null==e)return"";e=n(e),r=null!=r?n(r):r;var t=r?e.indexOf(r):-1;return~t?e.slice(t+r.length,e.length):e},strRightBack:function(e,r){if(null==e)return"";e=n(e),r=null!=r?n(r):r;var t=r?e.lastIndexOf(r):-1;return~t?e.slice(t+r.length,e.length):e},strLeft:function(e,r){if(null==e)return"";e=n(e),r=null!=r?n(r):r;var t=r?e.indexOf(r):-1;return~t?e.slice(0,t):e},strLeftBack:function(e,n){if(null==e)return"";e+="",n=null!=n?""+n:n;var r=e.lastIndexOf(n);return~r?e.slice(0,r):e},toSentence:function(e,n,r,t){n=n||", ",r=r||" and ";var u=e.slice(),i=u.pop();return e.length>2&&t&&(r=g.rtrim(n)+r),u.length?u.join(n)+r+i:i},toSentenceSerial:function(){var e=a.call(arguments);return e[3]=!0,g.toSentence.apply(g,e)},slugify:function(e){if(null==e)return"";var r="ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",t="aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",u=new RegExp(c(r),"g");return e=n(e).toLowerCase().replace(u,function(e){var n=r.indexOf(e);return t.charAt(n)||"-"}),g.dasherize(e.replace(/[^\w\s-]/g,""))},surround:function(e,n){return[n,e,n].join("")},quote:function(e,n){return g.surround(e,n||'"')},unquote:function(e,n){return n=n||'"',e[0]===n&&e[e.length-1]===n?e.slice(1,e.length-1):e},exports:function(){var e={};for(var n in this)this.hasOwnProperty(n)&&!n.match(/^(?:include|contains|reverse)$/)&&(e[n]=this[n]);return e},repeat:function(e,r,t){if(null==e)return"";if(r=~~r,null==t)return o(n(e),r);for(var u=[];r>0;u[--r]=e);return u.join(t)},naturalCmp:function(e,r){if(e==r)return 0;if(!e)return-1;if(!r)return 1;for(var t=/(\.\d+)|(\d+)|(\D+)/g,u=n(e).toLowerCase().match(t),i=n(r).toLowerCase().match(t),l=Math.min(u.length,i.length),o=0;l>o;o++){var a=u[o],c=i[o];if(a!==c){var s=parseInt(a,10);if(!isNaN(s)){var f=parseInt(c,10);if(!isNaN(f)&&s-f)return s-f}return c>a?-1:1}}return u.length===i.length?u.length-i.length:r>e?-1:1},levenshtein:function(e,r){if(null==e&&null==r)return 0;if(null==e)return n(r).length;if(null==r)return n(e).length;e=n(e),r=n(r);for(var t,u,i=[],l=0;l<=r.length;l++)for(var o=0;o<=e.length;o++)u=l&&o?e.charAt(o-1)===r.charAt(l-1)?t:Math.min(i[o],i[o-1],t)+1:l+o,t=i[o],i[o]=u;return i.pop()},toBoolean:function(e,n,t){return"number"==typeof e&&(e=""+e),"string"!=typeof e?!!e:(e=g.trim(e),r(e,n||["true","1"])?!0:r(e,t||["false","0"])?!1:void 0)}};g.strip=g.trim,g.lstrip=g.ltrim,g.rstrip=g.rtrim,g.center=g.lrpad,g.rjust=g.lpad,g.ljust=g.rpad,g.contains=g.include,g.q=g.quote,g.toBool=g.toBoolean,"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(module.exports=g),exports._s=g),"function"==typeof define&&define.amd&&define("underscore.string",[],function(){return g}),e._=e._||{},e._.string=e._.str=g}(this,String);
!function(a){function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define('md5',[],function(){return t}):a.md5=t}(this);
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define('store',store) }
	else { win.store = store }

})(Function('return this')());

define('sf.b2c.mall.business.config',[], function () {
  

  var MD5_KEY = 'www.sfht.com';

  var NONE_APPEND_WORD = 'sfhaitao.xyz!';

  var DEFAULT_REQUEST_HEADER = {
    _aid: 1,
    _sm: 'md5'
  };

  var host = window.location.hostname;
  var DEV_API_URL = {
    url: 'http://'+host+'/m.api',
    fileurl: 'http://'+host+'/file.api',
    detailurl: 'http://'+host,
    topicurl: 'http://'+host,
    mainurl: 'http://'+host
  };

  var main = 'www.sfht.com';
  var DEV_FILE_LINK = {
    '404': 'http://'+main+'/404.html',
    'activated': 'http://'+main+'/activated.html',
    'agreement': 'http://'+main+'/agreement.html',
    'center': 'http://'+main+'/center.html',
    'gotopay': 'http://'+main+'/gotopay.html',
    'index': 'http://'+main+'/index.html',
    'login': 'http://'+main+'/login.html',
    'nullactivated':'http://'+main+'/nullactivated.html',
    'order': 'http://'+main+'/order.html',
    'orderdetail': 'http://'+main+'/orderdetail.html',
    'orderlist': 'http://'+main+'/orderlist.html',
    'passwordchange': 'http://'+main+'/password-change.html',
    'preheat': 'http://'+main+'/preheat.html',
    'process': 'http://'+main+'/process.html',
    'register': 'http://'+main+'/register.html',
    'retrieve': 'http://'+main+'/retrieve.html'
  }

  return {
    setting:{
      'none_append_word': NONE_APPEND_WORD,
      'default_header': DEFAULT_REQUEST_HEADER,
      'md5_key': MD5_KEY,
      'api': DEV_API_URL,
      'link': DEV_FILE_LINK
    }
  };
});
define('sf.b2c.mall.api.security.type',[],function(){
  

  return {
    UserLogin: {
      name: 'UserLogin',
      code: 0x2000
    },
    RegisteredDevice: {
      name: 'RegisteredDevice',
      code: 0x0100
    },
    None: {
      name: 'None',
      code: 0
    }
  };
});


/**
 * @author jiyanliang|weizhiqiang
 * @class sf.b2c.mall.framework.comm
 * @description comm通信基类
 */
define('sf.b2c.mall.framework.comm',[
    'jquery',
    'jquery.cookie',
    'can',
    'underscore',
    'md5',
    'store',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.security.type'
  ],

  function($, cookie, can, _, md5, store, SFBizConfig, SecurityType) {

    var ERROR_CODE_TOKEN_ERROR = -360;
    var ERROR_CODE_TOKEN_EXPIRE = -300;
    var ERROR_CODE_SIGNATURE_ERROR = -180;
    var ERROR_CODE_ACCESS_DENIED = -160;

    var TOKEN_AND_SIGNATURE_ERROR_GROUP = [
      ERROR_CODE_TOKEN_ERROR,
      ERROR_CODE_TOKEN_EXPIRE,
      ERROR_CODE_SIGNATURE_ERROR,
      ERROR_CODE_ACCESS_DENIED
    ];

    var SFBaseComm = can.Construct.extend({

      /**
       * api的定义需要被每个子类复写
       * @type {Object}
       */
      api: {},

      /**
       * @function sf.b2c.mall.framework.comm.buildRequestData
       * @description 通过与定义的API接口和用户通过this.data传入的参数构建向服务端发起请求需要用到的数据
       * @return {Object} 向服务端提交的数据结构
       */
      buildRequestData: function() {
        if (this.api) {
          var requestData = {};

          // 添加每个请求的_mt参数
          _.extend(requestData, {
            '_mt': this.api.METHOD_NAME
          });

          // 提供公共参数
          _.extend(requestData, this.api.COMMON);

          var key;
          // 添加必填参数
          for (key in this.api.REQUIRED) {
            requestData[key] = this.data[key];
          }

          // 添加选填参数
          for (key in this.api.OPTIONAL) {
            requestData[key] = this.data[key];
          }

          return requestData;
        }
      },

      /**
       * @override
       * @function sf.b2c.mall.framework.comm.init
       * @description 初始化方法
       * @param  {Object} data 传入的涌来提交服务端的数据
       */
      init: function(data) {
        this.setData(data);
      },

      /**
       * @function sf.b2c.mall.framework.setData
       * @description 修改请求参数
       */
      setData: function (data) {
        this.data = data;
      },

      /**
       * @function sf.b2c.mall.framework.sendRequest
       * @description 构建请求
       * @param {boolean} isForceUserLogin 是否需要强制用户登录
       * @return {Object} can.Deferred
       */
      sendRequest: function(isForceUserLogin) {

        //step1 调用子业务类进行数据校验
        var checkResult = this.validate(isForceUserLogin);

        if (checkResult !== true) {
          return checkResult;
        }

        //step2 构建ajax请求数据，放到baseCommon的全局变量中，可以支持多个请求一起发送
        var requestData = this.buildRequestData();

        //step3 发送请求,获得返回数据
        return this.request(requestData, isForceUserLogin);
      },

      /**
       * @function sf.b2c.framework.comm.validate
       * @description 根据用户SecurityType进行检验，同时也会检验比天字段是否写入
       * @returns {Error|Boolean} 错误对象|验证成功
       */
      validate: function(isForceUserLogin) {
        // 检查必填字段，如果没有必填字段直接抛错
        if (this.api) {
          if (!this.api.METHOD_NAME) return '缺少_mt';

          for (var key in this.api.REQUIRED) {
            if (!_.has(this.data, key)) {
              return new Error('缺少必填字段' + key);
            }
          }
        }

        //根据action校验是否登录
        if (this.api.SECURITY_TYPE === SecurityType.UserLogin.name) {
          if (!this.checkUserLogin()) {
            if (isForceUserLogin) {
              this.goToLogin();
            }else{
              return new Error('该请求需要在登录后发起');
            }
          }
        }

        return true;
      },

      /**
       * @function sf.b2c.mall.framework.checkUserLogin
       * @description 检查用户是否登陆
       * @return {Boolean} 用户是否登陆
       */
      checkUserLogin: function() {
        // var csrf = window.localStorage ? window.localStorage.getItem('csrfToken') : $.jStorage.get('csrfToken');
        var csrf = store.get('csrfToken');
        return !!($.cookie(SFBaseComm._aid + '_ct') && csrf);
      },

      /**
       * @function sf.b2c.mall.framework.goToLogin
       * @description 跳转到登陆
       */
      goToLogin: function() {
        // 获取现在的pathname作为跳转的from依据
        var path = window.location.pathname;
        if (path !== SFBizConfig.setting.login) {
          window.location.href = SFBizConfig.setting.login + '?from' + path;
        }
      },

      /**
       * @function sf.b2c.mall.framework.comm.access
       * @description 返回的参数是否正确
       * @param  {Map}      response          服务端返回的信息
       * @param  {Boolean}  isForceUserLogin  是否需要强制登陆
       */
      access: function(response, isForceUserLogin) {
        if (response.stat.code === 0 && response.content[0] && response.stat.stateList[0].code === 0) {
          return true;
        } else if (_.contains(TOKEN_AND_SIGNATURE_ERROR_GROUP, response.stat.code) && isForceUserLogin) {
          this.goToLogin();
        } else {
          return false;
        }
      },

      /**
       * @function sf.b2c.mall.framework.comm.encrypt
       * @param  {Map}    params      需要加密的参数
       * @param  {String} appendWord  加言
       */
      encrypt: function(params, appendWord) {
        var arr = [];

        // 将Map变成Array，使用key=value的方式进行拼接
        _.each(params, function(value, key) {
          arr.push(key + '=' + value);
        });

        // 以ascii进行排序
        arr.sort();

        // 将队列拼接成String
        var str = arr.join('');
        str = str + appendWord;

        // 做md5加密
        return md5(str);
      },

      /**
       * @function sf.b2c.mall.framework.comm.sign
       * @param  {Map}      params           参与请求签名的实体
       * @param  {Boolean}  isForceUserLogin 是否需要强制登陆
       */
      sign: function(params, isForceUserLogin) {
        var map = {
          'None': function(data, force) {
            return _.extend(data, {
              _sig: this.encrypt(data, SFBizConfig.setting['none_append_word'])
            });
          },

          'RegisteredDevice': function(data, force) {
            return _.extend(data, {
              _sig: this.encrypt(data, SFBizConfig.setting['none_append_word'])
            });
          },

          'UserLogin': function(data, force) {
            // var csrf = window.localStorage ? window.localStorage.getItem('csrfToken') : $.jStorage.get('csrfToken');
            var csrf = store.get('csrfToken');

            if (csrf) {
              return _.extend(data, {
                _sig: this.encrypt(data, csrf)
              });
            } else {
              this.goToLogin();
            }
          }
        };

        if (_.isFunction(map[this.api.SECURITY_TYPE])) {
          // 过滤所有的undefined和null的数据
          _.each(params, function(value, key, list) {
            if (_.isUndefined(value) || _.isNull(value)) {
              delete params[key];
            }
          });

          // 将参数附加上必须要传递的标记
          var required = _.extend(params, SFBizConfig.setting['default_header']);
          required = _.extend(required, {_aid: SFBaseComm._aid});

          // 做加密生产_sig对象
          var _sig = map[this.api.SECURITY_TYPE].call(this, required, isForceUserLogin);

          // 返回数据可以直接做请求
          return _.extend(required, _sig);
        } else {
          return params;
        }
      },

      /**
       * @function sf.b2c.mall.framework.request
       * @param  {Map}     data             请求参数
       * @param  {Boolean} isForceUserLogin 是否需要强制登陆
       * @return {can.Deferred}
       */
      request: function(data, isForceUserLogin) {
        var def = can.Deferred();

        var that = this;
        can.ajax({
          url: SFBizConfig.setting.api.url,
          type: 'post',
          data: that.sign(data)
        })
        .done(function(response) {
          if (response && response.stat) {
            that.serverTime = response.stat.systime;
          }

          if (that.access(response, isForceUserLogin)) {
            that.afterRequest(data._mt, response.content[0]);
            def.resolve(response.content[0]);
          } else {
            if (response.stat.stateList.length == 0) {
              def.reject(response.stat.code);
            } else {
              def.reject(response.stat.stateList[0].code);
            }
          }
        })
        .fail(function(error) {
          def.reject(error);
        });

        return def;
      },

      /**
       * @description 通过服务端接口每次从stat中返回的system在客户端中保留服务端时间
       * @return {Int} 服务端时间的时间戳
       */
      getServerTime: function () {
        return this.serverTime;
      },

      /**
       * @description 请求后处理回调
       * @function sf.b2c.mall.framework.comm.afterRequest
       * @param  {String} mt
       * @param  {Map} response
       */
      afterRequest: function(mt, response) {
        var map = {
          'user.webLogin': function(response) {

            store.set('csrfToken', 'response.csrfToken');

            // if (window.localStorage) {
            //   window.localStorage.setItem('csrfToken', response.csrfToken);
            // } else {
            //   $.jStorage.set('csrfToken', response.csrfToken);
            // }
          }
        };

        if (_.isFunction(map[mt])) {
          map[mt].call(this, response);
        }
      },

      /**
       * @description 调用简单的ajax请求
       * @param  {Map} data 请求$.ajaxSetting
       * @return {Object} can.Deferred
       */
      ajax: function(data) {
        return can.ajax(data);
      }
    });

    SFBaseComm.register = function (aid) {
      this._aid = aid;
    }

    return SFBaseComm;
  });
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getBanner
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getBanner',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getBanner',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getFastSaleInfoList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getFastSaleInfoList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getFastSaleInfoList',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
      },
      OPTIONAL: {
        'pageIndex': 'int',
        'pageSize': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getItemInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getItemInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getItemInfo',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '9000210': '未知的item'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getProductHotData
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getProductHotData',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getProductHotData',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '9000210': '未知的item'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getProductHotDataList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getProductHotDataList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getProductHotDataList',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemIds': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '9000002': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getSkuInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getSkuInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getSkuInfo',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'skuId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '9000200': '未知的sku'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'b2cmall.getTimeLimitedSaleInfoList',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'filter': 'string',
      },
      OPTIONAL: {
        'size': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.cancelOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.cancelOrder',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.cancelOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000800': '订单状态不能取消'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.confirmReceive
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.confirmReceive',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.confirmReceive',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'subOrderId': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000900': '子订单状态不符合确认操作'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.getOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.getOrder',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.getOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.getOrderList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.getOrderList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.getOrderList',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'query': 'json'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.getSubOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.getSubOrder',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.getSubOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'subOrderId': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.requestPay
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.requestPay',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.requestPay',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string',
        'amount': 'int',
      },
      OPTIONAL: {
        'payType': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.requestPayV2
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.requestPayV2',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.requestPayV2',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string',
        'payType': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4001500': '请求支付系统失败',
        '4001700': '满足查询条件的订单不存在',
        '4002200': '子订单获取物流线路信息为空'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.submitOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.submitOrder',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.submitOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'json',
        'items': 'json'
      },
      OPTIONAL: {
        'userMsg': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000200': '订单地址不存在',
        '4000300': '订单地址状态错误',
        '4000400': '订单商品信息改变',
        '4000500': '订单商品库存不足',
        '4000600': '订单商品超过限额',
        '4000700': '订单商品金额改变'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.submitOrderForAllSys
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.submitOrderForAllSys',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.submitOrderForAllSys',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'json',
        'items': 'json',
        'sysType': 'string',
      },
      OPTIONAL: {
        'userMsg': 'string',
        'sysInfo': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000200': '订单地址不存在',
        '4000400': '订单商品信息改变',
        '4000500': '订单商品库存不足',
        '4000600': '订单商品超过限额',
        '4000700': '订单商品金额改变'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.submitOrderV2
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.order.submitOrderV2',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'order.submitOrderV2',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'json',
        'items': 'json'
      },
      OPTIONAL: {
        'userMsg': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000200': '订单地址不存在',
        '4000400': '订单商品信息改变',
        '4000500': '订单商品库存不足',
        '4000600': '订单商品超过限额',
        '4000700': '订单商品金额改变'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.findRecommendProducts
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.product.findRecommendProducts',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'product.findRecommendProducts',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long',
      },
      OPTIONAL: {
        'size': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5000400': '类目未发现'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.findSaleBaseInfoList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.product.findSaleBaseInfoList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'product.findSaleBaseInfoList',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'sale_base_info_list': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.add
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.add',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.add',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'sku': 'string',
        'num': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100100': '购物车添加失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.bulkDeleteShopCart
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.bulkDeleteShopCart',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.bulkDeleteShopCart',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'skulist': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100400': '购物车清空失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.clearShopCart
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.clearShopCart',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.clearShopCart',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100400': '购物车清空失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.getSkuAll
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.getSkuAll',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.getSkuAll',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100500': '查询购物车spu列表失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.getSkuCount
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.getSkuCount',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.getSkuCount',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100500': '查询购物车spu列表失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.remove
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.remove',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.remove',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'sku': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100200': '购物车sku删除失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.updateSKUNum
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.shopcart.updateSKUNum',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.updateSKUNum',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'sku': 'string',
        'num': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4100300': '购物车更新数量失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.appLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.appLogin',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.appLogin',
      SECURITY_TYPE: SecurityType.RegisteredDevice.name,
      REQUIRED: {
        'accountId': 'string',
        'type': 'string',
        'password': 'string',
      },
      OPTIONAL: {
        'vfCode': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000030': '用户名or密码错误',
        '1000070': '参数错误',
        '1000100': '验证码错误',
        '1000110': '账户尚未激活',
        '1000300': '用户名或密码错误已达3次，需要输入验证码'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.changePassword
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.changePassword',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.changePassword',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'oldPassword': 'string',
        'newPassword': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000040': '原密码错误',
        '1000060': '密码与原密码相同'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.checkLink
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.checkLink',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.checkLink',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'linkContent': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000120': '链接已过期',
        '1000130': '签名验证失败',
        '1000140': '密码修改间隔太短'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.checkSmsCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.checkSmsCode',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.checkSmsCode',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobile': 'string',
        'smsCode': 'string',
        'askType': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000230': '手机号错误，请输入正确的手机号',
        '1000250': '手机验证码已过期'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.checkUserExist
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.checkUserExist',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.checkUserExist',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'accountId': 'string',
        'type': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.checkVerifyCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.checkVerifyCode',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.checkVerifyCode',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'vfcode': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.createRecAddress
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.createRecAddress',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.createRecAddress',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'nationName': 'string',
        'provinceName': 'string',
        'cityName': 'string',
        'regionName': 'string',
        'detail': 'string',
        'cellphone': 'string',
      },
      OPTIONAL: {
        'zipCode': 'string',
        'recName': 'string',
        'recId': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误',
        '1000310': '已达到最大允许数目'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.createReceiverInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.createReceiverInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.createReceiverInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recName': 'string',
        'type': 'string',
        'credtNum': 'string',
      },
      OPTIONAL: {
        'credtImgUrl1': 'string',
        'credtImgUrl2': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误',
        '1000200': '收货人身份信息已存在，选择即可',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000280': '身份证号码错误',
        '1000310': '已达到最大允许数目'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.delRecAddress
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.delRecAddress',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.delRecAddress',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addrId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.deviceRegister
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.deviceRegister',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.deviceRegister',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'deviceInfo': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.downSmsCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.downSmsCode',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.downSmsCode',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobile': 'string',
        'askType': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000020': '账户已注册',
        '1000070': '参数错误',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000270': '短信请求太过频繁',
        '1000290': '短信请求太多'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.federatedLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.federatedLogin',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.federatedLogin',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'reqParas': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000130': '签名验证失败',
        '1000210': '校验第三方accessToken失败',
        '1000220': '不支持非门店账户下单or非门店下单'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getIDCardUrlList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.getIDCardUrlList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.getIDCardUrlList',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getInviteCodeList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.getInviteCodeList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.getInviteCodeList',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getRecAddressList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.getRecAddressList',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.getRecAddressList',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getUserInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.getUserInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.getUserInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.logout
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.logout',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.logout',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.mailRegister
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.mailRegister',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.mailRegister',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mailId': 'string',
        'passWord': 'string',
        'linkContent': 'string'
      },
      OPTIONAL: {
        'nick': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000050': '邮箱地址错误',
        '1000070': '参数错误',
        '1000120': '链接已过期',
        '1000130': '签名验证失败'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.mobileRegister
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.mobileRegister',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.mobileRegister',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobile': 'string',
        'smsCode': 'string',
        'password': 'string',
      },
      OPTIONAL: {
        'nick': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000240': '手机验证码错误',
        '1000250': '手机验证码已过期'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.needVfCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.needVfCode',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.needVfCode',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'accountId': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.renewToken
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.renewToken',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.renewToken',
      SECURITY_TYPE: SecurityType.RegisteredDevice.name,
      REQUIRED: {
        'token': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.resetPassword
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.resetPassword',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.resetPassword',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'accountId': 'string',
        'type': 'string',
        'newPassword': 'string',
      },
      OPTIONAL: {
        'linkContent': 'string',
        'smsCode': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000070': '参数错误',
        '1000120': '链接已过期',
        '1000130': '签名验证失败',
        '1000140': '密码修改间隔太短',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000240': '手机验证码错误',
        '1000250': '手机验证码已过期'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.sendActivateMail
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.sendActivateMail',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.sendActivateMail',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mailId': 'string',
      },
      OPTIONAL: {
        'vfCode': 'string',
        'from': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000050': '邮箱地址错误',
        '1000070': '参数错误',
        '1000100': '验证码错误',
        '1000160': '邮件请求频繁'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.sendResetPwdLink
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.sendResetPwdLink',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.sendResetPwdLink',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mailId': 'string',
      },
      OPTIONAL: {
        'vfCode': 'string',
        'from': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000050': '邮箱地址错误',
        '1000070': '参数错误',
        '1000100': '验证码错误',
        '1000110': '账户尚未激活',
        '1000160': '邮件请求频繁'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.setDefaultAddr
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.setDefaultAddr',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.setDefaultAddr',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addrId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.upateUserInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.upateUserInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.upateUserInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
        'gender': 'string',
        'nick': 'string',
        'headImgUrl': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.updateRecAddress
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.updateRecAddress',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.updateRecAddress',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addrId': 'long',
      },
      OPTIONAL: {
        'nationName': 'string',
        'provinceName': 'string',
        'cityName': 'string',
        'regionName': 'string',
        'detail': 'string',
        'zipCode': 'string',
        'cellphone': 'string',
        'recName': 'string',
        'recId': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.updateReceiverInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.updateReceiverInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.updateReceiverInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recId': 'long',
      },
      OPTIONAL: {
        'recName': 'string',
        'type': 'string',
        'credtNum': 'string',
        'credtImgUrl1': 'string',
        'credtImgUrl2': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误',
        '1000200': '收货人身份信息已存在，选择即可',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000280': '身份证号码错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.webLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.webLogin',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.webLogin',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'accountId': 'string',
        'type': 'string',
        'password': 'string',
      },
      OPTIONAL: {
        'vfCode': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000030': '用户名or密码错误',
        '1000070': '参数错误',
        '1000100': '验证码错误',
        '1000110': '账户尚未激活',
        '1000300': '用户名或密码错误已达3次，需要输入验证码'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.setDefaultRecv
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.setDefaultRecv',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.setDefaultRecv',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.updateUserInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.updateUserInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.updateUserInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
        'gender': 'string',
        'nick': 'string',
        'headImgUrl': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.delRecvInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.delRecvInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.delRecvInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getRecvInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define('sf.b2c.mall.api.user.getRecvInfo',[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  

  return Comm.extend({
    api: {
      METHOD_NAME: 'user.getRecvInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});
/**
 * @class sf.b2c.mall.framework.adapter
 * @description adapter基类
 * @param  {Object} can
 * @param  {Object} _   underscore
 * @return {can.Map}
 */
define('sf.b2c.mall.framework.adapter',['can', 'underscore'], function (can, _) {
  

  return can.Map.extend({

    /**
     * @function sf.b2c.mall.framework.adapter.format
     * @description 对传输进来的数据进行格式化
     */
    format: function () {
      throw new Error('使用前必须被复写');
    },

    /**
     * @function sf.b2c.mall.framework.adapter.empty
     * @description 清空现在的attrs
     */
    empty: function () {
      var handler = _.bind(function (value, key) {
        this.removeAttr(key);
      }, this);
      this.each(handler);
    },

    /**
     * @function sf.b2c.mall.framework.adapter.replace
     * @description 清空现在的attrs之后设置
     * @param  {Map} attrs 需要设置的熟悉
     */
    replace: function (attrs) {
      this.empty();
      this.attr(attrs);
    }

  });

});


/**
 * @class sf.b2c.mall.framework.multiple.comm
 * @description comm的合并通信
 * @example
 *
 * ```
 * var webLogin = new SFUserWebLogin(utils.testData.user4Login);
 *
 *     webLogin
 *       .sendRequest()
 *       .done(function(loginResult) {
 *       })
 *       .fail(function(errorCode) {
 *         errorCode.should.equal(0);
 *         done();
 *       })
 *       .then(function(loginResult) {
 *        request_a = new SFGetSKUInfo({sku: 1});
 *         request_b = new SFGetUserInfo();
 *
 *         var mComm = new SFFrameworkMultipleComm([request_a, request_b]);
 *         mComm.setData([request_a.data, request_b.data]);
 *         return mComm.sendRequest();
 *       })
 *       .done(function(message) {
 *         console.log(message)
 *         message.length.should.equal(2)
 *         message[0].skuId.should.equal('1')
 *         message[1].mailId.should.equal(utils.testData.user4Login.accountId)
 *         done();
 *       })
 *       .fail(function(stat) {
 *         for(var i in stat.stateList){
 *           stat.stateList[i].code.should.equal(0);
 *         }
 *         done();
 *       })
 * ```
 */

define(
  'sf.b2c.mall.framework.multiple.comm',[
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.security.type'
  ],
  function ( _, SFComm, SFBizConfig, SecurityType) {

    var ERROR_CODE_TOKEN_ERROR = -360;
    var ERROR_CODE_TOKEN_EXPIRE = -300;
    var ERROR_CODE_SIGNATURE_ERROR = -180;
    var ERROR_CODE_ACCESS_DENIED = -160;

    var TOKEN_AND_SIGNATURE_ERROR_GROUP = [
      ERROR_CODE_TOKEN_ERROR,
      ERROR_CODE_TOKEN_EXPIRE,
      ERROR_CODE_SIGNATURE_ERROR,
      ERROR_CODE_ACCESS_DENIED
    ];

    return SFComm.extend({

      /**
       * @override
       * @function sf.b2c.mall.framework.multiple.comm.init
       * @description 在init方法中传入comm的队列
       * @param  {List<Comm>} comms comms 需要合并的接口Array
       */
      init: function (comms) {
        this.buildApi(comms);
      },

      /**
       * @function sf.b2c.mall.framework.multiple.comm.buildApi
       * @description 为multiple创建api对象
       * @param  {List<Comm>} comms 需要合并的接口Array
       */
      buildApi: function (comms) {
        var apis = _.pluck(comms, 'api');

        // 拼接_mt字段饿方法请求
        var _mt_arr = _.pluck(apis, 'METHOD_NAME');
        this.api.METHOD_NAME = _mt_arr.join(',');

        // 获取SecurityType
        var securityType = {
          code: -1,
          name: null
        };
        _.each(apis, function(api){
          var st = SecurityType[api.SECURITY_TYPE];
          if (st.code > securityType.code) {
            securityType = st;
          }
        });
        this.api.SECURITY_TYPE = securityType.name;

        // 设置Data
        this.api.REQUIRED = _.pluck(apis, 'REQUIRED');
        this.api.OPTIONAL = _.pluck(apis, 'OPTIONAL');
      },

      /**
       * @override
       * @function sf.b2c.mall.framework.multiple.comm.buildRequestData
       * @description 对multiple的comms做数据处理
       */
      buildRequestData: function () {
        if (this.api) {
          var requestData = {};

          _.extend(requestData, {
            '_mt': this.api.METHOD_NAME
          });

          _.extend(requestData, this.api.COMMON);

          var that = this;

          var key;
          _.each(this.api.REQUIRED, function(apis, index){
            for (key in that.api.REQUIRED[index]) {
              requestData[index + '_' + key] = that.data[index][key];
            }
          });

          _.each(this.api.OPTIONAL, function(apis, index){
            for (key in that.api.OPTIONAL[index]) {
              requestData[index + '_' + key] = that.data[index][key];
            }
          });

          return requestData;
        }
      },

      /**
       * @override
       * @function sf.b2c.mall.framework.multiple.comm.access
       * @description 返回的参数是否正确
       * @param  {Map}      response          服务端返回的信息
       * @param  {Boolean}  isForceUserLogin  是否需要强制登陆
       */
      access: function(responses, isForceUserLogin) {
        if (_.isArray(responses.content)) {
          var that = this;
          var result = true;
          _.each(responses.content, function(response, index){
            result = result && that._access(responses, index, isForceUserLogin);
          });
          return result;
        }else{
          return this._access(responses, 0, isForceUserLogin);
        }
      },

      _access: function (response, index, isForceUserLogin) {
        if (response.stat.code === 0 && response.content[index] && response.stat.stateList[index].code === 0) {
          return true;
        } else if (_.contains(TOKEN_AND_SIGNATURE_ERROR_GROUP, response.stat.code) && isForceUserLogin) {
          this.goToLogin();
        } else {
          return false;
        }
      },

      /**
       * @function sf.b2c.mall.framework.request
       * @param  {Map}     data             请求参数
       * @param  {Boolean} isForceUserLogin 是否需要强制登陆
       * @return {can.Deferred}
       */
      request: function(data, isForceUserLogin) {
        var def = can.Deferred();

        var that = this;
        can.ajax({
          url: SFBizConfig.setting.api.url,
          type: 'post',
          data: that.sign(data),
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function(response) {
          if (that.access(response, isForceUserLogin)) {
            that.afterRequest(data._mt, response.content);
            def.resolve(response.content);
          } else {
            if (response.stat.stateList.length == 0) {
              def.reject(response.stat.code);
            } else {
              def.reject(response.stat);
            }
          }
        })
        .fail(function(error) {
          def.reject(error);
        });

        return def;
      },

    });
});


/**
 * @class sf.b2c.mall.framework.view.controller
 * @description view.controller基类
 * @param  {Object} can
 * @param  {Object} _   underscore
 * @return {can.Map}
 */
define('sf.b2c.mall.framework.view.controller',['can', 'underscore'], function (can, _) {

  return can.Control.extend({

    /**
     * @function sf.b2c.mall.framework.view.controller.draw
     * @description view的绘制
     * @param  {String}           template  模版名称
     * @param  {Map}              data      数据
     * @param  {Mustache.Helper}  helper
     */
    draw: function (template, data, helper) {
      this.element.html(can.view(template, data, helper || {}));
    },

    /**
     * @function sf.b2c.mall.framework.view.controller.render
     * @description view的第1层渲染
     */
    render: function () {
      throw('使用前必须被复写');
    },

    /**
     * @function sf.b2c.mall.framework.view.controller.supplement
     * @description view的第2层渲染
     */
    supplement: function () {
      throw('使用前必须被复写');
    }

  });

});


/**
 * @class sf.b2c.mall.util.check
 * @param  {Object} $
 * @param  {Object} can
 * @param  {Object} _
 * @param  {Object} errorCode
 */
define('sf.b2c.mall.util.utils',[
    'jquery',
    'can',
    'underscore',
    'md5',
    'sf.b2c.mall.business.config',
  ],
  function($, can, _, md5, SFBizConfig) {

    return {

      /**
       * [md5 进行MD5加密]
       * @param  {[type]} str
       * @return {[type]}
       */
      md5: function(str) {
        return md5(str + SFBizConfig.setting.md5_key);
      }
    }

  });
