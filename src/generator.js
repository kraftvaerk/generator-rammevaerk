'use strict';

import _            from 'lodash';
import yosay        from 'yosay';
import superb       from 'superb';
import mkdirp       from 'mkdirp';
import chalk        from 'chalk';
import glob         from 'globby';
import path         from 'path';
import { Base }     from 'yeoman-generator';

function capitalizeKebabCase(name) {
    return _.reduce(name.split('-'), (acc, str, index) => {
        const separator = index === 0 ? '' : ' ';
        return (acc + separator + _.upperFirst(str)).split(' ').join('-');
    }, '');
}

function copyDirectory(source, destination, globPatternStr, bulk){
    const root = this.templatePath(source);
    const dest = this.destinationPath(destination);
    const files = glob.sync(globPatternStr, { dot: true, nodir: true, cwd: root });
    let cp = this.copy;

    if (bulk) {
        cp = this.bulkCopy;
    }

    files.forEach((file) => {
        cp.call(this, path.join(root, file), path.join(dest, file));
    });
}

export default class Generator extends Base {
    constructor( ...args ) {
        // Call the parent constructor
        super(...args);

        // The appname argument is optional. If not provided Yeoman infers it from
        // the name of the current working directory.
        // this.argument('appname', {
        //     type: String,
        //     required: false,
        // });

        this.option('keep-silence', {
            desc: 'Test framework to be invoked',
            type: Boolean
        });
    }

    get initializing() {
        return {
            vaerkInit() {
                this.projectYear = new Date().getFullYear();
                this.answers = {};

                if (!this.options['keep-silence']){
                    this.log(yosay(
                        chalk.yellow(`Initializing a ${superb()} new rammevaerk project`)
                    ));
                }
            }
        };
    }

    get prompting() {
        return {
            vaerkPrompts(){
                const done = this.async();
                let questions = [];

                if (!this.options['keep-silence']){
                    this.log('-------------------------------------------------------');
                    this.log('Please answers the following questions.');
                    this.log('-------------------------------------------------------\n');
                }

                // Project name
                questions.push({
                    type: 'input',
                    name: 'projectName',
                    message: chalk.yellow('What is your project name?'),
                    default: _.kebabCase(this.appname),
                    filter: _.kebabCase,
                    validate: (name) => name.length > 0
                });

                // Project description
                questions.push({
                    type: 'input',
                    name: 'projectDescription',
                    message: chalk.yellow('How would you describe it?'),
                    default: 'N/A'
                });

                // Project URL
                questions.push({
                    type: 'input',
                    name: 'projectUrl',
                    message: chalk.yellow('What is the project homepage URL?'),
                    default: 'N/A'
                });

                // Version control
                questions.push({
                    type: 'list',
                    name: 'projectVersionControl',
                    message: chalk.yellow('Which version control system will you be using?'),
                    choices: ['GIT', 'SVN'],
                    default: 'GIT',
                    filter: (vcs) => vcs.toLowerCase()
                });

                // Repository URL
                questions.push({
                    type: 'input',
                    name: 'projectRepositoryUrl',
                    message: chalk.yellow('What is the repository URL?'),
                    default: `https://tfs.kraftvaerk.com/tfs/KvCollection/_git/${_.kebabCase(this.appname)}`
                });

                // Content Management System
                questions.push({
                    type: 'list',
                    name: 'projectCMS',
                    message: chalk.yellow('Which CMS will it be intergrated in?'),
                    choices: ['Sitecore', 'Umbraco', 'Custom'],
                    default: 'Sitecore',
                    filter: (cms) => cms.toLowerCase()
                });

                // Integrated Development Environment
                questions.push({
                    type: 'checkbox',
                    name: 'projectIDE',
                    message: chalk.yellow('Which IDE(s) will you be using?'),
                    choices: [
                        {
                            name: 'SublimeText',
                            checked: true
                        },
                        {
                            name: 'Visual Studio',
                            checked: true
                        },
                        {
                            name: 'Atom'
                        }
                    ],
                    default: ['sublimeText', 'visualStudio'],
                    filter: (IDEs) => IDEs.map(IDE => _.camelCase(IDE))
                });

                // Linting
                questions.push({
                    type: 'checkbox',
                    name: 'projectLinters',
                    message: chalk.yellow('Do you want code linting for the folowing?'),
                    choices: [
                        {
                            name: 'Scripts',
                            checked: true
                        },
                        {
                            name: 'Styles',
                            checked: true
                        }
                    ],
                    default: ['scripts', 'styles'],
                    filter: (linters) => linters.map(linter => linter.toLowerCase())
                });

                // Project modles
                questions.push({
                    type: 'checkbox',
                    name: 'projectModules',
                    message: chalk.yellow('Which frontend modules do you want to include?'),
                    choices: [
                        {
                            name: 'Lightbox',
                            checked: true
                        },
                        {
                            name: 'Slider',
                            checked: true
                        },
                        {
                            name: 'Cookie consent',
                            checked: true
                        },
                        {
                            name: 'Datepicker',
                            disabled: true
                        },
                        {
                            name: 'Alert',
                            disabled: true
                        },
                        {
                            name: 'GoogleMaps',
                            disabled: true
                        }
                    ],
                    default: ['lightbox', 'slider', 'cookieConsent'],
                    filter: (IDEs) => IDEs.map(IDE => _.camelCase(IDE))
                });

                // Project grid
                questions.push({
                    type: 'input',
                    name: 'projectGridColumns',
                    message: chalk.yellow('How many columns does the grid consists of?'),
                    default: 12,
                    validate: (val) => {
                        if (!_.isNumber(Number(val))){
                            return 'Please enter a valid number';
                        }

                        if (_.inRange(val, 1, 50)) {
                            return true;
                        }
                        return 'Please enter a valid number between 1 and 50';
                    }
                });

                // Project grid gutter
                questions.push({
                    type: 'input',
                    name: 'projectGridGutter',
                    message: chalk.yellow('What is the size of the grid gutter? (px)'),
                    default: 30,
                    validate: (val) => {
                        if (_.isNumber(Number(val))){
                            return true;
                        }
                        return 'Please enter a valid number';
                    }
                });

                // Project grid width
                questions.push({
                    type: 'input',
                    name: 'projectGridWidth',
                    message: chalk.yellow('What is the max grid width? (px)'),
                    default: 1140,
                    validate: (val) => {
                        if (_.isNumber(Number(val))){
                            return true;
                        }
                        return 'Please enter a valid number';
                    }
                });

                this.prompt(questions).then((answers) => {
                    let gitName = this.user.git.name() ? ` — ${this.user.git.name().split(' ')[0]}` : '.';

                    this.answers = answers;
                    this.answers.projectName = capitalizeKebabCase(this.answers.projectName);
                    this.answers.projectDescription = this.answers.projectDescription === 'N/A' ? `I promise to add the description later on to this ${superb()} new project${gitName}` : this.answers.projectDescription;

                    done();
                });
            }
        };
    }

    get writing() {
        return {
            directories() {
                const done = this.async();
                const folders = [
                    '.Web',
                    '.Web/Assets',
                    '.Web/Content',
                    '.Web/Fonts',
                    '.Web/Styles',
                    '.Web/Styles/' + this.answers.projectName,
                    '.Web/Styles/Shared',
                    '.Web/Styles/Shared/Vendor',
                    '.Web/Scripts',
                    '.Web/Scripts/' + this.answers.projectName,
                    '.Web/Scripts/Shared'
                ];

                if (!this.options['keep-silence']){
                    this.log('\n');
                    this.log.ok('Setting up directories...');
                }

                folders.forEach((folder) => mkdirp.sync(this.answers.projectName + folder));

                done();
            },
            versionControl(){
                const done = this.async();

                if (this.answers.projectVersionControl.length){
                    if (!this.options['keep-silence']){
                        this.log.ok('Setting up versioning...');
                    }

                    if (_.includes(this.answers.projectVersionControl, 'git')){
                        this.bulkCopy('_gitignore', '.gitignore');
                        this.bulkCopy('_gitattributes', '.gitattributes');
                    }
                }

                done();
            },
            IDE() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up IDE...');
                }

                this.copy('_editorconfig', '.editorconfig');

                if (_.includes(this.answers.projectIDE, 'sublimeText')){
                    this.template(
                        '_project-name.sublime-project',
                        `${this.answers.projectName}.sublime-project`
                    );
                }

                done();
            },
            readme() {
                const done = this.async();
                let readme;

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the readme file...');
                }

                readme = this.fs.read(this.templatePath('README/_BODY.md'));

                readme += '\n';

                if (_.includes(this.answers.projectIDE, 'visualStudio')){
                    readme += this.fs.read(this.templatePath('README/_IDE_visualStudio.md'));
                }

                if (_.includes(this.answers.projectIDE, 'sublimeText')){
                    readme += this.fs.read(this.templatePath('README/_IDE_sublimeText.md'));
                }

                readme += this.fs.read(this.templatePath('README/_USAGE.md'));

                readme = _.template(readme)(this);

                this.fs.write(this.destinationPath('README.md'), readme);

                done();
            },
            linting() {
                const done = this.async();

                if (this.answers.projectLinters.length){
                    if (!this.options['keep-silence']){
                        this.log.ok('Setting up the linting...');
                    }
                }

                if (_.includes(this.answers.projectLinters, 'scripts')){
                    this.template('_eslintignore', '.eslintignore');
                    this.bulkCopy('_eslintrc', '.eslintrc');
                }

                if (_.includes(this.answers.projectLinters, 'styles')){
                    this.bulkCopy('_stylelintrc', '.stylelintrc');
                }

                done();
            },
            gulp() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the Gulp...');
                }

                this.linting = {
                    scripts: _.includes(this.answers.projectLinters, 'scripts'),
                    styles: _.includes(this.answers.projectLinters, 'styles')
                };

                this.directory('project-name.Gulp', `${this.answers.projectName}.Gulp`);

                this.copy('_gulpfile.js', 'gulpfile.js');

                done();
            },
            packageJSON() {
                const done = this.async();
                let pkg = {};

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the package.json...');
                }

                pkg = this.fs.readJSON(this.templatePath('PACKAGE/_BASE.json'));

                // Info
                pkg.name = this.answers.projectName;
                pkg.description = this.answers.projectDescription;
                pkg.homepage = this.answers.projectUrl;

                // Contributors
                pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_CONTRIBUTORS.json'), {}));

                let contributor = {};
                if (this.user.git.name()){
                    contributor.name = this.user.git.name();

                    if (this.user.git.email()){
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
                if (this.answers.projectVersionControl){
                    pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_REPOSITORY.json'), {}));
                    pkg.repository.type = this.answers.projectVersionControl.toLowerCase();
                    pkg.repository.url = this.answers.projectRepositoryUrl;
                }

                // Node scripts
                pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_SCRIPTS.json'), {}));

                // Keywords
                pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_KEYWORDS.json'), {}));
                pkg.keywords.push(this.answers.projectName.toLowerCase());

                // Engines
                pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_ENGINES.json'), {}));

                // DevDependencies
                pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_DEVDEPENDENCIES.json'), {}));

                // JSPM
                pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_JSPM.json'), {}));

                pkg.jspm.directories.packages = `${this.answers.projectName}.Web/Scripts/Vendor`;
                pkg.jspm.configFile = `${this.answers.projectName}.Web/Scripts/system.config.js`;

                pkg.jspm.dependencies.jquery = 'npm:jquery';
                pkg.jspm.dependencies.svg4everybody = 'npm:svg4everybody@2.0.3';

                if (_.includes(this.answers.projectModules, 'cookieConsent')){
                    pkg.jspm.dependencies.cookieConsent = 'github:kraftvaerk/cookie-consent@0.0.3';
                }

                if (_.includes(this.answers.projectModules, 'lightbox')){
                    let fancyboxOverrides = {
                        'github:fancyapps/fancyBox@2.1.5': {
                            'main': 'source/jquery.fancybox',
                            'format': 'global',
                            'dependencies': {
                                'jquery': 'npm:jquery@*'
                            },
                            'shim': {
                                'source/jquery.fancybox': {
                                    'deps': [
                                        'jquery'
                                    ],
                                    'exports': '$'
                                }
                            }
                        }
                    };
                    pkg.jspm.overrides = Object.assign(pkg.jspm.overrides, fancyboxOverrides);
                    pkg.jspm.dependencies.fancyBox = 'github:fancyapps/fancyBox@2.1.5';
                }

                if (_.includes(this.answers.projectModules, 'slider')){
                    pkg.jspm.dependencies.owlCarousel = 'github:smashingboxes/OwlCarousel2@2.1.4';
                }

                // Write package.json
                this.fs.writeJSON(this.destinationPath('package.json'), pkg);

                done();
            },
            projectfiles: function() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the project files...');
                }

                this.use = {
                    slider: _.includes(this.answers.projectModules, 'slider'),
                    lightbox: _.includes(this.answers.projectModules, 'lightbox'),
                    cookieConsent: _.includes(this.answers.projectModules, 'cookieConsent')
                };

                this.bulkCopy(
                    'project-name.Web/favicon.ico',
                    `${this.answers.projectName}.Web/favicon.ico`
                );

                this.bulkCopy(
                    'project-name.Web/Styles/Company/img/logo.svg',
                    `${this.answers.projectName}.Web/Styles/${this.answers.projectName}/img/logo.svg`
                );

                this.bulkDirectory(
                    'project-name.Web/Styles/Company/svg',
                    `${this.answers.projectName}.Web/Styles/${this.answers.projectName}/svg`
                );

                // Pug
                const pugGlob = ['**', '!images/**', '!**/{cookie,lightbox}.pug'];

                copyDirectory.call(
                    this,
                    'project-name.Web/Mockup',
                    `${this.answers.projectName}.Web/Mockup`,
                    pugGlob
                );

                if (this.use.cookieConsent){
                    this.copy(
                        'project-name.Web/Mockup/pug/cookie.pug',
                        `${this.answers.projectName}.Web/Mockup/pug/cookie.pug`
                    );

                    this.copy(
                        'project-name.Web/Styles/Company/_cookie-consent.scss',
                        `${this.answers.projectName}.Web/Styles/${this.answers.projectName}/_cookie-consent.scss`
                    );

                    this.copy(
                        'project-name.Web/Styles/Shared/Vendor/cookieconsent.scss',
                        `${this.answers.projectName}.Web/Styles/Shared/Vendor/cookieconsent.scss`
                    );

                    this.directory(
                        'project-name.Web/Scripts/Shared/cookieconsent',
                        `${this.answers.projectName}.Web/Scripts/Shared/cookieconsent`
                    );
                }

                if (this.use.lightbox){
                    copyDirectory.call(
                        this,
                        'project-name.Web/Styles/Company/img',
                        `${this.answers.projectName}.Web/Styles/${this.answers.projectName}`,
                        ['fancyBox-*.*'],
                        true
                    );

                    this.copy(
                        'project-name.Web/Mockup/pug/lightbox.pug',
                        `${this.answers.projectName}.Web/Mockup/pug/lightbox.pug`
                    );

                    this.bulkDirectory(
                        'project-name.Web/Mockup/images/fancybox',
                        `${this.answers.projectName}.Web/Mockup/images/fancybox`
                    );

                    this.copy(
                        'project-name.Web/Styles/Shared/Vendor/fancybox.scss',
                        `${this.answers.projectName}.Web/Styles/Shared/Vendor/fancybox.scss`
                    );

                    this.directory(
                        'project-name.Web/Scripts/Shared/lightbox',
                        `${this.answers.projectName}.Web/Scripts/Shared/lightbox`
                    );
                }

                if (this.use.slider){
                    this.copy(
                        'project-name.Web/Styles/Shared/Vendor/owlcarousel.scss',
                        `${this.answers.projectName}.Web/Styles/Shared/Vendor/owlcarousel.scss`
                    );
                }


                // Styles
                const StylesGlob = ['**', '!**/{img,svg}/**', '!**/{cookie-consent,cookieconsent,owlcarousel,fancybox}.scss'];

                this.copy(
                    'project-name.Web/Styles/Shared/Vendor/normalize.scss',
                    `${this.answers.projectName}.Web/Styles/Shared/Vendor/normalize.scss`
                );

                copyDirectory.call(
                    this,
                    'project-name.Web/Styles/Company',
                    `${this.answers.projectName}.Web/Styles/${this.answers.projectName}`,
                    StylesGlob
                );

                copyDirectory.call(
                    this,
                    'project-name.Web/Styles/Shared',
                    `${this.answers.projectName}.Web/Styles/Shared`,
                    StylesGlob
                );


                // Scripts
                this.copy(
                    'project-name.Web/Scripts/Company/index.js',
                    `${this.answers.projectName}.Web/Scripts/${this.answers.projectName}/index.js`
                );

                this.copy(
                    'project-name.Web/Scripts/system.config.js',
                    `${this.answers.projectName}.Web/Scripts/system.config.js`
                );

                this.copy(
                    'project-name.Web/Scripts/Shared/index.js',
                    `${this.answers.projectName}.Web/Scripts/Shared/index.js`
                );

                this.directory(
                    'project-name.Web/Scripts/Shared/helpers',
                    `${this.answers.projectName}.Web/Scripts/Shared/helpers`
                );

                this.directory(
                    'project-name.Web/Scripts/Shared/legacy',
                    `${this.answers.projectName}.Web/Scripts/Shared/legacy`
                );

                this.directory(
                    'project-name.Web/Scripts/Shared/svg4everybody',
                    `${this.answers.projectName}.Web/Scripts/Shared/svg4everybody`
                );

                done();
            }
        };
    }

    get install() {
        return {
            vaerkInstall() {
                const done = this.async();

                this.installDependencies({bower: false});

                done();
            }
        };
    }

    get end() {
        return {
            vaerkEnd() {
                if (!this.options['keep-silence']){
                    this.log.writeln('\n-------------------------------------------------------');
                    this.log.writeln(`All done, you can ${chalk.green.bold('npm run watch')}, to start dev server.`);
                    this.log.writeln('-------------------------------------------------------\n');
                }
            }
        };
    }
}
