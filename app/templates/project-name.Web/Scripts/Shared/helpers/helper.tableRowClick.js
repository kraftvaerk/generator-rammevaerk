'use strict';

import $ from 'jquery';

export default function tableRowClick () {
    $('.table').on('click', '.js-helper-table-row-click', function(){
        window.location = $(this).find('a').first().attr('href');
        return false;
    });
}
