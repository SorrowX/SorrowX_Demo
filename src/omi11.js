!(function() {
	// omi.js
	var Omi = (function() {
		var Omi = {}
		Omi.instances =  {}
		Omi._instanceId = 0
		Omi.getInstanceId = function () {
		    return Omi._instanceId++
		}
		Omi.customTags = []
		Omi.mapping = {}

		Omi.STYLEPREFIX = "omi_style_"
		Omi.STYLESCOPEDPREFIX = "omi_scoped_"

		Omi.style = { }

		Omi.componentConstructor = { }

		//fix ie bug
		if (typeof Object.assign != 'function') {
		    Object.assign = function(target) {
		        'use strict';
		        if (target == null) {
		            throw new TypeError('Cannot convert undefined or null to object');
		        }

		        target = Object(target);
		        for (var index = 1; index < arguments.length; index++) {
		            var source = arguments[index];
		            if (source != null) {
		                for (var key in source) {
		                    if (Object.prototype.hasOwnProperty.call(source, key)) {
		                        target[key] = source[key];
		                    }
		                }
		            }
		        }
		        return target;
		    };
		}

		/**
		 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
		 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
		 * (technically, since host objects have been implementation-dependent,
		 * at least before ES6, IE hasn't needed to work this way).
		 * Also works on strings, fixes IE < 9 to allow an explicit undefined
		 * for the 2nd argument (as in Firefox), and prevents errors when
		 * called on other DOM objects.
		 */
		(function () {
		    'use strict';
		    var _slice = Array.prototype.slice;

		    try {
		        // Can't be used with DOM elements in IE < 9
		        _slice.call(document.documentElement);
		    } catch (e) { // Fails in IE < 9
		        // This will work for genuine arrays, array-like objects,
		        // NamedNodeMap (attributes, entities, notations),
		        // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
		        // and will not fail on other DOM objects (as do DOM elements in IE < 9)
		        Array.prototype.slice = function (begin, end) {
		            // IE < 9 gets unhappy with an undefined end argument
		            end = (typeof end !== 'undefined') ? end : this.length;

		            // For native Array objects, we use the native slice function
		            if (Object.prototype.toString.call(this) === '[object Array]'){
		                return _slice.call(this, begin, end);
		            }

		            // For array like object we handle it ourselves.
		            var i, cloned = [],
		                size, len = this.length;

		            // Handle negative value for "begin"
		            var start = begin || 0;
		            start = (start >= 0) ? start: len + start;

		            // Handle negative value for "end"
		            var upTo = (end) ? end : len;
		            if (end < 0) {
		                upTo = len + end;
		            }

		            // Actual expected size of the slice
		            size = upTo - start;

		            if (size > 0) {
		                cloned = new Array(size);
		                if (this.charAt) {
		                    for (i = 0; i < size; i++) {
		                        cloned[i] = this.charAt(start + i);
		                    }
		                } else {
		                    for (i = 0; i < size; i++) {
		                        cloned[i] = this[start + i];
		                    }
		                }
		            }

		            return cloned;
		        };
		    }
		}());


		var _createClass = function () { 
			function defineProperties(target, props) { 
				for (var i = 0; i < props.length; i++) { 
					var descriptor = props[i]; 
					descriptor.enumerable = descriptor.enumerable || false; 
					descriptor.configurable = true; 
					if ("value" in descriptor) descriptor.writable = true; 
					Object.defineProperty(target, descriptor.key, descriptor); 
				} 
			} 
			return function (Constructor, protoProps, staticProps) { 
				if (protoProps) defineProperties(Constructor.prototype, protoProps); 
				if (staticProps) defineProperties(Constructor, staticProps); 
				return Constructor; 
			}; 
		}();

		function _classCallCheck(instance, Constructor) { 
			if (!(instance instanceof Constructor)) { 
				throw new TypeError("Cannot call a class as a function"); 
			} 
		}

		function _possibleConstructorReturn(self, call) { 
			if (!self) { 
				throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); 
			} 
			return call && (typeof call === "object" || typeof call === "function") ? call : self; 
		}

		function _inherits(subClass, superClass) { 
			if (typeof superClass !== "function" && superClass !== null) { 
				throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); 
			} 
			subClass.prototype = Object.create(superClass && superClass.prototype, { 
				constructor: { 
					value: subClass, 
					enumerable: false, 
					writable: true, 
					configurable: true 
				} 
			}); 
			if (superClass) {
				Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; 
			}
		}

		function toArr(obj) {
		    let arr = []
		    for (let key in obj) {
		        if (obj.hasOwnProperty(key)) {
		            arr.push({key: key, value: obj[key]})
		        }
		    }
		    return arr
		}

		Omi.create = function(tagName ,parent,setting) {
		    let u_setting = parent,
		        u_parent = Omi.Component
		    if (arguments.length > 2) {
		        u_setting = setting
		        u_parent = parent
		    }
		    Omi.componentConstructor[tagName] = function (parent) {
		        _inherits(Obj, parent)

		        function Obj(data, server) {
		            _classCallCheck(this, Obj)
		            this.___omi_constructor_name = tagName
		            return _possibleConstructorReturn(this, (Obj.__proto__ || Object.getPrototypeOf(Obj)).call(this, data,server))
		        }

		        _createClass(Obj, toArr(u_setting))

		        return Obj
		    }(u_parent)

		    Omi.customTags.push(tagName)

		    return Omi.componentConstructor[tagName]
		}

		Omi.createStore = function(option) {

		    /*let Store = function (parent) {
		        _inherits(Obj, parent)

		        function Obj(data, isReady) {
		            _classCallCheck(this, Obj)
		            this.data = data
		            option.methods.install && option.methods.install.call(this)
		            return _possibleConstructorReturn(this, (Obj.__proto__ || Object.getPrototypeOf(Obj)).call(this, data, isReady))
		            // return _possibleConstructorReturn(this, (new (Obj.__proto__ || Object.getPrototypeOf(Obj))))
		        }

		        _createClass(Obj, toArr(option.methods))

		        return Obj
		    }(Omi.Store)

		    return new Store(option.data, true)*/

		    var storeInstance = new (class s extends Omi.Store {})(true);
		    storeInstance.data = option.data;
		    Object.assign(storeInstance.__proto__ || Object.getPrototypeOf(storeInstance), option.methods);
		    storeInstance.install && storeInstance.install();
		    return storeInstance;
		}

		Omi.mixIndex = function(array, key) {
		    const len = array.length,
		        indexName = key || "index"
		    for (let i = 0; i < len; i++) {
		        var item = array[i]
		        if (typeof item === "object") {
		            item[indexName] = i
		        } else {
		            array[i] = {value: item}
		            array[i][indexName] = i
		        }
		    }
		    return array
		}

		Omi.$ = function(selector,context){
		    if(context){
		        return context.querySelector(selector)
		    }else{
		        return document.querySelector(selector)
		    }
		}

		Omi.$$ = function(selector,context){
		    if(context){
		        return  Array.prototype.slice.call(context.querySelectorAll(selector))
		    }else{
		        return Array.prototype.slice.call(document.querySelectorAll(selector))
		    }
		}

		Omi.getClassFromString = function(str) {
		    if (str.indexOf('.') !== -1) { //root is window
		        let arr = str.split('.')
		        const len = arr.length
		        let current = window[arr[0]]
		        for (let i = 1; i < len; i++) {
		            current = current[arr[i]]
		        }
		        return current
		    } else {
		        return Omi.componentConstructor[str]
		    }
		}

		//以前是Component的静态方法，移到omi下来，不然makehtml 在ie下child访问不到父亲的静态方法
		Omi.makeHTML= function(name, ctor) {
		    Omi.componentConstructor[name] = ctor
		    Omi.componentConstructor[name.toLowerCase()] = ctor
		    Omi.customTags.push(name, name.toLowerCase())
		}

		Omi.tag = Omi.makeHTML

		Omi.render = function(component , renderTo , incrementOrOption){
		    component.renderTo = typeof renderTo === "string" ? document.querySelector(renderTo) : renderTo
		    if(typeof incrementOrOption === 'boolean') {
		        component._omi_increment = incrementOrOption
		    }else if(incrementOrOption){
		        component._omi_increment = incrementOrOption.increment
		        if( incrementOrOption.store) {
		            if(incrementOrOption.store instanceof Omi.Store){
		                component.$store = incrementOrOption.store
		            }else{
		                component.$store = Omi.createStore(incrementOrOption.store);
		                /*var store = new (class Cstore extends Omi.Store {});
		                Object.assign(store.__proto__, incrementOrOption.store.methods);
		                component.$store = store;
		                console.log(component.$store);*/
		            }
		        }
		        component._omi_autoStoreToData = incrementOrOption.autoStoreToData
		    }
		    component.install()
		    component._render(true)
		    component._childrenInstalled(component)
		    component.installed()
		    component._execInstalledHandlers()
		    return component
		}

		Omi.get = function(name){
		    return Omi.mapping[name]
		}

		Omi.plugins ={}

		Omi.extendPlugin = function(name, handler) {
		    Omi.plugins[name] = handler
		}

		Omi.getParameters = function(dom, instance, types){
		    let data = { }
		    let noop = function(){ }
		    let methodMapping = {
		        stringType : value =>{
		            return value
		        },
		        numberType: value =>{
		            return Number(value)
		        },
		        booleanType: value => {
		            if (value === 'true') {
		                return true
		            } else if (value === 'false') {
		                return false
		            } else {
		                return Boolean(value)
		            }
		        },
		        functionType: value => {
		            if (value) {
		                let handler = instance[value.replace(/Omi.instances\[\d\]./, '')]
		                if (handler) {
		                    return handler.bind(instance)
		                } else {
		                    console.warn('You do not define [ '+value+' ] method in following component')
		                    console.warn(instance)
		                }
		            } else {
		                return noop
		            }
		        }
		    }
		    Object.keys(types).forEach(type => {
		        types[type].forEach(name => {
		            let attr =  dom.getAttribute(name)
		            if(attr !== null) {
		                data[name] = methodMapping[type](attr)
		            }
		        } )
		    })

		    return data
		}

		Omi.mixIndexToArray = function(arr ,indexName){
		    arr.forEach((item , index)=>{
		       item[indexName||'index'] =  index
		    })
		}

		return Omi;
	})();

	// mustache.js
	var Mustache = (function(mustache) {
		var objectToString = Object.prototype.toString;
		var isArray = Array.isArray || function isArrayPolyfill (object) {
		        return objectToString.call(object) === '[object Array]';
		    };

		function isFunction (object) {
		    return typeof object === 'function';
		}

		/**
		 * More correct typeof string handling array
		 * which normally returns typeof 'object'
		 */
		function typeStr (obj) {
		    return isArray(obj) ? 'array' : typeof obj;
		}

		function escapeRegExp (string) {
		    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
		}

		/**
		 * Null safe way of checking whether or not an object,
		 * including its prototype, has a given property
		 */
		function hasProperty (obj, propName) {
		    return obj != null && typeof obj === 'object' && (propName in obj);
		}

		// Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
		// See https://github.com/janl/mustache.js/issues/189
		var regExpTest = RegExp.prototype.test;
		function testRegExp (re, string) {
		    return regExpTest.call(re, string);
		}

		var nonSpaceRe = /\S/;
		function isWhitespace (string) {
		    return !testRegExp(nonSpaceRe, string);
		}

		var entityMap = {
		    '&': '&amp;',
		    '<': '&lt;',
		    '>': '&gt;',
		    '"': '&quot;',
		    "'": '&#39;',
		    '/': '&#x2F;',
		    '`': '&#x60;',
		    '=': '&#x3D;'
		};

		function escapeHtml (string) {
		    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
		        return entityMap[s];
		    });
		}

		var whiteRe = /\s*/;
		var spaceRe = /\s+/;
		var equalsRe = /\s*=/;
		var curlyRe = /\s*\}/;
		var tagRe = /#|\^|\/|>|\{|&|=|!/;

		/**
		 * Breaks up the given `template` string into a tree of tokens. If the `tags`
		 * argument is given here it must be an array with two string values: the
		 * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
		 * course, the default is to use mustaches (i.e. mustache.tags).
		 *
		 * A token is an array with at least 4 elements. The first element is the
		 * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
		 * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
		 * all text that appears outside a symbol this element is "text".
		 *
		 * The second element of a token is its "value". For mustache tags this is
		 * whatever else was inside the tag besides the opening symbol. For text tokens
		 * this is the text itself.
		 *
		 * The third and fourth elements of the token are the start and end indices,
		 * respectively, of the token in the original template.
		 *
		 * Tokens that are the root node of a subtree contain two more elements: 1) an
		 * array of tokens in the subtree and 2) the index in the original template at
		 * which the closing tag for that section begins.
		 */
		function parseTemplate (template, tags) {
		    if (!template)
		        return [];

		    var sections = [];     // Stack to hold section tokens
		    var tokens = [];       // Buffer to hold the tokens
		    var spaces = [];       // Indices of whitespace tokens on the current line
		    var hasTag = false;    // Is there a {{tag}} on the current line?
		    var nonSpace = false;  // Is there a non-space char on the current line?

		    // Strips all whitespace tokens array for the current line
		    // if there was a {{#tag}} on it and otherwise only space.
		    function stripSpace () {
		        if (hasTag && !nonSpace) {
		            while (spaces.length)
		                delete tokens[spaces.pop()];
		        } else {
		            spaces = [];
		        }

		        hasTag = false;
		        nonSpace = false;
		    }

		    var openingTagRe, closingTagRe, closingCurlyRe;
		    function compileTags (tagsToCompile) {
		        if (typeof tagsToCompile === 'string')
		            tagsToCompile = tagsToCompile.split(spaceRe, 2);

		        if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
		            throw new Error('Invalid tags: ' + tagsToCompile);

		        openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
		        closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
		        closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
		    }

		    compileTags(tags || mustache.tags);

		    var scanner = new Scanner(template);

		    var start, type, value, chr, token, openSection;
		    while (!scanner.eos()) {
		        start = scanner.pos;

		        // Match any text between tags.
		        value = scanner.scanUntil(openingTagRe);

		        if (value) {
		            for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
		                chr = value.charAt(i);

		                if (isWhitespace(chr)) {
		                    spaces.push(tokens.length);
		                } else {
		                    nonSpace = true;
		                }

		                tokens.push([ 'text', chr, start, start + 1 ]);
		                start += 1;

		                // Check for whitespace on the current line.
		                if (chr === '\n')
		                    stripSpace();
		            }
		        }

		        // Match the opening tag.
		        if (!scanner.scan(openingTagRe))
		            break;

		        hasTag = true;

		        // Get the tag type.
		        type = scanner.scan(tagRe) || 'name';
		        scanner.scan(whiteRe);

		        // Get the tag value.
		        if (type === '=') {
		            value = scanner.scanUntil(equalsRe);
		            scanner.scan(equalsRe);
		            scanner.scanUntil(closingTagRe);
		        } else if (type === '{') {
		            value = scanner.scanUntil(closingCurlyRe);
		            scanner.scan(curlyRe);
		            scanner.scanUntil(closingTagRe);
		            type = '&';
		        } else {
		            value = scanner.scanUntil(closingTagRe);
		        }

		        // Match the closing tag.
		        if (!scanner.scan(closingTagRe))
		            throw new Error('Unclosed tag at ' + scanner.pos);

		        token = [ type, value, start, scanner.pos ];
		        tokens.push(token);

		        if (type === '#' || type === '^') {
		            sections.push(token);
		        } else if (type === '/') {
		            // Check section nesting.
		            openSection = sections.pop();

		            if (!openSection)
		                throw new Error('Unopened section "' + value + '" at ' + start);

		            if (openSection[1] !== value)
		                throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
		        } else if (type === 'name' || type === '{' || type === '&') {
		            nonSpace = true;
		        } else if (type === '=') {
		            // Set the tags for the next time around.
		            compileTags(value);
		        }
		    }

		    // Make sure there are no open sections when we're done.
		    openSection = sections.pop();

		    if (openSection)
		        throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

		    return nestTokens(squashTokens(tokens));
		}

		/**
		 * Combines the values of consecutive text tokens in the given `tokens` array
		 * to a single token.
		 */
		function squashTokens (tokens) {
		    var squashedTokens = [];

		    var token, lastToken;
		    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
		        token = tokens[i];

		        if (token) {
		            if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
		                lastToken[1] += token[1];
		                lastToken[3] = token[3];
		            } else {
		                squashedTokens.push(token);
		                lastToken = token;
		            }
		        }
		    }

		    return squashedTokens;
		}

		/**
		 * Forms the given array of `tokens` into a nested tree structure where
		 * tokens that represent a section have two additional items: 1) an array of
		 * all tokens that appear in that section and 2) the index in the original
		 * template that represents the end of that section.
		 */
		function nestTokens (tokens) {
		    var nestedTokens = [];
		    var collector = nestedTokens;
		    var sections = [];

		    var token, section;
		    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
		        token = tokens[i];

		        switch (token[0]) {
		            case '#':
		            case '^':
		                collector.push(token);
		                sections.push(token);
		                collector = token[4] = [];
		                break;
		            case '/':
		                section = sections.pop();
		                section[5] = token[2];
		                collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
		                break;
		            default:
		                collector.push(token);
		        }
		    }

		    return nestedTokens;
		}

		/**
		 * A simple string scanner that is used by the template parser to find
		 * tokens in template strings.
		 */
		function Scanner (string) {
		    this.string = string;
		    this.tail = string;
		    this.pos = 0;
		}

		/**
		 * Returns `true` if the tail is empty (end of string).
		 */
		Scanner.prototype.eos = function eos () {
		    return this.tail === '';
		};

		/**
		 * Tries to match the given regular expression at the current position.
		 * Returns the matched text if it can match, the empty string otherwise.
		 */
		Scanner.prototype.scan = function scan (re) {
		    var match = this.tail.match(re);

		    if (!match || match.index !== 0)
		        return '';

		    var string = match[0];

		    this.tail = this.tail.substring(string.length);
		    this.pos += string.length;

		    return string;
		};

		/**
		 * Skips all text until the given regular expression can be matched. Returns
		 * the skipped string, which is the entire tail if no match can be made.
		 */
		Scanner.prototype.scanUntil = function scanUntil (re) {
		    var index = this.tail.search(re), match;

		    switch (index) {
		        case -1:
		            match = this.tail;
		            this.tail = '';
		            break;
		        case 0:
		            match = '';
		            break;
		        default:
		            match = this.tail.substring(0, index);
		            this.tail = this.tail.substring(index);
		    }

		    this.pos += match.length;

		    return match;
		};

		/**
		 * Represents a rendering context by wrapping a view object and
		 * maintaining a reference to the parent context.
		 */
		function Context (view, parentContext) {
		    this.view = view;
		    this.cache = { '.': this.view };
		    this.parent = parentContext;
		}

		/**
		 * Creates a new context using the given view with this context
		 * as the parent.
		 */
		Context.prototype.push = function push (view) {
		    return new Context(view, this);
		};

		/**
		 * Returns the value of the given name in this context, traversing
		 * up the context hierarchy if the value is absent in this context's view.
		 */
		Context.prototype.lookup = function lookup (name) {
		    var cache = this.cache;

		    var value;
		    if (cache.hasOwnProperty(name)) {
		        value = cache[name];
		    } else {
		        var context = this, names, index, lookupHit = false;

		        while (context) {
		            if (name.indexOf('.') > 0) {
		                value = context.view;
		                names = name.split('.');
		                index = 0;

		                /**
		                 * Using the dot notion path in `name`, we descend through the
		                 * nested objects.
		                 *
		                 * To be certain that the lookup has been successful, we have to
		                 * check if the last object in the path actually has the property
		                 * we are looking for. We store the result in `lookupHit`.
		                 *
		                 * This is specially necessary for when the value has been set to
		                 * `undefined` and we want to avoid looking up parent contexts.
		                 **/
		                while (value != null && index < names.length) {
		                    if (index === names.length - 1)
		                        lookupHit = hasProperty(value, names[index]);

		                    value = value[names[index++]];
		                }
		            } else {
		                value = context.view[name];
		                lookupHit = hasProperty(context.view, name);
		            }

		            if (lookupHit)
		                break;

		            context = context.parent;
		        }

		        cache[name] = value;
		    }

		    if (isFunction(value))
		        value = value.call(this.view);

		    return value;
		};

		/**
		 * A Writer knows how to take a stream of tokens and render them to a
		 * string, given a context. It also maintains a cache of templates to
		 * avoid the need to parse the same template twice.
		 */
		function Writer () {
		    this.cache = {};
		}

		/**
		 * Clears all cached templates in this writer.
		 */
		Writer.prototype.clearCache = function clearCache () {
		    this.cache = {};
		};

		/**
		 * Parses and caches the given `template` and returns the array of tokens
		 * that is generated from the parse.
		 */
		Writer.prototype.parse = function parse (template, tags) {
		    var cache = this.cache;
		    var tokens = cache[template];

		    if (tokens == null)
		        tokens = cache[template] = parseTemplate(template, tags);

		    return tokens;
		};

		/**
		 * High-level method that is used to render the given `template` with
		 * the given `view`.
		 *
		 * The optional `partials` argument may be an object that contains the
		 * names and templates of partials that are used in the template. It may
		 * also be a function that is used to load partial templates on the fly
		 * that takes a single argument: the name of the partial.
		 */
		Writer.prototype.render = function render (template, view, partials) {
		    var tokens = this.parse(template);
		    var context = (view instanceof Context) ? view : new Context(view);
		    return this.renderTokens(tokens, context, partials, template);
		};

		/**
		 * Low-level method that renders the given array of `tokens` using
		 * the given `context` and `partials`.
		 *
		 * Note: The `originalTemplate` is only ever used to extract the portion
		 * of the original template that was contained in a higher-order section.
		 * If the template doesn't use higher-order sections, this argument may
		 * be omitted.
		 */
		Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
		    var buffer = '';

		    var token, symbol, value;
		    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
		        value = undefined;
		        token = tokens[i];
		        symbol = token[0];

		        if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
		        else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
		        else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
		        else if (symbol === '&') value = this.unescapedValue(token, context);
		        else if (symbol === 'name') value = this.escapedValue(token, context);
		        else if (symbol === 'text') value = this.rawValue(token);

		        if (value !== undefined)
		            buffer += value;
		    }

		    return buffer;
		};

		Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
		    var self = this;
		    var buffer = '';
		    var value = context.lookup(token[1]);

		    // This function is used to render an arbitrary template
		    // in the current context by higher-order sections.
		    function subRender (template) {
		        return self.render(template, context, partials);
		    }

		    if (!value) return;

		    if (isArray(value)) {
		        for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
		            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
		        }
		    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
		        buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
		    } else if (isFunction(value)) {
		        if (typeof originalTemplate !== 'string')
		            throw new Error('Cannot use higher-order sections without the original template');

		        // Extract the portion of the original template that the section contains.
		        value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

		        if (value != null)
		            buffer += value;
		    } else {
		        buffer += this.renderTokens(token[4], context, partials, originalTemplate);
		    }
		    return buffer;
		};

		Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
		    var value = context.lookup(token[1]);

		    // Use JavaScript's definition of falsy. Include empty arrays.
		    // See https://github.com/janl/mustache.js/issues/186
		    if (!value || (isArray(value) && value.length === 0))
		        return this.renderTokens(token[4], context, partials, originalTemplate);
		};

		Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
		    if (!partials) return;

		    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
		    if (value != null)
		        return this.renderTokens(this.parse(value), context, partials, value);
		};

		Writer.prototype.unescapedValue = function unescapedValue (token, context) {
		    var value = context.lookup(token[1]);
		    if (value != null)
		        return value;
		};

		Writer.prototype.escapedValue = function escapedValue (token, context) {
		    var value = context.lookup(token[1]);
		    if (value != null)
		        return mustache.escape(value);
		};

		Writer.prototype.rawValue = function rawValue (token) {
		    return token[1];
		};

		mustache.name = 'mustache.js';
		mustache.version = '2.3.0';
		mustache.tags = [ '{{', '}}' ];

		// All high-level mustache.* functions use this writer.
		var defaultWriter = new Writer();

		/**
		 * Clears all cached templates in the default writer.
		 */
		mustache.clearCache = function clearCache () {
		    return defaultWriter.clearCache();
		};

		/**
		 * Parses and caches the given template in the default writer and returns the
		 * array of tokens it contains. Doing this ahead of time avoids the need to
		 * parse templates on the fly as they are rendered.
		 */
		mustache.parse = function parse (template, tags) {
		    return defaultWriter.parse(template, tags);
		};

		/**
		 * Renders the `template` with the given `view` and `partials` using the
		 * default writer.
		 */
		mustache.render = function render (template, view, partials) {
		    if (typeof template !== 'string') {
		        throw new TypeError('Invalid template! Template should be a "string" ' +
		            'but "' + typeStr(template) + '" was given as the first ' +
		            'argument for mustache#render(template, view, partials)');
		    }

		    return defaultWriter.render(template, view, partials);
		};

		// This is here for backwards compatibility with 0.4.x.,
		/*eslint-disable */ // eslint wants camel cased function name
		mustache.to_html = function to_html (template, view, partials, send) {
		    /*eslint-enable*/

		    var result = mustache.render(template, view, partials);

		    if (isFunction(send)) {
		        send(result);
		    } else {
		        return result;
		    }
		};

		// Export the escaping function so that the user may override it.
		// See https://github.com/janl/mustache.js/issues/244
		mustache.escape = escapeHtml;

		// Export these mainly for testing, but also for advanced usage.
		mustache.Scanner = Scanner;
		mustache.Context = Context;
		mustache.Writer = Writer;

		return mustache;
	})({});

	// style.js
	var style = (function() {
		function scoper(css, prefix) {
		    //https://www.w3.org/TR/css-syntax-3/#lexical
		    css = css.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//g,'')

		    let re = new RegExp("([^\r\n,{}:]+)(:[^\r\n,{}]+)?(,(?=[^{}]*{)|\s*{)", "g")
		    /**
		     * Example:
		     *
		     * .classname::pesudo { color:red }
		     *
		     * g1 is normal selector `.classname`
		     * g2 is pesudo class or pesudo element
		     * g3 is the suffix
		     */
		    css = css.replace(re, function(g0, g1, g2, g3) {
		        if (typeof g2 === "undefined") {
		            g2 = ""
		        }

		        if (g1.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
		            return g1 + g2 + g3
		        }

		        var appendClass = g1.replace(/(\s*)$/, "") + prefix + g2
		        var prependClass = prefix + " " + g1.trim() + g2
		        return appendClass + "," + prependClass + g3
		    })

		    return css
		}

		function addStyle(cssText, id) {
		    let ele = document.getElementById(Omi.STYLEPREFIX  + id),
		        head = document.getElementsByTagName('head')[0]
		    if (ele && ele.parentNode === head) {
		        head.removeChild(ele)
		    }

		    let someThingStyles = document.createElement('style')
		    head.appendChild(someThingStyles)
		    someThingStyles.setAttribute('type', 'text/css')
		    someThingStyles.setAttribute('id',Omi.STYLEPREFIX + id)
		    if (!!window.ActiveXObject) {
		        someThingStyles.styleSheet.cssText = cssText
		    } else {
		        someThingStyles.textContent = cssText
		    }
		}

		return {
			scoper:scoper,
	        addStyle:addStyle
		};
	})();

	// event.js
	function scopedEvent(tpl,id) {
	    return tpl.replace(/<[\s\S]*?>/g, function (item) {
	        return item.replace(/on(abort|blur|cancel|canplay|canplaythrough|change|click|close|contextmenu|cuechange|dblclick|drag|dragend|dragenter|dragleave|dragover|dragstart|drop|durationchange|emptied|ended|error|focus|input|invalid|keydown|keypress|keyup|load|loadeddata|loadedmetadata|loadstart|mousedown|mouseenter|mouseleave|mousemove|mouseout|mouseover|mouseup|mousewheel|pause|play|playing|progress|ratechange|reset|resize|scroll|seeked|seeking|select|show|stalled|submit|suspend|timeupdate|toggle|volumechange|waiting|autocomplete|autocompleteerror|beforecopy|beforecut|beforepaste|copy|cut|paste|search|selectstart|wheel|webkitfullscreenchange|webkitfullscreenerror|touchstart|touchmove|touchend|touchcancel|pointerdown|pointerup|pointercancel|pointermove|pointerover|pointerout|pointerenter|pointerleave|Abort|Blur|Cancel|CanPlay|CanPlayThrough|Change|Click|Close|ContextMenu|CueChange|DblClick|Drag|DragEnd|DragEnter|DragLeave|DragOver|DragStart|Drop|DurationChange|Emptied|Ended|Error|Focus|Input|Invalid|KeyDown|KeyPress|KeyUp|Load|LoadedData|LoadedMetadata|LoadStart|MouseDown|MouseEnter|MouseLeave|MouseMove|MouseOut|MouseOver|MouseUp|MouseWheel|Pause|Play|Playing|Progress|RateChange|Reset|Resize|Scroll|Seeked|Seeking|Select|Show|Stalled|Submit|Suspend|TimeUpdate|Toggle|VolumeChange|Waiting|AutoComplete|AutoCompleteError|BeforeCopy|BeforeCut|BeforePaste|Copy|Cut|Paste|Search|SelectStart|Wheel|WebkitFullScreenChange|WebkitFullScreenError|TouchStart|TouchMove|TouchEnd|TouchCancel|PointerDown|PointerUp|PointerCancel|PointerMove|PointerOver|PointerOut|PointerEnter|PointerLeave)=(('([\s\S]*?)')|("([\s\S]*?)"))/g, function (eventStr, b, c) {
	            if (c.indexOf('Omi.instances[') === 1) {
	                return eventStr
	            } else if (c.lastIndexOf(')') === c.length - 2) {
	                return eventStr.replace(/=(['|"])/, '=$1Omi.instances[' + id + '].')
	            } else {
	                let str = eventStr.replace(/=(['|"])/, '=$1Omi.instances[' + id + '].')
	                return str.substr(0, str.length - 1) + "(event)" +  str.substr(str.length - 1, 1);
	            }
	        })
	    })
	};

	// morphdom.js
	var morphdom = (function() {
	    'use strict';

	    var range; // Create a range object for efficently rendering strings to elements.
	    var NS_XHTML = 'http://www.w3.org/1999/xhtml';

	    var doc = typeof document === 'undefined' ? undefined : document;

	    var testEl = doc ?
	    doc.body || doc.createElement('div') :
	    {};

	    // Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
	    // (IE7+ support) <=IE7 does not support el.hasAttribute(name)
	    var actualHasAttributeNS;

	    if (testEl.hasAttributeNS) {
	        actualHasAttributeNS = function(el, namespaceURI, name) {
	            return el.hasAttributeNS(namespaceURI, name);
	        };
	    } else if (testEl.hasAttribute) {
	        actualHasAttributeNS = function(el, namespaceURI, name) {
	            return el.hasAttribute(name);
	        };
	    } else {
	        actualHasAttributeNS = function(el, namespaceURI, name) {
	            return el.getAttributeNode(namespaceURI, name) != null;
	        };
	    }

	    var hasAttributeNS = actualHasAttributeNS;


	    function toElement(str) {
	        if (!range && doc.createRange) {
	            range = doc.createRange();
	            range.selectNode(doc.body);
	        }

	        var fragment;
	        if (range && range.createContextualFragment) {
	            fragment = range.createContextualFragment(str);
	        } else {
	            fragment = doc.createElement('body');
	            fragment.innerHTML = str;
	        }
	        return fragment.childNodes[0];
	    }

	    function toElements(str) {
	        if (!range && doc.createRange) {
	            range = doc.createRange();
	            range.selectNode(doc.body);
	        }

	        var fragment;
	        if (range && range.createContextualFragment) {
	            fragment = range.createContextualFragment(str);
	        } else {
	            fragment = doc.createElement('body');
	            fragment.innerHTML = str;
	        }

	        var arr = [], i = 0, len = fragment.childNodes.length;
	        for (; i < len; i++) {
	            var item = fragment.childNodes[i];
	            if(item.nodeType === 1){
	                arr.push(item);
	            }
	        }
	        return arr;
	    }

	    /**
	     * Returns true if two node's names are the same.
	     *
	     * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
	     *       nodeName and different namespace URIs.
	     *
	     * @param {Element} a
	     * @param {Element} b The target element
	     * @return {boolean}
	     */
	    function compareNodeNames(fromEl, toEl) {
	        var fromNodeName = fromEl.nodeName;
	        var toNodeName = toEl.nodeName;

	        if (fromNodeName === toNodeName) {
	            return true;
	        }

	        if (toEl.actualize &&
	            fromNodeName.charCodeAt(0) < 91 && /* from tag name is upper case */
	            toNodeName.charCodeAt(0) > 90 /* target tag name is lower case */) {
	            // If the target element is a virtual DOM node then we may need to normalize the tag name
	            // before comparing. Normal HTML elements that are in the "http://www.w3.org/1999/xhtml"
	            // are converted to upper case
	            return fromNodeName === toNodeName.toUpperCase();
	        } else {
	            return false;
	        }
	    }

	    /**
	     * Create an element, optionally with a known namespace URI.
	     *
	     * @param {string} name the element name, e.g. 'div' or 'svg'
	     * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
	     * its `xmlns` attribute or its inferred namespace.
	     *
	     * @return {Element}
	     */
	    function createElementNS(name, namespaceURI) {
	        return !namespaceURI || namespaceURI === NS_XHTML ?
	            doc.createElement(name) :
	            doc.createElementNS(namespaceURI, name);
	    }

	    /**
	     * Copies the children of one DOM element to another DOM element
	     */
	    function moveChildren(fromEl, toEl) {
	        var curChild = fromEl.firstChild;
	        while (curChild) {
	            var nextChild = curChild.nextSibling;
	            toEl.appendChild(curChild);
	            curChild = nextChild;
	        }
	        return toEl;
	    }

	    function morphAttrs(fromNode, toNode) {
	        var attrs = toNode.attributes;
	        var i;
	        var attr;
	        var attrName;
	        var attrNamespaceURI;
	        var attrValue;
	        var fromValue;

	        for (i = attrs.length - 1; i >= 0; --i) {
	            attr = attrs[i];
	            attrName = attr.name;
	            attrNamespaceURI = attr.namespaceURI;
	            attrValue = attr.value;

	            if (attrNamespaceURI) {
	                attrName = attr.localName || attrName;
	                fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

	                if (fromValue !== attrValue) {
	                    fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
	                }
	            } else {
	                fromValue = fromNode.getAttribute(attrName);

	                if (fromValue !== attrValue) {
	                    fromNode.setAttribute(attrName, attrValue);
	                }
	            }
	        }

	        // Remove any extra attributes found on the original DOM element that
	        // weren't found on the target element.
	        attrs = fromNode.attributes;

	        for (i = attrs.length - 1; i >= 0; --i) {
	            attr = attrs[i];
	            if (attr.specified !== false) {
	                attrName = attr.name;
	                attrNamespaceURI = attr.namespaceURI;

	                if (attrNamespaceURI) {
	                    attrName = attr.localName || attrName;

	                    if (!hasAttributeNS(toNode, attrNamespaceURI, attrName)) {
	                        fromNode.removeAttributeNS(attrNamespaceURI, attrName);
	                    }
	                } else {
	                    if (!hasAttributeNS(toNode, null, attrName)) {
	                        fromNode.removeAttribute(attrName);
	                    }
	                }
	            }
	        }
	    }

	    function syncBooleanAttrProp(fromEl, toEl, name) {
	        if (fromEl[name] !== toEl[name]) {
	            fromEl[name] = toEl[name];
	            if (fromEl[name]) {
	                fromEl.setAttribute(name, '');
	            } else {
	                fromEl.removeAttribute(name, '');
	            }
	        }
	    }

	    var specialElHandlers = {
	        /**
	         * Needed for IE. Apparently IE doesn't think that "selected" is an
	         * attribute when reading over the attributes using selectEl.attributes
	         */
	        OPTION: function(fromEl, toEl) {
	            syncBooleanAttrProp(fromEl, toEl, 'selected');
	        },
	        /**
	         * The "value" attribute is special for the <input> element since it sets
	         * the initial value. Changing the "value" attribute without changing the
	         * "value" property will have no effect since it is only used to the set the
	         * initial value.  Similar for the "checked" attribute, and "disabled".
	         */
	        INPUT: function(fromEl, toEl) {
	            syncBooleanAttrProp(fromEl, toEl, 'checked');
	            syncBooleanAttrProp(fromEl, toEl, 'disabled');

	            if (fromEl.value !== toEl.value) {
	                fromEl.value = toEl.value;
	            }

	            if (!hasAttributeNS(toEl, null, 'value')) {
	                fromEl.removeAttribute('value');
	            }
	        },

	        TEXTAREA: function(fromEl, toEl) {
	            var newValue = toEl.value;
	            if (fromEl.value !== newValue) {
	                fromEl.value = newValue;
	            }

	            if (fromEl.firstChild) {
	                // Needed for IE. Apparently IE sets the placeholder as the
	                // node value and vise versa. This ignores an empty update.
	                if (newValue === '' && fromEl.firstChild.nodeValue === fromEl.placeholder) {
	                    return;
	                }

	                fromEl.firstChild.nodeValue = newValue;
	            }
	        },
	        SELECT: function(fromEl, toEl) {
	            if (!hasAttributeNS(toEl, null, 'multiple')) {
	                var selectedIndex = -1;
	                var i = 0;
	                var curChild = toEl.firstChild;
	                while(curChild) {
	                    var nodeName = curChild.nodeName;
	                    if (nodeName && nodeName.toUpperCase() === 'OPTION') {
	                        if (hasAttributeNS(curChild, null, 'selected')) {
	                            selectedIndex = i;
	                            break;
	                        }
	                        i++;
	                    }
	                    curChild = curChild.nextSibling;
	                }

	                fromEl.selectedIndex = i;
	            }
	        }
	    };

	    var ELEMENT_NODE = 1;
	    var TEXT_NODE = 3;
	    var COMMENT_NODE = 8;

	    function noop() {}

	    function defaultGetNodeKey(node) {
	        return node.id;
	    }

	    function morphdomFactory(morphAttrs) {

	        return function morphdom(fromNode, toNode, options) {
	            if (!options) {
	                options = {};
	            }

	            if (typeof toNode === 'string') {
	                if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
	                    var toNodeHtml = toNode;
	                    toNode = doc.createElement('html');
	                    toNode.innerHTML = toNodeHtml;
	                } else {
	                    toNode = toElement(toNode);
	                }
	            }

	            var getNodeKey = options.getNodeKey || defaultGetNodeKey;
	            var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
	            var onNodeAdded = options.onNodeAdded || noop;
	            var onBeforeElUpdated = options.onBeforeElUpdated || noop;
	            var onElUpdated = options.onElUpdated || noop;
	            var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
	            var onNodeDiscarded = options.onNodeDiscarded || noop;
	            var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
	            var childrenOnly = options.childrenOnly === true;
	            var ignoreAttr = options.ignoreAttr;
	            // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
	            var fromNodesLookup = {};
	            var keyedRemovalList;

	            function addKeyedRemoval(key) {
	                if (keyedRemovalList) {
	                    keyedRemovalList.push(key);
	                } else {
	                    keyedRemovalList = [key];
	                }
	            }

	            function walkDiscardedChildNodes(node, skipKeyedNodes) {
	                if (node.nodeType === ELEMENT_NODE) {
	                    var curChild = node.firstChild;
	                    while (curChild) {

	                        var key = undefined;

	                        if (skipKeyedNodes && (key = getNodeKey(curChild))) {
	                            // If we are skipping keyed nodes then we add the key
	                            // to a list so that it can be handled at the very end.
	                            addKeyedRemoval(key);
	                        } else {
	                            // Only report the node as discarded if it is not keyed. We do this because
	                            // at the end we loop through all keyed elements that were unmatched
	                            // and then discard them in one final pass.
	                            onNodeDiscarded(curChild);
	                            if (curChild.firstChild) {
	                                walkDiscardedChildNodes(curChild, skipKeyedNodes);
	                            }
	                        }

	                        curChild = curChild.nextSibling;
	                    }
	                }
	            }

	            /**
	             * Removes a DOM node out of the original DOM
	             *
	             * @param  {Node} node The node to remove
	             * @param  {Node} parentNode The nodes parent
	             * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
	             * @return {undefined}
	             */
	            function removeNode(node, parentNode, skipKeyedNodes) {
	                if (onBeforeNodeDiscarded(node) === false) {
	                    return;
	                }

	                if (parentNode) {
	                    parentNode.removeChild(node);
	                }

	                onNodeDiscarded(node);
	                walkDiscardedChildNodes(node, skipKeyedNodes);
	            }

	            // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
	            // function indexTree(root) {
	            //     var treeWalker = document.createTreeWalker(
	            //         root,
	            //         NodeFilter.SHOW_ELEMENT);
	            //
	            //     var el;
	            //     while((el = treeWalker.nextNode())) {
	            //         var key = getNodeKey(el);
	            //         if (key) {
	            //             fromNodesLookup[key] = el;
	            //         }
	            //     }
	            // }

	            // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
	            //
	            // function indexTree(node) {
	            //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
	            //     var el;
	            //     while((el = nodeIterator.nextNode())) {
	            //         var key = getNodeKey(el);
	            //         if (key) {
	            //             fromNodesLookup[key] = el;
	            //         }
	            //     }
	            // }

	            function indexTree(node) {
	                if (node.nodeType === ELEMENT_NODE) {
	                    var curChild = node.firstChild;
	                    while (curChild) {
	                        var key = getNodeKey(curChild);
	                        if (key) {
	                            fromNodesLookup[key] = curChild;
	                        }

	                        // Walk recursively
	                        indexTree(curChild);

	                        curChild = curChild.nextSibling;
	                    }
	                }
	            }

	            indexTree(fromNode);

	            function handleNodeAdded(el) {
	                onNodeAdded(el);

	                var curChild = el.firstChild;
	                while (curChild) {
	                    var nextSibling = curChild.nextSibling;

	                    var key = getNodeKey(curChild);
	                    if (key) {
	                        var unmatchedFromEl = fromNodesLookup[key];
	                        if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
	                            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
	                            morphEl(unmatchedFromEl, curChild);
	                        }
	                    }

	                    handleNodeAdded(curChild);
	                    curChild = nextSibling;
	                }
	            }

	            function morphEl(fromEl, toEl, childrenOnly) {
	                if(ignoreAttr) {
	                    let ignoreF = false,
	                        ignoreT = false,
	                        attrF = null,
	                        attrT = null;
	                    for(let i = 0,len = ignoreAttr.length;i<len;i++) {
	                        let selector = ignoreAttr[i];
	                        if ((!ignoreF)&&fromEl.getAttribute(selector) !== null) {
	                            ignoreF = true
	                            attrF = selector
	                        }
	                        if ((!ignoreT)&&toEl.getAttribute(selector) !== null) {
	                            ignoreT = true
	                            attrT = selector
	                        }
	                        if(ignoreF&&ignoreT)break;
	                    }
	                    if(ignoreF&&ignoreT&&attrF===attrT){
	                        return
	                    }
	                }
	                var toElKey = getNodeKey(toEl);
	                var curFromNodeKey;

	                if (toElKey) {
	                    // If an element with an ID is being morphed then it is will be in the final
	                    // DOM so clear it out of the saved elements collection
	                    delete fromNodesLookup[toElKey];
	                }

	                if (toNode.isSameNode && toNode.isSameNode(fromNode)) {
	                    return;
	                }

	                if (!childrenOnly) {
	                    if (onBeforeElUpdated(fromEl, toEl) === false) {
	                        return;
	                    }

	                    morphAttrs(fromEl, toEl);
	                    onElUpdated(fromEl);

	                    if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
	                        return;
	                    }
	                }

	                if (fromEl.nodeName !== 'TEXTAREA') {
	                    var curToNodeChild = toEl.firstChild;
	                    var curFromNodeChild = fromEl.firstChild;
	                    var curToNodeKey;

	                    var fromNextSibling;
	                    var toNextSibling;
	                    var matchingFromEl;

	                    outer: while (curToNodeChild) {
	                        toNextSibling = curToNodeChild.nextSibling;
	                        curToNodeKey = getNodeKey(curToNodeChild);

	                        while (curFromNodeChild) {
	                            fromNextSibling = curFromNodeChild.nextSibling;

	                            if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
	                                curToNodeChild = toNextSibling;
	                                curFromNodeChild = fromNextSibling;
	                                continue outer;
	                            }

	                            curFromNodeKey = getNodeKey(curFromNodeChild);

	                            var curFromNodeType = curFromNodeChild.nodeType;

	                            var isCompatible = undefined;

	                            if (curFromNodeType === curToNodeChild.nodeType) {
	                                if (curFromNodeType === ELEMENT_NODE) {
	                                    // Both nodes being compared are Element nodes

	                                    if (curToNodeKey) {
	                                        // The target node has a key so we want to match it up with the correct element
	                                        // in the original DOM tree
	                                        if (curToNodeKey !== curFromNodeKey) {
	                                            // The current element in the original DOM tree does not have a matching key so
	                                            // let's check our lookup to see if there is a matching element in the original
	                                            // DOM tree
	                                            if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
	                                                if (curFromNodeChild.nextSibling === matchingFromEl) {
	                                                    // Special case for single element removals. To avoid removing the original
	                                                    // DOM node out of the tree (since that can break CSS transitions, etc.),
	                                                    // we will instead discard the current node and wait until the next
	                                                    // iteration to properly match up the keyed target element with its matching
	                                                    // element in the original tree
	                                                    isCompatible = false;
	                                                } else {
	                                                    // We found a matching keyed element somewhere in the original DOM tree.
	                                                    // Let's moving the original DOM node into the current position and morph
	                                                    // it.

	                                                    // NOTE: We use insertBefore instead of replaceChild because we want to go through
	                                                    // the `removeNode()` function for the node that is being discarded so that
	                                                    // all lifecycle hooks are correctly invoked
	                                                    fromEl.insertBefore(matchingFromEl, curFromNodeChild);

	                                                    fromNextSibling = curFromNodeChild.nextSibling;

	                                                    if (curFromNodeKey) {
	                                                        // Since the node is keyed it might be matched up later so we defer
	                                                        // the actual removal to later
	                                                        addKeyedRemoval(curFromNodeKey);
	                                                    } else {
	                                                        // NOTE: we skip nested keyed nodes from being removed since there is
	                                                        //       still a chance they will be matched up later
	                                                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
	                                                    }

	                                                    curFromNodeChild = matchingFromEl;
	                                                }
	                                            } else {
	                                                // The nodes are not compatible since the "to" node has a key and there
	                                                // is no matching keyed node in the source tree
	                                                isCompatible = false;
	                                            }
	                                        }
	                                    } else if (curFromNodeKey) {
	                                        // The original has a key
	                                        isCompatible = false;
	                                    }

	                                    isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
	                                    if (isCompatible) {
	                                        // We found compatible DOM elements so transform
	                                        // the current "from" node to match the current
	                                        // target DOM node.
	                                        morphEl(curFromNodeChild, curToNodeChild);
	                                    }

	                                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
	                                    // Both nodes being compared are Text or Comment nodes
	                                    isCompatible = true;
	                                    // Simply update nodeValue on the original node to
	                                    // change the text value
	                                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
	                                }
	                            }

	                            if (isCompatible) {
	                                // Advance both the "to" child and the "from" child since we found a match
	                                curToNodeChild = toNextSibling;
	                                curFromNodeChild = fromNextSibling;
	                                continue outer;
	                            }

	                            // No compatible match so remove the old node from the DOM and continue trying to find a
	                            // match in the original DOM. However, we only do this if the from node is not keyed
	                            // since it is possible that a keyed node might match up with a node somewhere else in the
	                            // target tree and we don't want to discard it just yet since it still might find a
	                            // home in the final DOM tree. After everything is done we will remove any keyed nodes
	                            // that didn't find a home
	                            if (curFromNodeKey) {
	                                // Since the node is keyed it might be matched up later so we defer
	                                // the actual removal to later
	                                addKeyedRemoval(curFromNodeKey);
	                            } else {
	                                // NOTE: we skip nested keyed nodes from being removed since there is
	                                //       still a chance they will be matched up later
	                                removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
	                            }

	                            curFromNodeChild = fromNextSibling;
	                        }

	                        // If we got this far then we did not find a candidate match for
	                        // our "to node" and we exhausted all of the children "from"
	                        // nodes. Therefore, we will just append the current "to" node
	                        // to the end
	                        if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
	                            fromEl.appendChild(matchingFromEl);
	                            morphEl(matchingFromEl, curToNodeChild);
	                        } else {
	                            var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
	                            if (onBeforeNodeAddedResult !== false) {
	                                if (onBeforeNodeAddedResult) {
	                                    curToNodeChild = onBeforeNodeAddedResult;
	                                }

	                                if (curToNodeChild.actualize) {
	                                    curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
	                                }
	                                fromEl.appendChild(curToNodeChild);
	                                handleNodeAdded(curToNodeChild);
	                            }
	                        }

	                        curToNodeChild = toNextSibling;
	                        curFromNodeChild = fromNextSibling;
	                    }

	                    // We have processed all of the "to nodes". If curFromNodeChild is
	                    // non-null then we still have some from nodes left over that need
	                    // to be removed
	                    while (curFromNodeChild) {
	                        fromNextSibling = curFromNodeChild.nextSibling;
	                        if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
	                            // Since the node is keyed it might be matched up later so we defer
	                            // the actual removal to later
	                            addKeyedRemoval(curFromNodeKey);
	                        } else {
	                            // NOTE: we skip nested keyed nodes from being removed since there is
	                            //       still a chance they will be matched up later
	                            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
	                        }
	                        curFromNodeChild = fromNextSibling;
	                    }
	                }

	                var specialElHandler = specialElHandlers[fromEl.nodeName];
	                if (specialElHandler) {
	                    specialElHandler(fromEl, toEl);
	                }
	            } // END: morphEl(...)

	            var morphedNode = fromNode;
	            var morphedNodeType = morphedNode.nodeType;
	            var toNodeType = toNode.nodeType;

	            if (!childrenOnly) {
	                // Handle the case where we are given two DOM nodes that are not
	                // compatible (e.g. <div> --> <span> or <div> --> TEXT)
	                if (morphedNodeType === ELEMENT_NODE) {
	                    if (toNodeType === ELEMENT_NODE) {
	                        if (!compareNodeNames(fromNode, toNode)) {
	                            onNodeDiscarded(fromNode);
	                            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
	                        }
	                    } else {
	                        // Going from an element node to a text node
	                        morphedNode = toNode;
	                    }
	                } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
	                    if (toNodeType === morphedNodeType) {
	                        morphedNode.nodeValue = toNode.nodeValue;
	                        return morphedNode;
	                    } else {
	                        // Text node to something else
	                        morphedNode = toNode;
	                    }
	                }
	            }

	            if (morphedNode === toNode) {
	                // The "to node" was not compatible with the "from node" so we had to
	                // toss out the "from node" and use the "to node"
	                onNodeDiscarded(fromNode);
	            } else {
	                morphEl(morphedNode, toNode, childrenOnly);

	                // We now need to loop over any keyed nodes that might need to be
	                // removed. We only do the removal if we know that the keyed node
	                // never found a match. When a keyed node is matched up we remove
	                // it out of fromNodesLookup and we use fromNodesLookup to determine
	                // if a keyed node has been matched up or not
	                if (keyedRemovalList) {
	                    for (var i=0, len=keyedRemovalList.length; i<len; i++) {
	                        var elToRemove = fromNodesLookup[keyedRemovalList[i]];
	                        if (elToRemove) {
	                            removeNode(elToRemove, elToRemove.parentNode, false);
	                        }
	                    }
	                }
	            }

	            if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
	                if (morphedNode.actualize) {
	                    morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
	                }
	                // If we had to swap out the from node with a new node because the old
	                // node was not compatible with the target node then we need to
	                // replace the old DOM node in the original DOM tree. This is only
	                // possible if the original DOM node was part of a DOM tree which
	                // we know is the case if it has a parent node.
	                fromNode.parentNode.replaceChild(morphedNode, fromNode);
	            }

	            return morphedNode;
	        };
	    }

	    var morphdom = morphdomFactory(morphAttrs);
	    morphdom.toElement = toElement;
	    morphdom.toElements = toElements;
	    return morphdom;
	})();

	// html2json.js
	var html2json = (function() {
		// Regular Expressions for parsing tags and attributes
		var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
		    endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
		    attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

		var HTMLParser = function (html, handler) {
		    var index, chars, match, stack = [], last = html;
		    stack.last = function () {
		        return this[this.length - 1];
		    };

		    while (html) {
		        chars = true;

		        // Make sure we're not in a script or style element
		        if (!stack.last() ) {

		            if (html.indexOf("</") == 0) {
		                match = html.match(endTag);

		                if (match) {
		                    html = html.substring(match[0].length);
		                    match[0].replace(endTag, parseEndTag);
		                    chars = false;
		                }

		                // start tag
		            } else if (html.indexOf("<") == 0) {
		                match = html.match(startTag);

		                if (match) {
		                    html = html.substring(match[0].length);
		                    match[0].replace(startTag, parseStartTag);
		                    chars = false;
		                }
		            }

		            if (chars) {
		                index = html.indexOf("<");

		                var text = index < 0 ? html : html.substring(0, index);
		                html = index < 0 ? "" : html.substring(index);

		                if (handler.chars)
		                    handler.chars(text);
		            }

		        } else {
		            html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function (all, text) {

		                if (handler.chars)
		                    handler.chars(text);

		                return "";
		            });

		            parseEndTag("", stack.last());
		        }

		        if (html == last)
		            throw "Parse Error: " + html;
		        last = html;
		    }

		    // Clean up any remaining tags
		    parseEndTag();

		    function parseStartTag(tag, tagName, rest, unary) {
		        //tagName = tagName.toLowerCase();

		        unary =  !!unary;

		        if (!unary)
		            stack.push(tagName);

		        if (handler.start) {
		            var attrs = [];

		            rest.replace(attr, function (match, name) {
		                var value = arguments[2] ? arguments[2] :
		                    arguments[3] ? arguments[3] :
		                        arguments[4] ? arguments[4] :"";

		                attrs.push({
		                    name: name,
		                    value: value,
		                    escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
		                });
		            });

		            if (handler.start)
		                handler.start(tagName, attrs, unary);
		        }
		    }

		    function parseEndTag(tag, tagName) {
		        // If no tag name is provided, clean shop
		        if (!tagName)
		            var pos = 0;

		        // Find the closest opened tag of the same type
		        else
		            for (var pos = stack.length - 1; pos >= 0; pos--)
		                if (stack[pos] == tagName)
		                    break;

		        if (pos >= 0) {
		            // Close all the open elements, up the stack
		            for (var i = stack.length - 1; i >= pos; i--)
		                if (handler.end)
		                    handler.end(stack[i]);

		            // Remove the open elements from the stack
		            stack.length = pos;
		        }
		    }
		};

		var DEBUG = false;
		var debug = DEBUG ? console.log.bind(console) : function(){};

		// Production steps of ECMA-262, Edition 5, 15.4.4.21
		// Reference: http://es5.github.io/#x15.4.4.21
		if (!Array.prototype.reduce) {
		    Array.prototype.reduce = function(callback /*, initialValue*/) {
		        'use strict';
		        if (this == null) {
		            throw new TypeError('Array.prototype.reduce called on null or undefined');
		        }
		        if (typeof callback !== 'function') {
		            throw new TypeError(callback + ' is not a function');
		        }
		        var t = Object(this), len = t.length >>> 0, k = 0, value;
		        if (arguments.length == 2) {
		            value = arguments[1];
		        } else {
		            while (k < len && !(k in t)) {
		                k++;
		            }
		            if (k >= len) {
		                throw new TypeError('Reduce of empty array with no initial value');
		            }
		            value = t[k++];
		        }
		        for (; k < len; k++) {
		            if (k in t) {
		                value = callback(value, t[k], k, t);
		            }
		        }
		        return value;
		    };
		}

		var html2json = function html2json(html) {

		    var bufArray = [];
		    var results = {
		        node: 'root',
		        child: [],
		    };
		    HTMLParser(html, {
		        start: function(tag, attrs, unary) {
		            debug(tag, attrs, unary);
		            // node for this element
		            var node = {
		                node: 'element',
		                tag: tag,
		            };
		            if (attrs.length !== 0) {
		                node.attr = attrs.reduce(function(pre, attr) {
		                    var name = attr.name;
		                    var value = attr.value;

		                    pre[name] = value;
		                    return pre;
		                }, {});
		            }
		            if (unary) {
		                // if this tag dosen't have end tag
		                // like <img src="hoge.png"/>
		                // add to parents
		                var parent = bufArray[0] || results;
		                if (parent.child === undefined) {
		                    parent.child = [];
		                }
		                parent.child.push(node);
		            } else {
		                bufArray.unshift(node);
		            }
		        },
		        end: function(tag) {
		            debug(tag);
		            // merge into parent tag
		            var node = bufArray.shift();
		            if (node.tag !== tag) console.error('invalid state: mismatch end tag');

		            if (bufArray.length === 0) {
		                results.child.push(node);
		            } else {
		                var parent = bufArray[0];
		                if (parent.child === undefined) {
		                    parent.child = [];
		                }
		                parent.child.push(node);
		            }
		        },
		        chars: function(text) {
		            debug(text);
		            var node = {
		                node: 'text',
		                text: text,
		            };
		            if (bufArray.length === 0) {
		                results.child.push(node);
		            } else {
		                var parent = bufArray[0];
		                if (parent.child === undefined) {
		                    parent.child = [];
		                }
		                parent.child.push(node);
		            }
		        }
		    });
		    return results;
		};

		return html2json;
	})();

	// Component.js
	class Component {
	    constructor(data, option) {
	        const componentOption = Object.assign({
	            server: false,
	            ignoreStoreData: false,
	            preventSelfUpdate: false,
	            selfDataFirst: false,
	            domDiffDisabled: false,
	            scopedSelfCSS: false
	        },option)
	        this._omi_scopedSelfCSS = componentOption.scopedSelfCSS
	        this._omi_preventSelfUpdate = componentOption.preventSelfUpdate
	        this._omi_domDiffDisabled = componentOption.domDiffDisabled
	        this._omi_ignoreStoreData = componentOption.ignoreStoreData
	        //re render the server-side rendering html on the client-side
	        const type = Object.prototype.toString.call(data)
	        const isReRendering = type !== '[object Object]' && type !== '[object Undefined]'
	        if (isReRendering) {
	            this.renderTo = typeof data === "string" ? document.querySelector(data) : data
	            this._hidden = this.renderTo.querySelector('.omi_scoped__hidden_data')
	            this.id = this._hidden.dataset.omiId
	            this.data = JSON.parse(this._hidden.value)
	        } else {
	            this.data = data || {}
	            this._omi_server_rendering = componentOption.server
	            this.id = this._omi_server_rendering ? (1000000 + Omi.getInstanceId()) : Omi.getInstanceId()
	        }
	        this.refs = {}
	        this.children = []
	        this.childrenData = []
	        this.HTML = null

	        Omi.instances[this.id] = this
	        this.selfDataFirst = componentOption.selfDataFirst

	        this._omi_scoped_attr =  Omi.STYLESCOPEDPREFIX + this.id
	        //this.BODY_ELEMENT = document.createElement('body')
	        this._preCSS = null
	        this._omiGroupDataCounter = {}
	        this._omi_installedHandlers = null
	        if (this._omi_server_rendering || isReRendering) {
	            this.install()
	            this._render(true)
	            this._childrenInstalled(this)
	            this.installed()
	            this._execInstalledHandlers()
	        }
	    }

	    install() {
	    }

	    installed() {
	    }

	    onInstalled(handler){
	        if(!this._omi_installedHandlers){
	            this._omi_installedHandlers = []
	        }
	        this._omi_installedHandlers.push(handler)
	    }

	    _execInstalledHandlers(){
	        this._omi_installedHandlers && this._omi_installedHandlers.forEach((handler)=>{
	            handler()
	        })
	    }

	    uninstall(){

	    }

	    afterUpdate(){

	    }

	    beforeUpdate(){

	    }

	    render() {

	    }

	    style() {

	    }

	    beforeRender(){

	    }

	    useStore(store) {
	        this.$$store = store
	        let isInclude = false
	        store.instances.forEach(instance=> {
	            if (instance.id === this.id) {
	                isInclude = true
	            }
	        })
	        if (!isInclude) {
	            store.instances.push(this)
	        }
	    }

	    updateSelf(){
	        this.beforeUpdate()
	        if (this.renderTo) {
	            this._render(false, true)
	        } else {
	            if(this._omi_preventSelfUpdate) return;
	            // update child node
	            if(this._omi_removed ) {
	                let hdNode  = this._createHiddenNode()
	                this.node.parentNode.replaceChild(hdNode,this.node)
	                this.node = hdNode
	            }else{
	                morphdom(this.node, scopedEvent(this._childRender(this._omiChildStr, true), this.id), {
	                    ignoreAttr:this._getIgnoreAttr()
	                })

	                this.node = document.querySelector("[" + this._omi_scoped_attr + "]")
	                this._queryElements(this)
	                this._fixForm()
	            }
	        }
	        this.afterUpdate()
	    }

	    update() {
	        this.beforeUpdate()
	        this._childrenBeforeUpdate(this)
	        if (this.renderTo) {
	            this._render()
	        } else {
	            if(this._omi_preventSelfUpdate) return;
	            // update child node
	            if(this._omi_removed ) {
	                let hdNode  = this._createHiddenNode()
	                this.node.parentNode.replaceChild(hdNode,this.node)
	                this.node = hdNode
	            }else{
	                if(this._omi_domDiffDisabled){
	                    this.node.parentNode.replaceChild(morphdom.toElement(scopedEvent(this._childRender(this._omiChildStr), this.id)),this.node)
	                }else {
	                    morphdom(this.node, scopedEvent(this._childRender(this._omiChildStr), this.id))
	                }
	                this.node = document.querySelector("[" + this._omi_scoped_attr + "]")
	                this._queryElements(this)
	                this._fixForm()
	            }
	        }

	        this._childrenAfterUpdate(this)
	        this.afterUpdate()
	    }

	    _childrenBeforeUpdate(root){
	        root.children.forEach((child)=>{
	            child.beforeUpdate()
	            this._childrenBeforeUpdate(child)
	        })
	    }

	    _childrenAfterUpdate(root){
	        root.children.forEach((child)=>{
	            this._childrenAfterUpdate(child)
	            child.afterUpdate()
	        })
	    }

	    setData(data, update) {
	        this.data = data
	        if (update) {
	            this.update()
	        }
	    }

	    removeChild(indexOrChild){
	        let child = indexOrChild
	        if(typeof indexOrChild === 'number'){
	            child = this.children[indexOrChild]
	        }

	        child.remove()
	    }

	    restoreChild(indexOrChild){
	        let child = indexOrChild
	        if(typeof indexOrChild === 'number'){
	            child = this.children[indexOrChild]
	        }

	        child.restore()
	    }

	    remove (){
	        this._omi_removed  = true
	        this.update()
	        this.uninstall()
	    }

	    restore(){
	        this._omi_removed  = false
	        this.update()
	        this.installed()
	        this._execInstalledHandlers()
	    }

	    _render(isFirst, isSelf) {
	        if(this._omi_removed ){
	            let node = this._createHiddenNode()
	            if(!isFirst){
	                this.node.parentNode.replaceChild(node, this.node)
	                this.node = node
	            }else if(this.renderTo){
	                this.renderTo.appendChild(node)
	            }
	            return
	        }
	        if(this._omi_autoStoreToData){
	            if(!this._omi_ignoreStoreData) {
	                this.data = this.$store.data
	            }
	        }
	        this.beforeRender()
	        this._generateHTMLCSS()
	        if(!isSelf) {
	            this._extractChildren(this)
	        }else {
	            this._extractChildrenString(this)
	        }

	        this.children.forEach(item => {
	            this.HTML = this.HTML.replace(item._omiChildStr, isSelf ? item.node.outerHTML : item.HTML)
	        })

	        this.HTML =  scopedEvent(this.HTML, this.id)
	        if (isFirst) {
	            if (this.renderTo) {
	                if (this._omi_increment) {
	                    this.renderTo.insertAdjacentHTML('beforeend', this.HTML)
	                } else {
	                    this.renderTo.innerHTML = this.HTML
	                }
	            }
	        } else {
	            if (this.HTML !== "") {
	                if(this._omi_domDiffDisabled){
	                    this.renderTo.innerHTML = this.HTML
	                }else {
	                    morphdom(this.node, this.HTML, isSelf ? {
	                        ignoreAttr: this._getIgnoreAttr()
	                    } : null)
	                }
	            } else {
	                morphdom(this.node, this._createHiddenNode())
	            }
	        }
	        //get node prop from parent node
	        if (this.renderTo) {
	            this.node = document.querySelector("[" + this._omi_scoped_attr + "]")
	            this._queryElements(this)
	            this._fixForm()
	        }
	    }

	    _getIgnoreAttr(){
	        var arr = []
	        this.children.forEach( child => {
	            arr.push(child._omi_scoped_attr)
	        })
	        return arr
	    }

	    _childRender(childStr,isSelf) {
	        if (this._omi_removed) {
	            this.HTML = '<input type="hidden" omi_scoped_' + this.id + ' >'
	            return this.HTML
	        }
	        //childStr = childStr.replace("<child", "<div").replace("/>", "></div>")
	        this._mergeData(childStr)
	        if (this.parent._omi_autoStoreToData) {
	            this._omi_autoStoreToData = true
	            if (!this._omi_ignoreStoreData) {
	                this.data = this.$store.data
	            }
	        }
	        this.beforeRender()
	        this._fixSlot(this._generateHTMLCSS())
	        if (!isSelf) {
	            this._extractChildren(this)
	        } else {
	            this._extractChildrenString(this)
	        }

	        this.children.forEach(item => {
	            this.HTML = this.HTML.replace(item._omiChildStr, isSelf ? item.node.outerHTML : item.HTML)
	        })
	        this.HTML = scopedEvent(this.HTML, this.id)
	        return this.HTML
	    }

	    _fixSlot(shareAttr) {
	        if(!this._omi_slotContent) return
	        this._omi_slotContent = this._scopedAttr(this._omi_slotContent, this._omi_scoped_attr, shareAttr)
	        let nodes = morphdom.toElements(this._omi_slotContent)
	        let slotMatch = this.HTML.match(/<slot[\s\S]*?<\/slot>/g)
	        if(nodes.length === 1 && slotMatch && slotMatch.length===1) {
	            this.HTML = this.HTML.replace(/<slot[\s\S]*?<\/slot>/, this._omi_slotContent)
	        }else{
	            nodes.sort(function(a,b){
	                return  parseInt(a.getAttribute('slot-index'))- parseInt(b.getAttribute('slot-index'))
	            })
	            nodes.forEach((node)=> {
	                this.HTML = this.HTML.replace(/<slot[\s\S]*?<\/slot>/, node.outerHTML)
	            })
	        }
	    }

	    _queryElements(current) {
	        current._mixRefs()
	        current._execPlugins()
	        current.children.forEach((item)=>{
	            item.node = current.node.querySelector("[" + Omi.STYLESCOPEDPREFIX + item.id + "]")
	            //recursion get node prop from parent node
	            item.node && current._queryElements(item)
	        })
	    }

	    _mixRefs() {
	        let nodes = Omi.$$('*[ref]',this.node)
	        nodes.forEach(node => {
	            if(node.hasAttribute(this._omi_scoped_attr) ) {
	                this.refs[node.getAttribute('ref')] = node
	            }
	        })
	        let attr = this.node.getAttribute('ref')
	        if(attr) {
	            this.refs[attr] = this.node
	        }
	    }

	    _execPlugins(){
	        Object.keys(Omi.plugins).forEach(item => {
	            let nodes = Omi.$$('*['+item+']',this.node)
	            nodes.forEach(node => {
	                if(node.hasAttribute(this._omi_scoped_attr) ) {
	                    Omi.plugins[item](node,this)
	                }
	            })
	            if(this.node.hasAttribute(item)) {
	                Omi.plugins[item](this.node, this)
	            }
	        })
	    }

	    _childrenInstalled(root){
	        root.children.forEach((child)=>{
	            this._childrenInstalled(child)
	            child.installed()
	            child._execInstalledHandlers()
	        })
	    }

	    _fixForm (){

	        Omi.$$('input',this.node).forEach(element =>{
	            let type = element.type.toLowerCase()
	            if (element.getAttribute('value') === '') {
	                element.value = ''
	            }
	            if (type === 'checked' || type === 'radio') {
	                if (element.hasAttribute('checked')) {
	                    element.checked = 'checked'
	                } else {
	                    element.checked = false
	                }
	            }
	        })

	        Omi.$$('textarea',this.node).forEach(textarea =>{
	            textarea.value = textarea.getAttribute('value')
	        })

	        Omi.$$('select',this.node).forEach(select =>{
	            let value = select.getAttribute('value')
	            if (value) {
	                Omi.$$('option',select).forEach(option =>{
	                    if(value === option.getAttribute('value')) {
	                        option.setAttribute('selected', 'selected')
	                    }
	                })
	            }else {
	                let firstOption = Omi.$$('option', select)[0]
	                firstOption && firstOption.setAttribute('selected', 'selected')
	            }
	        })
	    }

	    _replaceTags(array, html, updateSelf) {
	        if (Omi.customTags.length === 0) return
	        const str = array.join("|")
	        const reg = new RegExp('<(' + str + '+)((?:\\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\\s*=\\s*(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>\\s]+))?)*)\\s*((\\/>)|>(([\\s\\S]*?)<\\/\\1>))', 'g');
	        let index = 0
	        return html.replace(reg, (m,a,b,c,d,e,f) => {
	            if(updateSelf) {
	                let cmi = this.children[index]
	                if (cmi && cmi.___omi_constructor_name === a) {
	                    cmi._omiChildStr = m
	                }
	            }else{
	                this._initComponentByString(a, m, f, index++, this)
	            }
	        })
	    }

	    _createHiddenNode(){
	        let hdNode = document.createElement("input")
	        hdNode.setAttribute("type","hidden")
	        hdNode.setAttribute( this._omi_scoped_attr, '')
	        return hdNode
	    }

	    _mergeData(childStr) {
	        if(this.selfDataFirst){
	            this.data = Object.assign({},this._getDataset(childStr),this.data)
	        }else{
	            this.data = Object.assign({},this.data, this._getDataset(childStr))
	        }
	    }

	    _generateHTMLCSS() {
	        this.CSS = (this.style()|| '').replace(/<\/?style>/g,'')
	        let shareAttr = this.___omi_constructor_name?(Omi.STYLESCOPEDPREFIX + this.___omi_constructor_name.toLowerCase()):this._omi_scoped_attr
	        if (this.CSS) {
	            if(this._omi_scopedSelfCSS||!Omi.style[shareAttr]) {
	                this.CSS = style.scoper(this.CSS, this._omi_scopedSelfCSS ? "[" + this._omi_scoped_attr + "]" : "[" + shareAttr + "]")
	                Omi.style[shareAttr] = this.CSS
	                if (this.CSS !== this._preCSS && !this._omi_server_rendering) {
	                    style.addStyle(this.CSS, this.id)
	                    this._preCSS = this.CSS
	                }
	            }
	        }
	        let tpl = this.render()
	        this.HTML = this._scopedAttr(Omi.template(tpl ? tpl : "", this.data), this._omi_scoped_attr, shareAttr).trim()
	        if (this._omi_server_rendering) {
	            this.HTML = '\r\n<style id="'+Omi.STYLEPREFIX+this.id+'">\r\n' + this.CSS + '\r\n</style>\r\n'+this.HTML
	            this.HTML += '\r\n<input type="hidden" data-omi-id="' + this.id + '" class="' + Omi.STYLESCOPEDPREFIX + '_hidden_data" value=\'' + JSON.stringify(this.data) + '\'  />\r\n'
	        }

	        return shareAttr
	    }

	    _scopedAttr(html, id, shareAtrr) {
	        return html.replace(/<[^/]([A-Za-z]*)[^>]*>/g,  (m) => {
	            let str = m.split(" ")[0].replace(">", "")
	            if(this._omi_scopedSelfCSS||!this.___omi_constructor_name){
	                return m.replace(str, str + " " + id)
	            }else{
	                return m.replace(str, str + " " + id+" "+ shareAtrr)
	            }
	        })
	    }

	    _getDataset(childStr) {
	        let json = html2json(childStr)
	        let attr = json.child[0].attr
	        let baseData = { }
	        Object.keys(attr).forEach(key => {
	            const value = attr[key]
	            if (key.indexOf('on') === 0) {
	                let handler = this.parent[value]
	                if (handler) {
	                    baseData[key] = handler.bind(this.parent)
	                }
	            }else if(key.indexOf('data-') === 0){
	                this._dataset[this._capitalize(key.replace('data-', ''))] = value
	            }else if(key.indexOf(':data-') === 0) {
	                this._dataset[this._capitalize(key.replace(':data-', ''))] = eval('(' + value + ')')
	            }else if(key === ':data'){
	                this._dataset = eval('(' + value + ')')
	            }else if(key === 'data'){
	                this._dataset =  this._extractPropertyFromString(value,this.parent)
	            }else if (key === 'group-data') {
	                this._dataset = this._extractPropertyFromString(value,this.parent)[this._omi_groupDataIndex]
	            }
	        })

	        return Object.assign(baseData,this._dataset)
	    }

	    _capitalize (str){
	        str = str.toLowerCase()
	        str = str.replace(/\b\w+\b/g, function (word) {
	            return word.substring(0, 1).toUpperCase() + word.substring(1)
	        }).replace(/-/g,'')
	        return str.substring(0, 1).toLowerCase() + str.substring(1)
	    }

	    _extractPropertyFromString(str, instance){
	        let arr = str.replace(/['|"|\]]/g,'' ).replace(/\[/g,'.').split('.')
	        let current = instance
	        arr.forEach(prop => {
	            current = current[prop]
	        })
	        arr = null
	        return current

	    }

	    _extractChildrenString(child){
	        this._replaceTags(Omi.customTags, child.HTML,true)

	    }

	    _extractChildren(child){
	        this._replaceTags(Omi.customTags, child.HTML)
	    }

	    _initComponentByString(name, childStr, slotContent, i, child){
	        let json = html2json(childStr)
	        let attr = json.child[0].attr
	        let cmi = this.children[i]
	        //if not first time to invoke _extractChildren method
	        if (cmi && cmi.___omi_constructor_name === name) {
	            cmi._omiChildStr = childStr
	            cmi._omi_slotContent = slotContent
	            Object.keys(attr).forEach(key => {
	                const value = attr[key]
	                if (key === 'group-data') {
	                    if (child._omiGroupDataCounter.hasOwnProperty(value)) {
	                        child._omiGroupDataCounter[value]++
	                    } else {
	                        child._omiGroupDataCounter[value] = 0
	                    }
	                    cmi._omi_groupDataIndex = child._omiGroupDataCounter[value]
	                }
	            })

	            cmi._childRender(childStr)
	        } else {
	            let baseData = {}
	            let dataset = {}

	            let groupDataIndex = null
	            let omiID = null
	            let instanceName = null
	            let _omi_option = {}

	            Object.keys(attr).forEach(key => {
	                const value = attr[key]
	                if (key.indexOf('on') === 0) {
	                    let handler = child[value]
	                    if (handler) {
	                        baseData[key] = handler.bind(child)
	                    }
	                } else if (key === 'omi-id'){
	                    omiID = value
	                }else if (key === 'name'){
	                    instanceName = value
	                }else if (key === 'group-data') {
	                    if (child._omiGroupDataCounter.hasOwnProperty(value)) {
	                        child._omiGroupDataCounter[value]++
	                    } else {
	                        child._omiGroupDataCounter[value] = 0
	                    }
	                    groupDataIndex = child._omiGroupDataCounter[value]
	                    dataset = this._extractPropertyFromString(value,child)[groupDataIndex]

	                } else if(key.indexOf('data-') === 0){
	                    dataset[this._capitalize(key.replace('data-', ''))] = value
	                }else if(key.indexOf(':data-') === 0) {
	                    dataset[this._capitalize(key.replace(':data-', ''))] = eval('(' + value + ')')
	                }else if(key === ':data'){
	                    dataset = eval('(' + value + ')')
	                }else if(key === 'data'){
	                    dataset =  this._extractPropertyFromString(value,child)
	                }else if(key === 'preventSelfUpdate'|| key === 'psu'){
	                    _omi_option.preventSelfUpdate = true
	                }else if(key === 'selfDataFirst'|| key === 'sdf'){
	                    _omi_option.selfDataFirst = true
	                }else if(key === 'domDiffDisabled'|| key === 'ddd'){
	                    _omi_option.domDiffDisabled = true
	                }else if(key === 'ignoreStoreData'|| key === 'isd'){
	                    _omi_option.ignoreStoreData = true
	                }else if(key === 'scopedSelfCSS'|| key === 'ssc'){
	                    _omi_option.scopedSelfCSS = true
	                }
	            })

	            let ChildClass = Omi.getClassFromString(name)
	            if (!ChildClass) throw "Can't find Class called [" + name+"]"
	            let sub_child = new ChildClass( Object.assign(baseData,child.childrenData[i],dataset ),_omi_option)
	            sub_child._omi_groupDataIndex = groupDataIndex
	            sub_child._omiChildStr = childStr
	            sub_child._omi_slotContent = slotContent
	            sub_child.parent = child
	            sub_child.$store = child.$store
	            sub_child.___omi_constructor_name = name
	            sub_child._dataset = {}
	            sub_child.install()

	            omiID && (Omi.mapping[omiID] = sub_child)
	            instanceName && (child[instanceName] = sub_child)

	            if (!cmi) {
	                child.children.push(sub_child)
	            } else {
	                child.children[i] = sub_child
	            }

	            sub_child._childRender(childStr)
	        }
	    }
	}

	// Store.js
	class Store {
	    constructor(isReady) {
	        this.readyHandlers = []
	        this.isReady = isReady
	        this.instances = []
	        this.updateSelfInstances = []
	    }

	    ready(readyHandler) {
	        if (this.isReady) {
	            readyHandler()
	            return
	        }
	        this.readyHandlers.push(readyHandler)
	    }

	    addSelfView(view) {
	        let added = false

	        for (let i = 0, len = this.updateSelfInstances.length; i < len; i++) {
	            if (this.updateSelfInstances[i].id === view.id) {
	                added = true
	                break
	            }
	        }
	        if (!added) {
	            this.updateSelfInstances.push(view)
	        }
	    }

	    addView(view) {
	        let added = false

	        for (let i = 0, len = this.instances.length; i < len; i++) {
	            if (this.instances[i].id === view.id) {
	                added = true
	                break
	            }
	        }
	        if (!added) {
	            this.instances.push(view)
	        }

	    }

	    beReady() {
	        this.isReady = true
	        this.readyHandlers.forEach((handler)=>handler())
	    }

	    update() {
	        this._mergeInstances()
	        this._mergeSelfInstances()
	        this.instances.forEach(instance => instance.update())
	        this.updateSelfInstances.forEach(instance => instance.updateSelf())
	    }

	    _mergeSelfInstances() {

	        let arr = []
	        this.updateSelfInstances.forEach(instance=> {
	            if(!this._checkSelfUpdateInstance(instance)){
	                arr.push(instance)
	            }
	        })
	        this.updateSelfInstances = arr
	    }

	    _mergeInstances(){
	        let arr = []
	        this.idArr = []
	        this.instances.forEach(instance=>{
	            this.idArr.push(instance.id)
	        })

	        this.instances.forEach(instance=>{
	            if(!instance.parent){
	                arr.push(instance)
	            }else{
	                if(!this._isSubInstance(instance)){
	                    arr.push(instance)
	                }
	            }

	        })

	        this.instances = arr;
	    }

	    _checkSelfUpdateInstance(instance){
	        if (this.idArr.indexOf(instance.id) !== -1) {
	            return true;
	        } else if(instance.parent){
	            return this._checkSelfUpdateInstance(instance.parent)
	        }
	    }

	    _isSubInstance(instance) {
	        if (this.idArr.indexOf(instance.parent.id) !== -1) {
	            return true;
	        } else if(instance.parent.parent){
	            return this._isSubInstance(instance.parent)
	        }
	    }
	}

	Omi.template = Mustache.render;

	Omi.Store = Store;
	Omi.Component = Component;


	// 插件篇

	// Finger.js
	;(function () {
	    // 一些要使用的内部工具函数

	    // 2点之间的距离 (主要用来算pinch的比例的, 两点之间的距离比值求pinch的scale)
	    function getLen(v) {
	        return Math.sqrt(v.x * v.x + v.y * v.y);
	    };

	    // dot和getAngle函数用来算两次手势状态之间的夹角, cross函数用来算方向的, getRotateAngle函数算手势真正的角度的
	    function dot(v1, v2) {
	        return v1.x * v2.x + v1.y * v2.y;
	    };

	    // 求两次手势状态之间的夹角
	    function getAngle(v1, v2) {
	        var mr = getLen(v1) * getLen(v2);
	        if (mr === 0) return 0;
	        var r = dot(v1, v2) / mr;
	        if (r > 1) r = 1;
	        return Math.acos(r);
	    };

	    // 利用cross结果的正负来判断旋转的方向(大于0为逆时针, 小于0为顺时针)
	    function cross(v1, v2) {
	        return v1.x * v2.y - v2.x * v1.y;
	    };

	    // 如果cross大于0那就是逆时针对于屏幕是正角,对于第一象限是负角,所以 角度 * -1, 然后角度单位换算
	    function getRotateAngle(v1, v2) {
	        var angle = getAngle(v1, v2);
	        if (cross(v1, v2) > 0) {
	            angle *= -1;
	        };
	        return angle * 180 / Math.PI;
	    };

	    // HandlerAdmin构造函数
	    var HandlerAdmin = function(el) {
	        this.handlers = [];    // 手势函数集合
	        this.el = el;    // dom元素
	    };

	    // HandlerAdmin原型方法

	    // 把fn添加到实例的 handlers数组中
	    HandlerAdmin.prototype.add = function(handler) {
	        this.handlers.push(handler); 
	    };

	    // 删除 handlers数组中的函数
	    HandlerAdmin.prototype.del = function(handler) {
	        if(!handler) this.handlers = [];    // handler为假值,handlers则赋值为[](参数不传undefined,其实不管this.handlers有没有成员函数,都得置空)

	        for(var i = this.handlers.length; i >= 0; i--) {
	            if(this.handlers[i] === handler) {    // 如果函数一样
	                this.handlers.splice(i, 1);    // 从handler中移除该函数(改变了原数组)
	            };
	        };
	    };

	    // 执行用户的回调函数
	    HandlerAdmin.prototype.dispatch = function() {
	        for(var i=0, len=this.handlers.length; i<len; i++) {
	            var handler = this.handlers[i];    
	            if(typeof handler === 'function') handler.apply(this.el, arguments);    // 执行回调this为dom元素, 把触发的事件对象作为参数传过去了
	        };
	    };

	    function wrapFunc(el, handler) {
	        var handlerAdmin = new HandlerAdmin(el);    // 实例化一个对象
	        handlerAdmin.add(handler);

	        return handlerAdmin;
	    };

	    // AlloyFinger构造函数
	    var AlloyFinger = function (el, option) {    // el: dom元素/id, option: 各种手势的集合对象

	        this.element = typeof el == 'string' ? document.querySelector(el) : el;    // 获取dom元素

	        // 绑定原型上start, move, end, cancel函数的this对象为 AlloyFinger实例
	        this.start = this.start.bind(this);
	        this.move = this.move.bind(this);
	        this.end = this.end.bind(this);
	        this.cancel = this.cancel.bind(this);

	        // 给dom元素 绑定原生的 touchstart, touchmove, touchend, touchcancel事件, 默认冒泡
	        this.element.addEventListener("touchstart", this.start, false);
	        this.element.addEventListener("touchmove", this.move, false);
	        this.element.addEventListener("touchend", this.end, false);
	        this.element.addEventListener("touchcancel", this.cancel, false);

	        this.preV = { x: null, y: null };    // 开始前的坐标
	        this.pinchStartLen = null;    // start()方法开始时捏的长度
	        this.scale = 1;    // 初始缩放比例为1
	        this.isDoubleTap = false;    // 是否双击, 默认为false

	        var noop = function () { };    // 空函数(把用户没有绑定手势函数默认赋值此函数)

	        // 提供了14种手势函数. 根据option对象, 分别创建一个 HandlerAdmin实例 赋值给相应的this属性
	        this.rotate = wrapFunc(this.element, option.rotate || noop);
	        this.touchStart = wrapFunc(this.element, option.touchStart || noop);
	        this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
	        this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
	        this.pinch = wrapFunc(this.element, option.pinch || noop);
	        this.swipe = wrapFunc(this.element, option.swipe || noop);
	        this.tap = wrapFunc(this.element, option.tap || noop);
	        this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
	        this.longTap = wrapFunc(this.element, option.longTap || noop);
	        this.singleTap = wrapFunc(this.element, option.singleTap || noop);
	        this.pressMove = wrapFunc(this.element, option.pressMove || noop);
	        this.touchMove = wrapFunc(this.element, option.touchMove || noop);
	        this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
	        this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);

	        this.delta = null;    // 差值 变量增量
	        this.last = null;    // 最后数值
	        this.now = null;    // 开始时的时间戳
	        this.tapTimeout = null;    // tap超时
	        this.singleTapTimeout = null;    // singleTap超时
	        this.longTapTimeout = null;    // longTap超时(定时器的返回值)
	        this.swipeTimeout = null;    // swipe超时
	        this.x1 = this.x2 = this.y1 = this.y2 = null;    // start()时的坐标x1, y1, move()时的坐标x2, y2 (相对于页面的坐标)
	        this.preTapPosition = { x: null, y: null };    // 用来保存start()方法时的手指坐标
	    };

	    // AlloyFinger原型对象
	    AlloyFinger.prototype = {

	        start: function (evt) {
	            if (!evt.touches) return;    // 如果没有TouchList对象, 直接return掉 (touches: 位于屏幕上的所有手指的列表)

	            this.now = Date.now();    // 开始时间戳
	            this.x1 = evt.touches[0].pageX;    // 相对于页面的 x1, y1 坐标
	            this.y1 = evt.touches[0].pageY;
	            this.delta = this.now - (this.last || this.now);    // 时间戳差值

	            this.touchStart.dispatch(evt);    // 调用HandlerAdmin实例this.touchStart上的dispatch方法(用户的touchStart回调就在此调用的)

	            if (this.preTapPosition.x !== null) {    // 开始前tap的x坐标不为空的话(一次没点的时候必然是null了)
	                this.isDoubleTap = (this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30);
	            };
	            this.preTapPosition.x = this.x1;    // 把相对于页面的 x1, y1 坐标赋值给 this.preTapPosition
	            this.preTapPosition.y = this.y1;
	            this.last = this.now;    // 把开始时间戳赋给 this.last
	            var preV = this.preV,    // 把开始前的坐标赋给 preV变量
	                len = evt.touches.length;    // len: 手指的个数

	            if (len > 1) {    // 一根手指以上
	                this._cancelLongTap();    // 取消长按定时器
	                this._cancelSingleTap();    // 取消SingleTap定时器

	                var v = {    // 2个手指坐标的差值
	                    x: evt.touches[1].pageX - this.x1, 
	                    y: evt.touches[1].pageY - this.y1 
	                };
	                preV.x = v.x;    // 差值赋值给PreV对象
	                preV.y = v.y;

	                this.pinchStartLen = getLen(preV);    // start()方法中2点之间的距离
	                this.multipointStart.dispatch(evt);    // (用户的multipointStart回调就在此调用的)
	            };

	            this.longTapTimeout = setTimeout(function () {
	                this.longTap.dispatch(evt);    // (用户的longTap回调就在此调用的)
	            }.bind(this), 750);
	        },

	        move: function (evt) {
	            if (!evt.touches) return;    // 如果没有TouchList对象, 直接return掉 (touches: 位于屏幕上的所有手指的列表)

	            var preV = this.preV,    // 把start方法保存的2根手指坐标的差值xy赋给preV变量
	                len = evt.touches.length,    // 手指个数
	                currentX = evt.touches[0].pageX,    // 第一根手指的坐标(相对于页面的 x1, y1 坐标)
	                currentY = evt.touches[0].pageY;
	            this.isDoubleTap = false;    // 移动过程中不能双击了

	            if (len > 1) {    // 2根手指以上(处理捏pinch和旋转rotate手势)

	                var v = {    // 第二根手指和第一根手指坐标的差值
	                    x: evt.touches[1].pageX - currentX, 
	                    y: evt.touches[1].pageY - currentY 
	                };

	                if (preV.x !== null) {    // start方法中保存的this.preV的x不为空的话

	                    if (this.pinchStartLen > 0) {    // 2点间的距离大于0
	                        evt.scale = getLen(v) / this.pinchStartLen;    // move中的2点之间的距离除以start中的2点的距离就是缩放比值
	                        this.pinch.dispatch(evt);    // scale挂在到evt对象上 (用户的pinch回调就在此调用的)
	                    };

	                    evt.angle = getRotateAngle(v, preV);    // 计算angle角度
	                    this.rotate.dispatch(evt);    // (用户的pinch回调就在此调用的)
	                };

	                preV.x = v.x;    // 把move中的2根手指中的差值赋值给preV, 当然也改变了this.preV
	                preV.y = v.y;

	            } else {    // 一根手指(处理拖动pressMove手势)

	                if (this.x2 !== null) {    // 一根手指第一次必然为空,因为初始化赋值为null, 下面将会用x2, y2保存上一次的结果

	                    evt.deltaX = currentX - this.x2;    // 拖动过程中或者手指移动过程中的差值(当前坐标与上一次的坐标)
	                    evt.deltaY = currentY - this.y2;

	                } else {
	                    evt.deltaX = 0;    // 第一次嘛, 手指刚移动,哪来的差值啊,所以为0呗
	                    evt.deltaY = 0;
	                };
	                this.pressMove.dispatch(evt);    // deltaXY挂载到evt对象上,抛给用户(用户的pressMove回调就在此调用的)
	            };

	            this.touchMove.dispatch(evt);    // evt对象因if语句而不同,挂载不同的属性抛出去给用户 (用户的touchMove回调就在此调用的)

	            this._cancelLongTap();    // 取消长按定时器

	            this.x2 = currentX;    // 存一下本次的pageXY坐标, 为了下次做差值
	            this.y2 = currentY;

	            if (len > 1) {    // 2个手指以上就阻止默认事件
	                evt.preventDefault();
	            };
	        },

	        end: function (evt) {
	            if (!evt.changedTouches) return;    // 位于该元素上的所有手指的列表, 没有TouchList也直接return掉

	            this._cancelLongTap();    // 取消长按定时器

	            var self = this;    // 存个实例
	            if (evt.touches.length < 2) {    // 手指数量小于2就触发 (用户的多点结束multipointEnd回调函数)
	                this.multipointEnd.dispatch(evt);
	            };

	            this.touchEnd.dispatch(evt);    // 触发(用户的touchEnd回调函数)

	            //swipe 滑动
	            if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) || (this.y2 && Math.abs(this.preV.y - this.y2) > 30)) {

	                evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);    // 获取上下左右方向中的一个

	                this.swipeTimeout = setTimeout(function () {
	                    self.swipe.dispatch(evt);    // 立即触发,加入异步队列(用户的swipe事件的回调函数)
	                }, 0);

	            } else {   // 以下是tap, singleTap, doubleTap事件派遣

	                this.tapTimeout = setTimeout(function () {

	                    self.tap.dispatch(evt);    // 触发(用户的tap事件的回调函数)
	                    // trigger double tap immediately
	                    if (self.isDoubleTap) {    // 如果满足双击的话

	                        self.doubleTap.dispatch(evt);    // 触发(用户的doubleTap事件的回调函数)
	                        clearTimeout(self.singleTapTimeout);    // 清除singleTapTimeout定时器

	                        self.isDoubleTap = false;    // 双击条件重置

	                    } else {
	                        self.singleTapTimeout = setTimeout(function () {
	                            self.singleTap.dispatch(evt);    // 触发(用户的singleTap事件的回调函数)
	                        }, 250);
	                    };

	                }, 0);    // 加入异步队列,主线程完成立马执行
	            };

	            this.preV.x = 0;    // this.preV, this.scale, this.pinchStartLen, this.x1 x2 y1 y2恢复初始值
	            this.preV.y = 0;
	            this.scale = 1;
	            this.pinchStartLen = null;
	            this.x1 = this.x2 = this.y1 = this.y2 = null;
	        },

	        cancel: function (evt) {
	            //清除定时器
	            clearTimeout(this.singleTapTimeout);
	            clearTimeout(this.tapTimeout);
	            clearTimeout(this.longTapTimeout);
	            clearTimeout(this.swipeTimeout);
	            // 执行用户的touchCancel回调函数,没有就执行一次noop空函数
	            this.touchCancel.dispatch(evt);
	        },

	        _cancelLongTap: function () {    // 取消长按定时器
	            clearTimeout(this.longTapTimeout);
	        },

	        _cancelSingleTap: function () {    // 取消延时SingleTap定时器
	            clearTimeout(this.singleTapTimeout);
	        },

	        // 2点间x与y之间的绝对值的差值作比较,x大的话即为左右滑动,y大即为上下滑动,x的差值大于0即为左滑动,小于0即为右滑动
	        _swipeDirection: function (x1, x2, y1, y2) {    // 判断用户到底是从上到下，还是从下到上，或者从左到右、从右到左滑动
	            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	        },

	        // 给dom添加14种事件中的一种
	        on: function(evt, handler) {    
	            if(this[evt]) {    // 看看有没有相应的事件名
	                this[evt].add(handler);    // HandlerAdmin实例的add方法
	            };
	        },

	        // 移除手势事件对应函数
	        off: function(evt, handler) {
	            if(this[evt]) {
	                this[evt].del(handler);    // 从数组中删除handler方法
	            };
	        },

	        destroy: function() {

	            // 关闭所有定时器
	            if(this.singleTapTimeout) clearTimeout(this.singleTapTimeout);
	            if(this.tapTimeout) clearTimeout(this.tapTimeout);
	            if(this.longTapTimeout) clearTimeout(this.longTapTimeout);
	            if(this.swipeTimeout) clearTimeout(this.swipeTimeout);

	            // 取消dom上touchstart, touchmove, touchend, touchcancel事件
	            this.element.removeEventListener("touchstart", this.start);
	            this.element.removeEventListener("touchmove", this.move);
	            this.element.removeEventListener("touchend", this.end);
	            this.element.removeEventListener("touchcancel", this.cancel);

	            // 把14个HandlerAdmin实例的this.handlers置为空数组
	            this.rotate.del();
	            this.touchStart.del();
	            this.multipointStart.del();
	            this.multipointEnd.del();
	            this.pinch.del();
	            this.swipe.del();
	            this.tap.del();
	            this.doubleTap.del();
	            this.longTap.del();
	            this.singleTap.del();
	            this.pressMove.del();
	            this.touchMove.del();
	            this.touchEnd.del();
	            this.touchCancel.del();

	            // 实例成员的变量全部置为null
	            this.preV = this.pinchStartLen = this.scale = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = null;

	            return null;
	        }
	    };

	    // 抛出去
	    
	    Omi.AlloyFinger = AlloyFinger;
	})();

	;(function () {

	    var OmiFinger = {};
	    var AlloyFinger = Omi.AlloyFinger;
	    var noop = function(){ };

	    var getHandler = function(name, dom, instance) {
	        var value = dom.getAttribute(name);    // 从属性上获取对应的函数名
	        if (value === null) {
	            return noop;
	        }else{
	            return instance[value].bind(instance);    // 从类上找到对应的方法
	        };
	    };

	    OmiFinger.init = function(){
	        Omi.extendPlugin('omi-finger',function(dom, instance){
	            if (!instance.alloyFingerInstances) instance.alloyFingerInstances = [];    // finger的实例都存到这里面
	            var len = instance.alloyFingerInstances.length;
	            var i = 0;
	            for( ; i<len; i++){
	                if(instance.alloyFingerInstances[i].dom === dom){    // 如果以前绑定过得, 就先销毁, 然后重新來过
	                    instance.alloyFingerInstances[i].fg.destroy();
	                    instance.alloyFingerInstances.splice(i,1);    // 并且剔除
	                    break;
	                };
	            };
	            var alloyFinger = new AlloyFinger(dom,{
	                touchStart: getHandler('touchStart', dom, instance),
	                touchMove: getHandler('touchMove', dom, instance),
	                touchEnd: getHandler('touchEnd', dom, instance),
	                touchCancel: getHandler('touchCancel', dom, instance),
	                multipointStart: getHandler('multipointStart', dom, instance),
	                multipointEnd: getHandler('multipointEnd', dom, instance),
	                tap: getHandler('tap', dom, instance),
	                doubleTap: getHandler('doubleTap', dom, instance),
	                longTap: getHandler('longTap', dom, instance),
	                singleTap: getHandler('singleTap', dom, instance),
	                rotate: getHandler('rotate', dom, instance),
	                pinch: getHandler('pinch', dom, instance),
	                pressMove: getHandler('pressMove', dom, instance),
	                swipe: getHandler('swipe', dom, instance)
	            });
	            instance.alloyFingerInstances.push({fg:alloyFinger,dom:dom});
	        });
	    }

	    OmiFinger.destroy = function(){
	        delete Omi.plugins['omi-finger'];
	    };
	    
	    Omi.OmiFinger = OmiFinger;
	})();

	// Transform.js
	;(function () {

	    var DEG_TO_RAD =  0.017453292519943295;

	    var Matrix3D = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
	        this.elements = window.Float32Array ? new Float32Array(16) : [];
	        var te = this.elements;
	        te[0] = (n11 !== undefined) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
	        te[1] = n21 || 0; te[5] = (n22 !== undefined) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
	        te[2] = n31 || 0; te[6] = n32 || 0; te[10] = (n33 !== undefined) ? n33 : 1; te[14] = n34 || 0;
	        te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = (n44 !== undefined) ? n44 : 1;
	    };


	    Matrix3D.prototype = {
	        set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
	            var te = this.elements;
	            te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
	            te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
	            te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
	            te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;
	            return this;
	        },
	        identity: function () {
	            this.set(
	                1, 0, 0, 0,
	                0, 1, 0, 0,
	                0, 0, 1, 0,
	                0, 0, 0, 1
	            );
	            return this;
	        },
	        multiplyMatrices: function (a, be) {

	            var ae = a.elements;
	            var te = this.elements;
	            var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
	            var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
	            var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
	            var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

	            var b11 = be[0], b12 = be[1], b13 = be[2], b14 = be[3];
	            var b21 = be[4], b22 = be[5], b23 = be[6], b24 = be[7];
	            var b31 = be[8], b32 = be[9], b33 = be[10], b34 = be[11];
	            var b41 = be[12], b42 = be[13], b43 = be[14], b44 = be[15];

	            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

	            return this;

	        },
	        // 解决角度为90的整数倍导致Math.cos得到极小的数，其实是0。导致不渲染
	        _rounded: function (value, i) {
	            i = Math.pow(10, i || 15);
	            // default
	            return Math.round(value * i) / i;
	        },
	        _arrayWrap: function (arr) {
	            return window.Float32Array ? new Float32Array(arr) : arr;
	        },
	        appendTransform: function (x, y, z, scaleX, scaleY, scaleZ, rotateX, rotateY, rotateZ, skewX, skewY, originX, originY, originZ) {

	            var rx = rotateX * DEG_TO_RAD;
	            var cosx = this._rounded(Math.cos(rx));
	            var sinx = this._rounded(Math.sin(rx));
	            var ry = rotateY * DEG_TO_RAD;
	            var cosy = this._rounded(Math.cos(ry));
	            var siny = this._rounded(Math.sin(ry));
	            var rz = rotateZ * DEG_TO_RAD;
	            var cosz = this._rounded(Math.cos(rz * -1));
	            var sinz = this._rounded(Math.sin(rz * -1));

	            this.multiplyMatrices(this, this._arrayWrap([
	                1, 0, 0, x,
	                0, cosx, sinx, y,
	                0, -sinx, cosx, z,
	                0, 0, 0, 1
	            ]));

	            this.multiplyMatrices(this, this._arrayWrap([
	                cosy, 0, siny, 0,
	                0, 1, 0, 0,
	                -siny, 0, cosy, 0,
	                0, 0, 0, 1
	            ]));

	            this.multiplyMatrices(this, this._arrayWrap([
	                cosz * scaleX, sinz * scaleY, 0, 0,
	                -sinz * scaleX, cosz * scaleY, 0, 0,
	                0, 0, 1 * scaleZ, 0,
	                0, 0, 0, 1
	            ]));

	            if (skewX || skewY) {
	                this.multiplyMatrices(this, this._arrayWrap([
	                    this._rounded(Math.cos(skewX * DEG_TO_RAD)), this._rounded(Math.sin(skewX * DEG_TO_RAD)), 0, 0,
	                    -1 * this._rounded(Math.sin(skewY * DEG_TO_RAD)), this._rounded(Math.cos(skewY * DEG_TO_RAD)), 0, 0,
	                    0, 0, 1, 0,
	                    0, 0, 0, 1
	                ]));
	            }


	            if (originX || originY || originZ) {
	                this.elements[12] -= originX * this.elements[0] + originY * this.elements[4] + originZ * this.elements[8];
	                this.elements[13] -= originX * this.elements[1] + originY * this.elements[5] + originZ * this.elements[9];
	                this.elements[14] -= originX * this.elements[2] + originY * this.elements[6] + originZ * this.elements[10];
	            }
	            return this;
	        }
	    };

	    var Matrix2D = function(a, b, c, d, tx, ty) {
	        this.a = a == null ? 1 : a;
	        this.b = b || 0;
	        this.c = c || 0;
	        this.d = d == null ? 1 : d;
	        this.tx = tx || 0;
	        this.ty = ty || 0;
	        return this;
	    };

	    Matrix2D.prototype = {
	        identity : function() {
	            this.a = this.d = 1;
	            this.b = this.c = this.tx = this.ty = 0;
	            return this;
	        },
	        appendTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, originX, originY) {
	            if (rotation % 360) {
	                var r = rotation * DEG_TO_RAD;
	                var cos = Math.cos(r);
	                var sin = Math.sin(r);
	            } else {
	                cos = 1;
	                sin = 0;
	            }
	            if (skewX || skewY) {
	                skewX *= DEG_TO_RAD;
	                skewY *= DEG_TO_RAD;
	                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
	                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
	            } else {
	                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
	            }
	            if (originX || originY) {
	                this.tx -= originX * this.a + originY * this.c;
	                this.ty -= originX * this.b + originY * this.d;
	            }
	            return this;
	        },
	        append : function(a, b, c, d, tx, ty) {
	            var a1 = this.a;
	            var b1 = this.b;
	            var c1 = this.c;
	            var d1 = this.d;
	            this.a = a * a1 + b * c1;
	            this.b = a * b1 + b * d1;
	            this.c = c * a1 + d * c1;
	            this.d = c * b1 + d * d1;
	            this.tx = tx * a1 + ty * c1 + this.tx;
	            this.ty = tx * b1 + ty * d1 + this.ty;
	            return this;
	        },
	        initialize : function(a, b, c, d, tx, ty) {
	            this.a = a;
	            this.b = b;
	            this.c = c;
	            this.d = d;
	            this.tx = tx;
	            this.ty = ty;
	            return this;
	        },
	        setValues : function(a, b, c, d, tx, ty) {
	            this.a = a == null ? 1 : a;
	            this.b = b || 0;
	            this.c = c || 0;
	            this.d = d == null ? 1 : d;
	            this.tx = tx || 0;
	            this.ty = ty || 0;
	            return this;
	        },
	        copy : function(matrix) {
	            return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	        }
	    };

	    function observe(target, props, callback) {
	        for (var i = 0, len = props.length; i < len; i++) {
	            var prop = props[i];
	            watch(target, prop, callback);
	        }
	    }

	    function watch(target, prop, callback) {
	        Object.defineProperty(target, prop, {
	            get: function () {
	                return this["_" + prop];
	            },
	            set: function (value) {
	                if (value !== this["_" + prop]) {
	                    this["_" + prop] = value;
	                    callback();
	                }

	            }
	        });
	    }

	    function isElement(o) {
	        return (
	            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
	                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
	        );
	    }

	    function Transform(obj, notPerspective) {

	        var observeProps = ["translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"],
	            objIsElement = isElement(obj);
	        if (!notPerspective) {
	            observeProps.push("perspective");
	        }

	        observe(
	            obj,
	            observeProps,
	            function () {
	                var mtx = obj.matrix3d.identity().appendTransform(obj.translateX, obj.translateY, obj.translateZ, obj.scaleX, obj.scaleY, obj.scaleZ, obj.rotateX, obj.rotateY, obj.rotateZ, obj.skewX, obj.skewY, obj.originX, obj.originY, obj.originZ);
	                var transform = (notPerspective ? "" : "perspective(" + obj.perspective + "px) ") + "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
	                if (objIsElement) {
	                    obj.style.transform = obj.style.msTransform = obj.style.OTransform = obj.style.MozTransform = obj.style.webkitTransform = transform;
	                } else {
	                    obj.transform = transform;
	                }
	            });

	        obj.matrix3d = new Matrix3D();
	        if (!notPerspective) {
	            obj.perspective = 500;
	        }
	        obj.scaleX = obj.scaleY = obj.scaleZ = 1;
	        //由于image自带了x\y\z，所有加上translate前缀
	        obj.translateX = obj.translateY = obj.translateZ = obj.rotateX = obj.rotateY = obj.rotateZ = obj.skewX = obj.skewY = obj.originX = obj.originY = obj.originZ = 0;
	    }

	    Transform.getMatrix3D = function (option) {
	        var defaultOption = {
	            translateX: 0,
	            translateY: 0,
	            translateZ: 0,
	            rotateX: 0,
	            rotateY: 0,
	            rotateZ: 0,
	            skewX: 0,
	            skewY: 0,
	            originX: 0,
	            originY: 0,
	            originZ: 0,
	            scaleX: 1,
	            scaleY: 1,
	            scaleZ: 1
	        };
	        for (var key in option) {
	            if (option.hasOwnProperty(key)) {
	                defaultOption[key] = option[key];
	            }
	        }
	        return new Matrix3D().identity().appendTransform(defaultOption.translateX, defaultOption.translateY, defaultOption.translateZ, defaultOption.scaleX, defaultOption.scaleY, defaultOption.scaleZ, defaultOption.rotateX, defaultOption.rotateY, defaultOption.rotateZ, defaultOption.skewX, defaultOption.skewY, defaultOption.originX, defaultOption.originY, defaultOption.originZ).elements;

	    }

	    Transform.getMatrix2D = function(option){
	        var defaultOption = {
	            translateX: 0,
	            translateY: 0,
	            rotation: 0,
	            skewX: 0,
	            skewY: 0,
	            originX: 0,
	            originY: 0,
	            scaleX: 1,
	            scaleY: 1
	        };
	        for (var key in option) {
	            if (option.hasOwnProperty(key)) {
	                defaultOption[key] = option[key];
	            }
	        }
	        return new Matrix2D().identity().appendTransform(defaultOption.translateX, defaultOption.translateY, defaultOption.scaleX, defaultOption.scaleY, defaultOption.rotation, defaultOption.skewX, defaultOption.skewY, defaultOption.originX, defaultOption.originY);
	    }

	    
	    Omi.Transform = Transform;
	})();

	;(function () {

	    var OmiTransform = {};
	    var Transform = Omi.Transform;

	    OmiTransform.init = function(){
	        Omi.extendPlugin('omi-transform',function(dom, instance){
	            var ref = dom.getAttribute('ref');    // 查找dom的ref属性
	            if(ref){
	                var element = instance.refs[ref];    // 找到dom元素
	                Transform(element, element.getAttribute('perspective') ? false : true);    // 给元素赋予三维矩阵
	                ['translateX', 'translateY', 'translateZ', 'scaleX', 'scaleY', 'scaleZ', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewY', 'originX', 'originY', 'originZ'].forEach(function(name){
	                    var attr = dom.getAttribute(name);    // 获取这些值的默认值
	                    if(attr) {    // 有的话就给他
	                        element[name] = parseFloat(dom.getAttribute(name));
	                    };
	                });
	            };
	        });
	    };

	    OmiTransform.destroy = function(){
	        delete Omi.plugins['omi-transform'];
	    };
	 
	    Omi.OmiTransform = OmiTransform;
	})();

	// Touch.js
	;(function () {
	    'use strict';

	    if (!Date.now)
	        Date.now = function () { return new Date().getTime(); };

	    var vendors = ['webkit', 'moz'];
	    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	        var vp = vendors[i];
	        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame']
	                                   || window[vp + 'CancelRequestAnimationFrame']);
	    }
	    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
	        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
	        var lastTime = 0;
	        window.requestAnimationFrame = function (callback) {
	            var now = Date.now();
	            var nextTime = Math.max(lastTime + 16, now);
	            return setTimeout(function () { callback(lastTime = nextTime); },
	                              nextTime - now);
	        };
	        window.cancelAnimationFrame = clearTimeout;
	    }
	}());

	;(function () {

	    // 给元素绑定事件, 默认冒泡
	    function bind(element, type, callback) {
	        element.addEventListener(type, callback, false);
	    };

	    // 三次贝塞尔
	    function ease(x) {
	        return Math.sqrt(1 - Math.pow(x - 1, 2));
	    };

	    // 相反的三次贝塞尔
	    function reverseEase(y) {
	        return 1 - Math.sqrt(1 - y * y);
	    };

	    // INPUT|TEXTAREA|BUTTON|SELECT这几个标签就不用阻止默认事件了
	    function preventDefaultTest(el, exceptions) {
	        for (var i in exceptions) {
	            if (exceptions[i].test(el[i])) {
	                return true;
	            };
	        };
	        return false;
	    };

	    var AlloyTouch = function (option) {
	        
	        this.element = typeof option.touch === "string" ? document.querySelector(option.touch) : option.touch;    // 反馈触摸的dom
	        this.target = this._getValue(option.target, this.element);    // 运动的对象
	        this.vertical = this._getValue(option.vertical, true);    // 不必需，默认是true代表监听竖直方向touch
	        this.property = option.property;    // 被滚动的属性
	        this.tickID = 0;

	        this.initialValue = this._getValue(option.initialValue, this.target[this.property]);    // 被运动的属性的初始值,默认从Transform原始属性拿值
	        this.target[this.property] = this.initialValue;    // 给运动的属性赋值
	        this.fixed = this._getValue(option.fixed, false);
	        this.sensitivity = this._getValue(option.sensitivity, 1);    // 默认是1, 灵敏度
	        this.moveFactor = this._getValue(option.moveFactor, 1);    // move时的运动系数
	        this.factor = this._getValue(option.factor, 1);    // 系数
	        this.outFactor = this._getValue(option.outFactor, 0.3);    // 外部系数
	        this.min = option.min;    // 不必需,滚动属性的最小值,越界会回弹
	        this.max = option.max;    // 不必需,运动属性的最大值,越界会回弹, 一般为0
	        this.deceleration = 0.0006;    // 减速系数
	        this.maxRegion = this._getValue(option.maxRegion, 600);    // 最大区域, 默认60
	        this.springMaxRegion = this._getValue(option.springMaxRegion, 60);    // 弹动的最大值区域, 默认60
	        this.maxSpeed = option.maxSpeed;    // 最大速度
	        this.hasMaxSpeed = !(this.maxSpeed === undefined);    // 是否有最大速度属性
	        this.lockDirection = this._getValue(option.lockDirection, true);    // 锁定方向

	        var noop = function () { };    // 空函数
	        this.touchStart = option.touchStart || noop;
	        this.change = option.change || noop;
	        this.touchMove = option.touchMove || noop;
	        this.pressMove = option.pressMove || noop;
	        this.tap = option.tap || noop;
	        this.touchEnd = option.touchEnd || noop;
	        this.touchCancel = option.touchCancel || noop;
	        this.reboundEnd = option.reboundEnd || noop;    // 回弹回调
	        this.animationEnd = option.animationEnd || noop;
	        this.correctionEnd = option.correctionEnd || noop;    // 修改回调

	        this.preventDefault = this._getValue(option.preventDefault, true);    // 默认是true,是否阻止默认事件
	        this.preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ };    // 这几个tag标签,阻止默认事件例外
	        this.hasMin = !(this.min === undefined);    // 是否有min,和max属性
	        this.hasMax = !(this.max === undefined);
	        if (this.hasMin && this.hasMax && this.min > this.max) {    // 最小值不能比最大值大啊
	            throw "the min value can't be greater than the max value."
	        };
	        this.isTouchStart = false;    // 触摸是否开始
	        this.step = option.step;    // 步数(回弹)
	        this.inertia = this._getValue(option.inertia, true);    // 默认true,开启惯性效果

	        this._calculateIndex();    // 添加this.currentPage属性,如果写轮播的话

	        this.eventTarget = window;
	        if(option.bindSelf){
	            this.eventTarget = this.element;    // 默认touchmove, touchend, touchcancel绑定在 window 上的, 如果option.bindSelf为真值,则绑定到反馈触摸的dom
	        };

	        this._moveHandler = this._move.bind(this);    // 函数赋值
	        // 反馈触摸的dom只绑定了touchstart(_start), window绑定了 touchmove(_move), touchend(_end), touchcancel(_cancel)方法
	        bind(this.element, "touchstart", this._start.bind(this));
	        bind(this.eventTarget, "touchend", this._end.bind(this));
	        bind(this.eventTarget, "touchcancel", this._cancel.bind(this));
	        this.eventTarget.addEventListener("touchmove", this._moveHandler, { passive: false, capture: false });    // 使用 passive 改善的滚屏性能
	        this.x1 = this.x2 = this.y1 = this.y2 = null;    // start时的坐标和move时的坐标
	    };

	    AlloyTouch.prototype = {
	        _getValue: function (obj, defaultValue) {    // 取用户的值还是使用默认值
	            return obj === undefined ? defaultValue : obj;
	        },
	        _start: function (evt) {
	            this.isTouchStart = true;    // 触摸开始
	            this.touchStart.call(this, evt, this.target[this.property]);    // (1. touchStart(evt, propValue)回调)
	            cancelAnimationFrame(this.tickID);    // 只要触摸就停止动画
	            this._calculateIndex();    // 重新计算this.currentPage属性值
	            this.startTime = new Date().getTime();    // 开始的时间戳
	            this.x1 = this.preX = evt.touches[0].pageX;    // 开始前的坐标保存到x,y 和 preXY去
	            this.y1 = this.preY = evt.touches[0].pageY;
	            this.start = this.vertical ? this.preY : this.preX;    // 如果监听竖直方向则取y坐标,否则横向方向取x坐标
	            this._firstTouchMove = true;    // 开始move(这个条件为_move做铺垫)
	            this._preventMove = false;    // 不阻止dom继续运动(开启惯性运动之旅的条件之一 哈哈)
	        },
	        _move: function (evt) {
	            if (this.isTouchStart) {    // 触摸开始了
	                var len = evt.touches.length,    // 手指数量
	                    currentX = evt.touches[0].pageX,    // move时的坐标
	                    currentY = evt.touches[0].pageY;

	                if (this._firstTouchMove && this.lockDirection) {    // 开始move 且 锁定方向 
	                    var dDis = Math.abs(currentX - this.x1) - Math.abs(currentY - this.y1);    // 是左右滑动还是上下滑动(x>y为水平, y>x为竖直)
	                    if (dDis > 0 && this.vertical) {    // 左右滑动 且 监听竖直方向
	                        this._preventMove = true;    // 阻止dom继续运动
	                    } else if (dDis < 0 && !this.vertical) {    // 竖直滑动 且 监听横向方向
	                        this._preventMove = true;
	                    };    // 以上2种情况直接不开启惯性运动之旅(因为左右滑动的话this.vertical需为false,竖直滑动的话this.vertical需为true)
	                    this._firstTouchMove = false;    // 变成false, 为了手指连续移动中,此方法就不用进来了
	                };
	                if(!this._preventMove) {    // move时 属性运动(关闭惯性运动后, 其实只有此运动了, 手指移动才会运动, 离开则不会运动了)

	                    var d = (this.vertical ? currentY - this.preY : currentX - this.preX) * this.sensitivity;    // 根据竖直还是左右来确定差值 * 灵敏度
	                    var f = this.moveFactor;    // 变量f的值为 move时的运动系数(默认1)
	                    if (this.hasMax && this.target[this.property] > this.max && d > 0) {    // 有最大值 且 运动属性值>最大值 且 坐标差值d>0
	                        f = this.outFactor;
	                    } else if (this.hasMin && this.target[this.property] < this.min && d < 0) {    // 有最小值 且 运动属性值<最小值 且 坐标差值d<0
	                        f = this.outFactor;    // 满足以上2中条件 变量f 的值就变成 this.outFactor(默认0.3)
	                    };
	                    d *= f;    // 坐标差值再乘以运动系数
	                    this.preX = currentX;    // 把move时的坐标保存到preXY去
	                    this.preY = currentY;
	                    if (!this.fixed) {    // this.fixed默认false(fixed一旦固定了,move时, dom也不会运动)
	                        this.target[this.property] += d;    //把坐标的差值且乘以运动系数后的结果累加给运动的对象(被transform.js加工后的dom对象)
	                        // console.log('_move: ' + this.target[this.property]);
	                    };
	                    this.change.call(this, this.target[this.property]);    // (2. move时的change(evt, propValue)回调)
	                    var timestamp = new Date().getTime();    // move时的时间戳
	                    if (timestamp - this.startTime > 300) {    // move时的时间戳和start时的时间戳大于300的话
	                        this.startTime = timestamp;    // move时的时间戳赋值给start时的时间戳
	                        this.start = this.vertical ? this.preY : this.preX;    // 重新计算this.start值
	                    };
	                    this.touchMove.call(this, evt, this.target[this.property]);    // (3. touchMove(evt, propValue)回调)
	                };

	                if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {    //阻止默认事件除了INPUT|TEXTAREA|BUTTON|SELECT这几个标签
	                    evt.preventDefault();
	                };

	                if (len === 1) {    // 一根手指
	                    if (this.x2 !== null) {    //一开始为null
	                        evt.deltaX = currentX - this.x2;    // move移动时的差值
	                        evt.deltaY = currentY - this.y2;

	                    } else {
	                        evt.deltaX = 0;    // 一开始差值为0啦
	                        evt.deltaY = 0;
	                    }
	                    this.pressMove.call(this, evt, this.target[this.property]);    // (4. pressMove(evt, propValue)回调)
	                }
	                this.x2 = currentX;    //把本次坐标赋值给x2,y2
	                this.y2 = currentY;
	            }
	        },
	        _end: function (evt) {
	            if (this.isTouchStart) {    // 触摸开始了

	                this.isTouchStart = false;    // 触摸开始变量置为false(_move方法进不去了)
	                var self = this,    // 存个实例
	                    current = this.target[this.property],    // 当前运动对象的运动属性的值
	                    triggerTap = (Math.abs(evt.changedTouches[0].pageX - this.x1) < 30 && Math.abs(evt.changedTouches[0].pageY - this.y1) < 30);    // 是否触发tap事件回调
	                if (triggerTap) {    // 触发tap事件
	                    this.tap.call(this, evt, current);    // (5. tap(evt, propValue)回调)
	                };

	                if (this.touchEnd.call(this, evt, current, this.currentPage) === false) return;    // (6. touchEnd(evt, propValue, 当前第几页)回调)这个主要给轮播用的吧

	                if (this.hasMax && current > this.max) {    // 有最大值 且 当前运动对象的运动属性的值大于最大值

	                    this._to(this.max, 200, ease, this.change, function (value) {    // (最大小值, time, 曲线, change函数, fn)
	                        this.reboundEnd.call(this, value);
	                        this.animationEnd.call(this, value);
	                    }.bind(this));

	                } else if (this.hasMin && current < this.min) {    // 有最小值 且 当前运动对象的运动属性的值小于最小值

	                    this._to(this.min, 200, ease, this.change, function (value) {
	                        this.reboundEnd.call(this, value);
	                        this.animationEnd.call(this, value);
	                    }.bind(this));

	                } else if (this.inertia && !triggerTap && !this._preventMove) {    // 开启惯性效果(默认为true) 且 不触发tap事件 且 this._preventMove为false;

	                    var dt = new Date().getTime() - this.startTime;    // _end时的时间戳和_move时的时间戳的差值
	                    if (dt < 300) {    // 小于300ms就执行惯性运动
	                        var distance = ((this.vertical ? evt.changedTouches[0].pageY : evt.changedTouches[0].pageX) - this.start) * this.sensitivity,    // _end中的坐标与_move中坐标的差值乘以灵敏度
	                            speed = Math.abs(distance) / dt,    // 速度为坐标差值/时间戳差值
	                            speed2 = this.factor * speed;    // 速度2为 系数(默认1)乘以速度
	                        if(this.hasMaxSpeed && speed2 > this.maxSpeed) {    // 有最大速度 且 速度2大于最大速度
	                            speed2 = this.maxSpeed;    // 速度2就为最大速度
	                        };

	                        // 目标值destination = 当前运动对象的运动属性的值 + (速度2*速度2)/(2*减速系数)*(-1||1); 
	                        var destination = current + (speed2 * speed2) / (2 * this.deceleration) * (distance < 0 ? -1 : 1); 
	                        // console.log('distance： '+ distance);
	                        // console.log('目标值destination： '+ destination);
	                        // console.log('差值： '+ destination > current);

	                        var tRatio = 1;    // 比例
	                        if (destination < this.min ) {    // 目标值 比 最小值 小
	                            if (destination < this.min - this.maxRegion) {
	                                tRatio = reverseEase((current - this.min + this.springMaxRegion) / (current - destination));
	                                destination = this.min - this.springMaxRegion;
	                            } else {
	                                tRatio = reverseEase((current - this.min + this.springMaxRegion * (this.min - destination) / this.maxRegion) / (current - destination));
	                                destination = this.min - this.springMaxRegion * (this.min - destination) / this.maxRegion;
	                            }
	                        } else if (destination > this.max) {    // 目标值 比 最大值 大
	                            if (destination > this.max + this.maxRegion) {
	                                tRatio = reverseEase((this.max + this.springMaxRegion - current) / (destination - current));
	                                destination = this.max + this.springMaxRegion;
	                            } else {
	                                tRatio = reverseEase((this.max + this.springMaxRegion * ( destination-this.max) / this.maxRegion - current) / (destination - current));
	                                destination = this.max + this.springMaxRegion * (destination - this.max) / this.maxRegion;
	                                
	                            }
	                        };

	                        // 持续时间duration = 数字舍入(速度/减速系数) * 比例;
	                        var duration = Math.round(speed / self.deceleration) * tRatio;
	                        // console.log('持续时间duration: ' + duration);

	                        // end方法计算好的目标值和持续时间传入_to方法,运动起来吧
	                        self._to(Math.round(destination), duration, ease, self.change, function (value) {    // 回调函数的value 就是 destination

	                            if (self.hasMax && self.target[self.property] > self.max) {    // 有最大值 且 运动属性的值大于最大值

	                                cancelAnimationFrame(self.tickID);
	                                self._to(self.max, 600, ease, self.change, self.animationEnd);

	                            } else if (self.hasMin && self.target[self.property] < self.min) {    // 有最小值 且 运动属性的值小于最小值

	                                cancelAnimationFrame(self.tickID);
	                                self._to(self.min, 600, ease, self.change, self.animationEnd);

	                            } else {
	                                self._correction();    // 回弹
	                            };

	                            self.change.call(this, value);    // (7. change(运动属性的值)回调函数)
	                        });
	                    } else {
	                        self._correction();    // 回弹
	                    }
	                } else {
	                    self._correction();    // 回弹
	                };

	                // 阻止默认事件
	                if (this.preventDefault && !preventDefaultTest(evt.target, this.preventDefaultException)) {
	                    evt.preventDefault();
	                };

	            };
	            // 坐标置null
	            this.x1 = this.x2 = this.y1 = this.y2 = null;
	        },
	        // 提供目标值, 持续时间, 然后根据时间戳和time持续时间的差值比较, 时间戳< time的话就一直调用动画,否则结束
	        _to: function (value, time, ease, onChange, onEnd) {    // value:目标值, time:持续时间, ease: 曲线动画, onChange: this.change回调函数(用户的), onEnd回调
	            if (this.fixed) return;    // fixed(默认false)有真值就return掉
	            var el = this.target,    // 运动的对象
	                property = this.property;    // 运动的属性
	            var current = el[property];    // 运动对象运动属性当前的值
	            var dv = value - current;    // 目标值与当前属性的差值
	            var beginTime = new Date();    // 开始时间戳
	            var self = this;    // 存个实例
	            var toTick = function () {

	                var dt = new Date() - beginTime;    // 时间戳差值
	                if (dt >= time) {    // 时间戳差值大于持续时间
	                    el[property] = value;    // 把目标值赋值给dom属性
	                    onChange && onChange.call(self, value);    // (7. change(目标值)回调函数)
	                    onEnd && onEnd.call(self, value);    // onEnd回调
	                    return;
	                };
	                el[property] = dv * ease(dt / time) + current;
	                // console.log(el[property]);
	                self.tickID = requestAnimationFrame(toTick);    // 动画自调用
	                onChange && onChange.call(self, el[property]);    //(7. change(属性值)回调函数)
	            };
	            toTick();    // 调用
	        },
	        // 该函数用来当动画完成后根据this.step修正一点(回弹效果)
	        _correction: function () {
	            if (this.step === undefined) return;    // step没赋值的话就return掉
	            var el = this.target,    // 运动的对象
	                property = this.property;    // 运动对象的运动属性
	            var value = el[property];    // 运动对象运动属性的值
	            var rpt = Math.floor(Math.abs(value / this.step));    // 向下取整(取绝对值(运动对象运动属性的值/ this.step值))
	            var dy = value % this.step;    // 运动对象运动属性的值取余数

	            if (Math.abs(dy) > this.step / 2) {    // 我想这里又应用了啥物理原理根据条件判断,来计算value目标值的,然后调用_to方法执行惯性运动
	                this._to((value < 0 ? -1 : 1) * (rpt + 1) * this.step, 400, ease, this.change, function (value) {
	                    this._calculateIndex();
	                    this.correctionEnd.call(this, value);
	                    this.animationEnd.call(this, value);
	                }.bind(this));
	            } else {
	                this._to((value < 0 ? -1 : 1) * rpt * this.step, 400, ease, this.change, function (value) {
	                    this._calculateIndex();    // 重新计算this.currentPage值
	                    this.correctionEnd.call(this, value);    // (8. correctionEnd(属性值)回调函数)
	                    this.animationEnd.call(this, value);    // (9. animationEnd(属性值)回调函数)
	                }.bind(this));
	            }
	        },
	        _cancel: function (evt) {
	            var current = this.target[this.property];
	            this.touchCancel.call(this, evt, current);
	            this._end(evt);
	        },
	        // 给用户使用的, 控制dom以不同的曲线动画运动
	        to: function (v, time, user_ease) {
	            this._to(v, this._getValue(time, 600), user_ease || ease, this.change, function (value) {
	                this._calculateIndex();
	                this.reboundEnd.call(this, value);    // (10. reboundEnd(属性值)回调函数)
	                this.animationEnd.call(this, value);    // (9. animationEnd(属性值)回调函数)
	            }.bind(this));

	        },
	        // 计算this.currentPage值
	        _calculateIndex: function () {
	            if (this.hasMax && this.hasMin) {
	                this.currentPage = Math.round((this.max - this.target[this.property]) / this.step);    // 当前第几页,比如轮播图的第几个,从0开始
	            }
	        }
	        
	    };

	    // 抛出去
	    Omi.AlloyTouch = AlloyTouch;
	})();

	;(function () {

	    var OmiTouch = {};
	    var AlloyTouch = Omi.AlloyTouch;
	    var Transform = Omi.Transform;

	    var noop = function() { };

	    var getHandler = function(name, dom, instance) {
	        var value = dom.getAttribute(name);
	        if (value === null) {
	            return noop;
	        }else{
	            return instance[value].bind(instance);
	        }
	    };

	    var getNum = function(name, dom){
	        var value = dom.getAttribute(name);
	        if(value){
	            return parseFloat(value);
	        }
	    }

	    OmiTouch.init = function(){
	        Omi.extendPlugin('omi-touch',function(dom, instance){
	            var target = instance.refs[ dom.getAttribute('motionRef')];
	            var touchInstanceName = dom.getAttribute('touchInstance');
	            Transform(target, target.getAttribute('perspective') ? false : true);
	            var initialValue = dom.getAttribute('initialValue');
	            if(initialValue){
	                target[dom.getAttribute('property') || "translateY"] = parseInt(initialValue);
	            }

	            instance[touchInstanceName] = new AlloyTouch({
	                touch: dom,//反馈触摸的dom
	                vertical: dom.getAttribute('vertical') === 'false' ? false : true,//不必需，默认是true代表监听竖直方向touch
	                target: target, //运动的对象
	                property: dom.getAttribute('property') || "translateY",  //被运动的属性
	                min:  getNum('min', dom), //不必需,运动属性的最小值
	                max:  getNum('max', dom), //不必需,滚动属性的最大值
	                sensitivity: getNum('sensitivity', dom) ,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
	                factor: getNum('factor', dom) ,//不必需,表示触摸位移与被运动属性映射关系，默认值是1
	                step: getNum('step', dom),//用于校正到step的整数倍
	                bindSelf: dom.getAttribute('bindSelf') === 'true' ? true : false,
	                change: getHandler('change', dom, instance),
	                touchStart: getHandler('touchStart', dom, instance),
	                touchMove: getHandler('touchMove', dom, instance),
	                touchEnd: getHandler('touchEnd', dom, instance),
	                tap: getHandler('tap', dom, instance),
	                pressMove: getHandler('pressMove', dom, instance),
	                animationEnd: getHandler('animationEnd', dom, instance)
	            })
	        });
	    }

	    OmiTouch.destroy = function(){
	        delete Omi.plugins['omi-touch'];
	    };

	    Omi.OmiTouch = OmiTouch;
	})();

	// move.js
	;(function() {

		var PI = Math.PI,
			sin = Math.sin,
			cos = Math.cos,
			pow = Math.pow,
			abs = Math.abs,
			sqrt = Math.sqrt;

		var request = window.requestAnimationFrame,
			stopRequest = window.cancelAnimationFrame;
		var _move, _stopMove;    // 都是函数, 不支持requestAnimationFrame的浏览器就使用定时器

		//初始化运动函数和停止函数  
		if (request) {
			_move = function(fn, timer) {    // fn: 匿名函数, timer: 不同的空对象
				var step = function() {
					if (!fn()) {    // fn函数返回值为假值则调用requestAnimationFrame方法(true代表运动结束)
						timer.id = request(step);
					};
				};
				step();    // 函数调用
			};
		} else {
			_move = function(fn, timer) {
				timer.id = setInterval(fn, 16);    // 采用定时器, 时间间隔不能低于16
			};
		};
		if (stopRequest) {
			_stopMove = function(timer) {
				stopRequest(timer.id);    // 停止动画调用
			};
		} else {
			_stopMove = function(timer) {
				clearInterval(timer.id);    // 关闭定时器
			};
		};

		var Move = function() {    // Move构造函数
			this.aCurve = [];    // 曲线动画函数名集合
			this.init();
		};    


		var curve = Move.prototype = {    // Move原型
			// 初始化动画曲线 
			init: function() {
				this.extends({
					//定义域和值域均为[0, 1], 传入自变量x返回对应值y
					//先加速后减速
					ease: function(x) {
						// return -0.5*cos(PI * (2 - x)) + 0.5;
						if (x <= 0.5) return 2 * x * x;
						else if (x > 0.5) return -2 * x * x + 4 * x - 1;
					},

					// 初速度为0 ,一直加速
					easeIn: function(x) {
						return x * x;
					},

					//先慢慢加速1/3, 然后突然大提速, 最后减速
					ease2: function(x) {
						return x < 1 / 3 ? x * x : -2 * x * x + 4 * x - 1;
					},

					//初速度较大, 一直减速, 缓冲动画
					easeOut: function(x) {
						return pow(x, 0.8);
					},

					//碰撞动画
					collision: function(x) {
						var a, b; //a, b代表碰撞点的横坐标
						for (var i = 1, m = 20; i < m; i++) {
							a = 1 - (4 / 3) * pow(0.5, i - 1);
							b = 1 - (4 / 3) * pow(0.5, i);
							if (x >= a && x <= b) {
								return pow(3 * (x - (a + b) / 2), 2) + 1 - pow(0.25, i - 1);
							}
						}
					},

					//弹性动画
					elastic: function(x) {
						return -pow(1 / 12, x) * cos(PI * 2.5 * x * x) + 1;
					},

					//匀速动画
					linear: function(x) {
						return x;
					},

					//断断续续加速减速
					wave: function(x) {
						return (1 / 12) * sin(5 * PI * x) + x;
					},

					//先向反方向移动一小段距离, 然后正方向移动, 并超过终点一小段, 然后回到终点
					opposite: function(x) {
						return (sqrt(2) / 2) * sin((3 * PI / 2) * (x - 0.5)) + 0.5;
					},

					// 相反的三次贝塞尔
					reverseEase: function (x) {    
				        return 1 - Math.sqrt(1 - x * x);
				    }
				});
			},

			// 随机选择一个动画方法名
			getRd: function () {
				var preItem = null;

				return function () {
					var arr = this.aCurve;
					var index = Math.floor(Math.random() * arr.length),
					    item = arr[index],
					    result;

					if (preItem != item) {
						preItem = item;
						result = item;
					} else {
						result = this.getRd(arr);
					};

					return result;
				};
			}(),

			// 扩张曲线动画
			extends: function(obj) {
				for (var k in obj) {
					if (k in curve) {
						console.warn('扩张的方法名' + k + ': 已经存在, 换个方法名吧!' );
						return;
					};
					this.aCurve.push(k);
					curve[k] = (function(moveType) {    // 给Move原型添加 动画曲线 方法
						return function() {
							return _doMove.call(this, arguments, moveType);    // 每个动画曲线方法实际调用_doMove函数
						};
					})(obj[k]);
				};
			}
		};


		/**
		 * 开始动画函数
		 * arg: 用户要传的([0, 1000], 500, function(v){ ... }, fnEnd)
		 * moveType: 曲线动画函数
		 */
		function _doMove(arg, moveType) {
			var r,    // r => 过渡范围, 例如[0, 1000]   (必须传, 且传数组)
			    d,    // d => 过渡时间, ms,             (可不传, 默认500) 
			    fn,    // fn => 每一帧的回调函数, 传入当前过渡值v   (必须传) 
			    fnEnd;    // fnEnd => 动画结束时回调               (可不传)    

			// 严格限制传入参数, 且传入的参数可以没有顺序
			for (var i = 0; i < 4; i++) {
				if (typeof arg[i] === 'object' && !r) r = arg[i];
				else if (typeof arg[i] === 'number' && !d) d = arg[i];
				else if (typeof arg[i] === 'function' && !fn) fn = arg[i];
				else if (typeof arg[i] === 'function' && !fnEnd) fnEnd = arg[i];
			};

			if (!r instanceof Array || !fn) return;    // 如果r不是数组或者fn不是函数(真值)就return掉

			d = d || 500;    // 过渡时间默认500ms

			var from = +new Date, //起始时间
				x = 0,    
				y,
				a = r[0],    // 过渡范围的起点
				b = r[1];    // 过度范围的终点

			var timer = 't' + Math.random();    // 随机数

			var self = this;    // 存一下Move的实例

			//用于保存定时器ID的对象, requestAnimation递归调用必须传入对象(给实例添加timer属性值为{})
			this[timer] = {};

			// 优先使用requestAnimationFrame否则setInterval定时器
			_move(function() {
				x = (+new Date - from) / d;

				if (x >= 1) {    // 动画结束
					fn(b);    // 调用外部动画的回调函数且把过度范围的终点值作为参数传过去
					if (fnEnd) fnEnd();    // 如果有动画结束回调函数就执行回调函数
					return true;    // 返回真值停止调用requestAnimationFrame方法
				} else {    // 动画进行中
					y = moveType(x);    // 调用动画曲线中的函数返回运动数字
					fn(a + (b - a) * y);    // 调用外部动画的回调函数传参为 a + (b - a) * y
				};
			}, self[timer]);

			return function() {
				_stopMove(self[timer]);    // 调用cancelAnimationFrame方法停止动画
				return a + (b - a) * y;    // 返回动画停止后的运动数字
			};
		};

		// 抛出去
		Omi.Move = Move;    // Move构造函数抛出去
	})();

	// 路由较复杂
	var Parser = (function() {
		var isarray = Array.isArray || function (arr) {
		  return Object.prototype.toString.call(arr) == '[object Array]';
		};

		/**
		 * Expose `pathToRegexp`.
		 */
		/*module.exports = pathToRegexp
		module.exports.parse = parse
		module.exports.compile = compile
		module.exports.tokensToFunction = tokensToFunction
		module.exports.tokensToRegExp = tokensToRegExp*/

		/**
		 * The main path matching regexp utility.
		 *
		 * @type {RegExp}
		 */
		var PATH_REGEXP = new RegExp([
		  // Match escaped characters that would otherwise appear in future matches.
		  // This allows the user to escape special characters that won't transform.
		  '(\\\\.)',
		  // Match Express-style parameters and un-named parameters with a prefix
		  // and optional suffixes. Matches appear as:
		  //
		  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
		  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
		  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
		  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
		].join('|'), 'g')

		/**
		 * Parse a string for the raw tokens.
		 *
		 * @param  {string}  str
		 * @param  {Object=} options
		 * @return {!Array}
		 */
		function parse (str, options) {
		  var tokens = []
		  var key = 0
		  var index = 0
		  var path = ''
		  var defaultDelimiter = options && options.delimiter || '/'
		  var res

		  while ((res = PATH_REGEXP.exec(str)) != null) {
		    var m = res[0]
		    var escaped = res[1]
		    var offset = res.index
		    path += str.slice(index, offset)
		    index = offset + m.length

		    // Ignore already escaped sequences.
		    if (escaped) {
		      path += escaped[1]
		      continue
		    }

		    var next = str[index]
		    var prefix = res[2]
		    var name = res[3]
		    var capture = res[4]
		    var group = res[5]
		    var modifier = res[6]
		    var asterisk = res[7]

		    // Push the current path onto the tokens.
		    if (path) {
		      tokens.push(path)
		      path = ''
		    }

		    var partial = prefix != null && next != null && next !== prefix
		    var repeat = modifier === '+' || modifier === '*'
		    var optional = modifier === '?' || modifier === '*'
		    var delimiter = res[2] || defaultDelimiter
		    var pattern = capture || group

		    tokens.push({
		      name: name || key++,
		      prefix: prefix || '',
		      delimiter: delimiter,
		      optional: optional,
		      repeat: repeat,
		      partial: partial,
		      asterisk: !!asterisk,
		      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
		    })
		  }

		  // Match any characters still remaining.
		  if (index < str.length) {
		    path += str.substr(index)
		  }

		  // If the path exists, push it onto the end.
		  if (path) {
		    tokens.push(path)
		  }

		  return tokens
		}

		/**
		 * Compile a string to a template function for the path.
		 *
		 * @param  {string}             str
		 * @param  {Object=}            options
		 * @return {!function(Object=, Object=)}
		 */
		function compile (str, options) {
		  return tokensToFunction(parse(str, options))
		}

		/**
		 * Prettier encoding of URI path segments.
		 *
		 * @param  {string}
		 * @return {string}
		 */
		function encodeURIComponentPretty (str) {
		  return encodeURI(str).replace(/[\/?#]/g, function (c) {
		    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
		  })
		}

		/**
		 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
		 *
		 * @param  {string}
		 * @return {string}
		 */
		function encodeAsterisk (str) {
		  return encodeURI(str).replace(/[?#]/g, function (c) {
		    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
		  })
		}

		/**
		 * Expose a method for transforming tokens into the path function.
		 */
		function tokensToFunction (tokens) {
		  // Compile all the tokens into regexps.
		  var matches = new Array(tokens.length)

		  // Compile all the patterns before compilation.
		  for (var i = 0; i < tokens.length; i++) {
		    if (typeof tokens[i] === 'object') {
		      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
		    }
		  }

		  return function (obj, opts) {
		    var path = ''
		    var data = obj || {}
		    var options = opts || {}
		    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

		    for (var i = 0; i < tokens.length; i++) {
		      var token = tokens[i]

		      if (typeof token === 'string') {
		        path += token

		        continue
		      }

		      var value = data[token.name]
		      var segment

		      if (value == null) {
		        if (token.optional) {
		          // Prepend partial segment prefixes.
		          if (token.partial) {
		            path += token.prefix
		          }

		          continue
		        } else {
		          throw new TypeError('Expected "' + token.name + '" to be defined')
		        }
		      }

		      if (isarray(value)) {
		        if (!token.repeat) {
		          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
		        }

		        if (value.length === 0) {
		          if (token.optional) {
		            continue
		          } else {
		            throw new TypeError('Expected "' + token.name + '" to not be empty')
		          }
		        }

		        for (var j = 0; j < value.length; j++) {
		          segment = encode(value[j])

		          if (!matches[i].test(segment)) {
		            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
		          }

		          path += (j === 0 ? token.prefix : token.delimiter) + segment
		        }

		        continue
		      }

		      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

		      if (!matches[i].test(segment)) {
		        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
		      }

		      path += token.prefix + segment
		    }

		    return path
		  }
		}

		/**
		 * Escape a regular expression string.
		 *
		 * @param  {string} str
		 * @return {string}
		 */
		function escapeString (str) {
		  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
		}

		/**
		 * Escape the capturing group by escaping special characters and meaning.
		 *
		 * @param  {string} group
		 * @return {string}
		 */
		function escapeGroup (group) {
		  return group.replace(/([=!:$\/()])/g, '\\$1')
		}

		/**
		 * Attach the keys as a property of the regexp.
		 *
		 * @param  {!RegExp} re
		 * @param  {Array}   keys
		 * @return {!RegExp}
		 */
		function attachKeys (re, keys) {
		  re.keys = keys
		  return re
		}

		/**
		 * Get the flags for a regexp from the options.
		 *
		 * @param  {Object} options
		 * @return {string}
		 */
		function flags (options) {
		  return options.sensitive ? '' : 'i'
		}

		/**
		 * Pull out keys from a regexp.
		 *
		 * @param  {!RegExp} path
		 * @param  {!Array}  keys
		 * @return {!RegExp}
		 */
		function regexpToRegexp (path, keys) {
		  // Use a negative lookahead to match only capturing groups.
		  var groups = path.source.match(/\((?!\?)/g)

		  if (groups) {
		    for (var i = 0; i < groups.length; i++) {
		      keys.push({
		        name: i,
		        prefix: null,
		        delimiter: null,
		        optional: false,
		        repeat: false,
		        partial: false,
		        asterisk: false,
		        pattern: null
		      })
		    }
		  }

		  return attachKeys(path, keys)
		}

		/**
		 * Transform an array into a regexp.
		 *
		 * @param  {!Array}  path
		 * @param  {Array}   keys
		 * @param  {!Object} options
		 * @return {!RegExp}
		 */
		function arrayToRegexp (path, keys, options) {
		  var parts = []

		  for (var i = 0; i < path.length; i++) {
		    parts.push(pathToRegexp(path[i], keys, options).source)
		  }

		  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

		  return attachKeys(regexp, keys)
		}

		/**
		 * Create a path regexp from string input.
		 *
		 * @param  {string}  path
		 * @param  {!Array}  keys
		 * @param  {!Object} options
		 * @return {!RegExp}
		 */
		function stringToRegexp (path, keys, options) {
		  return tokensToRegExp(parse(path, options), keys, options)
		}

		/**
		 * Expose a function for taking tokens and returning a RegExp.
		 *
		 * @param  {!Array}          tokens
		 * @param  {(Array|Object)=} keys
		 * @param  {Object=}         options
		 * @return {!RegExp}
		 */
		function tokensToRegExp (tokens, keys, options) {
		  if (!isarray(keys)) {
		    options = /** @type {!Object} */ (keys || options)
		    keys = []
		  }

		  options = options || {}

		  var strict = options.strict
		  var end = options.end !== false
		  var route = ''

		  // Iterate over the tokens and create our regexp string.
		  for (var i = 0; i < tokens.length; i++) {
		    var token = tokens[i]

		    if (typeof token === 'string') {
		      route += escapeString(token)
		    } else {
		      var prefix = escapeString(token.prefix)
		      var capture = '(?:' + token.pattern + ')'

		      keys.push(token)

		      if (token.repeat) {
		        capture += '(?:' + prefix + capture + ')*'
		      }

		      if (token.optional) {
		        if (!token.partial) {
		          capture = '(?:' + prefix + '(' + capture + '))?'
		        } else {
		          capture = prefix + '(' + capture + ')?'
		        }
		      } else {
		        capture = prefix + '(' + capture + ')'
		      }

		      route += capture
		    }
		  }

		  var delimiter = escapeString(options.delimiter || '/')
		  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

		  // In non-strict mode we allow a slash at the end of match. If the path to
		  // match already ends with a slash, we remove it for consistency. The slash
		  // is valid at the end of a path match, not in the middle. This is important
		  // in non-ending mode, where "/test/" shouldn't match "/test//route".
		  if (!strict) {
		    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
		  }

		  if (end) {
		    route += '$'
		  } else {
		    // In non-ending mode, we need the capturing groups to match as much as
		    // possible by using a positive lookahead to the end or next path segment.
		    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
		  }

		  return attachKeys(new RegExp('^' + route, flags(options)), keys)
		}

		/**
		 * Normalize the given path string, returning a regular expression.
		 *
		 * An empty array can be passed in for the keys, which will hold the
		 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
		 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
		 *
		 * @param  {(string|RegExp|Array)} path
		 * @param  {(Array|Object)=}       keys
		 * @param  {Object=}               options
		 * @return {!RegExp}
		 */
		function pathToRegexp (path, keys, options) {
		  if (!isarray(keys)) {
		    options = /** @type {!Object} */ (keys || options)
		    keys = []
		  }

		  options = options || {}

		  if (path instanceof RegExp) {
		    return regexpToRegexp(path, /** @type {!Array} */ (keys))
		  }

		  if (isarray(path)) {
		    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
		  }

		  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
		}

		return pathToRegexp;
	})();

	;(function () {

	    var OmiRouter = {};

	    var parser = Parser,    // path-to-regexp.js
	        renderTo = null,    // 渲染到的dom
	        params = { },    // 参数
	        Component = null,    // 组件类
	        store = null,    // 数据存储
	        routerOption = { },    // 路由配置
	        preRenderTo = null,    // 前一个渲染到dom
	        preInstance = null;    // 前一个实例

	    OmiRouter.init = function (option) {
	        routerOption = option;    // 用户传的路由选项
	        option.routes.forEach(function (route) {    // 遍历路由配置, 给每个route路由对象添加一个reg正则属性
	            route.reg = parser(route.path);
	        });

	        Omi.extendPlugin('omi-router', function (dom, instance) {    // 给Omi.plugins 添加 omi-router 插件
	            dom.setAttribute('href', 'javascript:void(0)');

	            dom.addEventListener('click', function () {
	                hashMapping(dom.getAttribute('to'));
	            }, false);
	        });

	        var hash = window.location.hash.replace('#', '');    // URL 的锚部分（从 # 号开始的部分, 含#）, 所以把# 替换成 ''
	        hashMapping(hash ? hash : routerOption.defaultRoute, renderTo);    // hash映射 (hash为''则使用默认路径)
	        if(hash) {
	            option.root.onInstalled(function(){    // 调用实例的onInstalled方法
	                render();    // 自定义渲染函数在下面(如果有hash值就找到组件渲染一下)
	            });
	        };
	    }

	    function getParams(toArr, pathArr) {    // 获取参数, toArr路径地址匹配到的结果, pathArr路由对象匹配到的结果
	        var params = {};
	        toArr.forEach(function (item, index) {
	            if (index > 0) {
	                params[pathArr[index].replace(':','')] = item;    // 提取参数
	            };
	        });
	        return params;
	    };

	    function hashMapping(to) {    // to: 路径地址
	        routerOption.routes.every(function (route) {    // route: 路由对象
	            var toArr = to.match(route.reg);    // to匹配route.reg正则返回匹配到的结果数组
	            if (toArr) {
	                var pathArr = route.path.match(route.reg);    // route.path匹配route.reg正则返回匹配到的结果数组
	                params = getParams(toArr, pathArr);
	                renderTo = route.renderTo || routerOption.renderTo;    // 渲染到哪去(显然每个路由对象也可以有renderTo属性)
	                store = route.store || routerOption.store;    // 数据存储
	                Component = route.component;    // route的组件
	                pushState(to);
	                return false;    // 只有匹配到结果后到达这里就跳出函数啦
	            };
	            return true;    // 否则继续遍历
	        });
	    };

	    function pushState(route){    // 给url添加hash值
	        window.location.hash = route;    // 浏览器中的url就会变啦
	    };

	    window.addEventListener('hashchange', function() {    // hashchange事件, url改变就触发
	        hashMapping(window.location.hash.replace('#',''), renderTo);
	        render();
	    }, false);

	    function render(){
	        if(store){
	            store.$route = { };
	            store.$route.params = params;
	        }else{
	            store = {
	                methods:{
	                    install: function() {
	                        this.$route = { };
	                        this.$route.params = params;
	                    }
	                }
	            };
	        };
	        if(preRenderTo === renderTo&&preInstance){
	            deleteInstance(preInstance);
	        };
	        var instance = new Component();    // 组件类
	        Omi.render(instance, renderTo, {
	            store: store
	        });
	        preInstance = instance;
	        preRenderTo = renderTo;
	    };

	    function deleteInstance(instance) {    // 删除存在的实例
	        for (var key in Omi.instances) {
	            if(Omi.instances.hasOwnProperty(key)){
	                Omi.instances[key].id = instance.id;
	                delete  Omi.instances[key];
	                instance = null;
	                break;
	            };
	        };
	    };

	    OmiRouter.destroy = function () {
	        delete Omi.plugins['omi-router'];
	    };
	    
	    Omi.OmiRouter = OmiRouter;
	})();


	if(window.Omi){
	    module.exports = window.Omi
	} else {
	    window.Omi = Omi
	};

})();
