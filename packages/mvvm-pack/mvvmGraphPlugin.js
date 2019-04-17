
const path = require('path');
const MvvmCompiler = require('./compiler.js');

class mvvmGraphPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    let self = this;
    let npmName = cml.config.get().extPlatform[this.options.cmlType];
    let PlatformPlugin = require(path.join(cml.projectRoot, 'node_modules', npmName)); // eslint-disable-line
    let plugin = new PlatformPlugin(this.options);
    let mvvmCompiler = new MvvmCompiler(compiler);
    compiler._mvvmCompiler = mvvmCompiler;
    // 监听cml中查找组件
    cml.event.on('find-component', function({context, cmlFilePath, comPath, cmlType}, result) {
      // 如果是当前端 则触发用户的查找事件
      if (cmlType === self.options.cmlType) {
        mvvmCompiler.emit('find-component', {context, cmlFilePath, comPath, cmlType}, result);
      }
    })
    plugin.register(mvvmCompiler);
    compiler.plugin('should-emit', function(compilation) {
      debugger
      
      mvvmCompiler.run(compilation.modules);
      // 返回false 不进入emit阶段
      return false;      
    })
    
  }
}

module.exports = mvvmGraphPlugin;