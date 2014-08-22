(function () {
	var _frameHeightForTest = 500;
	var _frameWidthForTest = 800; //_frameHeightForTest-17;




	if (website.env.mode.desktop && !website.env.os.wp) {
		welcomeStage.config({
			viewportWidth: _frameWidthForTest,
			viewportHeight: _frameHeightForTest
		});
		welcomeStage.viewport.style.position = 'relative';
		welcomeStage.viewport.style.marginLeft = 'auto';
		welcomeStage.viewport.style.marginRight = 'auto';
		welcomeStage.viewport.style.marginTop = '240px';

		document.documentElement.style.backgroundColor =	'black';
		document.body.style.backgroundColor =				'black';
	}
})();




if (true) {
	var infoBox = new (function (parentNode) {
		this.root = undefined;
		this.label = undefined;
		this.content = undefined;

		this.show = function () { this.root.show(); }
		this.hide = function () { this.root.hide(); }
		this.updateLabel = function (innerHTML) { this.label.innerHTML = innerHTML; }
		this.updateContent = function (innerHTML) { this.content.innerHTML = innerHTML; }

		this.build = function (parentNode) {
			var _rE = document.createElement('DIV');
				_rE.id = 'info-box';

				// _rE.style.display =		'block';
				_rE.style.boxSizing =	'border-box';
				_rE.style.width =		'calc(100% - 20px)';
				_rE.style.position =	'fixed';
				_rE.style.left =		'0';
				_rE.style.top =			'0';

				_rE.style.margin =		'10px';
				_rE.style.padding =		'10px 30px';

				_rE.style.color =			'black';
				
				if (website.env.ua.ie8OrOlder) {
					_rE.style.backgroundColor =	'white';
					_rE.style.filter =			'alpha(opacity=87)';
				} else {
					_rE.style.backgroundColor =	'rgba(255,255,255,0.87)';
				}




			var _lE = document.createElement('H3');
				_lE.style.margin =	'0';
				_lE.style.padding =	'0';




			var _cE = document.createElement('H4');
				_cE.style.margin =	'0';
				_cE.style.padding =	'0';




			this.root = _rE;
			this.label = _lE;
			this.content = _cE;

			_rE.appendChild(_lE);
			_rE.appendChild(_cE);
			parentNode.appendChild(_rE);
		}

		this.build(parentNode);
	})(document.body);

	// infoBox.hide();

	var printingSolution = 2;

	welcomeMovie.onStop = function () {
		switch (printingSolution) {
			case 1: printDimensionsInfo.call(this.stage);
					break;
			case 2: printElapsedStatesInfo.call(this.stage);
					break;
			case 3: infoBox.updateLabel('Movie is stopped');
					break;
			default:
		}
	}

	welcomeMovie.onPlay = function () {
		switch (printingSolution) {
			case 1: printDimensionsInfo.call(this.stage);
					break;
			case 2: printElapsedStatesInfo.call(this.stage);
					break;
			case 3: infoBox.updateLabel('Movie is playing '+(welcomeMovie.isPlayingForward ? 'forwards' : 'backwards'));
					break;
			default:
		}
	}

	welcomeMovie.actionTriggers.forEach(
		function (trigger, i, triggersArray) {
			switch (printingSolution) {
				case 1: ;
						break;
				case 2: ;
						break;
				case 3: trigger.ontrigger = function(trigger) { printTriggeredActionInfoForActor.call(this, trigger) };
						break;
				default:
			}
		}
	);





	function printDimensionsInfo() {
		infoBox.updateContent(''
			+ 'screen: ' + screen.availWidth + ' x ' + screen.availHeight
			+ '<br/>window: ' + window.innerWidth + ' x ' + window.innerHeight
			+ '<br/>html: ' + document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight
			+ '<br/>body: ' + document.body.clientWidth + ' x ' + document.body.clientHeight
			+ '<br/>container: ' + this.viewport.realStyle.width + ' x ' + this.viewport.realStyle.height
			+ '<br/>'
			+ '<br/>stage dimensions:'
			+ '<br/>&nbsp;&nbsp;&nbsp;&nbsp;desired: ' + this.stageWidthForScaledContent + 'px x ' + this.viewportHeight + 'px'
			+ '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;actual: ' + this.stageElement.realStyle.width + ' x ' + this.stageElement.realStyle.height
			+ '<br/>stageScrollingWidth: ' + this.stageScrollingWidth
			+ '<br/>'
			+ '<br/>stageContentScale: ' + Math.round(this.stageContentScale*1000)/1000
			+ '<br/>stageContentScalerInlineStyle:<br/>' + (this.useCssZoom ? ('zoom: '+this.stageContentScaler.style.zoom) : this.stageContentScaler.style.transform)
		);
	}

	function printElapsedStatesInfo() {
		var _indent = '&nbsp;&nbsp;&nbsp;&nbsp;';
		var _infoLines = [
			'stage elapsed:',
			'_indent' + 'raw = ' + Math.round(this.elapsed*1000)/1000,
			'_indent' + 'Unscaled = ' + Math.round(this.elapsedUnscaled*1000)/1000,
			'_indent' + 'Unscaled Middle = ' + Math.round(this.elapsedUnscaledMiddle*1000)/1000,
			'_indent' + 'Unscaled Right = ' + Math.round(this.elapsedUnscaledRight*1000)/1000,
			'_indent' + 'Ratio = ' + Math.round(this.elapsedRatio*1000)/1000,
			'Movie:',
			'_indent' + 'isPlayingForward = ' + welcomeMovie.isPlayingForward,
		];
		infoBox.updateContent( _infoLines.join('<br/>').replace(/_indent/g, '&nbsp;&nbsp;&nbsp;&nbsp;') );
		// l( '\n'+_infoLines.join('\n').replace(/_indent/g, '\t') );
	}

	function printTriggeredActionInfoForActor(trigger) {
		var _infoLines = [
			'an action triggered!',
			'Actor: "'+this.actor.name +'"'+ ( (this.actor instanceof Actor) ? ('\t\t\t<locator id="' +this.actor.locator.id + '">') : ''),
			'trigger.actionId: "'+trigger.actionId + '"',
			'trigger.onElapsed'+(trigger.alwaysTrigger ? '(always)' : '')+': '+trigger.onElapsed,
			'triggered on '+(Math.round(welcomeMovie.stage.elapsedUnscaled * 100)/100)
		];

		infoBox.updateContent( _infoLines.join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;') );
		// l( '\nMovie is playing '+(trigger.isForwardTrigger ? 'forwards' : 'backwards')+',\t\t'+_infoLines.slice(0,-2).join('\n\t') );
	}
}
