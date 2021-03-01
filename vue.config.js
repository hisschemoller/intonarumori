module.exports = {
  publicPath: '/intonarumori/',
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Intonarumori 1.0';
        return args;
      });
  },
};
