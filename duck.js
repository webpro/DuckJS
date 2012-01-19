(function(define) {

    define(['./future'], function(Future) {

        Future = Future || window.Future; // Compatibility with non-modular usage

        var isGecko = ('MozAppearance' in document.documentElement.style);
        var isWebkit = ('webkitAppearance' in document.documentElement.style);

        /**
         * Main method to load all or some of: HTML, CSS, Javascript
         *
         * @param {string} parameters.content Url to HTML resource
         * @param {object} parameters.contentAppend DOM node to append HTML to
         * @param {string} parameters.css Url to CSS resource
         * @param {string} parameters.script Url to Javascript resource
         * @param {function} parameters.callback Function to execute when all resources are fetched/parsed/executed
         */

        var load = function() {

            var parameters = arguments[0];

            var future = new Future();

			var resourceTypes = ['css', 'content', 'script'], i, j, il = resourceTypes.length, jl, t, url, fLoad;

			for(i = 0; i < il; i++) {
				t = resourceTypes[i];
				url = parameters[t];
				if(url) {
					fLoad = 'load' + t.charAt(0).toUpperCase() + t.slice(1); // E.g. "load" + "script" becomes "loadScript()"
					if(typeof url === 'string') {
						future.addPromise(this[fLoad].call(this, url, future));
					} else if (url.length) {
						for(j = 0, jl = url.length; j < jl; j++) {
							future.addPromise(this[fLoad].call(this, url[j], future));
						}
					}
				}
			}

            future.then(function(resolvedPromises) {

                // Only here we inject the HTML, to be sure the CSS is in as well (to prevent from FOUC)
                if(resolvedPromises['content'] && parameters.contentAppend) {
                    var request = resolvedPromises['content'];
                    parameters.contentAppend.innerHTML = request.responseText;
                }

                // Execute callback, and pass original parameters, and resolved promises
                if(parameters.callback) {
                    parameters.callback.apply(null, [parameters, resolvedPromises]);
                }
            });

        };

        /**
         * Load and append HTML
         *
         * @param {string} url
         * @param [future] Either a Future object, a DOM node, or a callback function.
         */

        var loadContent = function(url, future) {

            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {

                if(this.readyState === 4) {

                    if(this.status >= 200 && this.status < 300 || this.status === 304) {

                        _finish(future, this, 'content');

                    }
                }
            };

            request.open('GET', url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send();

            return request;

        };

        /**
         * Load and execute script
         *
         * @param {string} url
         * @param [future] Either a Future object, or a callback function.
         */

        var loadScript = function(url, future) {

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = url.match(/\.js$/) ? url : url + '.js';

            script.onreadystatechange = script.onload = function () {

                if(!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {

                    _finish(future, script);

                    script.onload = script.onreadystatechange = null;

                }
            };

            var a = document.getElementsByTagName('script')[0];
            a.parentNode.insertBefore(script, a);

            return script;

        };

        /**
         * Load and apply stylesheet
         *
         * @param {string} url
         * @param [future] Either a Future object, or a callback function.
         */

        var loadCss = function(url, future) {

            var stylesheet = document.createElement('link');
            stylesheet.rel = 'stylesheet';
            stylesheet.type = 'text/css';
            stylesheet.href = url;

            if(!(isWebkit || isGecko)) {

                stylesheet.onload = function () {
                    _finish(future, stylesheet);
                };

            } else {

                var done = false;

                var poll = function(stylesheet) {
                    window.setTimeout(function() {
                        if(!done) {
                            try {
                                if(stylesheet.sheet.cssRules.length) {
                                    done = true;
                                    _finish(future, stylesheet);
                                } else {
                                    poll(stylesheet);
                                }
                            } catch(e) {
                                if((e.code === 1e3) || (e.message === 'security' || e.message === 'denied')) {
                                    done = true;
                                    _finish(future, stylesheet);
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

            return stylesheet;

        };

        /**
         * Private method to handle either resolved promises and/or callback functions
         *
         * @param future Future or callback function
         * @param promise Resolved promise
         * @param {string} [label]
         */

        var _finish = function(future, promise, label) {

            if(future) {

                if(future.resolve) {

                    future.resolve(promise, label); // Resolve a promise

                } else if(typeof future === 'function') {

                    future.call(null, promise); // Execute callback, passing the promise as argument

                } else if(future.innerHTML) {

                    future.innerHTML = promise.responseText; // Append to DOM

                }
            }
        };

        /**
         * Return public API
         */

        return {
            load: load,
            loadContent: loadContent,
            loadCss: loadCss,
            loadScript: loadScript
        };

    });
})(typeof define != 'undefined' ? define : function(deps, factory) { this.Duck = factory(); });
