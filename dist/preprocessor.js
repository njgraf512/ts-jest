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
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var logger_1 = require('./logger');
var postprocess_1 = require('./postprocess');
var utils_1 = require('./utils');
var transpiler_1 = require('./transpiler');
function process(src, filePath, jestConfig, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var compilerOptions = utils_1.getTSConfig(
    jestConfig.globals,
    jestConfig.rootDir
  );
  logger_1.logOnce('final compilerOptions:', compilerOptions);
  var isTsFile = /\.tsx?$/.test(filePath);
  var isJsFile = /\.jsx?$/.test(filePath);
  var isHtmlFile = /\.html$/.test(filePath);
  if (isHtmlFile && jestConfig.globals.__TRANSFORM_HTML__) {
    src = 'module.exports=`' + src + '`;';
  }
  var processFile =
    compilerOptions.allowJs === true ? isTsFile || isJsFile : isTsFile;
  if (!processFile) {
    return src;
  }
  var tsJestConfig = utils_1.getTSJestConfig(jestConfig.globals);
  logger_1.logOnce('tsJestConfig: ', tsJestConfig);
  if (tsJestConfig.enableTsDiagnostics) {
    utils_1.runTsDiagnostics(filePath, compilerOptions);
  }
  var transpileOutput = transpiler_1.transpileTypescript(
    filePath,
    src,
    compilerOptions
  );
  if (tsJestConfig.ignoreCoverageForAllDecorators === true) {
    transpileOutput.code = transpileOutput.code.replace(
      /__decorate/g,
      '/* istanbul ignore next */__decorate'
    );
  }
  if (tsJestConfig.ignoreCoverageForDecorators === true) {
    transpileOutput.code = transpileOutput.code.replace(
      /(__decorate\(\[\r?\n[^\n\r]*)\/\*\s*istanbul\s*ignore\s*decorator(.*)\*\//g,
      '/* istanbul ignore next$2*/$1'
    );
  }
  var outputText = postprocess_1.postProcessCode(
    compilerOptions,
    jestConfig,
    tsJestConfig,
    transformOptions,
    transpileOutput,
    filePath
  );
  logger_1.flushLogs();
  return { code: outputText.code, map: outputText.map };
}
exports.process = process;
var BABELRC_FILENAME = '.babelrc';
var BABELRC_JS_FILENAME = '.babelrc.js';
var BABEL_CONFIG_KEY = 'babel';
var PACKAGE_JSON = 'package.json';
var cache = Object.create(null);
function getBabelRC(filename, useBabelrc) {
  var paths = [];
  var directory = filename;
  while (directory !== (directory = path.dirname(directory))) {
    if (cache[directory]) {
      break;
    }
    paths.push(directory);
    if (useBabelrc) {
      var configFilePath = path.join(directory, BABELRC_FILENAME);
      if (fs.existsSync(configFilePath)) {
        cache[directory] = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        break;
      }
      var configJsFilePath = path.join(directory, BABELRC_JS_FILENAME);
      if (fs.existsSync(configJsFilePath)) {
        cache[directory] = require(configJsFilePath);
        break;
      }
    } else {
      var resolvedJsonFilePath = path.join(directory, PACKAGE_JSON);
      var packageJsonFilePath =
        resolvedJsonFilePath === PACKAGE_JSON
          ? path.resolve(directory, PACKAGE_JSON)
          : resolvedJsonFilePath;
      if (fs.existsSync(packageJsonFilePath)) {
        var packageJsonFileContents = require(packageJsonFilePath);
        if (packageJsonFileContents[BABEL_CONFIG_KEY]) {
          cache[directory] = packageJsonFileContents[BABEL_CONFIG_KEY];
          break;
        }
      }
    }
  }
  paths.forEach(function(directoryPath) {
    return (cache[directoryPath] = cache[directory]);
  });
  return cache[directory] || {};
}
function getCacheKey(fileData, filePath, jestConfigStr, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var jestConfig = JSON.parse(jestConfigStr);
  var tsConfig = utils_1.getTSConfig(jestConfig.globals, jestConfig.rootDir);
  var tsJestConfig = utils_1.getTSJestConfig(jestConfig.globals);
  var babelConfig = {};
  if (!tsJestConfig.skipBabel) {
    babelConfig = getBabelRC(filePath, !!tsJestConfig.useBabelrc);
    if (tsJestConfig.babelConfig) {
      babelConfig = __assign({}, babelConfig, tsJestConfig.babelConfig);
    }
  }
  return crypto
    .createHash('md5')
    .update(JSON.stringify(tsConfig), 'utf8')
    .update(JSON.stringify(transformOptions), 'utf8')
    .update(JSON.stringify(babelConfig), 'utf8')
    .update(fileData + filePath + jestConfigStr, 'utf8')
    .digest('hex');
}
exports.getCacheKey = getCacheKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQWlDO0FBQ2pDLHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFRN0IsbUNBQThDO0FBQzlDLDZDQUFnRDtBQUNoRCxpQ0FBeUU7QUFDekUsMkNBQW1EO0FBRW5ELGlCQUNFLEdBQVcsRUFDWCxRQUFjLEVBQ2QsVUFBc0IsRUFDdEIsZ0JBQTBEO0lBQTFELGlDQUFBLEVBQUEscUJBQXVDLFVBQVUsRUFBRSxLQUFLLEVBQUU7SUFJMUQsSUFBTSxlQUFlLEdBQUcsbUJBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU1RSxnQkFBTyxDQUFDLHdCQUF3QixFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRW5ELElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRzVDLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7UUFDdkQsR0FBRyxHQUFHLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7S0FDdkM7SUFFRCxJQUFNLFdBQVcsR0FDZixlQUFlLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBRXJFLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUVELElBQU0sWUFBWSxHQUFHLHVCQUFlLENBQUMsVUFBVSxDQUFDLE9B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
