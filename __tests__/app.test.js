'use strict';

const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');

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
            '.env',
            '.eslintrc',
            '.gitattributes',
            '.gitignore',
            '.stylelintrc',
            'package.json',
            'README.md',
            'webpack.config.js'
        ]);
    });

    it('generates capitalized kebab-case name', () => {
        assert.JSONFileContent('package.json', { name: 't-e-s-t' }); // eslint-disable-line new-cap
    });

    it('generates expected dependencies', () => {
        assert.JSONFileContent('package.json', { dependencies: { jquery: 'latest' } }); // eslint-disable-line new-cap
    });
});
