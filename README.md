# DuckJS

## Motivation

Often do I identify the need to fetch only a minimum of resources on page load, in order to optimize perceived performance. All resources that are not required immediately should then be lazy loaded on demand. This tiny library provides the means to do just that.

There are not a lot of complete solutions to (lazy) load complete modules (i.e. JavaScript, _and_ CSS, _and_ HTML) in a simple and straightforward manner. Script loaders are common, but they usually support only JavaScript.

## yepnope

Why develop or use DuckJS when there is [yepnope](http://yepnopejs.com)? The popular (and deservedly so!) [yepnope](http://yepnopejs.com) library is a similar solution, but DuckJS has an even simpler API, is much smaller, and supports both CSS and HTML loading by default. On the other hand, DuckJS doesn't have the yep/nope feature tests for conditional resource loading, and also there is no plugin architecture. This is by design, to keep things simple.

## API

    Duck.load({
        content: 'module.html',
        contentAppend: document.getElementById('modulePlaceholder'),
        css: 'module.css',
        script: 'module.js',
        callback: function(){}
    });

Every option is optional.

It is also possible to load either content, CSS, or script directly/separately:

    Duck.loadContent('module.html', document.getElementById('modulePlaceholder'), callback);

    Duck.loadStylesheet('module.css', callback);

    Duck.loadScript('module.js', callback);

Additionally, an array can be provided to load multiple CSS or script resources, e.g.:

    Duck.load({
        content: 'module.html',
        contentAppend: document.getElementById('modulePlaceholder'),
        css: ['module.css', 'module-more.css'],
    });


## Features

* Fast & small (under 1K when minified/gzipped)
* Simple API
* Parses CSS before HTML is inserted (to prevent from FOUC)
* Execute module script asynchronously (and callback function at the end)
* Supports IE7+
* Supports AMD
* No dependencies
* Comes with a simple future/promises API for free

## Notes

* HTML content is fetched using XMLHttpRequest, which (apart from a CORS setup) does not support cross-domain requests.
* Stylesheets and scripts are loaded using their normal ``<link>`` and ``<script>`` elements and can be cross-domain.
* Any HTML content is simply set using `innerHTML` on the provided `contentAppend` argument property.

## Bonus: future/promises API

    var future = new Future();

    future.then(function() {
        // do when all promises are resolved
    });

    // Add n number of promises:
    future.addPromise(asyncFunction1(future));
    future.addPromise(asyncFunction2(future));

    asyncFunction1 = function(future) {

        promise = "arbitrary object or just a string";

        setTimeout(function(){
            future.resolve(promise); // when promise is resolved
        }, 100);

        return promise;
    };

NB This is not a [CommonJS Promises/A](http://wiki.commonjs.org/wiki/Promises/A) implementation.

## Credits

Many thanks to [Spil Games](http://www.spilgames.com) for allowing me to open source this and develop it further during working hours.

Lots of thanks go to the inspiritational likes of:

* Alex Sexton & Ralph Holzmann (http://yepnopejs.com)
* Stoyan Stefanov (http://www.phpied.com/when-is-a-stylesheet-really-loaded/)
* John Hann (https://github.com/unscriptable/promises)
* Brian Cavalier (https://github.com/briancavalier/when.js)
