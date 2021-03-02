module.exports = {
  publicPath: '/intonarumori/1/',
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Intonarumori 1';
        return args;
      });
  },
};
