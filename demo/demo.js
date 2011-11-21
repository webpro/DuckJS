(function(require) {

    require(["duck"], function(Duck) {

        Duck = Duck || window.Duck; // Compatibility with non-modular usage

        var button = document.getElementById('myButton');

        var demo = function() {

            Duck.load({
                content: '../demo/module.html',
                contentAppend: document.getElementById('modulePlaceholder'),
                css: '../demo/module.css',
                script: '../demo/module.js',
                callback: function(params, promises) {
                    document.getElementById('moduleContent').innerHTML += ' <em>script callback</em>';
                    MyModule.init();
                }
            });

        };

        if(window.addEventListener) {
            button.addEventListener('click', demo, false);
        } else if(window.attachEvent) {
            button.attachEvent('onclick', demo);
        }

    });
})(typeof require != 'undefined' ? require : function(deps, factory) { factory();});
