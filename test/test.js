const path =     require('path');
const helpers =  require('yeoman-test');
const assert =   require('yeoman-assert');

describe('rammevaerk:app', () => {
    beforeAll(() => {
        return helpers.run(path.join(__dirname, '../app'))
            .withPrompts({projectName: 't e s t', 'skipInstall': true, 'keep-silence': true });
    });

    it('generates expected files', () => {
        assert.file([
            '.babelrc',
            '.browserslistrc',
            '.editorconfig',
            '.eslintrc',
            '.gitattributes',
            '.gitignore',
            '.stylelintrc',
            'gulpfile.js',
            'package.json',
            'README.md',
            'webpack.config.js'
        ]);
    });

    it('generates capitalized kebabcase name', () => {
        assert.JSONFileContent('package.json', {'name': 'T-e-s-t' });
    });

    it('generates expected dependencies', () => {
        assert.JSONFileContent('package.json', {'dependencies': { 'jquery': 'latest' }});
    });

    it('generates template interpolated files', () => {
        assert.fileContent('T-e-s-t.website/Mockup/T-e-s-t/pug/includes/layout.pug', /T-e-s-t/g);
    });
});
