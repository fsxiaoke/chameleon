// var parser = require('@babel/parser');
// var core = require('@babel/core');
// var path = require('path');
// var fs = require('fs');
// var loaderUtils = require('loader-utils');
// var lodashMerge = require('lodash.merge');
var cmlUtils = require('chameleon-tool-utils');

module.exports = function(content) {
  let parts = cmlUtils.splitParts({content});
  let template = parts.template[0].content;
  if (!template.trim()) {
    template = ''
  } else {
    template = parts.template[0].tagContent;
  }
  let js = parts.script.find(e => e.cmlType !== 'json').tagContent;
  let style = parts.style[0].tagContent;
  // const options = loaderUtils.getOptions(this) || {};
  // let srcJson = JSON.parse(parts.script.find(e => e.cmlType === 'json').content);
  // if (!srcJson["extends"]) {
  //   return content;
  // }
  // let extendFileChains = getExtendsFileChains(parts, this.resourcePath);
  // if (!extendFileChains.length) {
  //   return content;
  // }
  // if (extendFileChains.length > 1) {
  //   while (extendFileChains.length > 1) {
  //     let extendFile = extendFileChains.pop();
  //     let subFile = extendFileChains.pop();
  //     let merged = merge(extendFile, subFile);
  //     extendFileChains.push({file: merged, path: subFile.path});
  //   }
  // } else if (extendFileChains.length === 1) {
  //   let extendFile = extendFileChains.pop();
  //   let extendParts = cmlUtils.splitParts({content: extendFile.file});
  //   let template = extendParts.template[0].tagContent;
  //   let js = extendParts.script.find(e => e.cmlType !== 'json').tagContent;
  //   let style = extendParts.style[0].tagContent;
  //   let json = JSON.parse(extendParts.script.find(e => e.cmlType === 'json').content);
  //   let comps = json.base && json.base.usingComponents
  //   if (comps) {
  //     Object.keys(comps).forEach(key => {
  //       if (comps[key].indexOf('..') === 0) {
  //         let absolutePath = path.resolve(path.dirname(extendFile.path), comps[key])
  //         comps[key] = absolutePath;
  //       } else if (comps[key].indexOf('/') === 0) {
  //         let absolutePath = path.resolve(cml.projectRoot + '/src', comps[key].substring(1))
  //         comps[key] = absolutePath;
  //       } else {
  //         let absolutePath = path.resolve(cml.projectRoot + '/node_modules', comps[key])
  //         comps[key] = absolutePath;
  //       }
  //     })
  //   }
  //   extendFileChains.push({
  //     file: `${template}
  //     ${js}
  //     ${style}
  //     <script cml-type="json">${JSON.stringify(json)}</script>
  //     `,
  //     path: extendFile.path
  //   })

  // let output = merge(extendFileChains[0], {file: content, path: this.resourcePath}, options.cmlType);
  let output = `
  ${template}
  ${js}
  ${style}
  `;

  return output;

}
// function merge(extendFile, subFile, cmlType) {
//   let parts = cmlUtils.splitParts({content: subFile.file});
//   let extendParts = cmlUtils.splitParts({content: extendFile.file});
//   let sourceAst = getAst(extendParts);
//   let mergeAst = getAst(parts);
//   mergeScript(sourceAst, mergeAst);
//   mergeOutScript(sourceAst, mergeAst);
//   let json = '';
//   if (!cmlType) {
//     let jsonObject = mergeComponents(extendFile, subFile)
//     json = `<script cml-type="json">${JSON.stringify(jsonObject)}</script>`;
//   } else {
//     mergeDestComponents(extendFile, subFile, sourceAst, cmlType);
//     json = `<script cml-type="json">${parts.script.find(e => e.cmlType === 'json').content}</script>`;
//   }
//   let {code} = core.transformFromAstSync(sourceAst);
//   let template = parts.template[0].content.trim() ? parts.template[0].tagContent : extendParts.template[0].tagContent;
//   let js = `<script>${code}</script>`;
//   let style = parts.style[0].content.trim() ? parts.style[0].tagContent : extendParts.style[0].tagContent;
//
//   let output =
//     `${template}
//   ${js}
//   ${style}
//   ${json}`;
//   return output;
// }
// function getExtendsFileChains(parts, subPath) {
//   let result = [];
//   while (true) {
//     let config = parts.script.find(e => e.cmlType === 'json');
//     let filePath = JSON.parse(config.content)["extends"];
//     if (!config || !filePath) {
//       break;
//     }
//     let file = fs.readFileSync(path.resolve(path.dirname(subPath), filePath) + '.cml', {encoding: 'utf-8'})
//     result.push({
//       file,
//       path: path.resolve(path.dirname(subPath), filePath) + '.cml'
//     })
//     parts = cmlUtils.splitParts({content: file});
//     subPath = path.resolve(path.dirname(subPath), filePath) + '.cml';
//   }
//   return result
// }
// function getAst(parts) {
//   let script = parts.script.find(e => e.cmlType !== 'json');
//   let ast = parser.parse(script.content, {
//     sourceType: 'module',
//     plugins: [
//       'classProperties'
//     ]
//   })
//   return ast
// }
// function getOutAst(ast) {
//   let root = ast.program.body;
//   const declarations = {}
//   const imports = []
//   const result = {
//     imports,
//     declarations
//   }
//   if (root) {
//     root.forEach((e, index) => {
//       switch (e.type) {
//         case 'ImportDeclaration': imports.push(e);break;
//         case 'FunctionDeclaration': declarations[e.id.name] = {node: e, index};break;
//         case 'VariableDeclaration': declarations[e.declarations[0].id.name] = {node: e, index};break;
//         case 'ExportDefaultDeclaration': result.last = index;break;
//         default:break;
//       }
//     })
//   }
//   return result;
// }
// function getRealVueConifg(ast) {
//   let root = ast.program.body;
//   if (root) {
//     let classDeclarations = {};
//     let result;
//     root.forEach(e => {
//       if (e.type === 'ExportDefaultDeclaration') {
//         if (e.declaration.type === 'NewExpression') {
//           result = classDeclarations[e.declaration.callee.name];
//         } else {
//           result = e;
//         }
//       } else if (e.type === 'ClassDeclaration') {
//         classDeclarations[e.id.name] = e;
//       }
//     })
//     return result;
//   }
// }
// function mergeScript(src, sub) {
//   let srcParts = spiltPart(src);
//   let subParts = spiltPart(sub)
//   mergeObject(srcParts.data, subParts.data, srcParts, subParts);
//   mergeObject(srcParts.methods, subParts.methods, srcParts, subParts);
//   mergeObject(srcParts.computed, subParts.computed, srcParts, subParts);
//   mergeObject(srcParts.watch, subParts.watch, srcParts, subParts);
//   mergeObject(srcParts.props, subParts.props, srcParts, subParts);
//
//   const lifeCycles = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestory', 'destoryed'];
//   lifeCycles.forEach(e => {
//     mergeMethod(srcParts[e], subParts[e], srcParts, subParts)
//   })
// }
// function mergeOutScript(src, sub) {
//   const srcAst = getOutAst(src);
//   const subAst = getOutAst(sub);
//   Object.keys(subAst.declarations).forEach((e) => {
//     if (srcAst.declarations[e]) {
//       src.program.body.splice(srcAst.declarations[e].index, 1, subAst.declarations[e].node);
//     } else {
//       src.program.body.splice(srcAst.last, 0, subAst.declarations[e].node);
//       srcAst.last++;
//     }
//   })
//   subAst.imports.forEach(e => src.program.body.unshift(e))
// }
// function mergeComponents(extendFile, subFile) {
//   let parts = cmlUtils.splitParts({content: subFile.file});
//   let extendParts = cmlUtils.splitParts({content: extendFile.file});
//   let sub = JSON.parse(parts.script.find(e => e.cmlType === 'json').content);
//   let extend = JSON.parse(extendParts.script.find(e => e.cmlType === 'json').content);
//   let subComp = sub.base && sub.base.usingComponents;
//   let extendComp = extend.base && extend.base.usingComponents
//   if (extendComp) {
//     toSrcPath(extendComp, extendFile.path)
//   }
//   if (subComp) {
//     toSrcPath(subComp, subFile.path)
//   }
//   return lodashMerge(extend, sub)
//   function toSrcPath(comps, filePath) {
//     Object.keys(comps).forEach(key => {
//       if (comps[key].indexOf('..') === 0) {
//         let absolutePath = path.resolve(path.dirname(filePath), comps[key])
//         comps[key] = absolutePath;
//       } else if (comps[key].indexOf('/') === 0) {
//         let absolutePath = path.resolve(cml.projectRoot + '/src', comps[key].substring(1))
//         comps[key] = absolutePath;
//       } else {
//         let absolutePath = path.resolve(cml.projectRoot + '/node_modules', comps[key])
//         comps[key] = absolutePath;
//       }
//     })
//   }
//
// }
// function mergeDestComponents(extendFile, subFile, ast, cmlType) {
//   let parts = cmlUtils.splitParts({content: subFile.file});
//   let extendParts = cmlUtils.splitParts({content: extendFile.file});
//   let sub = JSON.parse(parts.script.find(e => e.cmlType === 'json').content);
//   let extend = JSON.parse(extendParts.script.find(e => e.cmlType === 'json').content);
//   let subComp = sub.base && sub.base.usingComponents;
//   let extendComp = extend.base && extend.base.usingComponents;
//   let config = getRealVueConifg(ast);
//   if (extendComp) {
//     let absolutePath = '';
//     let strArray = [];
//     Object.keys(extendComp).forEach(key => {
//       // if (extendComp[key].indexOf('..') === 0) {
//       //   absolutePath = path.resolve(path.dirname(extendFile.path), extendComp[key])
//       // } else if (extendComp[key].indexOf('/') === 0) {
//       //   absolutePath = path.resolve(cml.projectRoot + '/src', extendComp[key].substring(1))
//       // } else {
//       //   absolutePath = extendComp[key];
//       // }
//       absolutePath = extendComp[key];
//       cmlUtils.isFile(absolutePath + '.cml') ? absolutePath = absolutePath + '.cml' : absolutePath = absolutePath + `.${cmlType}.cml`
//       absolutePath = absolutePath.replace(/\\/g, '\\\\')
//       strArray.push(`"${key}":require("${absolutePath}").default`)
//     })
//     let code = `export default {${strArray.join(',')}}`;
//     let codeAst = parser.parse(code, {
//       sourceType: 'module'
//     })
//     let props = getRealBody(config);
//     let cstrFun = config.constructor;
//     if (config.type === 'ExportDefaultDeclaration') {
//       let tmp = new cstrFun()
//       tmp.type = 'ObjectProperty';
//       tmp.key = new cstrFun();
//       tmp.key.type = 'Identifier';
//       tmp.key.name = 'components';
//       tmp.value = codeAst.program.body[0].declaration;
//       props.unshift(tmp)
//     } else {
//       let tmp = new cstrFun()
//       tmp.type = 'ClassProperty';
//       tmp.key = new cstrFun();
//       tmp.key.type = 'Identifier';
//       tmp.key.name = 'components';
//       tmp.value = codeAst.program.body[0].declaration;
//       props.unshift(tmp)
//     }
//   }
//
// }
// function spiltPart(ast) {
//   let srcTree = getRealVueConifg(ast);
//   let parts = {}
//   if (srcTree.type === 'ExportDefaultDeclaration') {
//     let partsAst = srcTree.declaration.properties;
//     partsAst.forEach(e => {
//       parts[e.key.name] = e
//     })
//   } else {
//     let partsAst = srcTree.body.body;
//     partsAst.forEach(e => {
//       parts[e.key.name] = e
//     })
//   }
//   parts.ast = srcTree;
//   return parts;
// }
// function mergeObject(src, sub, srcParts, subParts) {
//   if (!src && !sub) {
//     return;
//   }
//   if (!src && sub) {
//     sub.type = srcParts.ast.type === 'ExportDefaultDeclaration' ? 'ObjectProperty' : 'ClassProperty'
//     getRealBody(srcParts.ast).push(sub)
//   } else if (src && sub) {
//     let srcProps = src.value.properties;
//     let subProps = sub.value.properties;
//     subProps.forEach(e => {
//       let srcField = srcProps.find(_e => _e.key.name === e.key.name);
//       if (srcField && srcField.value) {
//         srcField.value = e.value;
//       } else if (srcField && srcField.body) {
//         srcField.body = e.body;
//       } else {
//         srcProps.push(e);
//       }
//     })
//   }
// }
// function mergeMethod(src, sub, srcParts, subParts) {
//   if (!src && !sub) {
//     return;
//   }
//   if (!src && sub) {
//     sub.type = srcParts.ast.type === 'ExportDefaultDeclaration' ? 'ObjectMethod' : 'ClassMethod'
//     srcParts.ast.declaration.properties.push(sub)
//   } else if (src && sub) {
//     let body = src.body.body;
//     let cstrFun = src.constructor
//
//     let express = new cstrFun()
//     express.type = 'ExpressionStatement';
//     express.expression = new cstrFun();
//     express.expression.arguments = new Array();
//     let item = new cstrFun();
//     item.type = 'ThisExpression';
//     express.expression.arguments.push(item);
//     let callee = express.expression.callee = new cstrFun();
//     callee.computed = false;
//     callee.object = new cstrFun();
//     callee.object.name = 'sub_Method';
//     callee.object.type = 'Identifier';
//     callee.property = new cstrFun();
//     callee.property.type = 'Identifier';
//     callee.property.name = 'call';
//     callee.type = 'MemberExpression'
//     express.expression.type = 'CallExpression'
//     body.unshift(express);
//
//     express = new cstrFun()
//     express.type = 'FunctionExpression';
//     express.async = false;
//     express.generator = false;
//     express.id = new cstrFun()
//     express.id.name = 'sub_Method';
//     express.id.type = 'Identifier';
//     express.params = new Array();
//     express.body = sub.body;
//     body.unshift(express);
//   }
// }
// function getRealBody(ast) {
//   if (ast.type === 'ClassDeclaration') {
//     return ast.body.body
//   } else {
//     return ast.declaration.properties
//   }
// }
