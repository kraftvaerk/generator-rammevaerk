const path = require('path');

module.exports = {
    output: {
        path: path.join(__dirname, '../<%= answers.projectName %>.Website/Content/modern'),
        publicPath: '/Content/modern/'
    }
};
