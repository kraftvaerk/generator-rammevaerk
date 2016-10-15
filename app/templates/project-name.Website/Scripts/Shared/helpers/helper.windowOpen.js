'use strict';

import $ from 'jquery';

export default function windowOpen() {
    $('.js-helper-window-open').on('click', function(e){
        const url = $(this).attr('href');
        const name = $(this).attr('target');
        const specs = $(this).data('specs');

        window.open(url, name, specs || 'width=600, height=300, titlebar=0, menubar=0, status=0');
        e.preventDefault();
    });
}
