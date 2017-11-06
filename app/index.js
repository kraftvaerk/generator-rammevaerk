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

                    // Repository URL
                    questions.push({
                        type: 'input',
                        name: 'projectRepositoryUrl',
                        message: _chalk2.default.yellow('What is the repository URL?'),
                        default: 'https://tfs.kraftvaerk.com/tfs/KvCollection/_git/' + _lodash2.default.kebabCase(this.appname)
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

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up versioning...');
                    }

                    this.bulkCopy('_gitignore', '.gitignore');
                    this.bulkCopy('_gitattributes', '.gitattributes');

                    done();
                },
                IDE: function IDE() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up IDE...');
                    }

                    this.copy('_editorconfig', '.editorconfig');

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

                    readme += this.fs.read(this.templatePath('README/_IDE_visualStudio.md'));

                    readme += this.fs.read(this.templatePath('README/_USAGE.md'));

                    readme = _lodash2.default.template(readme)(this);

                    this.fs.write(this.destinationPath('README.md'), readme);

                    done();
                },
                linting: function linting() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the linting...');
                    }

                    this.bulkCopy('_eslintrc', '.eslintrc');
                    this.bulkCopy('_stylelintrc', '.stylelintrc');

                    done();
                },
                gulp: function gulp() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the Gulp...');
                    }

                    this.directory('project-name.Gulp', this.answers.projectName + '.Gulp');

                    this.copy('_gulpfile.js', 'gulpfile.js');
                    this.copy('_webpack.config.js', 'webpack.config.js');

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
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_REPOSITORY.json'), {}));
                    pkg.repository.type = 'git';
                    pkg.repository.url = this.answers.projectRepositoryUrl;

                    // Node scripts
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_SCRIPTS.json'), {}));

                    // Keywords
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_KEYWORDS.json'), {}));
                    pkg.keywords.push(this.answers.projectName.toLowerCase());

                    // Engines
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_ENGINES.json'), {}));

                    // Dependencies
                    pkg = _lodash2.default.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_DEPENDENCIES.json'), {}));

                    // Write package.json
                    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

                    done();
                },

                projectfiles: function projectfiles() {
                    var done = this.async();

                    if (!this.options['keep-silence']) {
                        this.log.ok('Setting up the project files...');
                    }

                    this.bulkCopy('project-name.Website/favicon.ico', this.answers.projectName + '.Website/favicon.ico');

                    // Pug
                    var pugGlob = ['**', '!images/**'];

                    copyDirectory.call(this, 'project-name.Website/Mockup/Company', this.answers.projectName + '.Website/Mockup/' + this.answers.projectName, pugGlob);

                    // Styles
                    var StylesGlob = ['**', '!**/{img,svg}/**'];

                    copyDirectory.call(this, 'project-name.Website/Styles/Company', this.answers.projectName + '.Website/Styles/' + this.answers.projectName, StylesGlob);

                    copyDirectory.call(this, 'project-name.Website/Styles/Shared', this.answers.projectName + '.Website/Styles/Shared', StylesGlob);

                    // Scripts
                    this.copy('project-name.Website/Scripts/Company/index.js', this.answers.projectName + '.Website/Scripts/' + this.answers.projectName + '/index.js');

                    this.directory('project-name.Website/Scripts/Shared', this.answers.projectName + '.Website/Scripts/Shared');

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

                    this.spawnCommand('npm', ['update', '-S']);
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
