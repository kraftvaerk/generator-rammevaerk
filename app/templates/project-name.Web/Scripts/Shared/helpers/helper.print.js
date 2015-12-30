'use strict';

import $ from 'jquery';

export default function printPage(){
    $('.js-helper-print').on('click', function(e){
        window.print();
        e.preventDefault();
    });
}
