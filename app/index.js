'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _yosay = require('yosay');

var _yosay2 = _interopRequireDefault(_yosay);

var _superb = require('superb');

var _superb2 = _interopRequireDefault(_superb);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yeomanGenerator = require('yeoman-generator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function capitalizeKebabCase(name) {
    return _lodash2.default.reduce(name.split('-'), function (acc, str, index) {
        var separator = index === 0 ? '' : ' ';
        return (acc + separator + _lodash2.default.upperFirst(str)).split(' ').join('-');
    }, '');
}

function copyDirectory(source, destination, globPatternStr, bulk) {
    var _this = this;

    var root = this.templatePath(source);
    var dest = this.destinationPath(destination);
    var files = _globby2.default.sync(globPatternStr, { dot: true, nodir: true, cwd: root });
    var cp = this.copy;

    if (bulk) {
        cp = this.bulkCopy;
    }

    files.forEach(function (file) {
        cp.call(_this, _path2.default.join(root, file), _path2.default.join(dest, file));
    });
}

var Generator = function (_Base) {
    _inherits(Generator, _Base);

    function Generator() {
        var _ref;

        _classCallCheck(this, Generator);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        // The appname argument is optional. If not provided Yeoman infers it from
        // the name of the current working directory.
        // this.argument('appname', {
        //     type: String,
        //     required: false,
        // });

        var _this2 = _possibleConstructorReturn(this, (_ref = Generator.__proto__ || Object.getPrototypeOf(Generator)).call.apply(_ref, [this].concat(args)));
        // Call the parent constructor


        _this2.option('keep-silence', {
            desc: 'Test framework to be invoked',
            type: Boolean
        });
        return _this2;
    }

    _createClass(Generator, [{
        key: 'initializing',
        get: function get() {
            return {
                vaerkInit: function vaerkInit() {
                    this.projectYear = new Date().getFullYear();
                    this.answers = {};

                    if (!this.options['keep-silence']) {
                        this.log((0, _yosay2.default)(_chalk2.default.yellow('Initializing a ' + (0, _superb2.default)() + ' new rammevaerk project')));
                    }
                }
            };
        }
    }, {
        key: 'prompting',
        get: function get() {
            return {
                vaerkPrompts: function vaerkPrompts() {
                    var _this3 = this;

                    var done = this.async();
                    var questions = [];

                    if (!this.options['keep-silence']) {
                        this.log('-------------------------------------------------------');
                        this.log('Please answers the following questions.');
                        this.log('-------------------------------------------------------\n');
                    }

                    // Project name
                    questions.push({
                        type: 'input',
                        name: 'projectName',
                        message: _chalk2.default.yellow('What is your project name?'),
                        default: _lodash2.default.kebabCase(this.appname),
                        filter: _lodash2.default.kebabCase,
                        validate: function validate(name) {
                            return name.length > 0;
                        }
                    });

                    // Project description
                    questions.push({
                        type: 'input',
                        name: 'projectDescription',
                        message: _chalk2.default.yellow('How would you describe it?'),
                        default: 'N/A'
                    });

                    // Project URL
                    questions.push({
                        type: 'input',
                        name: 'projectUrl',
                        message: _chalk2.default.yellow('What is the project homepage URL?'),
                        default: 'N/A'
                    });

                    // Version control
                    questions.push({
                        type: 'list',
                        name: 'projectVersionControl',
                        message: _chalk2.default.yellow('Which version control system will you be using?'),
                        choices: ['GIT', 'SVN'],
                        default: 'GIT',
                        filter: function filter(vcs) {
                            return vcs.toLowerCase();
                        }
                    });

                    // Repository URL
                    questions.push({
                        type: 'input',
                        name: 'projectRepositoryUrl',
                        message: _chalk2.default.yellow('What is the repository URL?'),
                        default: 'https://tfs.kraftvaerk.com/tfs/KvCollection/_git/' + _lodash2.default.kebabCase(this.appname)
                    });

                    // Integrated Development Environment
                    questions.push({
                        type: 'checkbox',
                        name: 'projectIDE',
                        message: _chalk2.default.yellow('Which IDE(s) will you be using?'),
                        choices: [{
                            name: 'SublimeText',
                            checked: true
                        }, {
                            name: 'Visual Studio',
                            checked: true
                        }, {
                            name: 'Atom'
                        }],
                        default: ['sublimeText', 'visualStudio'],
                        filter: function filter(IDEs) {
                            return IDEs.map(function (IDE) {
                                return _lodash2.default.camelCase(IDE);
                            });
                        }
                    });

                    // Linting
                    questions.push({
                        type: 'checkbox',
                        name: 'projectLinters',
                        message: _chalk2.default.yellow('Do you want code linting for the folowing?'),
                        choices: [{
                            name: 'Scripts',
                            checked: true
                        }, {
                            name: 'Styles',
                            checked: true
                        }],
                        default: ['scripts', 'styles'],
                        filter: function filter(linters) {
                            return linters.map(function (linter) {
                                return linter.toLowerCase();
                            });
                        }
                    });

                    // Project libraries
                    questions.push({
                        type: 'list',
                        name: 'projectLibraries',
                        message: _chalk2.default.yellow('Which libraries will you be using?'),
                        choices: ['jQuery', 'jQuery + Angular', 'React'],
                        default: 'jQuery',
                        filter: function filter(lib) {
                            return lib.toLowerCase();
                        }
                    });

                    // Project modules
                    questions.push({
                        type: 'checkbox',
                        name: 'projectModules',
                        message: _chalk2.default.yellow('Which frontend modules do you want to include?'),
                        choices: [{
                            name: 'SVG Sprites',
                            checked: true
                        }, {
                            name: 'Lazyload Images',
                            checked: true
                        }, {
                            name: 'Animations On Scroll',
                            checked: false
                        }, {
                            name: 'Lightbox',
                            checked: true
                        }, {
                            name: 'Slider',
                            checked: true
                        }, {
                            name: 'Cookie consent',
                            checked: true
                        }, {
                            name: 'Datepicker',
                            disabled: true
                        }, {
                            name: 'GoogleMaps',
                            disabled: true
                        }],
                        default: ['lightbox', 'slider', 'cookieConsent', 'svgSprites', 'lazyloadImages'],
                        filter: function filter(IDEs) {
                            return IDEs.map(function (IDE) {
                                return _lodash2.default.camelCase(IDE);
                            });
                        }
                    });

                    // Project grid
                    questions.push({
                        type: 'input',
                        name: 'projectGridColumns',
                        message: _chalk2.default.yellow('How many columns does the grid consists of?'),
                        default: 12,
                        validate: function validate(val) {
                            if (!_lodash2.default.isNumber(Number(val))) {
                                return 'Please enter a valid number';
                            }

                            if (_lodash2.default.inRange(val, 1, 50)) {
                                return true;
                            }
                            return 'Please enter a valid number between 1 and 50';
                        }
                    });

                    // Project grid gutter
                    questions.push({
                        type: 'input',
                        name: 'projectGridGutter',
                        message: _chalk2.default.yellow('What is the size of the grid gutter? (px)'),
                        default: 30,
                        validate: function validate(val) {
                            if (_lodash2.default.isNumber(Number(val))) {
                                return true;
                            }
                            return 'Please enter a valid number';
                        }
                    });

                    // Project grid width
                    questions.push({
                        type: 'input',
                        name: 'projectGridWidth',
                        message: _chalk2.default.yellow('What is the max grid width? (px)'),
                        default: 1140,
                        validate: function validate(val) {
                            if (_lodash2.default.isNumber(Number(val))) {
                                return true;
                            }
                            return 'Please enter a valid number';
                        }
                    });

                    this.prompt(questions).then(function (answers) {
                        var gitName = _this3.user.git.name() ? ' \u2014 ' + _this3.user.git.name().split(' ')[0] : '.';

                        _this3.answers = answers;
                        _this3.answers.projectName = capitalizeKebabCase(_this3.answers.projectName);
                        _this3.answers.projectDescription = _this3.answers.projectDescription === 'N/A' ? 'I promise to add the description later on to this ' + (0, _superb2.default)() + ' new project' + gitName : _this3.answers.projectDescription;

                        done();
                    });
                }
            };
        }
    }, {
        key: 'writing',
        get: function get() {
            return {
                directories: function directories() {
                    var _this4 = this;

                    var done = this.async();
                    var folders = ['.Website', '.Website/Assets', '.Website/Content', '.Website/Fonts', '.Website/Styles', '.Website/Styles/' + this.answers.projectName, '.Website/Styles/Shared', '.Website/Scripts', '.Website/Scripts/' + this.answers.projectName, '.Website/Scripts/Shared'];

                    if (!this.options['keep-silence']) {
                        this.log('\n');
                        this.log.ok('Setting up directories...');
                    }

                    folders.forEach(function (folder) {
                        return _mkdirp2.default.sync(_this4.answers.projectName + folder);
                    });

                    done();
                },
                versionControl: function versionControl() {
                    var done = this.async();

                    if (this.answers.projectVersionControl.length) {
                        if (!this.options['keep-silence']) {
                            this.log.ok('Setting up versioning...');
                        }

                        if (_lodash2.default.includes(this.answers.projectVersionControl, 'git')) {
                            this.bulkCopy('_gitignore', '.gitignore');
                            this.bulkCopy('_gitattributes', '.gitattributes');
                        }
                    }

                    done();
                },
                IDE: function IDE() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up IDE...');
                    }

                    this.copy('_editorconfig', '.editorconfig');

                    if (_lodash2.default.includes(this.answers.projectIDE, 'sublimeText')) {
                        this.template('_project-name.sublime-project', this.answers.projectName + '.sublime-project');
                    }

                    done();
                },
                readme: function readme() {
                    var done = this.async();
                    var readme = void 0;

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the readme file...');
                    }

                    readme = this.fs.read(this.templatePath('README/_BODY.md'));

                    readme += '\n';

                    if (_lodash2.default.includes(this.answers.projectIDE, 'visualStudio')) {
                        readme += this.fs.read(this.templatePath('README/_IDE_visualStudio.md'));
                    }

                    if (_lodash2.default.includes(this.answers.projectIDE, 'sublimeText')) {
                        readme += this.fs.read(this.templatePath('README/_IDE_sublimeText.md'));
                    }

                    readme += this.fs.read(this.templatePath('README/_USAGE.md'));

                    readme = _lodash2.default.template(readme)(this);

                    this.fs.write(this.destinationPath('README.md'), readme);

                    done();
                },
                linting: function linting() {
                    var done = this.async();

                    if (this.answers.projectLinters.length) {
                        if (!this.options['keep-silence']) {
                            this.log.ok('Setting up the linting...');
                        }
                    }

                    if (_lodash2.default.includes(this.answers.projectLinters, 'scripts')) {
                        this.template('_eslintignore', '.eslintignore');
                        this.bulkCopy('_eslintrc', '.eslintrc');
                    }

                    if (_lodash2.default.includes(this.answers.projectLinters, 'styles')) {
                        this.bulkCopy('_stylelintrc', '.stylelintrc');
                    }

                    done();
                },
                gulp: function gulp() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the Gulp...');
                    }

                    this.linting = {
                        scripts: _lodash2.default.includes(this.answers.projectLinters, 'scripts'),
                        styles: _lodash2.default.includes(this.answers.projectLinters, 'styles')
                    };

                    this.directory('project-name.Gulp', this.answers.projectName + '.Gulp');

                    this.bulkCopy('_babelrc', '.babelrc');
                    this.copy('_gulpfile.js', 'gulpfile.js');

                    done();
                },
                packageJSON: function packageJSON() {
                    var done = this.async();
                    var pkg = {};

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the package.json...');
                    }

                    pkg = this.fs.readJSON(this.templatePath('PACKAGE/_BASE.json'));

                    // Info
                    pkg.name = this.answers.projectName;
                    pkg.description = this.answers.projectDescription;
                    pkg.homepage = this.answers.projectUrl;

                    // Contributors
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_CONTRIBUTORS.json'), {}));

                    var contributor = {};
                    if (this.user.git.name()) {
                        contributor.name = this.user.git.name();

                        if (this.user.git.email()) {
                            contributor.email = this.user.git.email();
                        }

                        contributor.url = 'http://github.com/';
                    } else {
                        contributor = {
                            name: 'Kraftvaerk',
                            url: 'http://github.com/kraftvaerk'
                        };
                    }

                    pkg.contributors.push(contributor);

                    // Version control
                    if (this.answers.projectVersionControl) {
                        pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_REPOSITORY.json'), {}));
                        pkg.repository.type = this.answers.projectVersionControl.toLowerCase();
                        pkg.repository.url = this.answers.projectRepositoryUrl;
                    }

                    // Node scripts
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_SCRIPTS.json'), {}));

                    // Keywords
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_KEYWORDS.json'), {}));
                    pkg.keywords.push(this.answers.projectName.toLowerCase());

                    // Engines
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_ENGINES.json'), {}));

                    // Dependencies
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_DEPENDENCIES.json'), {}));

                    // JSPM
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_JSPM.json'), {}));

                    pkg.jspm.directories.baseURL = this.answers.projectName + '.Website';
                    pkg.jspm.directories.packages = this.answers.projectName + '.Website/Content/Vendor';
                    pkg.jspm.configFile = this.answers.projectName + '.Website/Scripts/system.config.js';

                    // Dependencies
                    pkg.jspm.dependencies.jquery = 'npm:jquery';

                    if (_lodash2.default.includes(this.answers.projectModules, 'jquery + angular')) {
                        var overrides = {
                            'npm:angular@1.5.8': {
                                'main': 'angular.min'
                            }
                        };
                        pkg.jspm.overrides = Object.assign(pkg.jspm.overrides, overrides);
                        pkg.jspm.dependencies.angular = 'npm:angular@1.5.8';
                    }

                    if (_lodash2.default.includes(this.answers.projectModules, 'cookieConsent')) {
                        pkg.jspm.dependencies.cookieConsent = 'github:kraftvaerk/cookie-consent@0.0.3';
                    }

                    if (_lodash2.default.includes(this.answers.projectModules, 'lightbox')) {
                        var _overrides = {
                            'github:fancyapps/fancyBox@2.1.5': {
                                'main': 'source/jquery.fancybox',
                                'format': 'global',
                                'dependencies': {
                                    'jquery': 'npm:jquery@*'
                                },
                                'shim': {
                                    'source/jquery.fancybox': {
                                        'deps': ['jquery'],
                                        'exports': '$'
                                    }
                                }
                            }
                        };
                        pkg.jspm.overrides = Object.assign(pkg.jspm.overrides, _overrides);
                        pkg.jspm.dependencies.fancyBox = 'github:fancyapps/fancyBox@2.1.5';
                    }

                    if (_lodash2.default.includes(this.answers.projectModules, 'slider')) {
                        var _overrides2 = {
                            'github:OwlCarousel2/OwlCarousel2@2.1.6': {
                                'main': 'dist/owl.carousel.min'
                            }
                        };
                        pkg.jspm.overrides = Object.assign(pkg.jspm.overrides, _overrides2);
                        pkg.jspm.dependencies.owlCarousel = 'github:OwlCarousel2/OwlCarousel2@2.1.6';
                    }

                    if (_lodash2.default.includes(this.answers.projectModules, 'svgSprites')) {
                        pkg.jspm.dependencies.svg4everybody = 'npm:svg4everybody@2.0.3';
                    }

                    if (_lodash2.default.includes(this.answers.projectModules, 'lazyloadImages')) {
                        pkg.jspm.dependencies.lazysizes = 'github:aFarkas/lazysizes@2.0.0';
                    }

                    if (_lodash2.default.includes(this.answers.projectModules, 'animationsOnScroll')) {
                        pkg.jspm.dependencies.aos = 'github:michalsnik/aos@2.0.4';
                    }

                    // Write package.json
                    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

                    done();
                },

                projectfiles: function projectfiles() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the project files...');
                    }

                    this.use = {
                        slider: _lodash2.default.includes(this.answers.projectModules, 'slider'),
                        lightbox: _lodash2.default.includes(this.answers.projectModules, 'lightbox'),
                        cookieConsent: _lodash2.default.includes(this.answers.projectModules, 'cookieConsent'),
                        svgSprites: _lodash2.default.includes(this.answers.projectModules, 'svgSprites')
                    };

                    this.bulkCopy('project-name.Website/favicon.ico', this.answers.projectName + '.Website/favicon.ico');

                    this.bulkCopy('project-name.Website/Styles/Company/img/logo.svg', this.answers.projectName + '.Website/Styles/' + this.answers.projectName + '/img/logo.svg');

                    if (_lodash2.default.includes(this.answers.projectModules, 'svgSprites')) {
                        this.bulkDirectory('project-name.Website/Styles/Company/svg', this.answers.projectName + '.Website/Styles/' + this.answers.projectName + '/svg');
                    }

                    // Pug
                    var pugGlob = ['**', '!images/**', '!**/{cookie,lightbox}.pug'];

                    copyDirectory.call(this, 'project-name.Website/Mockup/Company', this.answers.projectName + '.Website/Mockup/' + this.answers.projectName, pugGlob);

                    if (this.use.cookieConsent) {
                        this.copy('project-name.Website/Mockup/Company/pug/cookie.pug', this.answers.projectName + '.Website/Mockup/' + this.answers.projectName + '/pug/cookie.pug');

                        this.copy('project-name.Website/Styles/Shared/Vendor/cookieconsent.scss', this.answers.projectName + '.Website/Styles/Shared/Vendor/cookieconsent.scss');

                        this.directory('project-name.Website/Scripts/Shared/cookieconsent', this.answers.projectName + '.Website/Scripts/Shared/cookieconsent');
                    }

                    if (this.use.lightbox) {
                        copyDirectory.call(this, 'project-name.Website/Styles/Company/img', this.answers.projectName + '.Website/Styles/' + this.answers.projectName, ['fancyBox-*.*'], true);

                        this.copy('project-name.Website/Mockup/Company/pug/lightbox.pug', this.answers.projectName + '.Website/Mockup/' + this.answers.projectName + '/pug/lightbox.pug');

                        this.bulkDirectory('project-name.Website/Mockup/Company/images/fancybox', this.answers.projectName + '.Website/Mockup/' + this.answers.projectName + '/images/fancybox');

                        this.copy('project-name.Website/Styles/Shared/Vendor/fancybox.scss', this.answers.projectName + '.Website/Styles/Shared/Vendor/fancybox.scss');

                        this.directory('project-name.Website/Scripts/Shared/lightbox', this.answers.projectName + '.Website/Scripts/Shared/lightbox');
                    }

                    if (this.use.slider) {
                        this.copy('project-name.Website/Styles/Shared/Vendor/owlcarousel.scss', this.answers.projectName + '.Website/Styles/Shared/Vendor/owlcarousel.scss');
                    }

                    // Styles
                    var StylesGlob = ['**', '!**/{img,svg}/**', '!**/{cookieconsent,owlcarousel,fancybox}.scss'];

                    this.copy('project-name.Website/Styles/Shared/Vendor/normalize.scss', this.answers.projectName + '.Website/Styles/Shared/Vendor/normalize.scss');

                    copyDirectory.call(this, 'project-name.Website/Styles/Company', this.answers.projectName + '.Website/Styles/' + this.answers.projectName, StylesGlob);

                    copyDirectory.call(this, 'project-name.Website/Styles/Shared', this.answers.projectName + '.Website/Styles/Shared', StylesGlob);

                    // Scripts
                    this.copy('project-name.Website/Scripts/Company/core.js', this.answers.projectName + '.Website/Scripts/' + this.answers.projectName + '/core.js');

                    this.copy('project-name.Website/Scripts/Company/index.js', this.answers.projectName + '.Website/Scripts/' + this.answers.projectName + '/index.js');

                    this.copy('project-name.Website/Scripts/system.config.js', this.answers.projectName + '.Website/Scripts/system.config.js');

                    this.copy('project-name.Website/Scripts/Shared/index.js', this.answers.projectName + '.Website/Scripts/Shared/index.js');

                    this.directory('project-name.Website/Scripts/Shared/helpers', this.answers.projectName + '.Website/Scripts/Shared/helpers');

                    this.directory('project-name.Website/Scripts/Shared/legacy', this.answers.projectName + '.Website/Scripts/Shared/legacy');

                    done();
                }
            };
        }
    }, {
        key: 'install',
        get: function get() {
            return {
                vaerkInstall: function vaerkInstall() {
                    var done = this.async();

                    this.installDependencies({ bower: false });

                    done();
                }
            };
        }
    }, {
        key: 'end',
        get: function get() {
            return {
                vaerkEnd: function vaerkEnd() {
                    if (!this.options['keep-silence']) {
                        this.log.writeln('\n-------------------------------------------------------');
                        this.log.writeln('All done, you can ' + _chalk2.default.green.bold('npm run watch') + ', to start dev server.');
                        this.log.writeln('-------------------------------------------------------\n');
                    }
                }
            };
        }
    }]);

    return Generator;
}(_yeomanGenerator.Base);

exports.default = Generator;
module.exports = exports['default'];
