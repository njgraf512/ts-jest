'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
var logger_1 = require('./logger');
function transpileTypescript(filePath, fileSrc, compilerOptions) {
  logger_1.logOnce('Compiling via normal transpileModule call');
  var transpileOutput = transpileViaTranspileModule(
    filePath,
    fileSrc,
    compilerOptions
  );
  return {
    code: transpileOutput.outputText,
    map: transpileOutput.sourceMapText,
  };
}
exports.transpileTypescript = transpileTypescript;
function transpileViaTranspileModule(filePath, fileSource, compilerOptions) {
  var transpileOutput = ts.transpileModule(fileSource, {
    compilerOptions: compilerOptions,
    fileName: filePath,
    reportDiagnostics: true,
  });
  var diagnostics = transpileOutput.diagnostics;
  if (diagnostics.length > 0) {
    var errors = formatDiagnostics(diagnostics);
    logger_1.logOnce(logMessageForTranspilationErrors(errors));
    throw createTranspilationError(errors);
  }
  return transpileOutput;
}
function formatDiagnostics(diagnostics) {
  return (
    diagnostics.map(function(d) {
      return d.messageText;
    }) + '\n'
  );
}
function createTranspilationError(errors) {
  return Error(
    'TypeScript compiler encountered syntax errors while transpiling. Errors: ' +
      errors
  );
}
function logMessageForTranspilationErrors(errors) {
  return 'Diagnostic errors from TSC: ' + errors;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0JBQWlDO0FBQ2pDLG1DQUFtQztBQUluQyw2QkFDRSxRQUFnQixFQUNoQixPQUFlLEVBQ2YsZUFBbUM7SUFFbkMsZ0JBQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ3JELElBQU0sZUFBZSxHQUFHLDJCQUEyQixDQUNqRCxRQUFRLEVBQ1IsT0FBTyxFQUNQLGVBQWUsQ0FDaEIsQ0FBQztJQUNGLE9BQU87UUFDTCxJQUFJLEVBQUUsZUFBZSxDQUFDLFVBQVU7UUFDaEMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxhQUFhO0tBQ25DLENBQUM7QUFDSixDQUFDO0FBZkQsa0RBZUM7QUFLRCxxQ0FDRSxRQUFnQixFQUNoQixVQUFrQixFQUNsQixlQUFtQztJQUVuQyxJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRTtRQUNyRCxlQUFlLGlCQUFBO1FBQ2YsUUFBUSxFQUFFLFFBQVE7UUFDbEIsaUJBQWlCLEVBQUUsSUFBSTtLQUN4QixDQUFDLENBQUM7SUFDSSxJQUFBLHlDQUFXLENBQW9CO0lBRXRDLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDMUIsSUFBTSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsZ0JBQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRWxELE1BQU0sd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDeEM7SUFFRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDO0FBRUQsMkJBQTJCLFdBQTRCO0lBRXJELE9BQVUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxXQUFXLEVBQWIsQ0FBYSxDQUFDLE9BQUksQ0FBQztBQUNwRCxDQUFDO0FBRUQsa0NBQWtDLE1BQWM7SUFDNUMsT0FBTyxLQUFLLENBQ1YsOEVBQTRFLE1BQVEsQ0FDckYsQ0FBQztBQUNOLENBQUM7QUFFRCwwQ0FBMEMsTUFBYztJQUN0RCxPQUFPLGlDQUErQixNQUFRLENBQUM7QUFDakQsQ0FBQyJ9
