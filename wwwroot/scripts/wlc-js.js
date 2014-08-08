var wlcJS = new (function () {
	window.l = window.console.log.bind(window.console);
	window.w = window.console.warn.bind(window.console);
	window.e = window.console.error.bind(window.console);
	_l = window.console.log.bind(window.console);
	_w = window.console.warn.bind(window.console);
	_e = window.console.error.bind(window.console);
	this.domTools = new WLC_DOMTools();
	this.setNumberIfSafe = setNumberIfSafe;


	Number.prototype.format = function (in_n, in_sp) {

		// n: every Nth digi
		// sp: separator

		var n = (typeof in_n !== 'number' || Math.round(in_n) <= 0) ? in_n : 3;
		var sp = in_sp ? in_sp : ',';
		var source = this.toString();
		var result = '';


		var signPos = Math.max(0, source.indexOf('-') + 1, source.indexOf('+') + 1);
		var sign = source.slice(0, signPos);
		if (sign == '+') sign = '';

		var dotPos = source.indexOf('.');

		var str_restPart = '';
		if (dotPos === -1) {
			dotPos = source.length;
		} else {
			str_restPart = source.slice(dotPos, source.length);
		}

		if (dotPos === source.length - 1) {
			str_restPart = '.0';
			// str_restPart = '';
		}

		var str_unsignedInteger = '';
		if (dotPos === signPos) {
			str_unsignedInteger = '0';
		} else {
			str_unsignedInteger = source.slice(signPos, dotPos);
		}

		if (str_unsignedInteger === 0) sign = '';

		var uintLength = str_unsignedInteger.length;
		var firstPos = uintLength % n;
		if (firstPos === 0) firstPos = n;

		var pos1 = 0;
		var pos2 = firstPos;
		result = sign + str_unsignedInteger.slice(pos1, pos2);

		while (pos2 < uintLength) {
			pos1 = pos2;
			pos2 += n;
			result += sp + str_unsignedInteger.slice(pos1, pos2);
		}

		result += str_restPart;

		return result;
	}

	Number.prototype.padding = function (in_minDigisCount) {
		if (isNaN(in_minDigisCount)) {
			e('Invalid input for digits count: use an integer instead.');
			return false;
		}
		var _maxDigitsCount = 50;
		var minDigisCount = Math.min(_maxDigitsCount, in_minDigisCount);
		if (in_minDigisCount>_maxDigitsCount) {
			_w('Too large value for digits count: trunced to '+_maxDigitsCount+'.');
		}
		var value = Number(this);
		var absValue = Math.abs(value);
		var sign = value === absValue ? '' : '-';
		var abs = absValue.toString();
		var zerosCount = Math.max(0, minDigisCount - abs.length);
		for (var i = 0; i < zerosCount; i++) {
			abs = '0' + abs;
		}

		return sign + abs;
	}

	Array.prototype.indexOfValue = function ( value, startIndex ) {
		var _startIndex = parseInt( startIndex ) || 0;
		for (var i=_startIndex; i<this.length; i++)
			if ( this[i] === value ) return i;
		return -1;
	}


	Array.prototype.has = function () {
		return this.indexOfValue( arguments[0], 0 ) >= 0;
	}


	Array.prototype.hasAll = function () {
		var found = true;
		for (var i=0; i<arguments.length; i++) {
			found = found && this.has( arguments[i] );
			if ( !found ) break;
		}
		return found;
	}


	Array.prototype.hasAny = function () {
		var found = false;
		for (var i=0; i<arguments.length; i++) {
			found = found || this.has( arguments[i] );
			if ( found ) break;
		}
		return found;
	}


	Array.prototype.hasNo = function () {
		var found = false;
		for (var i=0; i<arguments.length; i++) {
			found = found || this.has( arguments[i] );
			if ( found ) break;
		}
		return !found;
	}


	Array.prototype.countOfValue = function () {
		var count = 0;
		for (var i=0; i<this.length; i++)
			if ( this[i] === arguments[0] )
				count++;
		return count;
	}


	Array.prototype.pushIfHasNo = function () {
		if ( this.has( arguments[0] ) ) 
			return this.indexOfValue( arguments[0], 0 );
		this.push( arguments[0] );
		return (this.length - 1);
	}

	Array.prototype.del = function ( value, startIndex ) {
		var _index = this.indexOfValue( value, startIndex );
		if ( _index >=0 ) {
			this.splice( _index, 1 );
			return true;
		}
		return false;
	}

	Array.prototype.delAll = function () {
		var deletedItemsCount = 0;
		while ( this.has( arguments[0] ) ) {
			this.del( arguments[0], 0 );
			deletedItemsCount++;
		}
		return deletedItemsCount;
	}

	Math.randomBetween = function ( in_a, in_b ) {
		var a = isNaN(Number(in_a)) ? 0 : in_a;
		var b = isNaN(Number(in_b)) ? 1 : in_b;
		return ( Math.random()*(b - a) + a);
	}

	Math.randomAround = function ( in_center, in_radius ) {
		var a = isNaN(Number(in_center)) ? 0 : in_center;
		var b = isNaN(Number(in_radius)) ? 0.5 : in_radius;
		return ( (Math.random()-0.5)*2*in_radius + in_center);
	}

	Math.remapDegreeInto_0_360 = function ( in_degree ) {
		var turns = Math.floor(in_degree / 360);
		return in_degree - 360* turns;
	}


	Object.defineProperty(String.prototype, 'E', { // E means Empty
		get: function () { return this.length === 0; }
	});

	Object.defineProperty(String.prototype, 'NE', { // NE means Not Empty
		get: function () { return this.length > 0; }
	});

	String.prototype.randomizeUrl = function (in_allowed) {
		if (!in_allowed) return String(this);
		return this + ((this.indexOf('?')>=0) ? '&' : '?') + 'wRandom=' + Math.round( Math.random() * 100000 );
	}

	function setNumberIfSafe(input, target) {
		var result = Number(input);
		if (!isNaN(result)) {
			target = result;
		}
	}

	function WLC_DOMTools() {

		window.doc = document;				// doc or window.doc
		window.qS = document.querySelector.bind(document);
		window.qSA = document.querySelectorAll.bind(document);

		window.add = _addDom;
		document.add = _addDom;

		window.isDomNode = _isDomNode;
		window.isDomElement = _isDomElement;
		window.isDom = _isDom;


		this.isDomNode = _isDomNode;
		this.isDomElement = _isDomElement;
		this.isDom = _isDom;

		function _isDomNode (o){
			// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
			// Returns true if it is a DOM node
			return (
				typeof Node === "object" ? o instanceof Node : 
				o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
			) || o === window;
		}

		function _isDomElement (o){
			// http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
			// Returns true if it is a DOM element    
			return (
				typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
			);
		}

		function _isDom (o) {
			return _isDomNode(o) || _isDomElement(o);
		}

		function _addDom ( tagName, classNames, id, uri ) {

			if (window.id(id)) {
				w('Element of id ['+id+'] already exists!');
			}

			_tagName = tagName ? tagName : 'div';

			var dom_new = null;
			switch (_tagName) {
				case 'text':
				case 'textNode':
					dom_new = document.createTextNode(arguments[1]);
					break;

				case 'comment':
					break;

				default:
					dom_new = document.createElement(_tagName);
			}

			if (id) dom_new.id = id;
			if (classNames) dom_new.className = classNames;

			if (_tagName === 'script') {
				// dom_new.type = 'text/javascript';
			}

			if (_tagName === 'link') {
				// dom_new.type = 'text/css';
				dom_new.rel = 'stylesheet';
			}

			if (uri) {
				switch (_tagName) {
					case 'script':
					case 'img':
						dom_new.src = uri;
					case 'a':
					case 'link':
					case 'css':
						dom_new.href = uri;
				}
			}

			return dom_new;
		}

		Element.prototype.qS = function (arguments) { return this.querySelector.call(this, arguments); }
		Element.prototype.qSA = function (arguments) { return this.querySelectorAll.call(this, arguments); }

		Element.prototype.take = function ( dom ) {
			this.appendChild( dom );
			return this;
		}

		Element.prototype.add = function ( tagName, classNames, id, uri ) {
			var dom_new = _addDom( tagName, classNames, id, uri )
			this.take(dom_new);
			return dom_new;
		}

		Element.prototype.die = function () {
			this.parentNode.removeChild(this);
		}

		Element.prototype.isChildOf = function (in_dom_pseudoParentNode, in_recursive) {
			var recursive = !in_recursive ? false : true;
			var isChild = false;

			var arr_dom_allChildren = in_dom_pseudoParentNode.childNodes;
			if (recursive) {
				arr_dom_allChildren = in_dom_pseudoParentNode.querySelectorAll('*');
			}

			for (var i = 0; i < arr_dom_allChildren.length; i++) {
				if (isChild = this === arr_dom_allChildren[i]) break;
			}

			return isChild;
		}

		Element.prototype.centerTo = function (options) {
			// options = {
			//		centerRef:			Object <default=document.documentElement>
			//							centerRef can ONLY be eigher one of below:
			//								1) the document.documentElement Object
			//									note:
			//										window.innerWidth includes the width of vertical scollbar, if any;
			//										body.clientHeight means the height of the entire content, include the overflowing part.
			//								2) the nearest parentNode whose position is among 'relative', 'absolute' and 'fixed'
			//
			//		alongX:				boolean <default=true>
			//		alongY:				boolean <default=true>
			//		offsetX:			Number <default=0>
			//		offsetY:			Number <default=0>
			//
			//		shrinkWhenNeeded:	boolean <default=false>
			//
			//		minMarginTop:		Number <default=10>
			//		minMarginRight:		Number <default=10>
			//		minMarginBottom:	Number <default=10>
			//		minMarginLeft:		Number <default=10>
			// };

			// Sample:
			//		document.getElementById('myElement').centerTo();
			//		// means 'myElement' center to window in both X and Y axes.

			var computedStyle = window.getComputedStyle(this, null);
			if (computedStyle.position === 'static') {
				w(this, '\nThe element is about to be centered, but it\'s "position" attribute is set to "static".' );
			}


			var _ = options || {};
			// var _defaultRef = document.documentElement;
			var _defaultRef = window;

			if (!_isDom(_.centerRef) ) {
				_.centerRef = _defaultRef;
			} else {
				if (
					_.centerRef == document.documentElement ||
					_.centerRef == document ||
					_.centerRef == document.body ||
					_.centerRef == window
				) {
					_.centerRef = _defaultRef;
				} else {
					// do nothing
				}
			}

			_.alongX = (typeof _.alongX === 'undefined') ? true : !!_.alongX;
			_.alongY = (typeof _.alongY === 'undefined') ? true : !!_.alongY;
			_.shrinkWhenNeeded = (typeof _.shrinkWhenNeeded === 'undefined') ? true : !!_.shrinkWhenNeeded;
			_.offsetX = isNaN(Number(_.offsetX)) ? 10: Number(_.offsetX);
			_.offsetY = isNaN(Number(_.offsetY)) ? 10: Number(_.offsetY);

			_.minMarginTop =	isNaN(Number(_.minMarginTop))		? 10: Number(_.minMarginTop);
			_.minMarginRight =	isNaN(Number(_.minMarginRight))		? 10: Number(_.minMarginRight);
			_.minMarginBottom =	isNaN(Number(_.minMarginBottom))	? 10: Number(_.minMarginBottom);
			_.minMarginLeft =	isNaN(Number(_.minMarginLeft))		? 10: Number(_.minMarginLeft);

			// l('_.centerRef:',_.centerRef);

			if (_.alongX) {
				var selfWidth = parseInt( computedStyle.width );
				var refWidth = _.centerRef === window ? _.centerRef.innerWidth : _.centerRef.clientWidth;
				// l('refWidth:',refWidth,'px\n','selfWidth:',selfWidth,'px\n','_.offsetX:',_.offsetX,'px\n');
				var left = undefined;

				if (_.shrinkWhenNeeded) {
					var selfPaddingHori = parseInt( computedStyle.paddingLeft ) + parseInt( computedStyle.paddingRight );
					var selfBordersHori = parseInt( computedStyle.borderLeftWidth ) + parseInt( computedStyle.borderRightWidth );
					if (typeof this.computedWidthBeforeCenterTo === 'undefined') {
						this.computedWidthBeforeCenterTo = selfWidth;
						this.computedWidthComesFromInlineDefinition = this.style.width.NE;
					} else {
						// always try to use original value
						selfWidth = this.computedWidthBeforeCenterTo;
					}

					var maxAllowedWidth = refWidth - _.minMarginLeft - _.minMarginRight - selfPaddingHori - selfBordersHori;

					if ( selfWidth>maxAllowedWidth ) { // camparing everytime this method being called, in case the container could have changed
						selfWidth = maxAllowedWidth;
						this.style.width = maxAllowedWidth + 'px';
					} else {
						// restore original settings
						if (this.computedWidthBeforeCenterTo) {
							this.style.width = this.computedWidthComesFromInlineDefinition ? this.computedWidthBeforeCenterTo+'px' : '';
						}
					}

					left = (maxAllowedWidth - selfWidth) / 2 + _.minMarginLeft + _.offsetX;
				} else {
					left = (refWidth - selfWidth) / 2 + _.offsetX;
				}

				this.style.left = left + 'px';
			}

			if (_.alongY) {
				var selfHeight = parseInt( computedStyle.height );
				var refHeight = _.centerRef === window ? _.centerRef.innerHeight : _.centerRef.clientHeight;
				// l('refHeight:',refHeight,'px\n','selfHeight:',selfHeight,'px\n','_.offsetY:',_.offsetY,'px\n');
				var top = undefined;

				if (_.shrinkWhenNeeded) {
					var selfPaddingVert = parseInt( computedStyle.paddingTop ) + parseInt( computedStyle.paddingBottom );
					var selfBordersVert = parseInt( computedStyle.borderTopWidth ) + parseInt( computedStyle.borderBottomWidth );
					if (typeof this.computedHeightBeforeCenterTo === 'undefined') {
						this.computedHeightBeforeCenterTo = selfHeight;
						this.computedHeightComesFromInlineDefinition = this.style.height.NE;
					} else {
						// always try to use original value
						selfHeight = this.computedHeightBeforeCenterTo;
					}

					var maxAllowedHeight = refHeight - _.minMarginTop - _.minMarginBottom - selfPaddingVert;

					if ( selfHeight>maxAllowedHeight ) { // camparing everytime this method being called, in case the container could have changed
						selfHeight = maxAllowedHeight;
						this.style.height = maxAllowedHeight + 'px';
					} else {
						// restore original settings
						if (this.computedHeightBeforeCenterTo) {
							this.style.height = this.computedHeightComesFromInlineDefinition ? this.computedHeightBeforeCenterTo+'px' : '';
						}
					}

					top = (maxAllowedHeight - selfHeight) / 2 + _.minMarginTop + _.offsetY;
				} else {
					top = (refHeight - selfHeight) / 2 + _.offsetY;
				}
				this.style.top = top + 'px';
			}

			return { width: selfWidth, height: selfHeight, left: left, top: top };
		}

		Object.defineProperty(Element.prototype, 'realStyle', {
			get: function () { return window.getComputedStyle(this, null); }
		});

		Object.defineProperty(Element.prototype, 'cssMatrix', {
			get: function () {
				var oStyle = this.realStyle;
				var cssMatrixString = '';
				var cssMatrix = null;

				if (cssMatrixString.E && oStyle['transform'])            cssMatrixString = oStyle['transform'];
				if (cssMatrixString.E && oStyle['-webkit-transform'])    cssMatrixString = oStyle['-webkit-transform'];
				if (cssMatrixString.E && oStyle['-moz-transform'])       cssMatrixString = oStyle['-moz-transform'];

				eval( 'var cssMatrix = [' + cssMatrixString.slice( 'matrix('.length, -1 ) + '];' );
				return cssMatrix;
			}
		});

		Object.defineProperty(Element.prototype, 'realWidth', {
			get: function () { return this.realStyle.width; }
		});

		Object.defineProperty(Element.prototype, 'realHeight', {
			get: function () { return this.realStyle.height; }
		});

		Object.defineProperty(Element.prototype, 'realLeft', {
			get: function () { return this.realStyle.left; }
		});

		Object.defineProperty(Element.prototype, 'realTop', {
			get: function () { return this.realStyle.top; }
		});

		Object.defineProperty(Element.prototype, 'real2DRotationAngle', {
			get: function () {
				var cssMatrix = this.cssMatrix;
				var angle = Math.atan2( cssMatrix[0], cssMatrix[1] )/Math.PI* -180 + 90;
				angle = angle<0 ? angle+360 : angle;
				return angle;
			}
		});



		this.decideFontSizeRem = _decideFontSizeRem;

		function _decideFontSizeRem(charsCountPerLine, minFontSizeInPixel, forceInteger) {
			var _domStyleId = 'wlc-style-root-font-size';
			var _safeValueCharsCountPerLine = 20; // 20 chars per line
			var _safeValueMinFontSizeInPixel = 12; // 12px
			var _forceInteger = (typeof forceInteger === 'undefined' || forceInteger == null) ? true : !!forceInteger;

			var _c = parseInt(charsCountPerLine) || _safeValueCharsCountPerLine;
			var _m = Number(minFontSizeInPixel) || _safeValueMinFontSizeInPixel;
			var _px = Math.max(
				_m,
				_forceInteger ? Math.floor(window.innerWidth / _c) : (window.innerWidth / _c)
			);

			if (1) {
				console.log(
					'window size:', window.innerWidth, '*', window.innerHeight,
					'\t where devicePixelRatio:', window.devicePixelRatio, '\n'+
					'chars per line:', _c, '\n'+
					'REM:', _px,'px'
				);
			}

			var _domStyle = document.getElementById(_domStyleId);
			if (!_domStyle) {
				_domStyle = document.createElement('style');
				_domStyle.id = _domStyleId;
				document.head.appendChild(_domStyle);   
			}

			_domStyle.innerHTML = 'html, body { font-size: ' + _px + 'px; }';
		}
	} // Class: WLC_DOM ()
}); // new operator
