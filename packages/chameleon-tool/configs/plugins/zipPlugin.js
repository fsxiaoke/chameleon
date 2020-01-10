const fs = require('fs');
const yazl = require('yazl');
const crypto = require('crypto');
const path = require('path');
const RawSource = require('webpack-sources').RawSource;


class ZipPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    let self = this;
    if (compiler.hooks) {
      compiler.hooks.emit.tap('ZipPlugin', zip);
    } else {
      compiler.plugin('emit', zip);
    }

    function zip(compilation, callback) {

      let zipFile = new yazl.ZipFile();

      for (let file in compilation.assets) {
        if (!compilation.assets.hasOwnProperty(file)) {continue;}
        let source = compilation.assets[file].source();

        zipFile.addBuffer(
          Buffer.isBuffer(source) ? source : Buffer.from(source),
          file);
      }
      zipFile.end();

      let hash = crypto.createHash('md5');
      let bufs = [];
      zipFile.outputStream.on('data', (buf)=>{
        hash.update(buf);
        bufs.push(buf)
      });

      zipFile.outputStream.on('end', function() {
        let outputPathAndFilename = self.options.filename.replace(/\[[\w:]+\]/g, (index) => {
          index = index.replace('[', '').replace(']', '');
          switch (index) {
            case 'hash': return hash.digest('hex')
            default: return ''
          }
        })

        outputPathAndFilename = path.resolve(compilation.options.output.path, `../zip/${outputPathAndFilename}`)
        let relativeOutputPath = path.relative(
          compilation.options.output.path,
          outputPathAndFilename
        );

        // add our zip file to the assets
        compilation.assets[relativeOutputPath] = new RawSource(Buffer.concat(bufs));
        callback()
      });

      return;
    }
  }
}

module.exports = ZipPlugin;


