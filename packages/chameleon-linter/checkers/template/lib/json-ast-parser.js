const Parser = require('cml-component-parser');
const cmlUtils = require('chameleon-tool-utils');
const utils = require('../../../utils');
const config = require('../../../config');

function getUsingComponents(jsonAst, filePath = '') {
  let results = {};
  let currentWorkspace = config.getCurrentWorkspace();
  let interfaceParser = new Parser(null, config.getParserConfig().script, currentWorkspace);

  if (jsonAst && jsonAst.base && jsonAst.base.usingComponents) {
    Object
      .entries(jsonAst.base.usingComponents)
      .map((componentInfoPair) => {
        return {
          name: utils.toDash(componentInfoPair[0]),
          path: componentInfoPair[1]
        };
      })
      .filter((infoPair) => {
        return !(infoPair.path.indexOf('plugin://') === 0);
      })
      .forEach((infoPair) => {
        // filePath: is a full absolute path of the target template file
        // inforPair.path: is the original path of base: {usingComponents: 'path/to/referenced component'}
        let interfaceInfo = cmlUtils.findInterfaceFile(currentWorkspace, filePath, infoPair.path);
        let componentInfo = cmlUtils.lintHandleComponentUrl(currentWorkspace, filePath, infoPair.path);
        let useDefine = interfaceInfo;

        if (!useDefine.filePath) {
          if (componentInfo && componentInfo.filePath) {
            useDefine = componentInfo;
          }
        }

        results[infoPair.name] = {
          path: useDefine.filePath
        };
        results[infoPair.name] = {
          ...results[infoPair.name],
          ...interfaceParser.resetPath(results[infoPair.name].path).getParseResults()
        }

        results[infoPair.name].isCml = !!interfaceInfo.filePath || componentInfo.isCml;
        results[infoPair.name].isOrigin = !results[infoPair.name].isCml;
        // if we can not get filePath then we delete this component, because the component is not well coded.
        if (!useDefine.filePath) {
          delete results[infoPair.name]
        }
      });
  }
  return results;
}

module.exports = {
  getUsingComponents
};
