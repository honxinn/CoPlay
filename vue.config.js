module.exports = {
    publicPath: './',
    outputDir: 'dist', // 输出文件目录
    lintOnSave: false, // eslint 是否在保存时检查
    assetsDir: 'static', // 配置js、css静态资源二级目录的位置
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 8082
    }
}