var MyModule = function() {

    var init = function() {
        document.getElementById('moduleContent').innerHTML += ' <b>MyModule initialized</b>';
    };

    document.getElementById('myButton').innerHTML = 'Module loaded';

    return {
        init: init
    };

}();
