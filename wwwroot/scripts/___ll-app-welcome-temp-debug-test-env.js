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
		welcomeStage.viewport.style.marginTop = '200px';

		document.documentElement.style.backgroundColor =	'black';
		document.body.style.backgroundColor =				'black';
	}
})();

if (1) {

	var infoBox = buildInfoBoxUnder(document.body);

	welcomeMovie.onStop = function () { printDynamicInfo3b(); /*printDynamicInfo2.call(this.stage);*/ }
	welcomeMovie.onPlay = function () { printDynamicInfo3(); /*printDynamicInfo2.call(this.stage);*/ }
	welcomeMovie.triggerActions.forEach(
		function (action, i, actionsArray) {
			action.onTrigger = function(trigger) { printTriggeredActionInfoForActor.call(this, trigger) };
		}
	);

	welcomeMovie.triggerActions[welcomeMovie.triggerActions.length-1].onTrigger = function(trigger) { printTriggeredActionInfoForActor.call(this, trigger) };


	function buildInfoBoxUnder(parentNode) {
		var _indent = '<br/>&nbsp;&nbsp;';
		var _infoBox = {}

		var _rootElement = document.createElement('DIV');
			_rootElement.id = 'info-box';

		var _margin = '10px';
		var _padding = '10px';

		// _rootElement.style.display =		'block';
		_rootElement.style.position =		'fixed';
		_rootElement.style.left =			'0';
		_rootElement.style.top =			'0';

		_rootElement.style.marginTop =		_margin;
		_rootElement.style.marginRight =	_margin;
		_rootElement.style.marginBottom =	_margin;
		_rootElement.style.marginLeft =		_margin;

		_rootElement.style.paddingTop =		_padding;
		_rootElement.style.paddingRight =	_padding;
		_rootElement.style.paddingBottom =	_padding;
		_rootElement.style.paddingLeft =	_padding;

		_rootElement.style.color =			'black';
		
		if (website.env.ua.ie8OrOlder) {
			_rootElement.style.backgroundColor =	'white';
			_rootElement.style.filter =				'alpha(opacity=87)';
		} else {
			_rootElement.style.backgroundColor =	'rgba(255,255,255,0.87)';
		}

		_margin = '10px';
		_padding = '0px';

		var _labelElement = document.createElement('H3');

			_labelElement.style.marginTop =		_margin;
			_labelElement.style.marginRight =	_margin;
			_labelElement.style.marginBottom =	_margin;
			_labelElement.style.marginLeft =	_margin;

			_labelElement.style.paddingTop =	_padding;
			_labelElement.style.paddingRight =	_padding;
			_labelElement.style.paddingBottom =	_padding;
			_labelElement.style.paddingLeft =	_padding;

		var _contentElement = document.createElement('H4');
			_contentElement.style.marginTop =		_margin;
			_contentElement.style.marginRight =		_margin;
			_contentElement.style.marginBottom =	_margin;
			_contentElement.style.marginLeft =		_margin;

			_contentElement.style.paddingTop =		_padding;
			_contentElement.style.paddingRight =	_padding;
			_contentElement.style.paddingBottom =	_padding;
			_contentElement.style.paddingLeft =		_padding;




		_infoBox.root = _rootElement;
		_infoBox.label = _labelElement;
		_infoBox.content = _contentElement;
		_infoBox.show = function () { this.root.show(); }



		_rootElement.appendChild(_labelElement);
		_rootElement.appendChild(_contentElement);
		parentNode.appendChild(_rootElement);

		return _infoBox;
	}

	function printDebugInfo() {
		infoBox.content.innerHTML = ''
			+ 'screen: ' + screen.availWidth + ' x ' + screen.availHeight
			+ '<br/>window: ' + window.innerWidth + ' x ' + window.innerHeight
			+ '<br/>html: ' + document.documentElement.clientWidth + ' x ' + document.documentElement.clientHeight
			+ '<br/>body: ' + document.body.clientWidth + ' x ' + document.body.clientHeight
			+ '<br/>container: ' + getRealStyleOf(this.viewport).width + ' x ' + getRealStyleOf(this.viewport).height
			+ '<br/>'
			+ '<br/>stage dimensions:'
			+ '<br/>&nbsp;&nbsp;&nbsp;&nbsp;desired: ' + this.stageWidthForScaledContent + 'px x ' + this.viewportHeight + 'px'
			+ '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;actual: ' + getRealStyleOf(this.stageElement).width + ' x ' + getRealStyleOf(this.stageElement).height
			+ '<br/>stageScrollingWidth: ' + this.stageScrollingWidth
			+ '<br/>'
			+ '<br/>stageContentScale: ' + Math.round(this.stageContentScale*1000)/1000
			+ '<br/>stageContentScalerInlineStyle:<br/>' + (this.useCssZoom ? ('zoom: '+this.stageContentScaler.style.zoom) : this.stageContentScaler.style.transform)
			;
	}

	function printDynamicInfo(innerHTML) {
		infoBox.content.innerHTML = innerHTML;
	}

	function printDynamicInfo2() {
		infoBox.content.innerHTML = ''
			+ 'stage elapsed:'
			+ _indent + 'raw = ' + Math.round(this.elapsed*1000)/1000
			+ _indent + 'Remapped = ' + Math.round(this.elapsedRemapped*1000)/1000
			+ _indent + 'RemappedMiddle = ' + Math.round(this.elapsedRemappedMiddle*1000)/1000
			+ _indent + 'RemappedRight = ' + Math.round(this.elapsedRemappedRight*1000)/1000
			+ _indent + 'Ratio = ' + Math.round(this.elapsedRatio*1000)/1000
			+ '<br/>Movie:'
			+ _indent + 'isPlayingForward = ' + welcomeMovie.isPlayingForward
			;
	}

	function printDynamicInfo3b() {
		infoBox.label.innerHTML = 'Movie is stopped';
	}

	function printDynamicInfo3() {
		infoBox.label.innerHTML = 'Movie is playing ' + (welcomeMovie.isPlayingForward ? 'forwards' : 'backwards');
	}

	function appendPrintInfo3(innerHTML) {
		infoBox.content.innerHTML = innerHTML;
	}

	function printTriggeredActionInfoForActor(trigger) {
		var _infoLines = [
			'an action triggered!',
			'Actor: "'+this.actor.name +'"'+ ( (this.actor instanceof Actor) ? ('\t\t\t<locator id="' +this.actor.locator.id + '">') : ''),
			'trigger.actionId: "'+trigger.actionId + '"',
			'trigger.onElapsed'+(trigger.alwaysTrigger ? '(always)' : '')+': '+trigger.onElapsed,
			'triggered on '+(Math.round(welcomeMovie.stage.elapsedRemapped * 100)/100)
		];

		appendPrintInfo3( _infoLines.join('<br/>&nbsp;&nbsp;&nbsp;&nbsp;') );
		// l( '\nMovie is playing '+(trigger.isForwardTrigger ? 'forwards' : 'backwards')+',\t\t'+_infoLines.slice(0,-2).join('\n\t') );
	}
}

welcomeMovie.stop(); // init
