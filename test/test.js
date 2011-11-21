var testButton = document.getElementById('myTestButton');

var assert = function(assertion, value) {
    return assertion === value;
}

var test = function() {

    var tests = [];

    var mc = document.getElementById('moduleContent');

    // HTML appended to DOM?
    tests.push(assert(typeof mc, 'object'));

    // Javascript executed?
    tests.push(assert(document.getElementById('myButton').innerHTML, 'Module loaded'));

    // CSS applied?
    var pl = mc.currentStyle ? mc.currentStyle.paddingLeft : document.defaultView.getComputedStyle(document.getElementById('moduleContent'),null).getPropertyValue('padding-left');
    tests.push(assert(pl, '10px'));

    // Callback executed?
    tests.push(assert(mc.textContent.indexOf('script callback'), 15));

    for(var i = 0, l = tests.length; i < l; i++) {
        console.log("Test " + (i+1) + (tests[i] ? " passed" : " failed"));
    };

};

if(window.addEventListener) {
    testButton.addEventListener('click', test, false);
} else if(window.attachEvent) {
    testButton.attachEvent('onclick', test);
}
