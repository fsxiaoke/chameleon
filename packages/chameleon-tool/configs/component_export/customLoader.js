const cmlUtils = require('chameleon-tool-utils');


module.exports = function(content) {
  function removeRuntime(parts) {
    let script = parts.script.find(e => e.cmlType !== 'json');
    return script.tagContent.replace(`import _cml_ from 'chameleon-runtime';`, '')
      .replace(`exports.default = _cml_.createComponent(exports.default).getOptions()`, '')
  }
  const parts = cmlUtils.splitParts({content});
  content = `
  ${parts.template[0].tagContent}
  ${removeRuntime(parts)}
  ${parts.style[0].tagContent}
  `
  return content;
}
