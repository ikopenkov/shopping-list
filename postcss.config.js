const colors = require('./src/utils/colors');

module.exports = ({ file, options, env }) => ({
    plugins: {
        autoprefixer: true,
        'postcss-nested': true,
        'postcss-mixins': true,
        'postcss-css-variables': {
            variables: colors,
            preserve: true
        }
    }
});
