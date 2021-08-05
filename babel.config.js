
// module.exports = {
//     presets: [[{ targets: { node: 'current' } }],
//         '@babel/preset-typescript'],
// };

// module.exports = {
//     presets: ['@babel/preset-typescript'],
// }

module.exports = {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'],
};