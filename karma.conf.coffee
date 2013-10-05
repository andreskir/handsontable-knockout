# Karma configuration
# Generated on Tue Sep 24 2013 00:54:42 GMT-0300 (ART)

module.exports = (config) ->
	testsBasePath = 'tests/'
	sourcesBasePath = ''

	suites = [
		'helpers'
	]

	paths = ["#{testsBasePath}{0}/**/*.coffee", "#{sourcesBasePath}{0}/**/*.js"]

	allFiles = suites
		.map((suite) -> paths.map (path) -> path.replace "{0}", suite) 
		.reduce((one, another) -> one.concat another)

	filesThatMustBeLoadedFirst = [
		"#{sourcesBasePath}lib/jquery-2.0.2.js",
		"#{sourcesBasePath}lib/knockout-2.2.0.js",
		"#{sourcesBasePath}lib/knockout.mapping-2.3.5.js",
		"#{sourcesBasePath}viewModel/viewModel.coffee"
		"#{sourcesBasePath}customCells/hasPopupRenderer.coffee"
	]	

	config.set
		# Sources
		frameworks: ['qunit']
		files: filesThatMustBeLoadedFirst.concat allFiles
		exclude: [
			"#{sourcesBasePath}Helpers/onLoad.js",
		]
		
		# Runner
		reporters: ['progress', 'growl']
		browsers: ['PhantomJS']
		captureTimeout: 60000
		port: 9876
		autoWatch: true
		
		# Output
		logLevel: config.LOG_INFO
