'use strict';
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var babel;
var istanbulPlugin;
var jestPreset;
function importBabelDeps() {
  if (babel) {
    return;
  }
  babel = require('babel-core');
  istanbulPlugin = require('babel-plugin-istanbul').default;
  jestPreset = require('babel-preset-jest');
}
var logger_1 = require('./logger');
function postProcessCode(
  compilerOptions,
  jestConfig,
  tsJestConfig,
  transformOptions,
  transpileOutput,
  filePath
) {
  var postHook = exports.getPostProcessHook(
    compilerOptions,
    jestConfig,
    tsJestConfig
  );
  return postHook(transpileOutput, filePath, jestConfig, transformOptions);
}
exports.postProcessCode = postProcessCode;
function createBabelTransformer(options) {
  importBabelDeps();
  options = __assign({}, options, {
    plugins: options.plugins || [],
    presets: (options.presets || []).concat([jestPreset]),
  });
  delete options.cacheDirectory;
  delete options.filename;
  return function(codeSourcemapPair, filename, config, transformOptions) {
    var theseOptions = Object.assign(
      { filename: filename, inputSourceMap: codeSourcemapPair.map },
      options
    );
    if (transformOptions && transformOptions.instrument) {
      theseOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
      theseOptions.plugins = theseOptions.plugins.concat([
        [
          istanbulPlugin,
          {
            cwd: config.rootDir,
            exclude: [],
          },
        ],
      ]);
    }
    return babel.transform(codeSourcemapPair.code, theseOptions);
  };
}
exports.getPostProcessHook = function(
  tsCompilerOptions,
  jestConfig,
  tsJestConfig
) {
  if (tsJestConfig.skipBabel) {
    logger_1.logOnce('Not using any postprocess hook.');
    return function(input) {
      return input;
    };
  }
  var plugins = Array.from(
    (tsJestConfig.babelConfig && tsJestConfig.babelConfig.plugins) || []
  );
  var babelOptions = __assign({}, tsJestConfig.babelConfig, {
    babelrc: tsJestConfig.useBabelrc || false,
    plugins: plugins,
    presets: tsJestConfig.babelConfig ? tsJestConfig.babelConfig.presets : [],
    sourceMaps: tsJestConfig.disableSourceMapSupport !== true,
  });
  logger_1.logOnce('Using babel with options:', babelOptions);
  return createBabelTransformer(babelOptions);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdHByb2Nlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcG9zdHByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLElBQUksS0FBNEIsQ0FBQztBQUNqQyxJQUFJLGNBQThDLENBQUM7QUFDbkQsSUFBSSxVQUFzQyxDQUFDO0FBQzNDO0lBQ0UsSUFBSSxLQUFLLEVBQUU7UUFDVCxPQUFPO0tBQ1I7SUFDRCxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlCLGNBQWMsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDMUQsVUFBVSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzVDLENBQUM7QUFXRCxtQ0FBbUM7QUFJbkMseUJBQ0UsZUFBZ0MsRUFDaEMsVUFBc0IsRUFDdEIsWUFBMEIsRUFDMUIsZ0JBQWtDLEVBQ2xDLGVBQWtDLEVBQ2xDLFFBQWdCO0lBRWhCLElBQU0sUUFBUSxHQUFHLDBCQUFrQixDQUNqQyxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksQ0FDYixDQUFDO0lBRUYsT0FBTyxRQUFRLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBZkQsMENBZUM7QUFFRCxnQ0FDRSxPQUE4QjtJQUU5QixlQUFlLEVBQUUsQ0FBQztJQUNsQixPQUFPLGdCQUNGLE9BQU8sSUFDVixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQzlCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FDdEQsQ0FBQztJQUNGLE9BQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUM5QixPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFFeEIsT0FBTyxVQUNMLGlCQUFvQyxFQUNwQyxRQUFnQixFQUNoQixNQUFrQixFQUNsQixnQkFBa0M7UUFFbEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDaEMsRUFBRSxRQUFRLFVBQUEsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEVBQ25ELE9BQU8sQ0FDUixDQUFDO1FBQ0YsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7WUFDbkQsWUFBWSxDQUFDLHNCQUFzQixHQUFHLHdCQUF3QixDQUFDO1lBRS9ELFlBQVksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ2pEO29CQUNFLGNBQWM7b0JBQ2Q7d0JBRUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxPQUFPO3dCQUNuQixPQUFPLEVBQUUsRUFBRTtxQkFDWjtpQkFDRjthQUNGLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBUSxLQUFLLENBQUMsU0FBUyxDQUNyQixpQkFBaUIsQ0FBQyxJQUFJLEVBQ3RCLFlBQVksQ0FDZ0IsQ0FBQztJQUNqQyxDQUFDLENBQUM7QUFDSixDQUFDO0FBRVksUUFBQSxrQkFBa0IsR0FBRyxVQUNoQyxpQkFBa0MsRUFDbEMsVUFBc0IsRUFDdEIsWUFBMEI7SUFFMUIsSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFO1FBQzFCLGdCQUFPLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUUzQyxPQUFPLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxFQUFMLENBQUssQ0FBQztLQUN2QjtJQUVELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQ3hCLENBQUMsWUFBWSxDQUFDLFdBQVcsSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FDckUsQ0FBQztJQUVGLElBQU0sWUFBWSxnQkFDYixZQUFZLENBQUMsV0FBVyxJQUMzQixPQUFPLEVBQUUsWUFBWSxDQUFDLFVBQVUsSUFBSSxLQUFLLEVBQ3pDLE9BQU8sU0FBQSxFQUNQLE9BQU8sRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUN6RSxVQUFVLEVBQUUsWUFBWSxDQUFDLHVCQUF1QixLQUFLLElBQUksR0FDMUQsQ0FBQztJQUVGLGdCQUFPLENBQUMsMkJBQTJCLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFFbkQsT0FBTyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUMifQ==
