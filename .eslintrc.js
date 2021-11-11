module.exports = {
    settings: {
        'import/ignore': ['node_modules'],
    },
    root: true,
    env: {
        node: true,
    },
    globals: {
        chrome: true,
    },
    extends: ['./node_modules/eslint-sundries/solutions/vue-ts.js'],
    rules: {
        'unicorn/no-null': 'off',
        'no-debugger': 'off',
        'unicorn/number-literal-case': 'off',
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
        'unicorn/prefer-node-protocol': 'off',
    },
};
