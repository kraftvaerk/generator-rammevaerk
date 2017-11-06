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

                // Repository URL
                questions.push({
                    type: 'input',
                    name: 'projectRepositoryUrl',
                    message: chalk.yellow('What is the repository URL?'),
                    default: `https://tfs.kraftvaerk.com/tfs/KvCollection/_git/${_.kebabCase(this.appname)}`
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
            },
            versionControl(){
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up versioning...');
                }

                this.bulkCopy('_gitignore', '.gitignore');
                this.bulkCopy('_gitattributes', '.gitattributes');

                done();
            },
            IDE() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up IDE...');
                }

                this.copy('_editorconfig', '.editorconfig');

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

                readme += this.fs.read(this.templatePath('README/_IDE_visualStudio.md'));

                readme += this.fs.read(this.templatePath('README/_USAGE.md'));

                readme = _.template(readme)(this);

                this.fs.write(this.destinationPath('README.md'), readme);

                done();
            },
            linting() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the linting...');
                }

                this.bulkCopy('_eslintrc', '.eslintrc');
                this.bulkCopy('_stylelintrc', '.stylelintrc');

                done();
            },
            gulp() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the Gulp...');
                }

                this.directory('project-name.Gulp', `${this.answers.projectName}.Gulp`);

                this.copy('_gulpfile.js', 'gulpfile.js');
                this.copy('_webpack.config.js', 'webpack.config.js');

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
            },
            projectfiles: function() {
                const done = this.async();

                if (!this.options['keep-silence']){
                    this.log.ok('Setting up the project files...');
                }

                this.bulkCopy(
                    'project-name.Website/favicon.ico',
                    `${this.answers.projectName}.Website/favicon.ico`
                );

                // Pug
                const pugGlob = ['**', '!images/**'];

                copyDirectory.call(
                    this,
                    'project-name.Website/Mockup/Company',
                    `${this.answers.projectName}.Website/Mockup/${this.answers.projectName}`,
                    pugGlob
                );

                // Styles
                const StylesGlob = ['**', '!**/{img,svg}/**'];

                copyDirectory.call(
                    this,
                    'project-name.Website/Styles/Company',
                    `${this.answers.projectName}.Website/Styles/${this.answers.projectName}`,
                    StylesGlob
                );

                copyDirectory.call(
                    this,
                    'project-name.Website/Styles/Shared',
                    `${this.answers.projectName}.Website/Styles/Shared`,
                    StylesGlob
                );

                // Scripts
                this.copy(
                    'project-name.Website/Scripts/Company/index.js',
                    `${this.answers.projectName}.Website/Scripts/${this.answers.projectName}/index.js`
                );

                this.directory(
                    'project-name.Website/Scripts/Shared',
                    `${this.answers.projectName}.Website/Scripts/Shared`
                );

                done();
            }
        };
    }

    get install() {
        return {
            vaerkInstall() {
                const done = this.async();

                this.spawnCommand('npm', ['update', '-S']);
                this.installDependencies({ bower: false });

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
