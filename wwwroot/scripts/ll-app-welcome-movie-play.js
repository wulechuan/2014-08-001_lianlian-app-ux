(function() { // delete resources-loader-0
	var tempResLoader = document.getElementById('resources-loader-0');
	if (tempResLoader) { tempResLoader.parentNode.removeChild(tempResLoader); }
	delete tempResLoader;
})();





$(welcomeStage.viewport).on('scroll', function (e) { welcomeMovie.play(); });
