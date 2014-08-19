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
	var _indent = '<br/>&nbsp;&nbsp;';
	var info = document.createElement('H3');
		info.id = 'info';

		var _margin = '10px';
		var _padding = '10px';

		info.style.display = 'none';
		info.style.position = 'fixed';
		info.style.left = '0';
		info.style.top = '0';
		info.style.marginTop =			_margin;
		info.style.marginRight =		_margin;
		info.style.marginBottom =		_margin;
		info.style.marginLeft =			_margin;
		info.style.paddingTop =			_padding;
		info.style.paddingRight =		_padding;
		info.style.paddingBottom =		_padding;
		info.style.paddingLeft =		_padding;
		info.style.color =				'black';
		
		if (website.env.ua.ie8OrOlder) {
			info.style.backgroundColor =	'white';
			info.style.filter =				'alpha(opacity=87)';
		} else {
			info.style.backgroundColor =	'rgba(255,255,255,0.87)';
		}

	document.body.appendChild(info);

	// welcomeMovie.onStop = function () { printDynamicInfo2.call(this.stage); }
	// welcomeMovie.onPlay = function () { printDynamicInfo2.call(this.stage); }
	welcomeMovie.triggeredActions[0].onTrigger = function(trigger) { printTriggeredActionInfo.call(this, trigger) };

	function printDebugInfo() {
		info.innerHTML = ''
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
		info.style.display = 'block';
	}

	function printDynamicInfo(innerHTML) {
		info.innerHTML = innerHTML;
		info.style.display = 'block';
	}

	function printDynamicInfo2() {
		info.innerHTML = ''
			+ 'stage elapsed:'
			+ _indent + 'raw = ' + Math.round(this.elapsed*1000)/1000
			+ _indent + 'Remapped = ' + Math.round(this.elapsedRemapped*1000)/1000
			+ _indent + 'RemappedMiddle = ' + Math.round(this.elapsedRemappedMiddle*1000)/1000
			+ _indent + 'RemappedRight = ' + Math.round(this.elapsedRemappedRight*1000)/1000
			+ _indent + 'Ratio = ' + Math.round(this.elapsedRatio*1000)/1000
			+ '<br/>Movie:'
			+ _indent + 'isPlayingForward = ' + welcomeMovie.isPlayingForward
			;
		info.style.display = 'block';
	}

	function printTriggeredActionInfo(trigger) {
		// l(this.actor.locator);
		printDynamicInfo( this.actor.locator.id+'<br/>'+trigger.actionId+'<br/>elapsed = '+trigger.elapsed+'/'+welcomeMovie.stage.elapsedRemapped );
	}
}

