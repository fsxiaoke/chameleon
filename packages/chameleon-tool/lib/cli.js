#! /usr/bin/env node

const commander = require('commander');
const cmlpackage = require('../package.json');
const argv = process.argv;
const utils = require('./utils')

module.exports.run = function () {

  var first = argv[2];
  if (first === '-v' || first === '--version' || first === '-V') {
    cml.log.notice(`current running chameleon(${cml.root})`)
    version();
  } else {
    utils.checkBaseChameleon();
    let extCommand = require('../commanders/ext/index.js').name;
    commander.usage('[command] [options]')
    commander.version(`${cmlpackage.name}@${cmlpackage.version}`)
    let cmdList = ['init', 'dev', 'build', 'server', 'web', 'weex', 'wx', 'baidu', 'alipay', 'qq'];
    if (typeof extCommand === 'string') {
      cmdList.push('ext');
    }
    cmdList = cmdList.map(key => ({
      key,
          cmd: require(`../commanders/${key}/index.js`) // eslint-disable-line
    }))

    cmdList.forEach(item => {
      let cmd = item.cmd;
      cmd.register(
        commander
          .command(cmd.name)
          .option('-l, --log [debug]', 'logLevel')
          .usage(cmd.usage)
          .description(cmd.desc)
      );
    })
    commander.parse(argv);
  }

  function version() {
    console.log(`${cmlpackage.name}@${cmlpackage.version}`)
  }
}
