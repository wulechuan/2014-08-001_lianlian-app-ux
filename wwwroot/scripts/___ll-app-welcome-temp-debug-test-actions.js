
var actorTempWifi0 = welcomeMovie.easyAddActor('temp-wifi-0', '#temp-wifi-0');
WAT.applyAnimationTo(actorTempWifi0.locator, 'wak-things-pop-out-1', true, 0.36, 0.3);

var actorTempWifi1 = welcomeMovie.easyAddActor('temp-wifi-1', '#temp-wifi-1');
WAT.applyAnimationTo(actorTempWifi1.locator, 'wak-things-pop-out-3', true, 0.36, 1.3);


welcomeMovie.stop(); // init
welcomeStage.viewport.scrollLeft = 1860;
document.body.on('click.show-wifi-spots', function() { WAT.resumeAnimationsOf( welcomeMovie.virtualActor('s5-all-wifi-spots').targets ); });

// var t = new WLCTrigger(3, /*function () { l(welcomeMovie.elapsed); return welcomeMovie.elapsed; }*/null, null, function (v) { return v > this.triggerValue; }, { disabled: true, autoResetAllowed: true, countLimit: 6 });

var bdt = new WLCBidirectionalTrigger(

	function () {
		l(welcomeMovie.isPlayingForward);
		return welcomeMovie.isPlayingForward;
	},

	{
		disabled: false,
		summaryCountLimit: 1,
		forward:  {
			triggerValue:			100,
			observeValue:			function () { l(welcomeMovie.elapsed); return welcomeMovie.elapsed; },
			exameValueForTrigger:	null,
			exameValueForReset:		null,
			options: { countLimit: 5 }
		},
		backward:  {
			triggerValue:			100,
			observeValue:			function () { l(welcomeMovie.elapsed); return welcomeMovie.elapsed; },
			exameValueForTrigger:	null,
			exameValueForReset:		null,
			options: { countLimit: 5 }
		}
	}
);

l('bdt:', bdt);
