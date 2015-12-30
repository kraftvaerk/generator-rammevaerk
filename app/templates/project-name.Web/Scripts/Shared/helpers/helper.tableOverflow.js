'use strict';

import $ from 'jquery';

export default function tableOverflow(){
    $('.js-helper-table-overflow').each(function(){
        $(this).wrap('<div class="table-data-wrapper" />');

        if($(this).width() > $(this).parent('.table-data-wrapper').width()) {
            $(this).parent('.table-data-wrapper').addClass('table-data--overflow');
        }
    });
}
