module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@models': './src/models',
            '@repositories': './src/repositories',
            '@services': './src/services',
            '@store': './src/store',
            '@screens': './src/screens',
            '@components': './src/components',
            '@theme': './src/theme',
            '@navigation': './src/navigation'
          }
        }
      ]
    ]
  };
};