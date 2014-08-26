var website = new WLCWebsite(wlcJS);

function WLCWebsite(wlcJS) {
	this.env = (function () {

		// wulechuan@live.com

		// 2014-07-04: Surface 2 (WinRT) *BOTH* Metro IE *AND* Desktop IE:
		//		userAgent:	Mozilla/5.0 (Windows NT 6.3; ARM; Trident/7.0; Touch; .NET4.0E; .NET4.0C; Tablet PC 2.0; rv:11.0) like Gecko
		//		platform:	Win32

		function uaHas(inString)          { return navigator.userAgent.search(inString) >= 0; }
		function uaHasNot(inString)       { return navigator.userAgent.search(inString) <  0; }
		function platformHas(inString)    { return navigator.platform.search(inString)  >= 0; }
		function platformHasNot(inString) { return navigator.platform.search(inString)  <  0; }

		if (!window.location.origin) {
			window.location.origin =
					window.location.protocol
				+	"//"
				+	window.location.hostname
				+	(window.location.port ? ':'
				+	window.location.port: '');
		}


		var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
		var screenMappedPixelX = screen.width;
		var screenMappedPixelY = screen.height;
		var screenPhysicalPixelX = Math.round( screenMappedPixelX * pixelRatio );
		var screenPhysicalPixelY = Math.round( screenMappedPixelY * pixelRatio );


		var isHighResolutionVirtualScreen =
			screenMappedPixelX >= 1360 && screenMappedPixelY >= 768
		 || screenMappedPixelX >= 768  && screenMappedPixelY >= 1360;

		var isHighResolutionPhysicalScreen =
			screenPhysicalPixelX >= 1360 && screenPhysicalPixelY >= 768
		 || screenPhysicalPixelX >= 768  && screenPhysicalPixelY >= 1360;



		var isWindowsPhoneSimuDesktop = uaHas('WPDesktop');

		var isWindowsPhone7x =
			uaHas('Windows Phone OS 7.') || uaHas('ZuneWP7')
		 || isWindowsPhoneSimuDesktop && uaHasNot('Windows NT');

		var isWindowsPhone8x =
			uaHas('Windows Phone 8.')
		 || isWindowsPhoneSimuDesktop && uaHas('Windows NT 6');

		var isWindowsPhone = isWindowsPhone7x || isWindowsPhone8x || isWindowsPhoneSimuDesktop;

		// to be tested
		var isWindowsRT = uaHas('Windows NT') && uaHas('ARM;') && !isWindowsPhoneSimuDesktop;

		var isWindows = uaHas('Windows') || isWindowsPhone7x;
		var isWindowsTouch = uaHas('Touch') && isWindows;

		// http://www.enterpriseios.com/wiki/UserAgent
		var isIpod = uaHas('iPod');
		var isIphone = uaHas('iPhone');
		var isIpad = uaHas('iPad');
		var isIOS = isIpod || isIphone || isIpad || uaHas('like Mac OS X;');
		var isMacOSX = uaHas('Mac OS X;') && !isIOS;

		// isAndroid *NOT* always correct
		var isAndroid = uaHas('Android') || platformHas('Linux arm');



		// http://msdn.microsoft.com/zh-CN/library/ms537503.aspx
		var isIE6 =  uaHas('MSIE 6.');
		var isIE7 =  uaHas('MSIE 7.');
		var isIE8 =  uaHas('MSIE 8.');
		var isIE9 =  uaHas('MSIE 9.');
		var isIE10 = uaHas('MSIE 10.');
		var isIE11 = uaHas('rv:11.');// || uaHas('Trident/7.0');
		
		var isIE8OrOlder = isIE8 || isIE7 || isIE6;
		var isIE11orLater = isIE11;

		var isEngineTrident = uaHas('Trident');
		var isIE = isEngineTrident;// || isIE6 || isIE7 || isIE8 || isIE9 || isIE10 || isIE11;
		
		var isFirefox = uaHas('Firefox');
		var isEngineGecko = uaHas('Gecko') && uaHasNot('ike Gecko') && isFirefox;

		var isEngineWebkit = uaHas('AppleWebKit');
		var isChrome = uaHas('Chrome\/');
		// var isAndroidDefault = isAndroid && !isChrome;
		var isSafari = uaHas('Safari') && !isChrome && !isAndroid;

		var isEnginePresto = uaHas('Presto');
		var isOldOpera = uaHas('Opera');
		var isNewOpera = isEngineWebkit && uaHas('OPR/');
		var isOperaNext = isNewOpera && uaHas('Edition Next');
		var isOpera = isOldOpera || isNewOpera;

		var isInTouchMode =
			isWindowsTouch || isWindowsPhone || isWindowsRT ||
			isAndroid || isIpad || isIphone;

		var isDesktopUA =
			isHighResolutionVirtualScreen ||
			isWindowsPhoneSimuDesktop ||
			uaHas('WOW64') ||
			isMacOSX ||
			(!isWindowsPhone && !isAndroid && !isIphone);

		return {
			screen: {
				pixelRatio:		pixelRatio,
				mappedPixelX:	screenMappedPixelX,
				mappedPixelY:	screenMappedPixelY,
				physicalPixelX:	screenPhysicalPixelX,
				physicalPixelY:	screenPhysicalPixelY
			},
			os: {
				windows: 		isWindows,
				windowsPhone: 	isWindowsPhone,
				wp: 			isWindowsPhone,
				windowsPhone7: 	isWindowsPhone7x,
				wp7: 			isWindowsPhone7x,
				windowsPhone8: 	isWindowsPhone8x,
				wp8: 			isWindowsPhone8x,
				windowsRT: 		isWindowsRT,
				ios: 			isIOS,
				osx: 			isMacOSX,
				android: 		isAndroid,
				chromeOS: 		null,
				linux:			null // so-called traditional linux
			},
			ua: {
				ie:				isIE,
				ie6:			isIE6,
				ie7:			isIE7,
				ie8:			isIE8,
				ie8OrOlder:		isIE8OrOlder,
				ie9:			isIE9,
				ie10:			isIE10,
				ieMorden:		isIE11orLater,
				chrome:			isChrome,
				safari:			isSafari,
				opera:			isOpera,
				operaOld:		isOldOpera,
				operaNew:		isNewOpera,
				firefox:		isFirefox
			},
			engine: {
				trident:		isEngineTrident,
				webkit:			isEngineWebkit,
				presto:			isEnginePresto,
				gecko:			isEngineGecko
			},
			mode: {
				touch:			isInTouchMode,
				desktop:		isDesktopUA
			},
			device: {
				windowsPhone:	isWindowsPhone,
				wp:				isWindowsPhone,
				windowsRT:		isWindowsRT,
				ipod:			isIpod,
				ipad:			isIpad,
				iphone:			isIphone
			}
		};
	})();

	this.decideFontSizeRem = function(charsCountPerLine, minFontSizeInPixel, forceInteger) {
		if (this.env.ua.ie8OrOlder) {
			return false;
		}

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

	String.prototype.uriRandomized = function (allowed) {
		if (!allowed) return String(this);
		return this + ((this.indexOf('?')>=0) ? '&' : '?') + 'wlcRandom=' + Math.round( Math.random() * 100000 );
	}


	this.popupWindowsService = new (function () {

		var _popupWindowsService = this;

		this.rootElement = null;
		this.backplate = null;
		this.backplateIsShown = false;
		this.windows = [];
		this.shownWindows = [];

		this.PopupWindow = PopupWindow; // a CLASS

		this.options = {
			backplateShowingDuration: 333,
			backplateHidingDuration: 333
		}


		_tryCreatingPopupWindowsContainer = function () {
			if (!this.rootElement) {
				this.rootElement = document.querySelector('#popup-windows-container');
			}
			if (!this.rootElement) {
				this.rootElement = document.createElement('section');
				this.rootElement.id = 'popup-windows-container';
				document.body.appendChild(this.rootElement);
			}
		}

		_tryCreatingBackplate = function (){
			_tryCreatingPopupWindowsContainer.call(this);

			if (!this.backplate) {
				this.backplate = document.querySelector('#backplate');
			}
			if (!this.backplate) {
				this.backplate = document.createElement('div');
				this.backplate.id = 'backplate';
				this.backplate.style.display = 'none';

				var firstChild = this.rootElement.firstChild;
				if (firstChild) {
					this.rootElement.insertBefore(this.backplate, firstChild);
				} else {
					this.rootElement.appendChild(this.backplate);
				}
			}
		}

		this.createWindow = function(rootElement, options) {
			_tryCreatingBackplate.call(this);
			return new this.PopupWindow(rootElement, options);
		}

		this.showBackplate = function() {
			if (!this.backplateIsShown) {
				this.backplate.show(this.options.backplateShowingDuration);
				this.backplateIsShown = true;
			}
		}

		this.hideBackplate = function() {
			if (this.backplateIsShown) {
				this.backplate.hide(this.options.backplateHidingDuration);
				this.backplateIsShown = false;
			}
		}

		this.prepareShowingPopupWindow = function(popupWindow, showBackplate) {
			if (!this.shownWindows.has(popupWindow)) {
				this.shownWindows.push(popupWindow);
			}
			if (showBackplate) {
				this.showBackplate();
			}
		}

		this.prepareHidingPopupWindow = function(popupWindow) {
			this.shownWindows.del(popupWindow);
			this.hideBackplate();
		}


		function PopupWindow(rootElement, options) {
			// options = {
			//		centered:				boolean		<default=true>
			//		centerRef:				can be any of:
			//									the document.documentElement Object
			//								or  the document Object,		which will be remapped to document.documentElement
			//								or  the window Object,			which will be remapped to document.documentElement
			//								or  the document.body Object,	which will be remapped to document.documentElement
			//								or	the parentNode Object
			//								or	String 'parent'
			//								or	String 'parentNode'
			//								<default=document.documentElement>
			//
			//		offsetX:				Number		<default=0, unit=px>, ONLY takes effects when centered is true
			//		offsetY:				Number		<default=0, unit=px>, ONLY takes effects when centered is true
			//
			//		showingDuration:		Number		<default=333, unit=ms>
			//		hidingDuration:	 		Number		<default=333, unit=ms>
			//
			//		autoHide:				boolean		<default=false>
			//		autoHideDelayDuration:	Number		<default=1500, unit=ms>, ONLY takes effects when autoHide is true
			//
			//		showBackplate:			boolean		<default=true>, could be OVERRIDED by argument of show() method, if that argument is provided.
			//
			//		showButtons:			[ array of elements ]
			//		hideButtons:			[ array of elements ]
			//		toggleButtons:			[ array of elements ]
			//
			//		minMarginTop:			Number <default=10>
			//		minMarginRight:			Number <default=10>
			//		minMarginBottom:		Number <default=10>
			//		minMarginLeft:			Number <default=10>
				// }

			// this.buttonsWhoShowMe		is the getter that does same as			this.options.showButtons
			// this.buttonsWhoHideMe		is the getter that does same as			this.options.hideButtons
			// this.buttonsWhoToggleMe		is the getter that does same as			this.options.toggleButtons

			this.logName = 'popupwindow "#"';
			this.rootElement = undefined;
			this.isShown = false;

			this.options = {
				centered: true,
				centerRef: window,
				offsetX: 0,
				offsetY: 0,

				minMarginTop: 10,
				minMarginRight: 10,
				minMarginBottom: 10,
				minMarginLeft: 10,
					
				showingDuration: 333,
				hidingDuration: 333,

				autoHide: false,
				autoHideDelayDuration: 1500,

				showBackplate: true,

				showButtons: [],
				hideButtons: [],
				toggleButtons: []
			};

			this.config = function (options, _allowWarning) { _config.call(this, options, _allowWarning); }
			this.updateContent = function (innerHTML) { this.rootElement.innerHTML = innerHTML; _refresh.call(this); }
			this.addShowButtons = function (elementsArray, _allowWarning) { return _addButtonsToArray.call(this, elementsArray, this.options.showButtons, _allowWarning); }
			this.addHideButtons = function (elementsArray, _allowWarning) { return _addButtonsToArray.call(this, elementsArray, this.options.hideButtons, _allowWarning); }
			this.addToggleButtons = function (elementsArray, _allowWarning) { return _addButtonsToArray.call(this, elementsArray, this.options.toggleButtons, _allowWarning); }
			this.removeShowButtons = function (elementsArray) { return _removeButtonsFromArray.call(this, elementsArray, this.options.showButtons); }
			this.removeHideButtons = function (elementsArray) { return _removeButtonsFromArray.call(this, elementsArray, this.options.hideButtons); }
			this.removeToggleButtons = function (elementsArray) { return _removeButtonsFromArray.call(this, elementsArray, this.options.toggleButtons); }
			this.clearShowButtons = function () { _clearButtonsInArray.call(this, 'showButtons'); }
			this.clearHideButtons = function () { _clearButtonsInArray.call(this, 'hideButtons'); }
			this.clearToggleButtons = function () { _clearButtonsInArray.call(this, 'toggleButtons'); }

			this.show = function (options) { _show.call(this, options); }
			this.hide = function () { _hide.call(this); }
			this.toggle = function () { _toggle.call(this); }
			this.onshow = function () { /*l('This is', this.logName, 'I\'m coming.');*/ }
			this.onhide = function () { /*l('This is', this.logName, 'I\'m leaving.');*/ }
			this.refresh = function () {
				// not implemented yet
				// to be overrided
				// l('Refreshing '+this.logName+' content. This is the default method.');
			}



			function _setRootElement(rootElement) {
				if (!wlcJS.domTools.isDom(rootElement)) {
					e('Invalid element for the rootElement of a {popupWindow} object.');
					return;
				}
				this.rootElement = rootElement;
				this.logName = 'popupwindow "'+this.rootElement.id+'"';
			}

			function _config(options, _allowWarning) {

				var _ = options || {};
				var _o = this.options;
				_allowWarning = (typeof _allowWarning === 'undefined') || !!_allowWarning;

				if (typeof _.centered != 'undefined') { _o.centered = !!_.centered; }
				if (typeof _.autoHide != 'undefined') { _o.autoHide = !!_.autoHide; }
				if (typeof _.showBackplate != 'undefined') {
					_o.showBackplate = !!_.showBackplate;
				} else {
					_o.showBackplate = !_o.autoHide;
				}

				if (!isNaN(Number(_.offsetX))) { _o.offsetX = Number(_.offsetX); }
				if (!isNaN(Number(_.offsetY))) { _o.offsetY = Number(_.offsetY); }
				if (!isNaN(Number(_.minMarginTop))) { _o.minMarginTop = Number(_.minMarginTop); }
				if (!isNaN(Number(_.minMarginRight))) { _o.minMarginRight = Number(_.minMarginRight); }
				if (!isNaN(Number(_.minMarginBottom))) { _o.minMarginBottom = Number(_.minMarginBottom); }
				if (!isNaN(Number(_.minMarginLeft))) { _o.minMarginLeft = Number(_.minMarginLeft); }
				if (!isNaN(Number(_.showingDuration))) { _o.showingDuration = Number(_.showingDuration); }
				if (!isNaN(Number(_.hidingDuration))) { _o.hidingDuration = Number(_.hidingDuration); }
				if (!isNaN(Number(_.autoHideDelayDuration))) { _o.autoHideDelayDuration = Number(_.autoHideDelayDuration); }

				if (
					_.centerRef && (
						_.centerRef == document.documentElement ||
						_.centerRef == document ||
						_.centerRef == document.body ||
						_.centerRef == window ||
						_.centerRef == this.rootElement.parentNode ||
						_.centerRef.toLowerCase() === 'parent' ||
						_.centerRef.toLowerCase() === 'parentnode'
					)
				) {

					_o.centerRef = _.centerRef;

					if (_.centerRef == document.documentElement ||
						_.centerRef == document ||
						_.centerRef == document.body ||
						_.centerRef == window
					) {
						_.centerRef = document.documentElement;
					}

					if (_o.centerRef === 'parent' || _o.centerRef === 'parentnode') {
						_o.centerRef = this.rootElement.parentnode;
					}
				}

				if (Array.isArray(_.showButtons)) {
					this.clearShowButtons();
					this.addShowButtons(_.showButtons, _allowWarning);
				}
				if (Array.isArray(_.hideButtons)) {
					this.clearHideButtons();
					this.addHideButtons(_.hideButtons, _allowWarning);
				}
				if (Array.isArray(_.toggleButtons)) {
					this.clearToggleButtons();
					this.addToggleButtons(_.toggleButtons, _allowWarning);
				}


				if (typeof _.onshow === 'function') this.onshow = _.onshow;
				if (typeof _.onhide === 'function') this.onhide = _.onhide;

				if (_allowWarning && this.options.hideButtons.length === 0 && this.options.toggleButtons.length === 0 && !this.options.autoHide) {
					w(this.logName+':\n\tIt has neither hide button nor toggle button.\n\tBeing a NON auto-hide window, it could never be closed interatively.\n\tAlthough it can still be closed programmatically.\n')
				}

				_refresh.call(this);
			}



			function _clearButtonsInArray(arrayName) {
				var a = this.options[arrayName];
				var oldLength = a.length;
				
				if (a===this.options.showButtons) _detachAllShowButtons.call(this);
				if (a===this.options.hideButtons) _detachAllHideButtons.call(this);
				if (a===this.options.toggleButtons) _detachAllToggleButtons.call(this);

				a = [];
				if (oldLength > 0) {
					w('The array "'+arrayName+'" of '+this.logName+' has been cleared! From now on, there is nothing inside this array.');
				}
			}

			function _addButtonsToArray(elementOrArrayToAdd, targetArray, _allowWarning) {
				var addedElements = [];
				_allowWarning = (typeof _allowWarning === 'undefined') || !!_allowWarning;

				if ( typeof elementOrArrayToAdd === 'undefined' || elementOrArrayToAdd === null ) {
					return addedElements;
				}

				var elementsArray = undefined;
				if (Array.isArray(elementOrArrayToAdd)) {
					elementsArray = elementOrArrayToAdd;
				} else {
					elementsArray = [];
					elementsArray.push(elementOrArrayToAdd);
				}

				var targetArrayName = '';
				if (targetArray===this.options.showButtons) targetArrayName = '"showButtons"';
				if (targetArray===this.options.hideButtons) targetArrayName = '"hideButtons"';
				if (targetArray===this.options.toggleButtons) targetArrayName = '"toggleButtons"';

				for (var i = 0; i < elementsArray.length; i++) {
					var element = elementsArray[i];
					if ( wlcJS.domTools.isDom(element) ) {
						var elementAlreadyInOneOfTheArrays = false;
						var elementAlreadyInArrayName = '';

						if (this.options.showButtons.has(element)) {
							elementAlreadyInOneOfTheArrays = true;
							elementAlreadyInArrayName = 'showButtons';
						}

						if (this.options.hideButtons.has(element)) {
							elementAlreadyInOneOfTheArrays = true;
							elementAlreadyInArrayName = 'hideButtons';
						}

						if (this.options.toggleButtons.has(element)) {
							elementAlreadyInOneOfTheArrays = true;
							elementAlreadyInArrayName = 'toggleButtons';
						}

						if (!elementAlreadyInOneOfTheArrays) {
							l(this.logName+': adding ', element, 'to', targetArrayName);
							targetArray.push( element );
							addedElements.push( element );
						} else {
							if (_allowWarning) {
								w( 'Element already in array "'+elementAlreadyInArrayName+'". Ignored.\nThe element metioned is', element, '\n');
							}
						}
					} else {
						if (_allowWarning) {
							w( 'Invalid element is met when trying to add buttons to '+targetArrayName+' for '+this.logName+'. Ignored.\nThe element metioned is', element, '\n');
						}
						continue;
					}
				};

				if (targetArray===this.options.showButtons) {
					_wireUpShowButtons.call(this, addedElements);
				}

				if (targetArray===this.options.hideButtons) {
					_wireUpHideButtons.call(this, addedElements);
				}

				if (targetArray===this.options.toggleButtons) {
					_wireUpToggleButtons.call(this, addedElements);
				}

				return addedElements;
			}

			function _removeButtonsFromArray(elementOrArrayToAdd, targetArray) {
				var removedElements = [];

				if ( typeof elementOrArrayToAdd === 'undefined' || elementOrArrayToAdd === null ) {
					return removedElements;
				}

				if (Array.isArray(elementOrArrayToAdd)) {
					var elementsArray = elementOrArrayToAdd;
				} else {
					var elementsArray = [].push(elementOrArrayToAdd);
				}
				l('_removeButtonsFromArray();');

				for (var i = 0; i < elementsArray.length; i++) {
					var element = elementsArray[ i ];
					if ( wlcJS.domTools.isDom(element) ) {
						if (targetArray===this.options.showButtons) _detachOneShowButton.call(this,element);
						if (targetArray===this.options.hideButtons) _detachOneHideButton.call(this,element);
						if (targetArray===this.options.toggleButtons) _detachOneToggleButton.call(this,element);
						targetArray.del(element);
						removedElements.push(element);
					} else {
						w( 'Invalid element met when trying to remove buttons for '+this.logName+'. Ignored.' );
						continue;
					}
				};
				return removedElements;
			}



			function _wireUpShowButtons(elementsArray) {
				for (var i = 0; i < elementsArray.length; i++) {
					var element = elementsArray[i];
					var thePopupWindow = this;

					$(element).on('click'+'.showPopupWindow-'+thePopupWindow.rootElement.id,
						function (e) {
							e.preventDefault();
							e.stopPropagation();
							thePopupWindow.show();
						}
					);
				};
			}

			function _wireUpHideButtons(elementsArray) {
				for (var i = 0; i < elementsArray.length; i++) {
					var element = elementsArray[i];
					var thePopupWindow = this;

					$(element).on('click'+'.hidePopupWindow-'+thePopupWindow.rootElement.id,
						function (e) {
							e.preventDefault();
							e.stopPropagation();
							thePopupWindow.hide();
						}
					);
				};
			}

			function _wireUpToggleButtons(elementsArray) {
				for (var i = 0; i < elementsArray.length; i++) {
					var element = elementsArray[i];
					var thePopupWindow = this;

					$(element).on('click'+'.togglePopupWindow-'+thePopupWindow.rootElement.id,
						function (e) {
							e.preventDefault();
							e.stopPropagation();
							thePopupWindow.toggle();
						}
					);
				};
			}



			function _detachOneShowButton(showButton) {
				$(showButton).off('click'+'.showPopupWindow-'+this.rootElement.id);
			}

			function _detachOneHideButton(hideButton) {
				$(hideButton).off('click'+'.hidePopupWindow-'+this.rootElement.id);
			}

			function _detachOneToggleButton(toggleButton) {
				$(toggleButton).off('click'+'.togglePopupWindow-'+this.rootElement.id);
			}

			function _detachAllShowButtons() {
				for (var i = 0; i < this.options.showButtons.length; i++) {
					_detachOneShowButton.call(this, this.options.showButtons[i]);
				};
			}

			function _detachAllHideButtons() {
				for (var i = 0; i < this.options.hideButtons.length; i++) {
					_detachOneHideButton.call(this, this.options.hideButtons[i]);
				};
			}

			function _detachAllToggleButtons() {
				for (var i = 0; i < this.options.toggleButtons.length; i++) {
					_detachOneToggleButton.call(this, this.options.toggleButtons[i]);
				};
			}



			function _show(options) {
				if (this.isShown) {
					// l(this.logName+' has already been opened. Skipped.');
					return false;
				}
				this.isShown = true;

				var _ = options || {};
				_.showBackplate = (typeof _.showBackplate  === 'undefined') ? this.options.showBackplate : _.showBackplate;
				// if (typeof _.onShow === 'function') {
				// 	_.onshow.call(this);
				// }

				this.onshow();
				_popupWindowsService.prepareShowingPopupWindow(this, _.showBackplate);

				this.rootElement.show(this.options.showingDuration);

				if (this.options.centered) {
					this.rootElement.centerTo({
						centerRef:			this.options.centerRef,
						offsetX:			this.options.offsetX,
						offsetY:			this.options.offsetY,
						minMarginTop:		this.options.minMarginTop,
						minMarginRight:		this.options.minMarginRight,
						minMarginBottom:	this.options.minMarginBottom,
						minMarginLeft:		this.options.minMarginLeft
					});
				}
				// l(this.logName+'this.options.autoHide:', this.options.autoHide, '\nthis.options:', this.options)
				if (this.options.autoHide) {
					var thisPopupWindow = this;
					var _duration = this.options.autoHideDelayDuration + this.options.showingDuration;
					l(this.logName+' will close automatically in about '+Math.round(_duration/1000)+' seconds.');
					window.setTimeout(function () {
						thisPopupWindow.hide();
					}, _duration);
				}
			}

			function _hide() {
				if (!this.isShown) {
					// l(this.logName+' has already been closed. Skipped.');
					return false;
				}
				this.isShown = false;

				if (typeof this.onhide === 'function') this.onhide();

				_popupWindowsService.prepareHidingPopupWindow(this);
				this.rootElement.hide(this.options.hidingDuration);
			}

			function _toggle() {
				if (this.isShown) {
					this.hide();
				} else {
					this.show();
				}
			}


			function _refresh() { if (this.isShown) this.refresh(); }



			Object.defineProperty(this, 'buttonsWhoShowMe', {
				get: function () { return this.options.showButtons; }
			});

			Object.defineProperty(this, 'buttonsWhoHideMe', {
				get: function () { return this.options.hideButtons; }
			});

			Object.defineProperty(this, 'buttonsWhoToggleMe', {
				get: function () { return this.options.toggleButtons; }
			});



			_setRootElement.call(this, rootElement);

			if (this.rootElement) {
				this.rootElement.style.display = 'none';
				// this.hide(); // will cause fadingOut if jQuery or Zepto presents.
				this.config(options, false);

				l(this.logName+':\n\tJust for conveniences, construcor is now automatically searching all possible hide-buttons:');
				this.addHideButtons([
					this.rootElement.qS('.button-x'),
					this.rootElement.qS('.button-ok'),
					this.rootElement.qS('.button-confirm'),
					this.rootElement.qS('.button-yes')
				], false);
				_popupWindowsService.windows.push(this);
			}

			return true;
		} // CLASS:PopupWindow
	});

	this.WLCFlipoverModule = WLCFlipoverModule;


	function WLCFlipoverModule(rootElement, initOptions) {

		if (!wlcJS.domTools.isDom(rootElement)) {
			e('Invalid element for the rootElement of a {popupWindow} object.');
			return undefined;
		}

		var _thisFlipoverModule = {
			logName: 'flipover "'+rootElement.id+'"',
			rootElement: rootElement,
			sidesElements: [],

			lastSideId: 0,
			currentSideId: 0,
			comingSideId: 0,

			lastSide: undefined,
			currentSide: undefined,
			comingSide: undefined,

			nextButtons: [],
			prevButtons: [],
			toggleButtons: [],

			playReversedAnimationOnGoingNext: false,
			lastAnimationWasReversed: true,

			endedAnimationsCount: 0,

			config: function (options, allowWarning) { _config.call(this, options, allowWarning); },

			addPrevButtons: function (elementsArray, allowWarning) {
				return _addButtonsToArray.call(this, elementsArray, 'prevButtons', allowWarning);
			},
			addNextButtons: function (elementsArray, allowWarning) {
				return _addButtonsToArray.call(this, elementsArray, 'nextButtons', allowWarning);
			},
			addToggleButtons: function (elementsArray, allowWarning) {
				return _addButtonsToArray.call(this, elementsArray, 'toggleButtons', allowWarning);
			},
			removePrevButtons: function (elementsArray) {
				return _removeButtonsFromArray.call(this, elementsArray, 'prevButtons');
			},
			removeNextButtons: function (elementsArray) {
				return _removeButtonsFromArray.call(this, elementsArray, 'nextButtons');
			},
			removeToggleButtons: function (elementsArray) {
				return _removeButtonsFromArray.call(this, elementsArray, 'toggleButtons');
			},
			clearPrevButtons: function () { _clearButtonsInArray.call(this, 'prevButtons'); },
			clearNextButtons: function () { _clearButtonsInArray.call(this, 'nextButtons'); },
			clearToggleButtons: function () { _clearButtonsInArray.call(this, 'toggleButtons'); },

			prev: function () {
				_flipAllSidesElements.call(this, !this.playReversedAnimationOnGoingNext);
			},
			next: function () {
				_flipAllSidesElements.call(this, this.playReversedAnimationOnGoingNext);
			},
			toggle: function () {
				_flipAllSidesElements.call(this, !this.lastAnimationWasReversed);
			},

			onprevstart:	function ()			{ /*l('on prev start',	this.currentSideId);*/ },
			onprevend:		function (event)	{ /*l('on prev end',		this.currentSideId);*/ },

			onnextstart:	function ()			{ /*l('on next start',	this.currentSideId);*/ },
			onnextend:		function (event)	{ /*l('on next end',		this.currentSideId);*/ },

			onflipstart:	function () 		{ /*l('on flip start',	this.currentSideId);*/ },
			onflipend:		function (event)	{ /*l('on flip end',		this.currentSideId);*/ }
		};

	
		return (function () { // initialize
			this.rootElement.setAttribute('wa-flipover-root', '');
			this.sidesElements = Array.prototype.slice.apply(
				this.rootElement.querySelectorAll('[wa-flipover-side]')
			);

			if (this.sidesElements.length < 2) return undefined;

			this.currentSide = this.sidesElements[0];

			Object.defineProperty(this, 'buttonsWhoGoPrev', {
				get: function () { return this.prevButtons; }
			});

			Object.defineProperty(this, 'buttonsWhoGoNext', {
				get: function () { return this.nextButtons; }
			});

			Object.defineProperty(this, 'buttonsWhoToggleMe', {
				get: function () { return this.toggleButtons; }
			});

			this.config(initOptions, false);

			this.sidesElements.forEach(function (element, i, allElements) {
				var _sideId = parseInt(element.getAttribute('wa-flipover-side'));

				var eventName = !!element.webkitAnimationEnd ? 'webkitAnimationEnd' : 'webkitAnimationEnd';
				element.addEventListener(eventName, _onAnyAnimationEnd.bind(_thisFlipoverModule));

				if (isNaN(_sideId)) {
					_sideId = i;
					element.setAttribute('wa-flipover-side', String(i));
				}

				if (_sideId!==_thisFlipoverModule.currentSideId) {
					element.setAttribute('wa-flipover-shown', 'no');
					element.style.display = 'none';
				} else {
					element.setAttribute('wa-flipover-shown', 'yes');
					// element.style.display = '';
					element.className = 'flipover-forwards-to-show-front-face';
				}
			});

			return this;
		}).apply(_thisFlipoverModule);







		function _config(options, allowWarning) {
			var _ = options || {};
			allowWarning = (typeof allowWarning === 'undefined') || !!allowWarning;

			// this.clearPrevButtons();
			// this.clearNextButtons();
			// this.clearToggleButtons();
			this.addPrevButtons(_.prevButtons, allowWarning);
			this.addNextButtons(_.nextButtons, allowWarning);
			this.addToggleButtons(_.toggleButtons, allowWarning);

			if (_.hasOwnProperty('reverseOnGoingNext'))
				this.playReversedAnimationOnGoingNext = !!_.reverseOnGoingNext;

			if (_.hasOwnProperty('currentSideId')) {
				_.currentSideId = parseInt(_.currentSideId);
				if (!isNaN(_.currentSideId) && _.currentSideId >=0 && _.currentSideId < this.sidesElements.length) {
					this.currentSideId = _.currentSideId;
				}
			}

			if (typeof _.onprevstart	=== 'function') this.onprevstart	= _.onprevstart;
			if (typeof _.onprevend		=== 'function') this.onprevend		= _.onprevend;

			if (typeof _.onnextstart	=== 'function') this.onnextstart	= _.onnextstart;
			if (typeof _.onnextend		=== 'function') this.onnextend		= _.onnextend;

			if (typeof _.onflipstart	=== 'function') this.onflipstart	= _.onflipstart;
			if (typeof _.onflipend		=== 'function') this.onflipend		= _.onflipend;

			if (allowWarning && this.nextButtons.length === 0 && this.toggleButtons.length === 0 && !this.options.autoHide) {
				w(this.logName+':\n\tIt hasn\'t any prev buttons, or next buttons, or toggle buttons.\n\tBeing a NON auto-flipping module, it could never be flipped interatively.\n\tAlthough it can still flip programmatically.\n');
			}
		}



		function _clearButtonsInArray(arrayName) {
			var a = this[arrayName];
			var oldLength = a.length;
			
			if (a===this.prevButtons) _detachAllPrevButtons.call(this);
			if (a===this.nextButtons) _detachAllNextButtons.call(this);
			if (a===this.toggleButtons) _detachAllToggleButtons.call(this);

			a = [];
			if (oldLength > 0) {
				w('The array "'+arrayName+'" of '+this.logName+' has been cleared! From now on, there is nothing inside this array.');
			}
		}

		function _addButtonsToArray(elementsArray, targetArrayName, allowWarning) {
			var _addedElements = [];
			if ( typeof elementsArray !== 'object' ) return _addedElements;

			elementsArray = wlcJS.arraylize(elementsArray);
			allowWarning = (typeof allowWarning === 'undefined') || !!allowWarning;

			var _allPossibleArrayNames = [
				'prevButtons',
				'nextButtons',
				'toggleButtons'
			];

			var _targetArray = this[targetArrayName];
			targetArrayName = '"'+targetArrayName+'"';

			for (var i = 0; i < elementsArray.length; i++) {
				var element = elementsArray[i];
				if ( wlcJS.domTools.isDom(element) ) {
					var _alreadyInOneOfTheArrays = false;
					var _containingArrayName = '';

					for (var j = 0; j < _allPossibleArrayNames.length; j++) {
						var _arrayName = _allPossibleArrayNames[j];
						var _array = this[_arrayName];
						if (_array.has(element)) {
							_alreadyInOneOfTheArrays = true;
							_containingArrayName = '"'+_arrayName+'"';
							break;
						}
					};

					if (!_alreadyInOneOfTheArrays) {
						l(this.logName+': adding ', element, 'to', targetArrayName);
						_targetArray.push( element );
						_addedElements.push( element );
					} else {
						if (allowWarning) {
							w(
								 'Element already in array '+_containingArrayName+'. Ignored.'
								+'\nThe element metioned is', element, '\n'
							);
						}
					}
				} else {
					if (allowWarning) {
						w(
							 'Invalid element is met when trying to add buttons to '
							+targetArrayName+' for '+this.logName+'. Ignored.'
							+'\nThe element metioned is', element, '\n'
						);
					}
					continue;
				}
			};

			if (_targetArray===this.prevButtons) {
				_wireUpPrevButtons.call(this, _addedElements);
			}

			if (_targetArray===this.nextButtons) {
				_wireUpNextButtons.call(this, _addedElements);
			}

			if (_targetArray===this.toggleButtons) {
				_wireUpToggleButtons.call(this, _addedElements);
			}

			return _addedElements;
		}

		function _removeButtonsFromArray(elementsArray, targetArray) {
			var removedElements = [];

			if ( typeof elementsArray === 'undefined' || elementsArray === null ) {
				return removedElements;
			}

			elementsArray = wlcJS.arraylize(elementsArray);

			for (var i = 0; i < elementsArray.length; i++) {
				var element = elementsArray[ i ];
				if ( wlcJS.domTools.isDom(element) ) {
					if (targetArray===this.prevButtons) _detachOnePrevButton.call(this,element);
					if (targetArray===this.nextButtons) _detachOneNextButton.call(this,element);
					if (targetArray===this.toggleButtons) _detachOneToggleButton.call(this,element);
					targetArray.del(element);
					removedElements.push(element);
				} else {
					w( 'Invalid element met when trying to remove buttons for '+this.logName+'. Ignored.' );
					continue;
				}
			};
			return removedElements;
		}



		function _wireUpPrevButtons(elementsArray) {
			for (var i = 0; i < elementsArray.length; i++) {
				var element = elementsArray[i];

				$(element).on('click'+'.go-prev-of-flipover-'+_thisFlipoverModule.rootElement.id,
					function (e) {
						e.preventDefault();
						e.stopPropagation();
						_thisFlipoverModule.prev();
					}
				);
			};
		}

		function _wireUpNextButtons(elementsArray) {
			for (var i = 0; i < elementsArray.length; i++) {
				var element = elementsArray[i];

				$(element).on('click'+'.go-next-of-flipover-'+_thisFlipoverModule.rootElement.id,
					function (e) {
						e.preventDefault();
						e.stopPropagation();
						_thisFlipoverModule.next();
					}
				);
			};
		}

		function _wireUpToggleButtons(elementsArray) {
			for (var i = 0; i < elementsArray.length; i++) {
				var element = elementsArray[i];

				$(element).on('click'+'.toggle-flipover-'+_thisFlipoverModule.rootElement.id,
					function (e) {
						e.preventDefault();
						e.stopPropagation();
						_thisFlipoverModule.toggle();
					}
				);
			};
		}



		function _detachOnePrevButton(prevButton) {
			$(prevButton).off('click'+'.go-prev-of-flipover-'+this.rootElement.id);
		}

		function _detachOneNextButton(nextButton) {
			$(nextButton).off('click'+'.go-next-of-flipover-'+this.rootElement.id);
		}

		function _detachOneToggleButton(toggleButton) {
			$(toggleButton).off('click'+'.toggle-flipover-'+this.rootElement.id);
		}

		function _detachAllPrevButtons() {
			for (var i = 0; i < this.prevButtons.length; i++) {
				_detachOnePrevButton.call(this, this.prevButtons[i]);
			};
		}

		function _detachAllNextButtons() {
			for (var i = 0; i < this.nextButtons.length; i++) {
				_detachOneNextButton.call(this, this.nextButtons[i]);
			};
		}

		function _detachAllToggleButtons() {
			for (var i = 0; i < this.toggleButtons.length; i++) {
				_detachOneToggleButton.call(this, this.toggleButtons[i]);
			};
		}


		function _decideComingSideId(isDecrease) {
			if (isDecrease) {
				this.comingSideId = this.currentSideId+1;
				if (this.comingSideId>=this.sidesElements.length) this.comingSideId=0;
			} else {
				this.comingSideId = this.currentSideId-1;
				if (this.comingSideId<0) this.comingSideId=this.sidesElements.length-1;
			}
			this.comingSide = this.sidesElements[this.comingSideId];
		}

		function _updateCurrentSideId() {
			this.currentSideId = this.comingSideId;
			this.currentSide = this.sidesElements[this.currentSideId];
		}

		function _recordCurrentSideIdAsLastOne() {
			this.lastSideId = this.currentSideId;
			this.lastSide = this.sidesElements[this.lastSideId];
		}

		function _flipAllSidesElements(reverse) {
			this.endedAnimationsCount=0;
			_decideComingSideId.call(this, reverse);

			this.onflipstart();

			if (this.lastAnimationWasReversed!==this.playReversedAnimationOnGoingNext) {
				this.onnextstart(event);
			} else {
				this.onprevstart(event);
			}

			this.sidesElements.forEach(function (element, i) {
				_flipOneSideElement.call(element, reverse, i);
			});

			this.lastAnimationWasReversed = reverse;
		}

		function _flipOneSideElement(reverse, i) {
			var _direction = reverse ? 'backwards' : 'forwards';
			var _isShown = this.getAttribute('wa-flipover-shown').toLowerCase()==='yes';
			var _faceToShow = _isShown ? 'back-face' : 'front-face';

			this.style.display = '';
			this.className = 'flipover-' + _direction + '-to-show-' + _faceToShow;
			this.setAttribute('wa-flipover-shown', _isShown ? 'no' : 'yes');

			// if (false) {
			// 	var _d = reverse ? 'forwards' : 'backwards';
			// 	var _f = _isShown ? 'hide (front to back)' : 'show (back to front)';
			// 	l(
			// 		i+':',
			// 		// '\tdirection: '+_d,
			// 		'\t', _f
			// 	);
			// }
		}

		function _onAnyAnimationEnd(event) {
			this.endedAnimationsCount++;
			if (this.endedAnimationsCount>this.sidesElements.length) {
				e('weird!');
			}

			if (this.endedAnimationsCount===this.sidesElements.length) { // all animation ended.

				_recordCurrentSideIdAsLastOne.call(this);
				_updateCurrentSideId.call(this);

				if (this.lastAnimationWasReversed===this.playReversedAnimationOnGoingNext) {
					this.onnextend(event);
				} else {
					this.onprevend(event);
				}
				this.onflipend(event);
			}
		}
	} // CLASS:WLCFlipoverModule
} // CLASS:WLCWebsite
