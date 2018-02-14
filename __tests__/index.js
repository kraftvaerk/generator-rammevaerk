'use strict';

const assert  = require('yeoman-assert');
const helpers = require('yeoman-test');
const path    = require('path');

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

    it('generates capitalized kebabcase name', () => {
        assert.JSONFileContent('package.json', { name: 'T-e-s-t' });
    });

    it('generates expected dependencies', () => {
        assert.JSONFileContent('package.json', { dependencies: { jquery: 'latest' } });
    });
});
