const path = require('path');

const fse = require('fs-extra');
const watch = require('node-watch');

const utils = require('chameleon-tool-utils');

const childProcess = require('child_process');
// 创建路由文件
// platform   web端和weex端 现在没有用到，如果要区分，cml weex dev命令要执行两遍， web和weex的要生成两个不同的routerOptions文件
// media dev模式开启watch  其他情况不监听变化 否则命名行不结束
utils.createRouterFile = function (platform, media) {

  let routerConfigPath = path.join(cml.projectRoot, 'src/router.config.json');

  if (utils.isFile(routerConfigPath)) {
    if (media === 'dev') {
      watch(routerConfigPath, { recursive: true }, function(evt, name) {
        cml.log.debug(' createRouterFile routerchange')
        cml.event.emit('routerchange')
      });
    }
  } else {
    cml.log.error('未找到路由配置文件');
  }

}

var TEMP_ROOT;

utils.getTempRoot = function () {
  if (!TEMP_ROOT) {
    var tmp = path.join(cml.projectRoot, 'node_modules/.chameleon')
    if (cml.config.get().serverPath) {
      tmp = cml.config.get().serverPath
    }
    utils.setTempRoot(tmp);
  }
  return TEMP_ROOT;
};

utils.getDevServerPath = function () {
  return path.resolve(utils.getTempRoot() + '/www');
}


utils.setTempRoot = function (tmp) {
  try {
    TEMP_ROOT = tmp;
    fse.ensureDirSync(tmp);
  } catch (e) {
    console.log(e);
  }
};

// 检查fs-base-chameleon版本，不一致时报错
utils.checkBaseChameleon = function () {
  try {
    let sout = childProcess.execSync("npm list fs-base-chameleon") + ""
    let arr = sout.match(/fs-base-chameleon@([0-9]|\.)*/g);
    let allVersionLibs = arr.filter((e, i) => arr.indexOf(e) == i)
    if (allVersionLibs.length > 1) {
      cml.log.warn("依赖了不同版本的fs-base-chameleon\n****fs-base-chameleon必须全局一个版本，里面的 config, event 实现依赖全局唯一****")
      cml.log.warn(sout)
      // process.exit();
    }
  } catch (e) {
    cml.log.warn(e)
  }
}

// 生成config.json文件
module.exports = utils;

