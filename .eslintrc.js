module.exports = {
    root: true,
    env: {
        node: true,
    },
    globals: {
        chrome: true,
    },
    extends: ['./node_modules/eslint-sundries/solutions/vue-ts.js'],
    rules: {
        'unicorn/number-literal-case': 'off',
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
        'unicorn/prefer-node-protocol': 'off',
    },
};
