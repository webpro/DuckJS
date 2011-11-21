# Duck

## Motivation

There are not a lot of solutions (if at all) to lazy-load complete modules (i.e. HTML, CSS _and_ Javascript) in a simple and straightforward manner.

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


## Features

* Fast & small (under 1K when minified/gzipped)
* Simple API
* Support for CommonJS and AMD
* No dependencies
* Support for IE7+
* Parses CSS before HTML is inserted (to prevent from FOUC)
* Execute module script asynchronously (and callback function at the end)
* Comes with a simple future/promises API for free

## Bonus future/promises API

    var future = new Future();

    future.then(function() {
        // do when all promises are resolved
    });

    // Add n number of promises:
    future.addPromise(asyncFunction1(future));
    future.addPromise(asyncFunction2(future));

    asyncFunction1 = function(future) {

        setTimeout(function(){
            future.resolve(promise); // when promise is resolved
        }, 100);

        return promise;
    };

NB This is not a [CommonJS Promises/A](http://wiki.commonjs.org/wiki/Promises/A) implementation.

## Credits

Lots of thanks go to the inspiritational likes of:

* Alex Sexton & Ralph Holzmann (http://yepnopejs.com)
* Stoyan Stefanov (http://www.phpied.com/when-is-a-stylesheet-really-loaded/)
* John Hann (https://github.com/unscriptable/promises)
* Brian Cavalier (https://github.com/briancavalier/when.js)

## Why "duck"?

All my projects are named after animal species. This one is called after ducks, referring to "dive below the surface" and grab something (i.e. the resources for a module).
