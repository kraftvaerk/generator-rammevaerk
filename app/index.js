'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');
const superb = require('superb');
const yosay = require('yosay');

const OPTIONS = {
    KEEP_SILENCE: 'keep-silence',
    SKIP_INSTALL: 'skip-install'
};

function capitalizeKebabCase(name) {
    return _.reduce(name.split('-'), (acc, str, index) => {
        const separator = index === 0 ? '' : ' ';
        return (acc + separator + _.upperFirst(str)).split(' ').join('-');
    }, '');
}

module.exports = class extends Generator {
    constructor(...args) {
        super(...args);

        this.answers = {};

        this.option(OPTIONS.SKIP_INSTALL, {
            desc: 'Do not install npm dependencies',
            type: Boolean
        });

        this.option(OPTIONS.KEEP_SILENCE, {
            desc: 'Do not log output into the console',
            type: Boolean
        });
    }

    initializing() {
        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log(yosay(
                chalk.yellow(`Initializing a ${superb.random()} new rammevaerk project...`)
            ));
        }
    }

    prompting() {
        const questions = [];

        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log('-------------------------------------------------------');
            this.log('Please answers the following questions:');
            this.log('-------------------------------------------------------\n');
        }

        // Project name
        questions.push({
            type: 'input',
            name: 'projectName',
            message: chalk.yellow('What is your project name?'),
            default: _.kebabCase(this.appname),
            filter: _.kebabCase,
            validate: name => name.length > 0
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

        // Repository URL
        questions.push({
            type: 'input',
            name: 'projectRepositoryUrl',
            message: chalk.yellow('What is the repository URL?'),
            default: `https://kraftvaerkgroup.visualstudio.com/_git/${_.kebabCase(this.appname)}`
        });

        return this.prompt(questions).then((answers) => {
            const username = this.user.git.name() ? this.user.git.name().split(' ')[0] : null;

            this.answers = answers;
            this.answers.projectName = capitalizeKebabCase(this.answers.projectName);
            this.answers.projectDescription = this.answers.projectDescription === 'N/A'
                ? `I promise to add the description later on to this ${superb.random()} new project${username ? ` — ${username}` : ''}.`
                : this.answers.projectDescription;
        });
    }

    _directories() {
        const folders = [
            '.Website',
            '.Website/Assets',
            '.Website/Assets/Fonts',
            '.Website/Assets/Images',
            '.Website/Content',
            '.Website/Scripts',
            '.Website/Scripts/' + this.answers.projectName,
            '.Website/Scripts/Shared',
            '.Website/Styles',
            '.Website/Styles/' + this.answers.projectName,
            '.Website/Styles/Shared'
        ];

        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log('\n');
            this.log.ok('Setting up directories...');
        }

        folders.forEach((folder) => {
            mkdirp.sync(`${this.answers.projectName}${folder}`);
        });
    }

    _dotfiles() {
        const dotfiles = [
            'babelrc',
            'browserslistrc',
            'editorconfig',
            'env.example',
            'env',
            'eslintrc',
            'gitattributes',
            'gitignore',
            'stylelintrc'
        ];

        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log.ok('Setting up the dotfiles...');
        }

        dotfiles.forEach((file) => {
            this.fs.copy(this.templatePath(`_${file}`), this.destinationPath(`.${file}`));
        });
    }

    _readme() {
        let readme;

        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log.ok('Setting up the README...');
        }

        readme = this.fs.read(this.templatePath('_README.md'));
        readme = _.template(readme)(this);

        this.fs.write(this.destinationPath('README.md'), readme);
    }

    _gulp() {
        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log.ok('Setting up the Gulp...');
        }

        this.fs.copyTpl(this.templatePath('project-name.Webpack'), this.destinationPath(`${this.answers.projectName}.Webpack`), this);
        this.fs.copyTpl(this.templatePath('_webpack.config.js'), this.destinationPath('webpack.config.js'), this);
    }

    _packageJSON() {
        let pkg = {};

        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log.ok('Setting up the package.json...');
        }

        pkg = this.fs.readJSON(this.templatePath('_package.json'));

        // Info
        pkg.name = this.answers.projectName.toLowerCase();
        pkg.description = this.answers.projectDescription;
        pkg.homepage = this.answers.projectUrl === 'N/A' ? `http://${pkg.name}.local/` : this.answers.projectUrl;

        // Contributors
        let contributor = {};

        if (this.user.git.name()) {
            contributor.name = this.user.git.name();

            if (this.user.git.email()) {
                contributor.email = this.user.git.email();
            }
        } else {
            contributor = {
                name: 'Kraftvaerk',
                url: 'https://www.kraftvaerk.com/'
            };
        }

        pkg.contributors.push(contributor);

        // Version control
        pkg.repository.type = 'git';
        pkg.repository.url = this.answers.projectRepositoryUrl;

        // Keywords
        pkg.keywords.push(this.answers.projectName.toLowerCase());

        // Write package.json
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    }

    _projectFiles() {
        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log.ok('Setting up the project files...');
        }

        this.fs.copy(
            this.templatePath('project-name.Website/favicon.ico'),
            this.destinationPath(`${this.answers.projectName}.Website/favicon.ico`)
        );

        // Scripts
        this.fs.copyTpl(
            this.templatePath('project-name.Website/Scripts/Company/index.js'),
            this.destinationPath(`${this.answers.projectName}.Website/Scripts/${this.answers.projectName}/index.js`),
            this
        );

        this.fs.copy(
            this.templatePath('project-name.Website/Scripts/Shared'),
            this.destinationPath(`${this.answers.projectName}.Website/Scripts/Shared`)
        );

        // Pug
        this.fs.copyTpl(
            this.templatePath('project-name.Website/Mockup/Company/**/*.pug'),
            this.destinationPath(`${this.answers.projectName}.Website/Mockup/${this.answers.projectName}`),
            this
        );

        // Styles
        this.fs.copyTpl(
            this.templatePath('project-name.Website/Styles/Company/**'),
            this.destinationPath(`${this.answers.projectName}.Website/Styles/${this.answers.projectName}`),
            this
        );

        this.fs.copy(
            this.templatePath('project-name.Website/Styles/Shared'),
            this.destinationPath(`${this.answers.projectName}.Website/Styles/Shared`)
        );
    }

    writing() {
        this._directories();
        this._dotfiles();
        this._readme();
        this._gulp();
        this._packageJSON();
        this._projectFiles();
    }

    install() {
        if (!this.options[OPTIONS.SKIP_INSTALL]) {
            this.spawnCommandSync('npm', ['install']);
        }
    }

    end() {
        if (!this.options[OPTIONS.KEEP_SILENCE]) {
            this.log.writeln('\n-------------------------------------------------------');
            this.log.writeln(`All done, you can ${chalk.green.bold('npm run watch')} to watch files and rebuild whenever they change.`);
            this.log.writeln('-------------------------------------------------------\n');
        }
    }
};
