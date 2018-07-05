import * as ts from 'typescript';
import { CompilerOptions } from 'typescript/lib/typescript';
import {
  CodeSourceMapPair,
  FullJestProjectConfig,
  JestConfig,
  PostProcessHook,
  TransformOptions,
  TsJestConfig,
} from './jest-types';
export declare function postProcessCode(
  compilerOptions: CompilerOptions,
  jestConfig: JestConfig,
  tsJestConfig: TsJestConfig,
  transformOptions: TransformOptions,
  transpileOutput: CodeSourceMapPair,
  filePath: string,
): CodeSourceMapPair;
export declare const getPostProcessHook: (
  tsCompilerOptions: ts.CompilerOptions,
  jestConfig: Partial<FullJestProjectConfig>,
  tsJestConfig: TsJestConfig,
) => PostProcessHook;
