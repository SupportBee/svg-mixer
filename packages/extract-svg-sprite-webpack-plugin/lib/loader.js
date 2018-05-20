/* eslint-disable func-names,consistent-this,new-cap */
const merge = require('merge-options');
const mixer = require('svg-mixer');
const { interpolateName, getOptions } = require('loader-utils');

const configure = require('./configurator');
const generateRuntime = require('./utils/runtime-generator');
const getPluginFromLoader = require('./utils/get-plugin-from-loader');

module.exports = function (content, sourcemap, meta = {}) {
  const callback = this.async();
  const loader = this;
  const context = loader.rootContext || loader.options.context;
  const plugin = getPluginFromLoader(loader);
  const config = configure(merge(plugin.config, getOptions(loader) || {}));
  const request = loader.resourcePath + loader.resourceQuery;

  const symbolId = typeof config.symbolId === 'function'
    ? config.symbolId(loader.resourcePath, loader.resourceQuery)
    : interpolateName(loader, config.symbolId, { content, context });

  const img = new mixer.Image(request, meta.ast || content);
  const symbol = new config.symbolClass(symbolId, img);

  symbol.config = config;
  symbol.module = loader._module;
  symbol.request = request;

  plugin.addSymbol(symbol);

  const publicPath = config.publicPath
    ? JSON.stringify(config.publicPath)
    : '__webpack_public_path__';

  const runtime = generateRuntime(
    symbol,
    config.runtimeFields,
    config.filename && config.emit
      ? publicPath
      : undefined
  );

  callback(null, runtime, sourcemap, meta);
};
