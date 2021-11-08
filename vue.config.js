module.exports = {
    outputDir: 'extension',
    filenameHashing: false,
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'public/receiver.html',
            filename: 'receiver.html',
        },
        ...(process.env.NODE_ENV === 'production'
            ? {
                  spy: {
                      entry: 'src/script/spy.ts',
                  },
              }
            : {}),
    },
    chainWebpack: (config) => {
        config.optimization.delete('splitChunks');
        config.plugins.delete('html-spy');
    },
};
