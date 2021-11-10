const extensionFiles = {
    spy: {
        entry: 'src/script/spy.ts',
    },
    injector: {
        entry: 'src/script/injector.ts',
    },
    manipulator: {
        entry: 'src/script/manipulator.ts',
    },
};

module.exports = {
    outputDir: 'extension',
    filenameHashing: false,
    pages: {
        index: {
            entry: 'src/main.ts',
            template: 'public/receiver.html',
            filename: 'receiver.html',
        },
        ...(process.env.NODE_ENV === 'production' ? extensionFiles : {}),
    },
    chainWebpack: (config) => {
        config.output.set('filename', (pathData) => {
            const currentName = pathData.chunk.name;
            return Object.keys(extensionFiles).includes(currentName)
                ? '[name].js'
                : 'js/[name].js';
        });
        config.optimization.delete('splitChunks');
        config.optimization.set('minimize', false);
        config.plugins.delete('html-spy');
        config.plugins.delete('html-injector');
        config.plugins.delete('html-manipulator');
    },
};
