
var actorTempWifi0 = welcomeMovie.easyAddActor('temp-wifi-0', '#temp-wifi-0');
WAT.applyAnimationTo(actorTempWifi0.locator, 'wak-things-pop-out-1', true, 0.36, 0.3);

var actorTempWifi1 = welcomeMovie.easyAddActor('temp-wifi-1', '#temp-wifi-1');
WAT.applyAnimationTo(actorTempWifi1.locator, 'wak-things-pop-out-3', true, 0.36, 1.3);



welcomeStage.viewport.scrollLeft = 1860;
document.body.on('click.show-wifi-spots', function() { WAT.resumeAnimationsOf( welcomeMovie.virtualActor('s5-all-wifi-spots').targets ); });

// welcomeMovie.stop(); // init
