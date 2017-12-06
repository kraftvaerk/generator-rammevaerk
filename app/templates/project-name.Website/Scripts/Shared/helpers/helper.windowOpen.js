import $ from 'jquery';

export default function windowOpen() {
    $('.js-helper-window-open').on('click', function(e){
        const elm = $(this);
        const url = elm.attr('href');
        const name = elm.attr('target');
        const specs = elm.data('specs');

        window.open(url, name, specs || 'width=600, height=300, titlebar=0, menubar=0, status=0');
        e.preventDefault();
    });
}
