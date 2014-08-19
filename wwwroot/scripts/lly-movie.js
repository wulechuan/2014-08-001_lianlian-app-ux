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

function getRealStyleOf(e) {
	return document.defaultView.getComputedStyle(e,null);
}


var WAT = new (function AnimationToolkits() {

	this.pauseAnimationOf = function(e) {
		if (!e) return false;
		e.animationIsRunning = false;
		e.style.webkitAnimationPlayState = 'paused';
		e.style.animationPlayState = 'paused';
	}

	this.resumeAnimationOf = function(e) {
		if (!e) return false;
		e.animationIsRunning = true;
		e.style.webkitAnimationPlayState = 'running';
		e.style.animationPlayState = 'running';
	}

	this.toggleAnimationOf = function(e) {
		if (!e) return false;
		if (typeof e.animationIsRunning === 'undefined') e.animationIsRunning = true;
		if (e.animationIsRunning) {
			pauseAnimationOf(e);
		} else {
			resumeAnimationOf(e);
		}
	}

	this.applyKeyframesTo = function(element, keyframesName, duration, delay, iterationCount, direction, timingFunction, fillMode) {
		if (!isDomElement(element)) {
			return false;
		}

		keyframesName = String(keyframesName);
		if (keyframesName.length < 1) {
			return false;
		}

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
			fillMode
		].join(' ');

		if (typeof element.style.webkitAnimation != 'undefined') {
			element.style.webkitAnimation = _cssAnimation;
		} else {
			element.style.animation = _cssAnimation;
		}

		// l(element, '\n', _cssAnimation);
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
	this.viewportWidthRemapped =		NaN; // remapped back to unscaled stage content
	this.stageScrollingWidth =			NaN;
	this.stageScrollingWidthRemapped =	NaN;

	this.elapsed = 0;
	this.elapsedRemapped = 0;
	this.elapsedRemappedMiddle = NaN;
	this.elapsedRemappedRight = NaN;
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
		
		this.viewportWidthRemapped = this.viewportWidth / this.stageContentScale;

		this.stageScrollingWidth = Math.max(0, this.stageWidthForScaledContent - this.viewportWidth);
		this.stageScrollingWidthRemapped = this.stageScrollingWidth / this.stageContentScale;




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
		this.elapsedRemapped = this.elapsed / this.stageContentScale;
		this.elapsedRemappedMiddle = this.elapsedRemapped + this.viewportWidthRemapped * 0.5;
		this.elapsedRemappedRight = this.elapsedRemapped + this.viewportWidthRemapped;
		this.elapsedRatio = this.elapsedRemapped / this.stageScrollingWidthRemapped;

		// l(this.elapsedRatio, '\t', this.elapsed + this.viewportWidthRemapped);

		return this.elapsedRatio;
	}

	this.play = function () {
		return this.playTo(this.viewport.scrollLeft);
	}

	this.config(options);
} // CLASS:Stage




function Actor (locator, symbol, options) {
	this.status = 0;
	if (!locator || !locator.className || !locator.className.toLowerCase().indexOf('locator')<0) {
		e('Invalid locator element for new Actor. Actor NOT created.');
		return false;
	}

	this.locator =	locator;
	this.symbol =	symbol;
	this.actions =	[];

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




function MovieTriggerdAction(movie, actor, options) {
	// movie:						<object of CLASS:Movie>
	// actor:						<object of CLASS:Actor>

	if (!(movie instanceof Movie) ) {
		e('Invalid movie for a MovieTriggerdAction.', '\n\tProvided movie:', movie);
		return false;
	}

	if (!(actor instanceof Actor) ) {
		e('Invalid actor for a MovieTriggerdAction.', '\n\tProvided actor:', actor);
		return false;
	}

	this.actor = actor;

	this.triggerForward = {
		triggered: false,
		enabled: false,
		elapsed: NaN,
		actionId: ''
	};

	this.triggerBackward = {
		triggered: true,
		enabled: false,
		elapsed: NaN,
		actionId: ''
	};

	this.onTrigger = function (trigger) {}
	this.onTriggerForward = function () {}
	this.onTriggerBackward = function () {}


	this.config = function(options) {
		// options.triggerForward:		'disabled'|'no'|NaN|'enabled'|'yes'|'auto'|<Valid Number>;
		// options.triggerBackward:		'disabled'|'no'|NaN|'enabled'|'yes'|'auto'|<Valid Number>;
		//
		//								'disabled':		disable backward trigger
		//								'no':			disable backward trigger
		//								NaN:			disable backward trigger
		//
		//								'enabled':		triggerForward + viewportWidthRemapped/2 | triggerBackward - viewportWidthRemapped/2
		//								'yes':			triggerForward + viewportWidthRemapped/2 | triggerBackward - viewportWidthRemapped/2
		//								'auto':			triggerForward + viewportWidthRemapped/2 | triggerBackward - viewportWidthRemapped/2
		//
		//								<Valid Number>:	the number value
		//
		// options.forwardActionId:		<string>;
		// options.backwardActionId:	<string>;
		//
		var _ok = true;
		var _ = options || {};

		var _fEnabled = false;
		var _bEnabled = false;

		var _f = Number(_.triggerForward);
		var _fS = String(_.triggerForward).toLowerCase();

		var _b = Number(_.triggerBackward);
		var _bS = String(_.triggerBackward).toLowerCase();

		var _fValid = !isNaN(_f);
		var _bValid = !isNaN(_b);

		if (!_fValid && !_bValid) {
			_ok = false;
			e(this.actor, 'Neither triggerForward nor triggerBackward is provided specifically.','\n\tProvided triggerForward:', _.triggerForward,'\n\tProvided triggerBackward:', _.triggerBackward);
		} else {

			var _viewportWidth = movie.stage.viewportWidthRemapped;

			if (_fValid) {
				_fEnabled = true;
			}

			if (_fValid && !_bValid) {
				var _bSValid = _bS === 'auto' || _bS === 'yes' || _bS === 'enabled';
				if (_bSValid) {
					_bEnabled = true;
					_b = _f + _viewportWidth/2;
				}
			}

			if (!_fValid && _bValid) {
				var _fSValid = _fS === 'auto' || _fS === 'yes' || _bS === 'enabled';
				if (_fSValid) {
					_fEnabled = true;
					_f = _d - _viewportWidth/2;
				}
			}

			if (_bValid) {
				_bEnabled = true;
				if (_fValid && _b<=_f) {
					w(this.actor, 'TriggerBackward is less than or equals to triggerForward.','\n\tProvided triggerForward:', _.triggerForward,'\n\tProvided triggerBackward:', _.triggerBackward);
				}
			}

		}


		if (_fEnabled && (!_.forwardActionId || typeof _.forwardActionId !== 'string')) {
			_ok = false;
			e('Invalid forwardActionId for a MovieTriggerdAction.', '\n\tProvided forwardActionId:', _.forwardActionId);
		}

		if (_fEnabled && (!_.backwardActionId || typeof _.backwardActionId !== 'string')) {
			_ok = false;
			e('Invalid backwardActionId for a MovieTriggerdAction.', '\n\tProvided backwardActionId:', _.backwardActionId);
		}

		if (!_ok) {
			return false;
		}


		if (!_fEnabled) { _f = NaN; _.forwardActionId = ''; }	// just for sure
		if (!_bEnabled) { _b = NaN; _.backwardActionId = ''; }	// just for sure

		this.triggerForward.enabled = _fEnabled;
		this.triggerForward.elapsed = _f;
		this.triggerForward.actionId = _.forwardActionId;

		this.triggerBackward.enabled = _bEnabled;
		this.triggerBackward.elapsed = _b;
		this.triggerBackward.actionId = _.backwardActionId;

		return this;
	}

	this.tryTrigger = function(moviePlayingForward, movieElapsed) {
		var _t = moviePlayingForward ? this.triggerForward : this.triggerBackward;
		var _tOpp = moviePlayingForward ? this.triggerBackward : this.triggerForward;

		if (_t.enabled && !_t.triggered) {
			var _triggered = moviePlayingForward ? (_t.elapsed <= movieElapsed) : (_t.elapsed >= movieElapsed);

			if (_triggered) {
				// l('"'+this.actor.symbol.id+'"', moviePlayingForward ? 'forward' : 'backward', trigger.elapsed, movieElapsed);
				_t.triggered = true;
				_tOpp.triggered = false;

				this.onTrigger(_t);
				this.actor.doAction(_t.actionId);

				if (moviePlayingForward) {
					this.onTriggerForward(_t);
				} else {
					this.onTriggerBackward(_t);
				}
				return true;
			}
		}

		return false;
	}

	this.tryTriggerForward = function(moviePlayingForward, movieElapsed) {
		return this.tryTrigger(moviePlayingForward, movieElapsed);
	}

	this.tryTriggerBackward = function(moviePlayingForward, movieElapsed) {
		return this.tryTrigger(moviePlayingForward, movieElapsed);
	}
	
	return this.config(options);
} // CLASS:MovieTriggerdAction




function Movie(stage, options) {
	this.stage = null;
	this.isPlaying = false;
	this.isPlayingForward = false;
	this.isPaused = false;
	this.elapsedRatio = 0;
	this.elapsedRatioLastTime = 0;
	this.actors = {};
	this.actorsCount = 0;
	this.triggeredActions = [];

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
		this.stageWidth = this.stage.stageScrollingWidthRemapped;
		var _ = options || {};
	}

	this.addActor = function(actorName, locator, symbol, options) {
		var _actor = new Actor(locator, symbol, options);
		if (_actor) {
			this.actors[actorName] = _actor;
			this.actorsCount++;
			l('Actor\t\t'+actorName+''+(new Array(48-actorName.length)).join(' ')+'has been created.');
			return _actor;
		}
		return undefined;
	}

	this.easyAddActor = function(actorName, locatorQueryString, options) {
		var _l = qS(locatorQueryString);
		var _s = qS(locatorQueryString + ' > .size > .symbol');
		return this.addActor(actorName, _l, _s, options);
	}

	this.actor = function(actorName) {
		return this.actors[actorName];
	}

	this.forEachActor = function (func) {
		if (typeof func != 'function') {
			return 0;
		}
		var _i = 0;
		var _r = undefined;
		for (var _actorName in this.actors) {
			_r = func.call(this.actors[_actorName], _i);
			if (typeof _r === 'undefined' || !!_r) {
				_i++;
			}
		}
		return _i;
	}

	this.logActors = function() {
		return this.forEachActor(
			function (i) {
				l(i, this);
			}) + ' of ' + this.actorsCount + ' actors printed.';
	}

	this.addTriggeredAction = function (actorName, options) {
		var _a = new MovieTriggerdAction(this, this.actors[actorName], options);
		if (_a) {
			this.triggeredActions.push(_a);
			return _a;
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
		var _elapsed = this.stage.elapsedRemapped;

		this.isPlayingForward = this.elapsedRatio > this.elapsedRatioLastTime;
		// l('isPlayingForward = '+this.isPlayingForward);
		this.elapsedRatioLastTime = this.elapsedRatio;

		for (var i=0; i<this.triggeredActions.length;i++) {
			var _a = this.triggeredActions[i];
			_a.tryTriggerForward(this.isPlayingForward, _elapsed);
			_a.tryTriggerBackward(this.isPlayingForward ,_elapsed);
		}
	}


	this.config(stage, options);
} // CLASS:Movie
