
// 设置静态资源的线上路径
const publicPath = '//www.fxiaoke.com';
// 设置api请求前缀
const apiPrefix = 'https://www.fxiaoke.com';

cml.config.merge({
  templateLang: 'vue',
  templateType: 'html',
  platforms: ['web', 'weex'],
  staticPath: 'res',  //weex编译后图片等静态文件存放路径
  check: {
	enable: false, //接口类型检查，请设置为false即不检查。由于有缺陷，true对于开发不友好
  },
  web: {
    dev: {
      apiPrefix:"http://localhost:9090/web/"//http请求前缀
    },
    build: {
      publicPath: `${publicPath}/web/`,
      apiPrefix
    }
  },
  weex: {
    dev: {
	singlePage:false,//单页应用  
    },
    build: {
      publicPath: `bundle://`,//静态文件发布地址前缀
      singlePage:false,//多页应用
    }
  }
})

