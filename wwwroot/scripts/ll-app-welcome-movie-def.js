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

welcomeMovie.addActor('cloud-1', qS('#cloud-1'), qS('#cloud-1 > .size > .symbol'));
welcomeMovie.addActor('cloud-2', qS('#cloud-2'), qS('#cloud-2 > .size > .symbol'));
welcomeMovie.addActor('cloud-3', qS('#cloud-3'), qS('#cloud-3 > .size > .symbol'));







// ----- Story teller: build actionsLib --------------------------------------

var actorActionsLib = {
	cloudFlyForward: function () {
		l(this.locator.id, 'cloudFlyForward');
		this.locator.classList.remove('fly-backward');
		this.locator.classList.add('fly-forward');
	},
	cloudFlyBackward: function () {
		l(this.locator.id, 'cloudFlyBackward');
		this.locator.classList.remove('fly-forward');
		this.locator.classList.add('fly-backward');
	}
}







// ----- Story teller: associate actions to actors --------------------------------------

welcomeMovie.actors['cloud-1'].defineAction('fly-forward', actorActionsLib.cloudFlyForward);
welcomeMovie.actors['cloud-2'].defineAction('fly-forward', actorActionsLib.cloudFlyForward);
welcomeMovie.actors['cloud-3'].defineAction('fly-forward', actorActionsLib.cloudFlyForward);

welcomeMovie.actors['cloud-1'].defineAction('fly-backward', actorActionsLib.cloudFlyBackward);
welcomeMovie.actors['cloud-2'].defineAction('fly-backward', actorActionsLib.cloudFlyBackward);
welcomeMovie.actors['cloud-3'].defineAction('fly-backward', actorActionsLib.cloudFlyBackward);





// ----- Story teller: decide when actions of actors should be triggered --------------------------------------

welcomeMovie.addTriggeredAction( 'cloud-1', { triggerForward:   70, triggerBackward:  210, forwardActionId: 'fly-forward', backwardActionId: 'fly-backward' } );
welcomeMovie.addTriggeredAction( 'cloud-2', { triggerForward:  130, triggerBackward:  240, forwardActionId: 'fly-forward', backwardActionId: 'fly-backward' } );
welcomeMovie.addTriggeredAction( 'cloud-3', { triggerForward:  100, triggerBackward:  230, forwardActionId: 'fly-forward', backwardActionId: 'fly-backward' } );
