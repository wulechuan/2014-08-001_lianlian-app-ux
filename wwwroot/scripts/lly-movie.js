function getScrollBarDimension() {
	var _s1 = 123;
	var _s2 = 234;
	var w1=NaN,w2=NaN,h1=NaN,h2=NaN;

	var outer = document.createElement('div');
	var inner = document.createElement('div');

	outer.appendChild(inner);
	document.body.appendChild(outer);

	outer.style.visibility = 'hidden';
	outer.style.position = 'absolute';
	outer.style.top = '0';
	outer.style.left = '0';
	outer.style.overflow = 'scroll';

	outer.style.width = _s1+'px';
	outer.style.height = _s1+'px';

	inner.style.width = _s2+'px';
	inner.style.height = _s2+'px';

	w1 = outer.clientWidth;
	h1 = outer.clientHeight;
	w2 = outer.offsetWidth;
	h2 = outer.offsetHeight;

	outer.removeChild(inner);
	document.body.removeChild(outer);
	delete inner;
	delete outer;

	return {
		vScrollBarWidth: w2 - w1,
		hScrollBarHeight: h2 - h1
	};
}

var WAT = new (function AnimationToolkits() {

	function safeArray(input) {
		var _arr = undefined;
		if (Array.isArray(input)) {
			_arr = input;
		} else {
			_arr = [];
			_arr.push(input);
		}
		return _arr;
	}

	this.setScales = function(elements, scaleX, scaleY, scaleZ) {
		var _sX = wlcJS.getSafeNumber(scaleX, 1);
		var _sY = wlcJS.getSafeNumber(scaleY, _sX);
		var _sZ = wlcJS.getSafeNumber(scaleZ, _sX);
		safeArray(elements).forEach(function (element, i, _elements) {
			element.style.transform = 'scale3d('+_sX+','+_sY+','+_sZ+')';
		});
	}

	this.pauseAnimationsOf = function(elements) {
		safeArray(elements).forEach(function (element, i, _elements) {
			if (!isDomElement(element)) return undefined;
			element.animationIsRunning = false;
			element.style.webkitAnimationPlayState = 'paused';
			element.style.animationPlayState = 'paused';
		});
	}

	this.resumeAnimationsOf = function(elements) {
		safeArray(elements).forEach(function (element, i, _elements) {
			if (!isDomElement(element)) return undefined;
			element.animationIsRunning = true;
			element.style.webkitAnimationPlayState = 'running';
			element.style.animationPlayState = 'running';
		});
	}

	this.toggleAnimationsOf = function(elements) {
		safeArray(elements).forEach(function (element, i, _elements) {
			if (!isDomElement(element)) return undefined;
			if (typeof element.animationIsRunning === 'undefined') element.animationIsRunning = true;
			if (element.animationIsRunning) {
				element.animationIsRunning = false;
				element.style.webkitAnimationPlayState = 'paused';
				element.style.animationPlayState = 'paused';
			} else {
				element.animationIsRunning = true;
				element.style.webkitAnimationPlayState = 'running';
				element.style.animationPlayState = 'running';
			}
		});
	}

	this.clearAnimationsOf = function(elements) {
		safeArray(elements).forEach(function (element, i, _elements) {
			if (!isDomElement(element)) return undefined;
			element.animationIsRunning = false;
			element.style.webkitAnimation = '';
			element.style.animation = '';
		});
	}

	this.applyAnimationTo = function(element, keyframesName, playState, duration, delay, iterationCount, direction, timingFunction, fillMode) {
		if (!isDomElement(element)) {
			return false;
		}

		keyframesName = String(keyframesName);
		if (keyframesName.length < 1) {
			return false;
		}

		playState = (typeof playState === 'undefined' || (!!playState && String(playState).toLowerCase()!='paused')) ? 'running' : 'paused';

		duration = Number(duration);
		duration = isNaN(duration) ? '0.6s' : (Math.max(0.05, duration)+'s');

		delay = Number(delay);
		delay = isNaN(delay) ? '0s' : (delay+'s');

		iterationCount = isNaN(Number(iterationCount)) ? (String(iterationCount).toLowerCase()==='infinite' ? 'infinite' : '1' ) : String(Number(iterationCount)); // don't care integer or not

		direction = String(direction);
		direction = (direction==='normal' || direction==='alternate' || direction==='reverse' || direction==='alternate-reverse') ? direction : 'normal';

		timingFunction = timingFunction ? String(timingFunction) : 'ease-in-out'; // be careful

		fillMode = String(fillMode);
		fillMode = (fillMode==='forwards' || fillMode==='backwards' || fillMode==='both') ? fillMode : 'both';

		var _cssAnimation = [
			keyframesName,
			duration,
			timingFunction,
			iterationCount,
			delay,
			direction,
			fillMode,
			playState
		].join(' ');

		if (typeof element.style.webkitAnimation != 'undefined') {
			element.style.webkitAnimation = _cssAnimation;
		} else {
			element.style.animation = _cssAnimation;
		}

		// l(element, '\n', _cssAnimation);
	}

	this.batchApplyAnimationsTo = function(locatorsArray, keyframesName, playState, options) {
		// options {
		//		durationExp:		Number, <default = 0.4>
		//		durationVar:		Number, <default = 0>
		//		delayGlobal:		Number, <default = 0>
		//		delayEachStepExp:	Number, <default = 0>
		//		delayEachStepVar:	Number, <default = 0>
		//
		//		oneByOne:			boolean, <default = false>
		//							// Here oneByOne means extending delay accumulately
		//
		//		oneAfterOne:		boolean, <default = false>
		//							// oneAfterOne ONLY take effects when oneByOne is set true
		//							// Here oneAfterOne means extending delay further more,
		//							// so that the next animation won't even start counting its delay(fake)
		//							// until the previous animation running completely.
		// }

		_ = options || {};

		_.duraionExp = wlcJS.getSafeNumber(_.duraionExp, 0.4);
		_.duraionVar = wlcJS.getSafeNumber(_.duraionVar, 0);

		_.delayGlobal = wlcJS.getSafeNumber(_.delayGlobal, 0);

		_.delayEachStepExp = wlcJS.getSafeNumber(_.delayEachStepExp, 0);
		_.delayEachStepVar = wlcJS.getSafeNumber(_.delayEachStepVar, 0);

		_.oneByOne =	!!_.oneByOne;
		_.oneAfterOne =	_.oneByOne && !!_.oneAfterOne;



		var _durationCurrent = NaN;

		var _delayGap = NaN;
		var _delayCurrent = _.delayGlobal;

		for (var i = 0; i < locatorsArray.length; i++) {
			_durationCurrent =	Math.randomAround(_.duraionExp, _.duraionVar);
			_delayGap =			Math.randomAround(_.delayEachStepExp, _.delayEachStepVar);

			if (_.oneByOne) {
				_delayCurrent += _delayGap;
			} else {
				_delayCurrent = _delayGap;
			}

			WAT.applyAnimationTo(locatorsArray[i], keyframesName, playState, _durationCurrent, _delayCurrent);

			_delayCurrent += (_.oneAfterOne ? _durationCurrent : 0);
			// l(_durationCurrent, _delayGap, _delayCurrent);
		};
	}

	this.batchApplyOneByOneAnimationsTo = function(locatorsArray, keyframesName, playState, options) {
		// options {
		//		durationExp:		Number, <default = 0.4>
		//		durationVar:		Number, <default = 0.05>
		//		delayGlobal:		Number, <default = 0>
		//		delayEachStepExp:	Number, <default = 0.25>
		//		delayEachStepVar:	Number, <default = 0.08>
		// }

		_ = options || {};

		_.duraionExp = wlcJS.getSafeNumber(_.duraionExp, 0.4);
		_.duraionVar = wlcJS.getSafeNumber(_.duraionVar, 0.05);

		_.delayGlobal = wlcJS.getSafeNumber(_.delayGlobal, 0);

		_.delayEachStepExp = wlcJS.getSafeNumber(_.delayEachStepExp, 0.25);
		_.delayEachStepVar = wlcJS.getSafeNumber(_.delayEachStepVar, 0.08);

		_.oneByOne =	true;
		_.oneAfterOne =	_.oneByOne && !!_.oneAfterOne;

		this.batchApplyAnimationsTo(locatorsArray, keyframesName, playState, _);
	}

	this.oneByOneJumpOut = function(locatorsArray, playState, wakVarianceId, options) {
		//	wakVarianceId:		<allowed: 1 or 2 or 3 or '1' or '2' or '3'>, <default = 3>
		//						// there 3 types of keyframes available currently (2014-08-20)
		wakVarianceId = wlcJS.getSafeNumber(wakVarianceId, 3);
		this.batchApplyOneByOneAnimationsTo(locatorsArray, 'wak-things-pop-out-'+wakVarianceId, playState, options);
	}
});




function Stage (options) {
	// --- provided values -------------------
	this.viewport =						null;
	this.stageElement =					null;
	this.stageContentScaler =			null;

	this.viewportWidth =				NaN;
	this.viewportHeight =				NaN;

	this.stageWidthAtFullScale =		NaN;
	this.stageHeightAtFullScale =		NaN;
	

	// --- derived values --------------------
	this.useCssZoom =					false;
	this.stageContentScale =			1;
	this.stageWidthForScaledContent =	NaN;
	this.stageHeightForScaledContent =	NaN;
	this.viewportWidthUnscaled =		NaN; // Remap back to unscaled stage content
	this.stageScrollingWidth =			NaN;
	this.stageScrollingWidthUnscaled =	NaN;

	this.elapsed = 0;
	this.elapsedUnscaled = 0;
	this.elapsedUnscaledMiddle = NaN;
	this.elapsedUnscaledRight = NaN;
	this.elapsedRatio = 0;


	this.config = function (options) {
		var _ok = true;
		var _ = options || {};

		var _viewport = 			document.getElementById(_.viewportId);
		var _stageElement = 		document.getElementById(_.stageId);
		var _stageContentScaler = 	document.getElementById(_.stageContentScalerId);

		if (_viewport)				{ this.viewport = 			document.getElementById(_.viewportId); }
		if (_stageElement)			{ this.stageElement = 		document.getElementById(_.stageId); }
		if (_stageContentScaler)	{ this.stageContentScaler =	document.getElementById(_.stageContentScalerId); }

		var _w = Number(_.stageWidthAtFullScale);
		var _h = Number(_.stageHeightAtFullScale);

		if (!this.viewport) {
			_ok = false;
			e('Invalid html id for Stage.viewport.', '\n\tThe html id provided:', _.viewportId);
			// return false;
		}

		if (!this.stageElement) {
			_ok = false;
			e('Invalid html id for Stage.stageElement.', '\n\tThe html id provided:', _.stageId);
			// return false;
		}

		if (!this.stageContentScaler) {
			_ok = false;
			e('Invalid html id for Stage.stageContentScaler.', '\n\tThe html id provided:', _.stageContentScalerId);
			// return false;
		}

		if (!this.stageWidthAtFullScale && !_w) {
			_ok = false;
			e('Invalid stage width.', '\n\tThe width value provided:', _.stageWidthAtFullScale);
			// return false;
		}

		if (!this.stageHeightAtFullScale && !_h) {
			_ok = false;
			e('Invalid stage height.', '\n\tThe height value provided:', _.stageHeightAtFullScale);
			// return false;
		}

		if (!_ok) {
			return false;
		}




		if (_w) { this.stageWidthAtFullScale = _w; }
		if (_h) { this.stageHeightAtFullScale = _h; }




		_w = Number(_.viewportWidth);
		_h = Number(_.viewportHeight);

		this.viewportWidth =	!_w ? document.documentElement.clientWidth  : Math.min(document.documentElement.clientWidth, _w);
		this.viewportHeight =	!_h ? document.documentElement.clientHeight : Math.min(document.documentElement.clientHeight, _h);

		if (_w) {
			this.viewport.style.width = this.viewportWidth + 'px';
		}
		if (_h) {
			this.viewport.style.height = this.viewportHeight + 'px';
		}

		this.stageHeightForScaledContent = this.viewportHeight;

		var _hasHorizontalScrollBar = website.env.mode.desktop;

		if (_hasHorizontalScrollBar) {
			this.stageHeightForScaledContent = this.stageHeightForScaledContent - getScrollBarDimension().hScrollBarHeight;
		}



		this.stageContentScale = this.stageHeightForScaledContent / this.stageHeightAtFullScale;
		this.stageWidthForScaledContent = Math.floor( this.stageWidthAtFullScale * this.stageContentScale );
		
		this.viewportWidthUnscaled = this.viewportWidth / this.stageContentScale;

		this.stageScrollingWidth = Math.max(0, this.stageWidthForScaledContent - this.viewportWidth);
		this.stageScrollingWidthUnscaled = this.stageScrollingWidth / this.stageContentScale;




		this.useCssZoom = (website.env.os.ios || website.env.ua.safari) && !website.env.os.wp;

		if (this.useCssZoom) {
			this.stageContentScaler.style.zoom = this.stageContentScale;
		} else {
			this.stageContentScaler.style.transform = 		'scale3d('+this.stageContentScale+', '+this.stageContentScale+', '+0.999+')';
			this.stageContentScaler.style.webkitTransform =	'scale3d('+this.stageContentScale+', '+this.stageContentScale+', '+0.999+')';

			// this.stageContentScaler.style.transform = 		'scale('+this.stageContentScale+', '+this.stageContentScale+')';
			// this.stageContentScaler.style.webkitTransform =	'scale('+this.stageContentScale+', '+this.stageContentScale+')';
		}

		this.stageElement.style.width = this.stageWidthForScaledContent + 'px';
	}

	this.reset = function () {
		this.playTo(0);
		this.viewport.scrollLeft = 0;
	}

	this.playTo = function (elapsed) {
		if (!isNaN(Number(elapsed))) { this.elapsed = Number(elapsed); }
		this.elapsedUnscaled = this.elapsed / this.stageContentScale;
		this.elapsedUnscaledMiddle = this.elapsedUnscaled + this.viewportWidthUnscaled * 0.5;
		this.elapsedUnscaledRight = this.elapsedUnscaled + this.viewportWidthUnscaled;
		this.elapsedRatio = this.elapsedUnscaled / this.stageScrollingWidthUnscaled;

		// l(this.elapsedRatio, '\t', this.elapsed + this.viewportWidthUnscaled);

		return this.elapsedRatio;
	}

	this.play = function () {
		return this.playTo(this.viewport.scrollLeft);
	}

	this.config(options);
} // CLASS:Stage




function Actor (name, locator, symbol, options) {
	if (!isDomElement(locator) || !locator.className.toLowerCase().indexOf('locator')<0) {
		e('Invalid locator element for new Actor. Actor NOT created. Try creating a VirtualActor instead, which does NOT require a locator object.');
		return false;
	}

	this.locator =	locator;
	this.symbol =	symbol;

	this.name = name ? name : 'anonymous';
	this.status = 0;
	this.actions =	{};

	l('Actor\t\t\t'+name+''+(new Array(48-name.length)).join(' ')+'created.');

	this.reset = function () {
		this.status = 0;
	}

	this.doAction = function (actionId) {
		this.actions[actionId].call(this);
		this.status = 1;
	}

	this.defineAction = function (actionId, action) {
		if (typeof action != 'function') {
			e('Invalid function provided when trying defining an action of actor', this.locator);
			return false;
		}
		this.actions[actionId] = action;
	}
} // CLASS:Actor




function VirtualActor (name, targets, options) {
	if (typeof targets != 'object') {
		e('Invalid targets for new VirtualActor. VirtualActor NOT created.');
		return false;
	}

	var _targets = undefined;
	if (Array.isArray(targets)) {
		_targets = targets;
	} else {
		_targets = [];
		_targets.push(targets);
	}

	this.targets = _targets;

	this.name = name ? name : 'anonymous';
	this.status = 0;
	this.actions =	{};

	l('VirtualActor\t'+name+''+(new Array(48-name.length)).join(' ')+'created.');

	this.reset = function () {
		this.status = 0;
	}

	this.doAction = function (actionId) {
		this.actions[actionId].call(this);
		this.status = 1;
	}

	this.defineAction = function (actionId, action) {
		if (typeof action != 'function') {
			e('Invalid function provided when trying defining an action of VirtualActor');
			return false;
		}
		this.actions[actionId] = action;
	}
} // CLASS:Actor




function MovieTriggerAction(movie, actor, options) {
	// movie:						<object of CLASS:Movie>
	// actor:						<object of CLASS:Actor or CLASS:VirtualActor>

	if (!(movie instanceof Movie) ) {
		e('Invalid movie for a MovieTriggerAction.', '\n\tProvided movie:', movie);
		return false;
	}

	if (!(actor instanceof Actor) && !(actor instanceof VirtualActor) ) {
		e('Invalid Actor\/VirtualActor for a MovieTriggerAction.', '\n\tProvided Actor/VirtualActor:', actor);
		return false;
	}

	this.actor = actor;
	this.isPaired = false;

	this.forward = {
		isForwardTrigger:	true, // read-only
		enabled:			false,
		hasBeenTriggered:	false,
		onElapsed:			NaN,
		actionId:			''
	};

	this.backward = {
		isBackwardTrigger:	false, // read-only
		enabled:			false,
		hasBeenTriggered:	false,
		onElapsed:			NaN,
		actionId:			''
	};

	this.onTrigger = function (trigger) {}
	this.onTriggerForward = function () {}
	this.onTriggerBackward = function () {}


	this.config = function (options) {
		// options.forward.onElapsed:			'disabled'|'no'|NaN|'enabled'|'yes'|'auto'|<Valid Number>;
		// options.backward.onElapsed:		'disabled'|'no'|NaN|'enabled'|'yes'|'auto'|<Valid Number>;
		//
		//									'disabled':		disable backward trigger
		//									'no':			disable backward trigger
		//									NaN:			disable backward trigger
		//
		//									'enabled':		forward.onElapsed + viewportWidthUnscaled/2 | backward.onElapsed - viewportWidthUnscaled/2
		//									'yes':			forward.onElapsed + viewportWidthUnscaled/2 | backward.onElapsed - viewportWidthUnscaled/2
		//									'auto':			forward.onElapsed + viewportWidthUnscaled/2 | backward.onElapsed - viewportWidthUnscaled/2
		//
		//									<Valid Number>:	the number value
		//
		// options.forward.actionId:		<string>; default: '';
		// options.backward.actionId:		<string>; default: '';

		var _ok = true;
		var _o = { isPaired: false, f: {}, b: {} };

		var _ = options || {};
			_.forward  = _.forward  || {};
			_.backward = _.backward || {};


		_o.f.number = _.forward.onElapsed  === null ? NaN : Number(_.forward.onElapsed);
		_o.f.string = String( _.forward.onElapsed).toLowerCase();

		_o.b.number = _.backward.onElapsed === null ? NaN : Number(_.backward.onElapsed);
		_o.b.string = String(_.backward.onElapsed).toLowerCase();

		// _o.f.stringValid = _o.f.string === 'auto' || _o.f.string === 'yes' || _o.f.string === 'no' || _o.f.string === 'enabled' || _o.f.string === 'disabled' || _o.f.string === 'null';
		// _o.b.stringValid = _o.b.string === 'auto' || _o.b.string === 'yes' || _o.b.string === 'no' || _o.b.string === 'enabled' || _o.b.string === 'disabled' || _o.b.string === 'null';
		_o.f.enabledByString = _o.f.string === 'auto' || _o.f.string === 'yes' || _o.f.string === 'enabled';
		_o.b.enabledByString = _o.b.string === 'auto' || _o.b.string === 'yes' || _o.b.string === 'enabled';

		_o.f.specified = !isNaN(_o.f.number);
		_o.b.specified = !isNaN(_o.b.number);

		_o.f.enabled = _o.f.specified || _o.f.enabledByString;
		_o.b.enabled = _o.b.specified || _o.b.enabledByString;

		if (!_o.f.specified && !_o.b.specified) {

			_ok = false;
			e(
				this.actor,
				'\n\tNeither forward trigger nor backward trigger is provided specifically.',
				'\n\tProvided forward.onElapsed :', _.forward.onElapsed,
				'\n\tProvided backward.onElapsed:', _.backward.onElapsed
			);

		} else {

			var _viewportWidth = movie.stage.viewportWidthUnscaled;

			if (_o.f.specified && _o.b.enabledByString) {
				_o.b.number = _o.f.number + _viewportWidth/2;
			}

			if (_o.f.enabledByString && _o.b.specified) {
				_o.f.number = _o.b.number - _viewportWidth/2;
			}

			// if (_o.f.specified && _o.b.specified) {
			// 	if (_o.b.number > _o.f.number) {
			// 		w(
			// 			this.actor,
			// 			'\n\tThe backward trigger comes later than the forward trigger.',
			// 			'\n\tProvided forward.onElapsed :', _.forward.onElapsed,
			// 			'\n\tProvided backward.onElapsed:', _.backward.onElapsed
			// 		);
			// 	}
			// }

		}


		if (_o.f.enabled && (!_.forward.actionId || typeof _.forward.actionId !== 'string')) {
			_ok = false;
			e(
				'Invalid forward actionId for a MovieTriggerAction.',
				'\n\tProvided forward.actionId :', _.forward.actionId
			);
		}

		if (_o.b.enabled && (!_.backward.actionId || typeof _.backward.actionId !== 'string')) {
			_ok = false;
			e(
				'Invalid backward actionId for a MovieTriggerAction.',
				'\n\tProvided backward.actionId:', _.backward.actionId
			);
		}

		if (!_ok) {
			return false;
		}

		_o.isPaired = _o.f.enabled && _o.b.enabled;


		if (!_o.f.enabled) { _o.f.number = NaN; _.forward.actionId = ''; }	// just for sure
		if (!_o.b.enabled) { _o.b.number = NaN; _.backward.actionId = ''; }	// just for sure

		// l(_o);

		this.isPaired = _o.isPaired;

		this.forward.enabled		= _o.f.enabled;
		this.forward.onElapsed		= _o.f.number;
		this.forward.actionId		= _.forward.actionId;
		this.forward.hasBeenTriggered		= false; // !_o.f.enabled;

		this.backward.enabled		= _o.b.enabled;
		this.backward.onElapsed		= _o.b.number;
		this.backward.actionId		= _.backward.actionId;
		this.backward.hasBeenTriggered		= false; // !_o.b.enabled || _o.f.enabled;

		this.forward.opposite		= this.isPaired ? this.backward : undefined;
		this.backward.opposite		= this.isPaired ? this.forward  : undefined;

		return this;
	}

	this.tryTrigger = function (trigger, moviePlayingInMyTriggerDirection, movieElapsed) {
		var _triggerOpp = undefined;

		if (this.isPaired) {
			_triggerOpp = trigger.opposite; // moviePlayingForward ? this.backward : this.forward;
		}

		if (trigger.enabled) {
			var _nowTriggered =
					!trigger.hasBeenTriggered
				&&	moviePlayingInMyTriggerDirection
				&&	(trigger.isForwardTrigger
						?	(movieElapsed >= trigger.onElapsed)
						:	(movieElapsed <= trigger.onElapsed)
					);

			var _shouldReset =
					trigger.hasBeenTriggered
				&&	!moviePlayingInMyTriggerDirection
				&&	(trigger.isForwardTrigger
						?	(movieElapsed < trigger.onElapsed)
						:	(movieElapsed > trigger.onElapsed)
					)
				;

			if (_nowTriggered) {
				trigger.hasBeenTriggered = true;

				if (this.isPaired) {
					_triggerOpp.hasBeenTriggered = false;
				}

				this.onTrigger(trigger);

				if (trigger.isForwardTrigger) {
					this.onTriggerForward();
				} else {
					this.onTriggerBackward();
				}

				this.actor.doAction(trigger.actionId);

				return true;
			}

			if (_shouldReset) {
				trigger.hasBeenTriggered = false;
				// l('Actor: "'+this.actor.name+'": '+'actionId: '+'"'+trigger.actionId+'"\t\t<'+(trigger.isForwardTrigger ? 'Forward' : 'Backward')+'> trigger has been reset.');
			}

		} else {
			// do nothing
		}

		return false;
	}

	this.tryTriggerForward = function(moviePlayingForward, movieElapsed) {
		return this.tryTrigger(this.forward, moviePlayingForward, movieElapsed);
	}

	this.tryTriggerBackward = function(moviePlayingForward, movieElapsed) {
		return this.tryTrigger(this.backward, !moviePlayingForward, movieElapsed);
	}
	
	return this.config(options);
} // CLASS:MovieTriggerAction




function Movie(stage, options) {
	this.stage = null;
	this.isPlaying = false;
	this.isPlayingForward = false;
	this.isPaused = false;
	this.elapsedRatio = 0;
	this.elapsedRatioLastTime = 0;
	this.actors = {};
	this.actorsCount = 0;
	this.virtualActors = {};
	this.virtualActorsCount = 0;
	this.triggerActions = [];

	this.onStop = function() {};
	this.onPause = function() {};
	this.onResume = function() {};
	this.onPlay = function() {};

	this.config = function (stage, options) {
		if (!stage && !stage.stageElement && !stage.viewportWidth) {
			e('Invalid stage object.');
			return false;
		}

		this.stage = stage;
		this.stageWidth = this.stage.stageScrollingWidthUnscaled;
		var _ = options || {};
	}

	this.addActor = function(actorName, locator, symbol, options) {
		var _actor = new Actor(actorName, locator, symbol, options);
		if (_actor) {
			this.actors[actorName] = _actor;
			this.actorsCount++;
			return _actor;
		}
		return undefined;
	}

	this.addVirtualActor = function(actorName, actorObj, options) {
		var _virtualActor = new VirtualActor(actorName, actorObj, options);
		if (_virtualActor) {
			this.virtualActors[actorName] = _virtualActor;
			this.virtualActorsCount++;
			return _virtualActor;
		}
		return undefined;
	}

	this.easyAddActor = function(actorName, locatorQueryString, options) {
		var _l = qS(locatorQueryString);
		var _s = qS(locatorQueryString + ' > .size > .symbol');
		return this.addActor(actorName, _l, _s, options);
	}

	this.actor = function(actorName) { // just for conveniece
		return this.actors[actorName];
	}

	this.virtualActor = function(actorName) { // just for conveniece
		return this.virtualActors[actorName];
	}

	this.anyActor = function(actorName) {
		var _actor = this.actor(actorName);
		if(!_actor) _actor = this.virtualActor(actorName);
		if (!_actor) return undefined;
		return _actor;
	}

	this.forEachActor = function (func) {
		if (typeof func != 'function') {
			return 0;
		}
		var _successCount = 0;
		var _successful = undefined;
		for (var _actorName in this.actors) {
			_successful = func.call(this.actors[_actorName], _successCount);
			if (typeof _successful === 'undefined' || !!_successful) {
				_successCount++;
			}
		}
		return _successCount;
	}

	this.forEachVirtualActor = function (func) {
		if (typeof func != 'function') {
			return 0;
		}
		var _successCount = 0;
		var _successful = undefined;
		for (var _actorName in this.virtualActors) {
			_successful = func.call(this.virtualActors[_actorName], _successCount);
			if (typeof _successful === 'undefined' || !!_successful) {
				_successCount++;
			}
		}
		return _successCount;
	}

	this.logActors = function(logSummary) {
		var _c = this.forEachActor(function (i) { l(i, this); });
		if (!!logSummary) l(_c + ' of ' + this.actorsCount + ' actors printed.');
		return _c;
	}

	this.logVirtualActors = function(logSummary) {
		var _c = this.forEachVirtualActor(function (i) { l(i, this); });
		if (!!logSummary) l(_c + ' of ' + this.virtualActorsCount + ' virtual actors printed.');
		return _c;
	}

	this.logActorsOfAllTypes = function() {
		var _c = 0;
		var _total = this.actorsCount + this.virtualActorsCount;
		_c += this.logActors(false);
		_c += this.logVirtualActors(false);
		l(_c + ' of ' + _total + ' actors of all types printed.');
		return _c;
	}


	this.addTriggerAction = function (actorName, options) {
		var _action = new MovieTriggerAction(this, this.anyActor(actorName), options);
		if (_action) {
			this.triggerActions.push(_action);
			return _action;
		}
	}

	this.stop = function() {
		this.stage.reset();

		for (var i=0; i<this.actors.length;i++) {
			this.actors[i].reset();
		}

		this.isPlaying = false;
		this.isPlayingForward = false;
		this.isPaused = false;

		this.onStop();
	}

	this.pause = function() {
		// if (!this.isPlaying) {
		// 	return false;
		// }
		// this.isPlaying = false;
		// this.isPlayingForward = false;
		// this.isPaused = true;

		this.onPause();
	}

	this.resume = function() {
		// if (!this.isPaused) {
		// 	return false;
		// }
		// this.isPlaying = true;
		// this.isPaused = false;

		this.onResume();
	}

	this.play = function() {
		if (this.isPaused) {
			return false;
		}

		this.onPlay();

		this.isPlaying = true;
		this.isPaused = false;
		this.elapsedRatio = this.stage.play();
		var _elapsed = this.stage.elapsedUnscaled;

		var _delta = this.elapsedRatio - this.elapsedRatioLastTime;
		this.elapsedRatioLastTime = this.elapsedRatio;

		var _distance = Math.abs(_delta);
		// l('Movie.play();', _distance);
		// this.isPlaying = _distance > 0.001;
		// l('Movie.play();', this.isPlaying);

		this.isPlayingForward = this.isPlaying && _delta>0;

		if ( this.isPlaying ) {
			for (var i=0; i<this.triggerActions.length;i++) {
				var _a = this.triggerActions[i];
				_a.tryTriggerForward(this.isPlayingForward, _elapsed);
				_a.tryTriggerBackward(this.isPlayingForward ,_elapsed);
			}
		}

	}


	this.config(stage, options);
} // CLASS:Movie
