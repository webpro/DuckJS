(function(root, factory) {
	if(typeof define === 'function' && define.amd) {
		define(['./rsvp.amd'], factory);
	} else {
		root.Duck = factory(root.RSVP);
	}
}(this, function(RSVP) {

	var isGecko = ('MozAppearance' in document.documentElement.style);
	var isWebkit = ('webkitAppearance' in document.documentElement.style);

	/**
	 * Main method to load all or some of: HTML, CSS, Javascript
	 *
	 * @param {string} options.content Url to HTML resource
	 * @param {object} options.contentAppend DOM node to append HTML to
	 * @param {string} options.css Url to CSS resource
	 * @param {string} options.script Url to Javascript resource
	 * @param {function} options.callback Function to execute when all resources are fetched/parsed/executed
	 */

	var load = function(options) {

		var promises = [];

		var resourceTypes = ['css', 'content', 'script'], i, j, il = resourceTypes.length, jl, resourceType, url, fLoad;

		for(i = 0; i < il; i++) {
			resourceType = resourceTypes[i];
			url = options[resourceType];
			if(url) {
				if(typeof url === 'string') {
					promises.push(_[resourceType].call(this, url));
				} else if(url.length) {
					for(j = 0, jl = url.length; j < jl; j++) {
						promises.push(_[resourceType].call(this, url[j]));
					}
				}
			}
		}

		RSVP.all(promises).then(function(resolvedPromises) {

			var il = resolvedPromises.length,
				promise;

			// Only here we inject the HTML, to be sure the CSS is in as well (to prevent from FOUC)
			for(var i = 0; i < il; i++) {
				promise = resolvedPromises[i];
				if(typeof promise === 'string') {
					options.contentAppend.innerHTML = promise;
				}
			}

		}).then(function() {
			// Execute callback, and pass original parameters
			if(options.callback) {
				options.callback(options);
			}
		})

	};

	/**
	 * Load and append HTML
	 *
	 * @param {string} url
	 * @return {Promise}
	 */

	var content = function(url) {

		var promise = new RSVP.Promise(),
			request = new XMLHttpRequest();

		request.onreadystatechange = function() {

			if(this.readyState === 4) {

				if(this.status >= 200 && this.status < 300 || this.status === 304) {

					promise.resolve(this.response);

				}
			}
		};

		request.open('GET', url, true);
		request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		request.send();

		return promise;

	};

	/**
	 * Load and execute script
	 *
	 * @param {string} url
	 * @return {Promise}
	 */

	var script = function(url) {

		var promise = new RSVP.Promise();

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.async = true;
		script.src = url.match(/\.js$/) ? url : url + '.js';

		script.onreadystatechange = script.onload = function() {

			if(!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {

				promise.resolve(script);

				script.onload = script.onreadystatechange = null;

			}
		};

		var a = document.getElementsByTagName('script')[0];
		a.parentNode.insertBefore(script, a);

		return promise;

	};

	/**
	 * Load and apply stylesheet
	 *
	 * @param {string} url
	 * @return {Promise}
	 */

	var css = function(url) {

		var promise = new RSVP.Promise();

		var stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.type = 'text/css';
		stylesheet.href = url;

		if(!(isWebkit || isGecko)) {

			stylesheet.onload = function() {
				promise.resolve(stylesheet);
			};

		} else {

			var done = false;

			var poll = function(stylesheet) {
				window.setTimeout(function() {
					if(!done) {
						try {
							if(stylesheet.sheet.cssRules.length) {
								done = true;
								promise.resolve(stylesheet);
							} else {
								poll(stylesheet);
							}
						} catch(e) {
							if((e.code === 1e3) || (e.message === 'security' || e.message === 'denied')) {
								done = true;
								// We just resolve (although CSS is not loaded), because we only implemented happy path
								promise.resolve(stylesheet);
							} else {
								poll(stylesheet);
							}
						}
					}
				}, 0);
			};
			poll(stylesheet);
		}

		document.getElementsByTagName("head")[0].appendChild(stylesheet);

		return promise;

	};

	// Private members

	var _ = {
		content: content,
		script: script,
		css: css
	};

	// Public API

	return {
		load: load
	};

}));
