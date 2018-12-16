const variables = {
    grey: '#979797',
    orange: '#FDAF2A',
    green: '#30B69F',
    black: '#4a4a4a',
    white: '#fff',
};
const prefixedVariables = {};
for (const key in variables) {
    prefixedVariables[`--${key}`] = variables[key];
}

module.exports = prefixedVariables;