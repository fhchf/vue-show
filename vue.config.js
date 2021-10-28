module.exports = {
  publicPath: '',
  chainWebpack: config => {
    // 生产模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 更改打包入口函数
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js');

      // 通过 externals 加载外部 CDN 资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      });

      // 为 html 自定义插件 isProd ，并根据值来决定如何渲染页面结构
      config.plugin('html').tap(args => {
        args[0].isProd = true;
        return args;
      });
    });

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // 更改打包入口函数
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js');

      // 为 html 自定义插件 isProd ，并根据值来决定如何渲染页面结构
      config.plugin('html').tap(args => {
        args[0].isProd = false;
        return args;
      });
    });
  }
};
