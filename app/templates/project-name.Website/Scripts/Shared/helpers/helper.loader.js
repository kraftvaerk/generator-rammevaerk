import $ from 'jquery';

let instance = null;
let timer = null;

export default class Loader {
    constructor(options = {}) {
        const defaults = {
            loaderClass: 'is-loading',
            container: $(window.document.body),
            tpl: `<div id="loader" class="loader__overlay">
                        <div class="loader__container" data-loader-label="${options.label ? options.label : 'LOADING'}">
                            <i class="spinner"></i>
                        </div>
                    </div>`,
            timeout: 10000,
            ajaxMonitor: false
        };

        this.options = Object.assign(defaults, options);

        if (!instance) {
            instance = this;

            this._state = 0;

            this.options.container.append(this.options.tpl);
            this.options.loader = this.options.container.find('#loader');

            this._setup();
        } else {
            instance.options = Object.assign(instance.options, options);
            instance.options.loader.find('[data-loader-label]').attr('data-loader-label', instance.options.label);
        }

        return this.options.container;
    }

    _setup() {
        this.options.loader.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', () => this._animationEnd());

        this.options.container.on('loader:show', () => this._show());
        this.options.container.on('loader:hide', () => this._hide());
    }

    _show() {
        clearTimeout(timer);

        timer = setTimeout(() => this._hide(), instance.options.timeout);

        this.options.loader.show(() => {
            this.options.container.addClass(this.options.loaderClass);
            this._state = 1;
        });
    }

    _hide() {
        clearTimeout(timer);

        this.options.container.removeClass(this.options.loaderClass);
        this._state = 0;
    }

    _animationEnd() {
        if (this._state === 0){
            this.options.loader.removeAttr('style');
        }
    }

    _ajaxMonitor() {
        // TODO
    }
}
