import * as ts from 'typescript';
import { CodeSourceMapPair } from './jest-types';
export declare function transpileTypescript(
  filePath: string,
  fileSrc: string,
  compilerOptions: ts.CompilerOptions,
): CodeSourceMapPair;
