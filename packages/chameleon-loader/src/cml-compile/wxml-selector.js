

const loaderUtils = require('loader-utils');
const fs = require('fs');
const cmlUtils = require('chameleon-tool-utils');
const path = require('path');

module.exports = function(content) {
  const self = this;
  const resource = this.resourcePath;
  const extName = path.extname(resource);
  const cssExt = {
    '.wxml': '.wxss',
    '.axml': '.acss',
    '.swan': '.css',
    '.qml': '.qss'
  }
  const styles = cssExt[extName];
  const query = loaderUtils.getOptions(this) || {}
  const type = query.type;
  let targetFilePath = '';
  let output = '';
  let extMap = {
    script: '.js',
    styles
  }
  // targetFilePath = resource.replace(/\.wxml/, extMap[type]);
  targetFilePath = resource.replace(new RegExp(`${extName}$`), extMap[type]);
  if (!cmlUtils.isFile(targetFilePath)) {
    throw new Error(`can't find ${targetFilePath}`)
  } else {
    self.addDependency(targetFilePath);
    output = fs.readFileSync(targetFilePath, {encoding: 'utf-8'})
  }
  return output;

}
