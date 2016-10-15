'use strict';

/*
    eslint no-extend-native:0
 */


// ES6: String.prototype.includes()
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}
