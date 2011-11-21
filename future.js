(function(define) {

    define([], function() {

        /**
         * Utility function to remove a promise from
         * the list when resolved.
         *
         * @param promises
         * @param promise
         */

        function removeFromArray(promises, promise) {
            for(var i = 0, l = promises.length; i < l; i++) {
                if(promises[i] === promise) {
                    promises.splice(i, 1);
                    break;
                }
            }
        };

        /**
         * Future constructor
         */

        function Future() {
            this.promises = [];
            this._promises = [];
            this._then = function() {};
        };

        /**
         * Add a promise to Future.
         *
         * @param promise
         */

        Future.prototype.addPromise = function(promise) {
            this.promises.push(promise);
            this._promises.push(promise);
        };

        /**
         * Let Future know a promise has been resolved.
         *
         * Optionally provide a label which will be augmented
         * to the call to then().
         *
         * @param promise
         * @param [label]
         */

        Future.prototype.resolve = function(promise, label) {

            removeFromArray(this.promises, promise);

            if(label) {
                this._promises[label] = promise;
            }

            if(!this.promises.length) {
                this._then.apply(null, [this._promises]);
                this._promises = [];
            }
        };

        /**
         * Provide the function to be called when all promises are resolved
         *
         * @param fPromiseThen
         */

        Future.prototype.then = function(fPromiseThen) {
            this._then = fPromiseThen;
        };

        return Future;

    }); // define
})(typeof define != 'undefined'
    // use define for AMD if available
    ? define
    // If no define, look for module to export as a CommonJS module.
    // If no define or module, attach to current context.
    : typeof module != 'undefined'
    ? function(deps, factory) { module.exports = factory(); }
    : function(deps, factory) { this.Future = factory(); }
);
