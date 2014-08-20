// ----- Stage and Movie init -------------------------------------------------

var welcomeStage = new Stage({
	viewportId:				'stage-viewport',
	stageId:				'stage',
	stageContentScalerId:	'stage-content-scaler',

	// viewportWidth:			320,
	// viewportHeight:			480,

	stageWidthAtFullScale:	4480,
	stageHeightAtFullScale:	717
});

var welcomeMovie = new Movie(welcomeStage);
	welcomeMovie.stop(); // init







// ----- Story teller: build actorsLib ---------------------------------------

function easyAddActorForScene(scenarioIndex, queryString) {
	var scenarioIdPrefix = 'scenario-';
	var actorNamePrefixOfSenario = 's';

	var _scenarioId,_actorName;

	_scenarioId	= '#'+scenarioIdPrefix+scenarioIndex;
	_actorName	= actorNamePrefixOfSenario+scenarioIndex + '-' + queryString.replace(/[#|\.]/g,'').replace(/\s+/g,'-');
	queryString	= _scenarioId + ' ' + queryString;

	// l('welcomeMovie.addActor("'+_actorName+'", "'+queryString+'");');
	return welcomeMovie.easyAddActor(_actorName, queryString);
}

welcomeMovie.easyAddActor('cloud-1', '#cloud-1');
welcomeMovie.easyAddActor('cloud-2', '#cloud-2');
welcomeMovie.easyAddActor('cloud-3', '#cloud-3');

easyAddActorForScene(1, '.bus-stop-pole');
easyAddActorForScene(1, '.bus-stop-trash-bin');

easyAddActorForScene(2, '.hotel');
easyAddActorForScene(2, '.hotel .brand');
easyAddActorForScene(2, '.coffee-shop');
easyAddActorForScene(2, '.coffee-shop .brand');

easyAddActorForScene(3, '.outdoor-seats');
easyAddActorForScene(3, '.outdoor-seats .base');
easyAddActorForScene(3, '.outdoor-seats .table');
easyAddActorForScene(3, '.outdoor-seats .umbrella');
easyAddActorForScene(3, '.outdoor-seats .boy');
easyAddActorForScene(3, '.outdoor-seats .girl');
easyAddActorForScene(3, '.outdoor-seats .waitress');
easyAddActorForScene(3, '.outdoor-seats .waitress .voice');

easyAddActorForScene(4, '.gigantic-phone');
easyAddActorForScene(4, '.gigantic-phone .boy');
easyAddActorForScene(4, '.gigantic-phone .girl');
easyAddActorForScene(4, '#gigantic-phone-tree-1');
easyAddActorForScene(4, '#gigantic-phone-tree-2');

easyAddActorForScene(5, '.green-land');
easyAddActorForScene(5, '.green-land .building-1');
easyAddActorForScene(5, '.green-land .building-2');
easyAddActorForScene(5, '.green-land .building-twins');
easyAddActorForScene(5, '.green-land .building-twins .tower-1');
easyAddActorForScene(5, '.green-land .building-twins .tower-2');
easyAddActorForScene(5, '#green-land-wifi-1');
easyAddActorForScene(5, '#green-land-wifi-2');
easyAddActorForScene(5, '#green-land-wifi-3');
easyAddActorForScene(5, '#green-land-wifi-4');
easyAddActorForScene(5, '#green-land-wifi-5');
easyAddActorForScene(5, '#green-land-wifi-6');
easyAddActorForScene(5, '#green-land-wifi-7');
easyAddActorForScene(5, '#green-land-wifi-8');
easyAddActorForScene(5, '#green-land-wifi-9');
easyAddActorForScene(5, '#green-land-wifi-10');
easyAddActorForScene(5, '#green-land-wifi-hero');
easyAddActorForScene(5, '#green-land-tree-1');
easyAddActorForScene(5, '#green-land-tree-2');
easyAddActorForScene(5, '#green-land-tree-3');
easyAddActorForScene(5, '#green-land-tree-4');

welcomeMovie.addVirtualActor('s5-all-wifi-spots', Array.prototype.slice.call(qSA('[id*=green-land-wifi-]')) );




// ----- Story teller: build actionsLib --------------------------------------

var actorActionsLib = new (function () {
	function _clearAnimationsForActorOfAnyType () {
		var _targets = (this instanceof Actor) ? this.locator : this.targets;
		WAT.clearAnimationsOf(_targets);
	}

	this.cloudFlyForward = function () {
		this.locator.classList.remove('fly-backward');
		this.locator.classList.add('fly-forward');
	}

	this.cloudFlyBackward = function () {
		this.locator.classList.remove('fly-forward');
		this.locator.classList.add('fly-backward');
	}

	this.clearAnimations = function () {
		_clearAnimationsForActorOfAnyType.call( this );
	}

	this.s5_allWifiSpotsReset = function () {
		_clearAnimationsForActorOfAnyType.call( this );
		WAT.setScales(this.targets, 0.01);
	}

	this.s5_allWifiSpotsPrepareForJumpingOut = function () {
		WAT.oneByOneJumpOut(this.targets, 'paused', 3, { delayGlobal: 0.5 });
	}

	this.s5_allWifiSpotsJumpOut = function () {
		WAT.resumeAnimationsOf(this.targets);
	}
});







// ----- Story teller: associate actions to actors --------------------------------------

welcomeMovie.actor('cloud-1').defineAction('fly-forward', actorActionsLib.cloudFlyForward);
welcomeMovie.actor('cloud-2').defineAction('fly-forward', actorActionsLib.cloudFlyForward);
welcomeMovie.actor('cloud-3').defineAction('fly-forward', actorActionsLib.cloudFlyForward);

welcomeMovie.actor('cloud-1').defineAction('fly-backward', actorActionsLib.cloudFlyBackward);
welcomeMovie.actor('cloud-2').defineAction('fly-backward', actorActionsLib.cloudFlyBackward);
welcomeMovie.actor('cloud-3').defineAction('fly-backward', actorActionsLib.cloudFlyBackward);

welcomeMovie.virtualActor('s5-all-wifi-spots').defineAction('reset', actorActionsLib.s5_allWifiSpotsReset);
welcomeMovie.virtualActor('s5-all-wifi-spots').defineAction('prepare-to-jump-out-one-by-one', actorActionsLib.s5_allWifiSpotsPrepareForJumpingOut);
welcomeMovie.virtualActor('s5-all-wifi-spots').defineAction('jump-out-one-by-one', actorActionsLib.s5_allWifiSpotsJumpOut);






// ----- Story teller: decide when actions of actors should be triggered --------------------------------------

welcomeMovie.addTriggerAction( 'cloud-1', { forward: { onElapsed:   70, actionId: 'fly-forward' }, backward: { onElapsed: 210,  actionId: 'fly-backward' } } );
welcomeMovie.addTriggerAction( 'cloud-2', { forward: { onElapsed:  130, actionId: 'fly-forward' }, backward: { onElapsed: 240,  actionId: 'fly-backward' } } );
welcomeMovie.addTriggerAction( 'cloud-3', { forward: { onElapsed:  100, actionId: 'fly-forward' }, backward: { onElapsed: 230,  actionId: 'fly-backward' } } );

welcomeMovie.addTriggerAction( 's5-all-wifi-spots', { backward: { onElapsed: 2580, actionId: 'reset' } } );
welcomeMovie.addTriggerAction( 's5-all-wifi-spots', { forward:  { onElapsed: 2560, actionId: 'prepare-to-jump-out-one-by-one' } } );
welcomeMovie.addTriggerAction( 's5-all-wifi-spots', { forward:  { onElapsed: 3333, actionId: 'jump-out-one-by-one' } } );
