const {defineConfig} = require('@vue/cli-service')


module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        // 解决开发环境跨域问题
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8080',
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
})
