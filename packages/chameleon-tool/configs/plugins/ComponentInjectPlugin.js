const fs = require('fs');
const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
var injectConfig;

class ComponentInjectPlugin {
  constructor(options) {
    this.cmlType = options.cmlType;
    this.media = options.media;
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.beforeCompile.tap('ComponentInjectPlugin', injectComponents2Cml);
    } else {
      compiler.plugin('before-compile', injectComponents2Cml);
    }

    // if (compiler.hooks) {
    //     compiler.hooks.done.tap('ComponentInjectPlugin', revert2OrgCml);
    // } else {
    //     compiler.plugin('done', revert2OrgCml);
    // }

    function injectComponents2Cml(compilation, callback) {
      if (!injectConfig) {
        let configJsonPath = path.join(cml.projectRoot, "inject-usingcomponent-config.json");
        if (!fs.existsSync(configJsonPath)) {
          return callback && callback()
        }
        injectConfig = JSON.parse(fs.readFileSync(configJsonPath, {encoding: 'utf-8'}))
        if (!injectConfig || !injectConfig.length) {
          return callback && callback()
        }
        console.log("[injectComponents2Cml] start")
        injectConfig.forEach(config => {
          injectByConfig(config);
        })
        console.log("[injectComponents2Cml] end")
      }
      return callback && callback()
    }

    function injectByConfig(config) {
      if (!config || !config.targetCml || !config.usingComponents || !config.usingComponents) {
        return;
      }
      let targetCmlPath = path.join(cml.projectRoot, config.targetCml);
      if (!fs.existsSync(targetCmlPath)) {
        console.error("[injectComponents2Cml] target cml file not exist: " + targetCmlPath)
        return
      }
      console.log("[injectComponents2Cml] info: " + JSON.stringify(config));
      let injectComponents = config.usingComponents;
      let targetCmlContent = fs.readFileSync(targetCmlPath, {encoding: 'utf-8'})
      let parts = cmlUtils.splitParts({content: targetCmlContent});
      let template = parts.template[0].content;
      if (!template.trim()) {
        template = ''
      } else {
        template = parts.template[0].tagContent;
      }
      let js = parts.script.find(e => e.cmlType !== 'json')
      js = js ? js.tagContent : '';
      let style = parts.style[0];
      style = style ? style.tagContent : '';
      let json = JSON.parse(parts.script.find(e => e.cmlType === 'json').content) || {};
      if (!json.base) {
        json.base = {}
      }
      if (!json.base.usingComponents) {
        json.base.usingComponents = {}
      }
      let comps = json.base.usingComponents;
      cmlUtils.map(injectComponents, comps, true)
      let output = `${template}\n${js}\n${style}\n<script cml-type="json">\n${JSON.stringify(json)}\n</script>`;
      fs.writeFileSync(targetCmlPath, output)
    }

    // function revert2OrgCml(compilation, callback) {
    //   return callback && callback()
    // }
  }
}

module.exports = ComponentInjectPlugin;
