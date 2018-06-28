import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import path from 'path';

describe('rammevaerk:app', () => {
    beforeAll(() => {
        return helpers
            .run(path.join(__dirname, '../app'))
            .withPrompts({ projectName: 't e s t', 'skip-install': true, 'keep-silence': true });
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

    it('generates capitalized kebab-case name', () => {
        assert.JSONFileContent('package.json', { name: 'T-e-s-t' }); // eslint-disable-line new-cap
    });

    it('generates expected dependencies', () => {
        assert.JSONFileContent('package.json', { dependencies: { jquery: 'latest' } }); // eslint-disable-line new-cap
    });
});
