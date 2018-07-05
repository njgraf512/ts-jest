'use strict';
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
        cache[directory] = fs.readFileSync(configFilePath, 'utf8');
        break;
      }
      var configJsFilePath = path.join(directory, BABELRC_JS_FILENAME);
      if (fs.existsSync(configJsFilePath)) {
        cache[directory] = JSON.stringify(require(configJsFilePath));
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
          cache[directory] = JSON.stringify(
            packageJsonFileContents[BABEL_CONFIG_KEY]
          );
          break;
        }
      }
    }
  }
  paths.forEach(function(directoryPath) {
    return (cache[directoryPath] = cache[directory]);
  });
  return cache[directory] || '';
}
function getCacheKey(fileData, filePath, jestConfigStr, transformOptions) {
  if (transformOptions === void 0) {
    transformOptions = { instrument: false };
  }
  var jestConfig = JSON.parse(jestConfigStr);
  var tsConfig = utils_1.getTSConfig(jestConfig.globals, jestConfig.rootDir);
  var tsJestConfig = utils_1.getTSJestConfig(jestConfig.globals);
  var babelConfig = '';
  if (!tsJestConfig.skipBabel) {
    babelConfig = getBabelRC(filePath, !!tsJestConfig.useBabelrc);
    if (tsJestConfig.babelConfig) {
      babelConfig += JSON.stringify(tsJestConfig.babelConfig);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ByZXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFpQztBQUNqQyx1QkFBeUI7QUFDekIsMkJBQTZCO0FBUTdCLG1DQUE4QztBQUM5Qyw2Q0FBZ0Q7QUFDaEQsaUNBQXlFO0FBQ3pFLDJDQUFtRDtBQUVuRCxpQkFDRSxHQUFXLEVBQ1gsUUFBYyxFQUNkLFVBQXNCLEVBQ3RCLGdCQUEwRDtJQUExRCxpQ0FBQSxFQUFBLHFCQUF1QyxVQUFVLEVBQUUsS0FBSyxFQUFFO0lBSTFELElBQU0sZUFBZSxHQUFHLG1CQUFXLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFNUUsZ0JBQU8sQ0FBQyx3QkFBd0IsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUVuRCxJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUc1QyxJQUFJLFVBQVUsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFO1FBQ3ZELEdBQUcsR0FBRyxrQkFBa0IsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0tBQ3ZDO0lBRUQsSUFBTSxXQUFXLEdBQ2YsZUFBZSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUVyRSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRCxJQUFNLFlBQVksR0FBRyx1QkFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMs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
