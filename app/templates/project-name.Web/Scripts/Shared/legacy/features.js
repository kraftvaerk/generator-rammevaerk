'use strict';


//change className of html from .noJS to .hasJS.
(function(el){
    el.className = el.className.replace('no-js', 'has-js');
})(document.documentElement);
