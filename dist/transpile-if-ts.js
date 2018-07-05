'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tsc = require('typescript');
var utils_1 = require('./utils');
function transpileIfTypescript(path, contents, config, rootDir) {
  if (rootDir === void 0) {
    rootDir = '';
  }
  if (path && (path.endsWith('.tsx') || path.endsWith('.ts'))) {
    var transpiled = tsc.transpileModule(contents, {
      compilerOptions: utils_1.getTSConfig(
        config || utils_1.mockGlobalTSConfigSchema(global),
        rootDir
      ),
      fileName: path,
    });
    return transpiled.outputText;
  }
  return contents;
}
exports.transpileIfTypescript = transpileIfTypescript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlLWlmLXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zcGlsZS1pZi10cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUFrQztBQUNsQyxpQ0FBZ0U7QUFHaEUsK0JBQ0UsSUFBWSxFQUNaLFFBQWdCLEVBQ2hCLE1BQXNCLEVBQ3RCLE9BQW9CO0lBQXBCLHdCQUFBLEVBQUEsWUFBb0I7SUFFcEIsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUMzRCxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRTtZQUMvQyxlQUFlLEVBQUUsbUJBQVcsQ0FDMUIsTUFBTSxJQUFJLGdDQUF3QixDQUFDLE1BQU0sQ0FBQyxFQUMxQyxPQUFPLENBQ1I7WUFDRCxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztRQUVILE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQztLQUM5QjtJQUNELE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFsQkQsc0RBa0JDIn0=
