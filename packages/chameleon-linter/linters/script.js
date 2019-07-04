const parse = require('@babel/parser').parse;
const config = require('../config/parser-config');
const traverse = require('@babel/traverse')['default'];
const globalVars = require('../config/globalVars');
const uniq = require('lodash.uniq');

const Map = {
  watch: 'watcher',
  computed: 'computed property',
  methods: 'method'
};

function checkArrowFun(path) {
  let messages = [];
  if (path.node) {
    let properties = path.get('value').get('properties');
    switch (path.node.key.name) {
      case 'watch':
      case 'computed':
      case 'methods':
        if (properties.forEach) {
          (properties || []).forEach(property => {
            messages = messages.concat(handleProperty(property, path.node.key.name));
          });
        }
        break;
      case 'beforeCreate':
      case 'created':
      case 'beforeMount':
      case 'mounted':
      case 'beforeDestroy':
      case 'destroyed':
        messages = messages.concat(handleProperty(path, path.node.key.name));
        break;
      default:
        break;
    }
  }
  return messages;
}

function handleProperty(property, propertyName) {
  let messages = [];
  if (property.get('value').isArrowFunctionExpression()) {
    let node = property.get('key').node;
    let name = node.name;
    messages.push({
      line: node.loc.start.line,
      column: node.loc.start.column + 1,
      msg: Map[propertyName]
        ? (Map[propertyName] + ' "' + name + '" cannot be used as an arrow function')
        : ('lifecycle hook "' + name + '" cannot be used as an arrow function')
    });
  }
  return messages;
}

function getForbiddenGlobalTokens(platform = 'all') {
  let tokenList = [];
  platform = platform.toUpperCase();

  Object.keys(globalVars).forEach(key => {
    if (platform === 'ALL' || key !== platform) {
      tokenList = tokenList.concat(globalVars[key]);
    }
  });

  tokenList = uniq(tokenList);

  return tokenList;
}


function checkGlobal(path, tokenList) {
  let messages = [];

  let programScope = path.scope;

  Object.keys(programScope.globals).forEach(tokenName => {
    if (~tokenList.indexOf(tokenName)) {
      messages.push({
        line: programScope.globals[tokenName].loc.start.line,
        column: programScope.globals[tokenName].loc.start.column,
        token: tokenName,
        msg: 'global variable: "' + tokenName + '" should not be used in this file'
      });
    }
  });

  return messages;
}

/**
 * 校验语法
 *
 * @param  {Object} part 片段
 * @return {Object}      语法检查结果
 */
const checkSyntax = function (part) {
  let messages = [];
  const opts = config.script;
  let ast;
  let tokenList = [];
  try {
    ast = parse(part.content, opts);
  }
  catch (err) {
    messages.push({
      line: err.loc.line,
      column: err.loc.column + 1,
      msg: err.message.replace(/ \((\d+):(\d+)\)$/, '')
    });
  }
  try {
    tokenList = getForbiddenGlobalTokens(part.platformType || 'all');
    traverse(ast, {
      // check arrow function: we do not allow arrow functions in life cycle hooks.
      ClassProperty(path) {
        messages = messages.concat(checkArrowFun(path));
      },
      // check global variables: we shall never use any platform specified global variables such as wx, global, window etc.
      Program(path) {
        messages = messages.concat(checkGlobal(path, tokenList));
      }
    });
  }
  catch (e) {
    console.log(e);
  }


  return {
    start: part.line,
    ast,
    messages
  };
}

module.exports = function (part) {
  return checkSyntax(part);
};
