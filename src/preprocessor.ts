import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {
  BabelTransformOptions,
  CodeSourceMapPair,
  JestConfig,
  Path,
  TransformOptions,
} from './jest-types';
import { flushLogs, logOnce } from './logger';
import { postProcessCode } from './postprocess';
import { getTSConfig, getTSJestConfig, runTsDiagnostics } from './utils';
import { transpileTypescript } from './transpiler';

export function process(
  src: string,
  filePath: Path,
  jestConfig: JestConfig,
  transformOptions: TransformOptions = { instrument: false },
): CodeSourceMapPair | string {
  // transformOptions.instrument is a proxy for collectCoverage
  // https://github.com/kulshekhar/ts-jest/issues/201#issuecomment-300572902
  const compilerOptions = getTSConfig(jestConfig.globals, jestConfig.rootDir);

  logOnce('final compilerOptions:', compilerOptions);

  const isTsFile = /\.tsx?$/.test(filePath);
  const isJsFile = /\.jsx?$/.test(filePath);
  const isHtmlFile = /\.html$/.test(filePath);

  // This is to support angular 2. See https://github.com/kulshekhar/ts-jest/pull/145
  if (isHtmlFile && jestConfig.globals.__TRANSFORM_HTML__) {
    src = 'module.exports=`' + src + '`;';
  }

  const processFile =
    compilerOptions.allowJs === true ? isTsFile || isJsFile : isTsFile;

  if (!processFile) {
    return src;
  }

  const tsJestConfig = getTSJestConfig(jestConfig.globals);
  logOnce('tsJestConfig: ', tsJestConfig);

  // We can potentially do this faster by using the language service.
  // See https://github.com/TypeStrong/ts-node/blob/master/src/index.ts#L268
  if (tsJestConfig.enableTsDiagnostics) {
    runTsDiagnostics(filePath, compilerOptions);
  }

  const transpileOutput = transpileTypescript(filePath, src, compilerOptions);

  if (tsJestConfig.ignoreCoverageForAllDecorators === true) {
    transpileOutput.code = transpileOutput.code.replace(
      /__decorate/g,
      '/* istanbul ignore next */__decorate',
    );
  }
  if (tsJestConfig.ignoreCoverageForDecorators === true) {
    transpileOutput.code = transpileOutput.code.replace(
      /(__decorate\(\[\r?\n[^\n\r]*)\/\*\s*istanbul\s*ignore\s*decorator(.*)\*\//g,
      '/* istanbul ignore next$2*/$1',
    );
  }

  const outputText = postProcessCode(
    compilerOptions,
    jestConfig,
    tsJestConfig,
    transformOptions,
    transpileOutput,
    filePath,
  );

  flushLogs();

  return { code: outputText.code, map: outputText.map };
}

const BABELRC_FILENAME = '.babelrc';
const BABELRC_JS_FILENAME = '.babelrc.js';
const BABEL_CONFIG_KEY = 'babel';
const PACKAGE_JSON = 'package.json';
const cache: { [directory: string]: object } = Object.create(null);

/**
 * Adapted from the function Jest uses to get babel config
 */
function getBabelRC(
  filename: string,
  useBabelrc: boolean,
): BabelTransformOptions {
  const paths = [];
  let directory = filename;
  // tslint:disable-next-line:no-conditional-assignment
  while (directory !== (directory = path.dirname(directory))) {
    if (cache[directory]) {
      break;
    }

    paths.push(directory);
    if (useBabelrc) {
      const configFilePath = path.join(directory, BABELRC_FILENAME);
      if (fs.existsSync(configFilePath)) {
        cache[directory] = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
        break;
      }
      const configJsFilePath = path.join(directory, BABELRC_JS_FILENAME);
      if (fs.existsSync(configJsFilePath)) {
        cache[directory] = require(configJsFilePath);
        break;
      }
    } else {
      const resolvedJsonFilePath = path.join(directory, PACKAGE_JSON);
      const packageJsonFilePath =
        resolvedJsonFilePath === PACKAGE_JSON
          ? path.resolve(directory, PACKAGE_JSON)
          : resolvedJsonFilePath;
      if (fs.existsSync(packageJsonFilePath)) {
        const packageJsonFileContents = require(packageJsonFilePath);
        if (packageJsonFileContents[BABEL_CONFIG_KEY]) {
          cache[directory] = packageJsonFileContents[BABEL_CONFIG_KEY];
          break;
        }
      }
    }
  }
  paths.forEach(directoryPath => (cache[directoryPath] = cache[directory]));
  return cache[directory] || {};
}

/**
 * This is the function Jest uses to check if it has the file already in cache
 */
export function getCacheKey(
  fileData: string,
  filePath: Path,
  jestConfigStr: string,
  transformOptions: TransformOptions = { instrument: false },
): string {
  const jestConfig: JestConfig = JSON.parse(jestConfigStr);

  const tsConfig = getTSConfig(jestConfig.globals, jestConfig.rootDir);

  const tsJestConfig = getTSJestConfig(jestConfig.globals);
  let babelConfig: BabelTransformOptions = {};
  if (!tsJestConfig.skipBabel) {
    babelConfig = getBabelRC(filePath, !!tsJestConfig.useBabelrc);
    if (tsJestConfig.babelConfig) {
      babelConfig = { ...babelConfig, ...tsJestConfig.babelConfig };
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
