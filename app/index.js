'use strict';

const _         = require('lodash');
const yosay     = require('yosay');
const superb    = require('superb');
const mkdirp    = require('mkdirp');
const chalk     = require('chalk');
const Generator = require('yeoman-generator');

function capitalizeKebabCase(name) {
    return _.reduce(name.split('-'), (acc, str, index) => {
        const separator = index === 0 ? '' : ' ';
        return (acc + separator + _.upperFirst(str)).split(' ').join('-');
    }, '');
}


module.exports = class extends Generator {
    constructor(...args) {
        // Call the parent constructor
        super(...args);

        this.option('keep-silence', {
            desc: 'Test framework to be invoked',
            type: Boolean
        });

        this.option('babel', {
            desc: 'Use Babel',
            type: Boolean,
            defaults: true
        });
    }

    initializing() {
        this.option('keep-silence', {
            desc: 'Test framework to be invoked',
            type: Boolean
        });


        this.projectYear = new Date().getFullYear();
        this.answers = {};

        if (!this.options['keep-silence']){
            this.log(yosay(
                chalk.yellow(`Initializing a ${superb()} new rammevaerk project`)
            ));
        }
    }

    prompting() {
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

        // Repository URL
        questions.push({
            type: 'input',
            name: 'projectRepositoryUrl',
            message: chalk.yellow('What is the repository URL?'),
            default: `https://tfs.kraftvaerk.com/tfs/KvCollection/_git/${_.kebabCase(this.appname)}`
        });

        return this.prompt(questions).then((answers) => {
            let gitName = this.user.git.name() ? ` — ${this.user.git.name().split(' ')[0]}` : '.';

            this.answers = answers;
            this.answers.projectName = capitalizeKebabCase(this.answers.projectName);
            this.answers.projectDescription = this.answers.projectDescription === 'N/A' ? `I promise to add the description later on to this ${superb()} new project${gitName}` : this.answers.projectDescription;

        });
    }

    _directories() {
        const done = this.async();
        const folders = [
            '.Website',
            '.Website/Assets',
            '.Website/Content',
            '.Website/Fonts',
            '.Website/Styles',
            '.Website/Styles/' + this.answers.projectName,
            '.Website/Styles/Shared',
            '.Website/Scripts',
            '.Website/Scripts/' + this.answers.projectName,
            '.Website/Scripts/Shared'
        ];

        if (!this.options['keep-silence']){
            this.log('\n');
            this.log.ok('Setting up directories...');
        }

        folders.forEach((folder) => mkdirp.sync(this.answers.projectName + folder));

        done();
    }
    _dotfiles(){
        const done = this.async();

        if (!this.options['keep-silence']){
            this.log.ok('Setting up the dotfiles...');
        }

        this.fs.copy(this.templatePath('_babelrc'), this.destinationPath('.babelrc'));
        this.fs.copy(this.templatePath('_browserslistrc'), this.destinationPath('.browserslistrc'));
        this.fs.copy(this.templatePath('_editorconfig'), this.destinationPath('.editorconfig'));
        this.fs.copy(this.templatePath('_eslintrc'), this.destinationPath('.eslintrc'));
        this.fs.copy(this.templatePath('_gitattributes'), this.destinationPath('.gitattributes'));
        this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
        this.fs.copy(this.templatePath('_stylelintrc'), this.destinationPath('.stylelintrc'));

        done();
    }
    _readme() {
        const done = this.async();
        let readme;

        if (!this.options['keep-silence']){
            this.log.ok('Setting up the readme file...');
        }

        readme = this.fs.read(this.templatePath('README/_BODY.md'));

        readme += '\n';

        readme += this.fs.read(this.templatePath('README/_IDE_visualStudio.md'));

        readme += this.fs.read(this.templatePath('README/_USAGE.md'));

        readme = _.template(readme)(this);

        this.fs.write(this.destinationPath('README.md'), readme);

        done();
    }
    _gulp() {
        const done = this.async();

        if (!this.options['keep-silence']){
            this.log.ok('Setting up the Gulp...');
        }

        this.fs.copyTpl(this.templatePath('project-name.Gulp'), this.destinationPath(`${this.answers.projectName}.Gulp`), this);

        this.fs.copyTpl(this.templatePath('_gulpfile.js'), this.destinationPath('gulpfile.js'), this);
        this.fs.copyTpl(this.templatePath('_webpack.config.js'), this.destinationPath('webpack.config.js'), this);
        done();
    }
    _packageJSON() {
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
        pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_REPOSITORY.json'), {}));
        pkg.repository.type = 'git';
        pkg.repository.url = this.answers.projectRepositoryUrl;

        // Node scripts
        pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_SCRIPTS.json'), {}));

        // Keywords
        pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_KEYWORDS.json'), {}));
        pkg.keywords.push(this.answers.projectName.toLowerCase());

        // Engines
        pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_ENGINES.json'), {}));

        // Dependencies
        pkg = _.merge(pkg, this.fs.readJSON(this.templatePath('PACKAGE/_DEPENDENCIES.json'), {}));

        // Write package.json
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);

        done();
    }
    _projectFiles() {
        const done = this.async();


        if (!this.options['keep-silence']){
            this.log.ok('Setting up the project files...');
        }

        this.fs.copy(
            this.templatePath('project-name.Website/favicon.ico'),
            this.destinationPath(`${this.answers.projectName}.Website/favicon.ico`)
        );


        // Scripts
        this.fs.copy(
            this.templatePath('project-name.Website/Scripts/Company/index.js'),
            this.destinationPath(`${this.answers.projectName}.Website/Scripts/${this.answers.projectName}/index.js`)
        );

        this.fs.copy(
            this.templatePath('project-name.Website/Scripts/Shared'),
            this.destinationPath(`${this.answers.projectName}.Website/Scripts/Shared`)
        );

        // Pug
        this.fs.copy(
            this.templatePath('project-name.Website/Mockup/Company/images'),
            this.destinationPath(`${this.answers.projectName}.Website/Mockup/${this.answers.projectName}/images`)
        );

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

        done();
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
        if (!this.options['skipInstall']){
            this.spawnCommandSync('npm', ['update', '--save', '--save-exact']);
            this.spawnCommandSync('npm', ['update', '--save-dev', '--save-exact']);
        }

        this.installDependencies({bower: false});
    }

    end() {
        if (!this.options['keep-silence']){
            this.log.writeln('\n-------------------------------------------------------');
            this.log.writeln(`All done, you can ${chalk.green.bold('npm run watch')}, to start dev server.`);
            this.log.writeln('-------------------------------------------------------\n');
        }
    }
};
